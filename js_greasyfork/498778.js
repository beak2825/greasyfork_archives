// ==UserScript==
// @name         Bouton pour créer une nouvelle fiche
// @namespace    bouton_fiche.js
// @version      1.8.0
// @description  Ajouter des boutons pour aider à l'utilisation de la plateforme
// @match        https://procuration-front-populaire.fr/console/*
// @grant        window.onurlchange
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/498778/Bouton%20pour%20cr%C3%A9er%20une%20nouvelle%20fiche.user.js
// @updateURL https://update.greasyfork.org/scripts/498778/Bouton%20pour%20cr%C3%A9er%20une%20nouvelle%20fiche.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DEBUG = false;

  // From csv in bash: recreatedDemands="const recreatedDemands = [" && while read line; do recreatedDemands+="\"$(echo -n $line | sha256sum | awk '{print $1}')\","; done < <(cat ../recreation_fiches_2nd.csv | grep '@' | cut -f 2 -d ',') && recreatedDemands=${recreatedDemands%?}"];" && echo $recreatedDemands
  const recreatedDemands = ["e00c2af273b523f54fc7aee9c5c1bec851ab33ac61ded7cfee4f8a77271a255b","1b03e15eb04a1077466ae3354de50a701ff4bbba62994d71249f29b047c00b96","c67c6fead139136792e66064a7a6e1db2a540659f98cf0e38492aab516613b54","1c1195e6a7e13ec049e8424c32972217d4fa2cb5310bf588c40cdaed975cb2d9","d4f3f0b3a4cbf4a3293dac655e0a8d128a2f3177abca5de500a6d12cb122d723","7cabc4d9991879b10171fd6aa1628f4b44405861991ec27046637277f2e1d44f","849c62ce557107ef67a44e638f8fcf25bdf241bcf65879591e5ef19ae464505b","5866cc2a4772f1b90c8f54b53c43eb662a50d35a994295fd974ab87fe49ebf65","875b15fbf656abeb1374846ce8137753736783a44d75a2be5a5b8dcbc156058e","632e7991ea7d75bc6e76480875e918b285ea73a875bd4233d62ae5d8756958d3","b7e004a38de0a51c489433f741ffa5ec7da1b5f8d9eeb522f5fcb8689f574a28","93e42fed8d78d93e2ea42efbef77fcfc582ee57ec1f128d49e8eba10532a8912","fa5678d0717339fd23118d9fa93a627c553b57c578ce063fff46b647b3aacb6e","2d1df1204fcb2568fbac96f8312b311100e8db468b584530b9d2d716f903d357","c7e7c3ee4dfbd3be98c56e0ab4b7f43c955830f0c15ee9c42975bcf5d1cf57e9","baf886e51a5ae09c36acfa9cb8ea4b3961058f2fb86353bb79c3acb4cfed49f4","5266b3d4a13afd7cb976a93431e5f53db7d7098757d25de7bd66e8bbf0ef471d","005f0c6e9613b6e8109c9b44418e8bb8a5ecc84205428efeb533cf75f47ffb07","16c5ff7ceb56ae50760b644e833d158a47e9ae7538b8589fb8cf06c8bdcd07a8","f104fd216480447da7b0fa78a68dce7c76f78de9020e1fa66c848322abef0fe6","c2d55e88dac342732bb753b33a3dcbd0eb203dbb5aa6e6b938dded7e9133d788","5bf602545a78669f4047eb712fd98734e6d589c1bda92918b27c9fa19eb82dbb","e63a99a4dc34ef8fd877c18d8b827c2f521da702f47246158fe5539288f1b81e","de4cbcb849e9de093c39fe08b52e3a5405bec065c614839d4b23909cfb8e6ff9","9e67c477607e15f619a13743ee1fe3446de411fdff38698033f232a5c575644b","d76e7188561200793e4e6a97093aac85ecfc73896d10396ed8adbfa3312f3773","d1d8f110082e8ba9a476926d540e027905067d50817e252a35b184482d498169","8dcc9b52b30f1fbb2f0070381d634fce316ca64357ecf4b97a5c36c65819e1bc","5cdd4176b3a021b49e388f39f93e3f59a50c0dd4e83c5fde1c71658e67a9c69b","6f760e5083392e018f02cbae1fe181bff78adf7741c8926cbd391f9192217800","ab98d02113e15ddb0a9cbd5cf740af36fc4aa6ae99824f037f0966a476bb3579","faaca337afc0762d0f6d88762b70a023faa1942b7132a2256720a26406777d15","c4d8be6376d6df615ea09287a61959c180793e44ac8509eb655d8a3afee4c626","c405d0ce28cedf569eeac47acc428887baba6152ae9a31aa3edcef538e518c54","c4cc795f4492acd1d5694e9141986c0a2793694794468f4696f7950c2655b0f0","a00e907f1dec36b3634fd5f774bffb58ea5c15dd6c392dcad2b804c3c59d93ce","0d891ca6288bdfac905bf3b04206f066fb2f4ec42bccf7792723c5206de3285b","c9730bbd6cf1744ac9e83450111b452c41b099a967fe4629049c40221a4a620b","235523578b1ece6172163661d0c696f5222a8b055d045ab6b1489e4e4c61748f","9967d563b64e40800c2634e11074fcfb18eca3e050e73c8144e15fae835b0b80","ecb7b76bee40464b93b71509e17fea275da3b589b9ca9090b8eed20fa09e84b3","8a7387d248520061399da3c6cd0dafd1987509f679ac6149a10c811f5bd1a5e9","e8660c32964b20c6b90057af12766f236b5cd0ce9543f57cbb8428f4f7f68afd","ccf5cb22bc97b8f8bce50ef88e2f907e3113f82b85ec02ed414cebf0055a68d5","c111327b7faefcc51e00f6e4976f996d178efd1dd8bb0ae95aa7d767ee198f22","2306a259a149b0845fb050bb59e2dea72839a06bf495a37a8ee369cfb5acdf86","c528f939b494022216e6728e4a25f9a2170bae5726b9bd1b018906937bd760e6","d2ff51121c2211fc9851323e1af268ebb4bef3e4c2688f6f7d473dc73781b5ba","c5aff2b78ce576f878117f239ceb27aca179f62528f25bb84788593bc31a0a64","6f6a47548bf82d4964534d4e5e47b668f40618f788b4fdbdb830385e03e278d2","b4e9e1f2af67998a753d14801352e9a44f9e28cf08392ab49b7a50a63694c416","a003764d12994df6dddf10d769259e9d245d01634ce5407bfb333c81f056006e","948f5b8ec3ffc1569e73eb2dbf57df5adff2bab71ebcc60661081d054d801555","38285e7a805a35b15b80d5387fbaca39c6c15bad0638478dd143786377a27d74","198c7522521e6859c3d037faed3150ccce9653464d0c38acffd161b1197feec2","3dbf96872c96055cb6562505a2a3f4f25ea64542dc1587b0f28ecbc8756287eb","24f2307d4376eb7afeca004d0d76214977185360e3f61bac20a943d81ad2b464","b0eba9982d78adf5a50ed25a14fd225ec86b58862ebc233164f0ba331c687d5b","ddb96c66f9c77f3a58f6f41ce117530a9654a4b71aea261708acd3fb4405eaf4","7a67168b15ae4836db2d58d7b7a777006c31efd0058ea43d19f32edf47133722","39907e9404d7ca7a40ea8ff87a5033433883e570152580f70145f2cf4c4abe8a","16247917986e6f5e00504711239e9bf523afa03745b8d0aa8135c574ca8971d3","86416d554ef8ceae7bbff09c43cc67128823f9dd4a5e36d40c01954801822fda","56f51acc4bd6fe508f959a9e0e5c3d0e8ebb42bd6ac38e415f5a9b2505dbddb1","63952e1e9319e548f121543904b98476b959106008c50e7614edb85d7df5d36f","aebf4c8f70d22f11d86869329bb4e4fffe4a51ae4292592f66224165230d7a2d","ca0b5786526f477240860d0224f61cc45ed397be482fef1769f0130e638f564e","ff29f2b41bb2c31fb12c304d340395c0fcdad2224f5a00427e69348f92670e1f","560ed9df7237892749de42ea4ad7bdb40b69d7f206198eada20d414d229716e7","31773b53c731aa9b9700ffd78ce05c7df5417c5194201d86c2bfb0fe5384d1cc","cf14c72d11052dbbedacc0ad91c3f445b6540c3fa8a2d952d22b555ab5e6d4cd","a0984babb777825d36d6021adcbcf142b9a56f5be6492dcb0fd563ff44d6bd62","d846e78f1b6d0f4492a32a04409dbec56f7f486b806a3e9e6a310fc385fed214","85fa2fb5dc8c8d77e5160ca21984f7697fd3a43fb60945e42f7b91b0ce6b49bd","af8494eb34c055661f9586de32b9d21e50332bc41176b8ba8573b93710603f4f","804dadb05c4f10c6b56a52281e934cb1c6cc3cfaf3fe406310c5e47f5eaf7c68","58699d86f0ba81ec86b303228fbcd70f41455912d8bb7c58ab38deaf36fd3476","96baf024e19597e7d4eff6523f3effd5e0c2f815588fd65276641ba0aa0631ad","d8417a9a520045b60f9227c3c778aecaa81e6228f3805fcb40185607bf8caa82","d74537db8970c653a9b167c3cd4cda4ea4665a78b0fd9b2b9370b65938c3a6d5","c169d9f335ad0d5cd2663222a3ff2c45c3a3d7cc5d536ffcf0b716e1bccbb409","98c0a05a334e6b662c10acfe0553e864d78a60a8bef0a5a347a75b509e3f96e3","e6443b2880143d20721fda5ab347a1e0f19030ebc3f7eef5e172bfd8c4b1b480","8eacbd17dae8725a5e9471b331a1a00ba248094801e8895ce290f91930d7edf6","ac777c71244c982954d42aeb473b1c69798b007f74dcc6aa304fcb9b87ebc784","a269cee477d83164fa03c72c3bc61d75c969339ad1ddf21267c4c811bc047fda","9f0a4faced6df5489fdbbbbc599580c6453fcd97c167da3c3e01a89213c1ea2f","aaa20949679ce9fea90a0c04000e07f551a7ffb16c207411cfdedf08dc9f5500","58d60f60ff8e4b94901b9b4bb8a3f549e4c0df53928a6b472a0ce4a6a716bdec","f70e0b4e1e4e48998e2b1e6169ca89904646236e6f1ed8ef8aeef8383bbe0fa6","22680dc9cabb1d5a1c22bd2002029be43188a8afd599248f400ff0894112b699","0572fa58eea0417bf2aafba966296372a1460eaa79e388f6f3ed432f3bfc47eb","83fe33ec33666cdf33c42f49e9c9eaab66ab4f216c2ea190fb4d49f5ec4d6dfd","caadaa9b191cd8a42ff94efece1bc4e87464123bd9c831abe93a3632fd2b4716","c894593e83aa8860165a940c410f615e2ffeec27800d06ddbe5b11739cfb7b96","a36532843716fc77df2057095bf2c0728c75f03b7e740c68b58b35fa0cf4cb07","83bf525307a7c1af5876bba3c73efdf09e7c7354ce4f06e68a38fca9bbf63189","67930b571d96fe5b1413aa0e05299cf1317c176d0b01fbf4049dd99ce132cfeb","842316d81eef126a1a380c476b2231c6941f3744b0e5e9ecc13709e258b247f4","67c3d54e46ed0dd133f16b004a280ebcba56906f3049df424bbf2ce6d5cc6dc4","3dc008c5b09dfe544b1a1bc21deb3d5ad72cb6ba39d0ce0479d4e86d46bcee30","3cf2f08167ee7a60490af1df2430aa2ea0f31de2bfd38750b699f84706dfcdcc","cfd4a17d77a18774fe4a3a9fa08da68223fb8cac4eb19aef2e953c206f83899c","848a6971c6b2c02a427e68ce9c7b046654502b8a6b8c9e251fc4664f4d87c0c0","15d76beb422245b3814abf6b8ad9491daf90dc69208fccf6d5624cd911f835cc","7e8398b9428d1918f23725476779e8213241fada879769f6acef77ba4229ce81","ca72a78d8d7b0a3c043e751c0f81d6e7854a418dc89bad89c735d7e8030d5c53","39e9ccfdbc1e50bb08d4dd7a9551817f9e8b85cabf168ea37b63df7abaa5f63f","581895eaa551b3a7d216224f7ada68d0376e2a89ab9e87c95e2d935bd544b5c5","69e14e530fcb119b4d58685ad3a5cbb7cfcba6278ebb44ade392a419518d1b19","14ce540b98df599f42c640d7199a29ccc32d772c29581f5f0df0c11c429a6aea","1752722b35d6f0913dfe14d13eb4525ee4f7a5ebe86585d1603291244ff99c63","3223755e79cfa31b591b665187f6d6be501f556749e903a7126d8d9d3118db03","221ce0c6953d527ee8047dcd96933543c3fc42c1fb9ab4b9c5dd87bca02f34e7","057c8e8e5ae445e4bbcccc0cd80dde46374cce109af0161a12d5d1003af37418","882e2085dfe9a0547d078db6c61e86fbe9a2f1222b74d0dfbb62878a6435155b","44e2a5f925ba0d2447e0a5c8fab709ee88fb65a2da0c1179afd44850dd40672a","39ac4861ada233c3425595cd16c61d13bd1673d2201b3efe69753f4d204dfe59","e1da86b652f2b1a6f2e4a29f3e4e2f20a246c3fba23aa51d789edea3f13fc4f8","dbc4dcd01bd32ac505b6332259d4fd57af9bed5ee0ca36d25fcbf31a70fa05cd","4e083c95bff2f7839f26fbb1a748432bb27b73a8ef097100fb81390334e26dac","adbc43777310c8c7e522f603d326bbfe0827663ba2ae514b7ed4bfed02ff7949","f84c7ab9ae4ecf1021538b541951a5d8135ea030ab2b80acb3bd9031cf4b54dd","9d92479d324d6b27e8fb103e905b16a384b4f42f63d3520817ad0cdefe1dd8d0","444c075a605de7d84eb5f126234d8dbadc5772eba6bce1b23c9a487ec2ba0c07","c7de3ef0f4efeb0accb16c7e150af82929aa50b2a82d97246c9e50b9250681f7","afe7bc2d6375b4acbd271549245eb281b766bfdbbab58ae73b5f17325a7f9eff","6c4933ef1c2d4993ac3b2072896cbe10c6ad9fb00195a0c333c49bcbd36c4e1f","05511f039ac406ca395754cb17a323d30fe37daa84ba2b62ef8f91ee612f8b71","9b6debbe35822b1773148e74d358445f3ac062bbdabf27622730f0cbc678a2f1","b14ab7f41f270fdbd7ee185f2c72e25d4d0a006cecde163d1eb93f09d0f67b35","8dada022055ed5a0518aacf09fe182b2cab5a7bb70a13727a83d1f4f9d501336","191e3e4c044443c3ac1ca1030748e41bb57ae8907254c7f9e9575ee76fb9cf98","7597fcb474aa83955e21c06e7a79d24bc3a3ac6d05b28d1dcc8ce38a1a39327c","644aa0f450261b9e00519e8333528c40cd30f0a05664091a463bf20c29340fc6","db38257b1ece020586399b68d6e76d53c96e984d08c9b8e2c687143210d95218","8ee39d34d2c7f27de003bdb35402c1d48bf1ad6390add51c14cbe391b094edc2","44dedb23f686ec53f01d54e60ed9123028505f99cae428c5a911dabe330576d3","47e1f7a6b7fd9b4d5c9146b4e469b065301759b233da6c28050e036134bb9b49","682ab2cf3f5c3bc1c5b5765aba2b77998f95e65c307c5d6a512d630038ab5278","2490656e36ee478df2e4ba4e4a59baa0eb8a0d96fe3247d9347e104cba12e6e4","826a36b652a9fcb3c023dcffb7f60555d3aa1106daf37948852593e23312c64f","00c2aa080dfff550e73848c95257e2b621228bbb3fecb85401c2da966301c6f8","bd8f34cd1a1f085e71c13acf1d862c5779362c6098c8dee33af2c227d696ace1","f9872446a24302e42d25f2cbfb717c69b234bbebdbf294f5e6368fa573545f5b","bcd1346163a01e9dfd5f2dcd70e2a2655429bc10e974ee9a059360e2c71c0ca4","f2c020912723e3307063a0f4bc8fe879cfd78a05d1c7a0a0f41b621db99523b3","f94f8b2994ebcb9f4299e55793e222537f7bc06acf963a717013651881a24bf8","4dccdcbc76e0d9ac5d62f2cace4a85de174dabc6b758618368165bb823324663","804ecaebe95bc6f4ff3cfc7787130d6d052378be05f9c4022cb54c0be3a1f135","d0b51ba76f50343b5c32e9a8df422b00ac9b240c2d3d71a641ab28738f280c20","5da654976f40f564c33227b3c7f1c1172c4a3a3e7cb8f9e54f968713d4852988","4cc069cad22af5c0f5f60b660be64fee2a10862d96bb767cff1bf555a22c35e9","44f7f3151cc27121b7cdf569591ce4f303fc8a91fe6b522661dc7e817cf7617d","77733de01fc30472246dd51cc7b466f8396b5d77436d914e16b9e7469de57753","3b0b14331c22ae96d117adfc859afd44bd82bc9ac3a1da3fe4d7d38ac6ee3a17","38d1f180247c5dc42b29dbd848ad9da525e881d0a3c47126ba199a41fbf0b2ff","b53c64c73321bccda2b7bda2f25197d3dbac80a018f35cb50d9300859b7d91b5","eb09773924a73eb77dcf789f8a85178700e8bdeaa6fa767e19db01abd1be0d93","229925e5708eb8df231095099e3fb127768bc560a2b920e80a7b27f186e8604f","b692f7374230d7862601e2dae2fd5766ca7449c89242ad7d7286c0853b1861ef","5eaa330c016deb55b3d2d8896fc8201d4bc641bee3373484ba9054d51b698c3a","aa6f883f0160c8278dcaef18603e1735d47fda6a6416f88399ca2657ce292b9e","4387dbb8f65d17ca2bb014ba0dc6366984773ce439eb6a2d738fb2147a263f09","f835b05dddc373f1a016e5a66070b9efad5c7e2381e8ab651ff0d6cc831c19e8","d2c998928f7f00721bbd4e33176837d1c272058a4e9168d108e97098a701d0ba","5643ede1e6db165acb975e5b25e5381adbe167bf53816f9bb557f4a5e2b1a295","03e11c4c3bd53baa4bd902828136edd5cbc659a97483de113621cad2b2476ecb","6485c927cd5af1091a46eb7dda985df95770f5bdeae4b7c0fbabaf26f8cf5b7b","6c84247d12c7dea696ddfa6d34e66abdca03116cfc8fd2932b405c1b05dc7b0c","ef2b30178ae5ec6fe3f5adc97cab44b05bf002dc30e063b0593719d27965966a","bb9fa68dfebaee8a2a8d37b8b20f67bae03070222c78750db08c79de5f546979","50ef33e910b05fafe7f8cfe80e9556987e9c551b1e923f13a5ebdef0957d7ee9","d929ecd9efa23898a6c9bd0470a2e0913c0b794fb2eef0448185266056d1b49d","b74cd446812819abe1b2090f96c377e4d5a69430dc1978dbf54e17b4c337ed23","f72eee2fb27fabcef50e75a588d7e7888c2f7f1c1381e748ef0908483cc0da7d","74c2199d598d3efaba2dfd464f86872161bc91cc191b74b6a6e775d37084112f","51d310e57b5a0ba817f5d008721c8cfd2d37da0b819ad575db50f4514d4f0b91","526f05f3cd896bb41abbe0f9e4b3bfccee64c228a241b6ea45d2117d6de80b06","bc7c2ccf3d848c5b42b14c9d93ad982af0f414fb644079fd0131903b5a00a4e3","9fd2a038ed4e0650b79dfcb77699b2d0f8c9160c55688c7a195f4afadf731003","09e493690aaa336d2eac46576bdb06b7a1a630286a3e63cb56347869bdb107c0","a8aa2b5304cb338c4bf057c67cfb5aeed387fd31225418d130a7f49651be8e4b","e730cee47fe06e7dd9b7fb486ae7d3dbfcc28f0fbc5dd24e9bd6e7c0f56b9145","82388b3b22f2e6ce9026777456221aa3e784f4f720590819edf6956d045665e7","0286beecac7861adbe0381c1233d6b471e4a1fe49b20065df98cb97335bf8b4d","77cfb69c0c8826894f0ac7ddaa6f7960dd95e9dd505ea91dff436a653e0b1d31","7cdffe32f143b4cd39751b45acfaee9b34f39888468e798376301134c7cba1e5","675f45921747127ab2e867848f8df6ea6ec5c11c2d2d1a14939de8fe6e2940f0","978d0090a76fb9d5da5ace32d8e01a2b8443aeb6821b154cb5e09c4759f2a221","cc0e12d84cd5e045a1e9f9417a720234c6d529ba60108cb796d0acfde65b24c6","43ada0d99bf8977e1c15a83217f8374caa93ef8eb17a11589e573f4c2c1b59f7","80883b810e3efefc30421904a0e10fec16ab00f2988c5a9ade151867c73d0564","75019bfe7cba861bd0efae7aab20fed35cc5e8269f2b4bc2fa74487fbee3f67f","bf66536725a89937cd9893bf8ba00cbd567e25816367172960f11206bc4a22a2","39e6db6501c61dc47143af90d55b2cfaa9c7de27a579848da7f6a20ed81e78c2","735b4dbdc1ea594f0a11cfb43b7893c8c1c7c8f8a39a71cf6595e0e9cb2d5738","d21f6e509a7ff4bfd653a4bc9dbe9da33b18e27a93c8b079f9034bfc6ba39d6e","cc5f87ac081dc207a002f9eecbb5d88d16529ad5ae4b7f96b1437b1c28300c6c","70ec0daac335c5d020a379037ca8197921d313fa4bb7cff623200a17235f0d2c","d478ece525e47cf9afeb16223feaad2dc1b90e2df72408a8d1eb162a948673fb","4838a3e877975e9065be7894c5dd9cbdf901bf9214bd74cd49be0cdc04607cd7","dd8cef9b314480dd8b2af821db447ca5d50855f6431c0bf70a1ac97973a1d06b","edfc4356b4bee258d8fb7fa99fe59c8410f182a4172f42fed6b59ffaf9b1b259","d38f3c93528d6400b1ec3f3706467d8058aba9405e4d6528b00868d9a3b34189","e05bcb8c35b82b4cb63a929db8e7cf01a8d5cd9927c394810759cd13cd3ef85e","e76bca4fe1b966ee9f111c1f357b046b50c962121d052d47e30fd95346cf64e5","0522f7cd4220dc70396e40975b7b6f985ed0e05035d2247b4190fa55ea4d2d2c","4e58547113debc0b1853aea6c4811f7b349672966cc6064b3a0f7b709fcc94e8","27fe39bff8ee8f28acd68ecc9412c38d5abec3b0a1c0f621ff276612d98787cf","13f92631b5c016673300b5e6734cc0a64fb4e9fd9d071d1113ae742e979dd736","4532a2014ed1f6b8b71a55cb60ac74508185ce8d4a3a075f380c26b3a0a50cbf","7919413f67a697cc5a64354b2f189a1adf296472dd44e1a5c1bad4bcbde20106","25fdadc222b1f38094328d135840d654045238cc86862bb347a95a6674eec5fc","a584b56d160fa140929e5140467a0df35590a6184326a3a897fb48bc1c99cc54","e0103f28cafe0298ff811a9c73847fa439d1f680fd470c3effef954a6bc11a48","ea082be2e6fc08820bdd894fb070d618e9462599bc385f230b0a63a5bdade1e0","3e87aacdbc83aa7be05e102e832b0c10ca38d76bad7f6555894554733b3ff443","57a646202b25a4267b209be5ad34441f1bfe0fb5c6c56c736aeba677d06cafb2","69da88f211be04ce6a781087ee4a1b1e34f2ae8c0f6211cd0240c7b239c47938","2a7a6df44aaa7f52fa2e3654b70493f2428bd8f37747dcabe45293797e14230b","d98b58306ffd134c277abf3570001bc6ebe6f0d5ca281bd17decf6e85db86f33","a317367d3a0a49bd451d3c205cf46e75526e49ff9ad26771f8881ba9b5c25cd5","169d4e130093b119de3c846df0e09abbee75c53099e052e4a8b97ccb440cdf1e","febfe0a1889535e69a7f29f76d00a68eee2d16bf17927a224b55fcef4e2d8260","5103f84cf0faf559175829792390986aebdb0dfa745b85efd52543e5a8704aab","ff698ffb4518acdfa453c73813a843fac80a07f73f0b1f3c5d36b5bbc6ed2056","309246661f09017e8c9b1a4466c14726ce4220462af838faa84854e02aacb12e","cf3378d26f5a77e9119d18fb535a0a9184837b7434bc2a92035270eedf490d95","bcabfe01547a8d198fca2e2036f4334dce03b71b7a547ca9f23e2df28bc82a85","4da465cd39602280f53065c3b275133e88116de43fe6632f4d1fd8a00c0b1cbc","7ebfb5477c6c1952ab5f0f93f9bb8525dd7c0499622812cef12837ab5c59a883","aba52e5effbd4ca97c7b46191b95b93537855751889816b530aa60bc12724ea3","1e0269a2fc395aec311da4145ffffd105a6139dd0d89dd7335e036581d334c83","e35a1fffcf2af59e154e9483a839b6848169a4586e35c964258c70057f9d2410","cc5a9e0e058388210eb97d1adb382f760ce136b2e8a93c34a3782beea2dbdb99","bf4d402435f88c8fd4bf2122c9eb0bd69b40cabcdb291855cf515b789a9247b2","50f5cb4619b07981d9bd7373e9186da76328b7ce23c33476b1a739ff52e59929","f99c95311422d42a77d29e110d5d63acb1ed5e4a2ba99f7641648a19f6223e03","83e38826c5158a16f4bcbc1a195343676ce907ae13b4a99ba62854ca1a6ebf01","cfe3af3bceaf737ebfd9579f9413176b51eba11f8f1bb87ba390d795df012915","c46bf6f93ad2b34e3b4f71f426a9e323dd71695c19f40af9aa044d87a3ced307","687e46b270c7c41ab59ed28405ab2b77ad7c4fdf1e6577e1faa85ee3fdb9e38e","9e16d6dc4869a5a1ee352ce5744df5f2ebfab842830ce6174b3ec4ae5e22d56a","6593f1ecfaf9f1b1a11af76969187d019348fa285cfd0787679bbe0851cd88be","bcd11bfe6ccfba5befdb8856759642adb42528f37df2e5250b70c4011240f82e","84b791caf5f3dc54560406723e3fc1720e4bde07c6a246c95300b353dfcd5f68","290439a246bc04e5bbbe3a9e793ae2fb40a6a60ffaf33c0b0fbd0cad2e00a706","03a60f5e736e4f987a99d993173c88cd15d73cf703757ab5368a733e9ee45b53","6adac52143bf55c602ae4b4b9b16f8a78d0f79814c3cabad028f5211296b08f8","dcc711e2c00929129ed511dc8ddf0d5f70658dd66f86b34e8be802935f03c0e5","d5c5dbd8a04baa89704a5cce9e5bc319efbde7df77fb5a6f8af6024cfefd3d69","bd8e567153cb390805fc3263ac0e35824e65a50139287d8eaa64d538b356d596","c19e1e2f540ab883876dd0e4b8310ef638bae4c2c0d2f3ae4beb4af28fbe7dc2","329ca7c95a4c39cbeb455f6f982a7bc06f1fd42efb8f81d6fcf1817ef359ba8a"];

  // on veut 8 ou 9 chiffres dans le num d'électeur
  const regexNumElect = new RegExp("^[0-9]{8,9}$");
  const regexAddr = new RegExp("^[^]*[0-9]{5} [^]{2,}$");

  function sha256(str) {
    const buffer = new TextEncoder().encode(str);
    return crypto.subtle.digest("SHA-256", buffer).then((hash) => {
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    });
  }

  function createUsefullButton(url, text) {
    const button = document.createElement("button");
    button.innerText = text;
    button.className = "btn btn-primary";
    button.style.margin = "10px";

    button.addEventListener("click", () => {
      window.open(`${url}`, "_blank");
    });

    return button;
  }

  // Fonction pour créer un bouton avec les query params
  function createFormButton(type, contactInfo) {
    const button = document.createElement("button");
    button.innerText = "Créer une nouvelle fiche";
    button.className = "btn btn-primary";
    button.style.marginTop = "10px";

    button.addEventListener("click", () => {
      const baseUrl =
        type === "demandeur"
          ? "https://procuration-front-populaire.fr/request"
          : "https://procuration-front-populaire.fr/proposal";
      const queryParams = new URLSearchParams(contactInfo).toString();
      window.open(`${baseUrl}?${queryParams}`, "_blank");
    });

    return button;
  }

  function createSearchButtons(contactInfo) {
    const container = document.createElement("div");

    // Extraire la première chaîne jusqu'à un caractère différent d'une lettre
    const firstNameMatch = decodeURIComponent(
      contactInfo.user_details_firstNames
    ).match(/^[a-zA-Z\u00C0-\u024F]+/);

    const firstName = firstNameMatch
      ? firstNameMatch[0]
      : contactInfo.user_details_firstNames;

    // Bouton 1 : Recherche avec prénom et nom
    const button1 = document.createElement("button");
    button1.innerText = "Rechercher avec le prénom et nom";
    button1.className = "btn btn-primary";
    button1.style.marginTop = "10px";

    button1.addEventListener("click", () => {
      const query = `${firstName} ${contactInfo.user_details_lastName}`;
      const urls = [
        `https://www.google.com/search?q=${query}`,
        `https://www.linkedin.com/search/results/people/?keywords=${query}`,
        `https://www.facebook.com/search/people/?q=${query}`,
        `https://twitter.com/search?q=${query}&f=user`,
      ];

      urls.forEach((url) => GM_openInTab(url, { active: true, insert: true }));
    });

    // Bouton 2 : Recherche avec prénom, nom et ville
    const button2 = document.createElement("button");
    button2.innerText = "Rechercher avec le prénom, nom et ville";
    button2.className = "btn btn-primary";
    button2.style.marginTop = "10px";

    button2.addEventListener("click", () => {
      const query = `${firstName} ${contactInfo.user_details_lastName} ${contactInfo.user_details_electoralListCityName}`;
      const urls = [
        `https://www.google.com/search?q=${query}`,
      ];

      urls.forEach((url) => GM_openInTab(url, { active: true, insert: true }));
    });

    container.appendChild(button2);
    container.appendChild(button1);

    return container;
  }

  // Fonction pour mapper les mois en texte vers les valeurs numériques
  function mapMonthTextToValue(monthText) {
    switch (monthText) {
      case "janv.":
        return "1";
      case "févr.":
        return "2";
      case "mars":
        return "3";
      case "avr.":
        return "4";
      case "mai":
        return "5";
      case "juin":
        return "6";
      case "juil.":
        return "7";
      case "août":
        return "8";
      case "sept.":
        return "9";
      case "oct.":
        return "10";
      case "nov.":
        return "11";
      case "déc.":
        return "12";
      default:
        return "";
    }
  }

  // Fonction pour extraire les informations du demandeur
  function extractInfo(element) {
    const info = {};

    // Nom et prénom
    const nameElement = element.querySelector("h3");
    if (nameElement) {
      const name = nameElement.innerText.trim().split(" ");
      info.user_details_fullName = nameElement.innerText.trim();
      info.user_details_lastName = name.pop();
      info.user_details_firstNames = encodeURIComponent(name.join(" "));
    }

    // Adresse
    const addressElement = Array.from(element.querySelectorAll("div")).find(
      (el) => el.textContent.trim() === "Addresse postale"
    );
    if (addressElement) {
      const address = addressElement.nextElementSibling
        ? addressElement.nextElementSibling.innerText.trim()
        : "";
      info.user_details_infoParentElement = addressElement.parentElement.parentElement;
      info.user_details_rawAddress = address;
      info.user_details_address = encodeURIComponent(
        address.replace(/\s+/g, " ").trim()
      );
    }

    // Bureau de vote
    const votePlaceElement = Array.from(element.querySelectorAll("div")).find(
      (el) => el.textContent.trim() === "Bureau de vote"
    );
    if (votePlaceElement) {
      const votePlace = votePlaceElement.nextElementSibling
        .querySelector(".flex-1")
        .textContent.trim();

      let lignes = votePlace.split("\n");
      const ville = lignes[1].split("(")[0].trim();
      const departement = lignes[1].match(/\(([^)]+)\)/)[1];

      info.user_details_rawVotePlace = lignes[0].trim();
      info.user_details_votePlace = encodeURIComponent(lignes[0].trim());
      info.user_details_electoralListCityName = encodeURIComponent(ville);
      info.user_details_electoralListCityDepartment =
        encodeURIComponent(departement);
    }

    // Numéro d'électeur
    const voterNumberElement = Array.from(element.querySelectorAll("div")).find(
      (el) => el.textContent.trim() === "Numéro d'électeur"
    );
    if (voterNumberElement) {
      const voterNumber = voterNumberElement.nextElementSibling
        ? voterNumberElement.nextElementSibling
            .querySelector(".flex-1")
            .textContent.trim()
        : "";
      info.user_details_voterNumber = voterNumber;
    }

    // Email
    const emailLink = element.querySelector('a[href^="mailto:"]');
    if (emailLink) {
      info.user_details_rawEmail = emailLink.innerText.trim();
      info.user_details_email = encodeURIComponent(emailLink.innerText.trim());
    }

    // Téléphone
    const phoneLink = element.querySelector('a[href^="tel:"]');
    if (phoneLink) {
      info.user_details_phone = phoneLink.innerText.trim();
    }

    // Date de naissance
    const birthdateElement = Array.from(element.querySelectorAll("div")).find(
      (el) => el.textContent.trim() === "Date de naissance"
    );
    if (birthdateElement) {
      const birthdateText = birthdateElement.nextElementSibling
        ? birthdateElement.nextElementSibling.innerText.trim()
        : "";
      const birthdateParts = birthdateText.split(" ");
      info.user_details_birthdate_day = birthdateParts[0];
      info.user_details_birthdate_month = mapMonthTextToValue(
        birthdateParts[1]
      );
      info.user_details_birthdate_year = birthdateParts[2];
    }

    // Disponibilités
    const availabilityElement = Array.from(
      element.querySelectorAll("div")
    ).find((el) => el.textContent.trim() === "Disponibilités");
    if (availabilityElement) {
      const availabilityText = availabilityElement.nextElementSibling
        ? availabilityElement.nextElementSibling.innerText.trim()
        : "";
      info.user_details_electionsDates_0 =
        availabilityText.includes("2024-06-30");
      info.user_details_electionsDates_1 =
        availabilityText.includes("2024-07-07");
    }

    // Contact Citipo
    const contactElement = Array.from(element.querySelectorAll("div")).find(
      (el) => el.textContent.trim() === "Contact Citipo/OpenAction"
    );
    if (contactElement) {
      info.contact = contactElement.nextElementSibling
        ? contactElement.nextElementSibling.innerText
            .trim()
            .includes("Confiance")
          ? "Confiance"
          : ""
        : "";
    }

    // Commentaire
    const commentElement = Array.from(element.querySelectorAll("div")).find(
      (el) => el.textContent.trim() === "Commentaire"
    );
    if (commentElement) {
      const comment = commentElement.nextElementSibling
        ? commentElement.nextElementSibling.innerText.trim()
        : "";
      info.user_details_comment = encodeURIComponent(comment);
    }

    return info;
  }

  // Fonction pour extraire les informations du demandeur
  function extractFromMatchRequestInfo(requestElement) {
    const info = {};

    // Nom et prénom
    const nameElement = requestElement.querySelector("h3");
    if (nameElement) {
      const name = nameElement.innerText.trim().split(" ");
      info.user_details_fullName = nameElement.innerText.trim();
      info.user_details_lastName = name.pop();
      info.user_details_firstNames = encodeURIComponent(name.join(" "));
    }

    // Adresse
    const addressElement = Array.from(
      requestElement.querySelectorAll("div")
    ).find((el) => el.textContent.trim() === "Addresse postale");
    if (addressElement) {
      const address = addressElement.nextElementSibling
        ? addressElement.nextElementSibling.innerText.trim()
        : "";
      
      info.user_details_infoParentElement = addressElement.parentElement.parentElement;
      info.user_details_rawAddress = address;
      info.user_details_address = encodeURIComponent(
        address.replace(/\s+/g, " ").trim()
      );
    }

    // Bureau de vote
    const votePlaceElement = Array.from(
      requestElement.querySelectorAll("div")
    ).find((el) => el.textContent.trim() === "Bureau de vote");
    if (votePlaceElement) {
      const votePlace = votePlaceElement.nextElementSibling
        .querySelector(".flex-1")
        .textContent.trim();

      let lignes = votePlace.split("\n");
      const ville = lignes[1].split("(")[0].trim();
      const departement = lignes[1].match(/\(([^)]+)\)/)[1];
      info.user_details_rawVotePlace = lignes[0].trim();
      info.user_details_votePlace = encodeURIComponent(lignes[0].trim());
      info.user_details_electoralListCityName = encodeURIComponent(ville);
      info.user_details_electoralListCityDepartment =
        encodeURIComponent(departement);
    }

    // Numéro d'électeur
    const voterNumberElement = Array.from(
      requestElement.querySelectorAll("div")
    ).find((el) => el.textContent.trim() === "Numéro d'électeur");
    if (voterNumberElement) {
      const voterNumber = voterNumberElement.nextElementSibling
        ? voterNumberElement.nextElementSibling
            .querySelector(".flex-1")
            .textContent.trim()
        : "";
      info.user_details_voterNumber = voterNumber;
    }

    // Email
    const emailLink = requestElement.querySelector('a[href^="mailto:"]');
    if (emailLink) {
      info.user_details_rawEmail = emailLink.innerText.trim();
      info.user_details_email = encodeURIComponent(emailLink.innerText.trim());
    }

    // Téléphone
    const phoneLink = requestElement.querySelector('a[href^="tel:"]');
    if (phoneLink) {
      info.user_details_phone = phoneLink.innerText.trim();
    }

    // Date de naissance
    const birthdateElement = Array.from(
      requestElement.querySelectorAll("div")
    ).find((el) => el.textContent.trim() === "Date de naissance");
    if (birthdateElement) {
      const birthdateText = birthdateElement.nextElementSibling
        ? birthdateElement.nextElementSibling.innerText.trim()
        : "";
      const birthdateParts = birthdateText.split(" ");
      info.user_details_birthdate_day = birthdateParts[0];
      info.user_details_birthdate_month = mapMonthTextToValue(
        birthdateParts[1]
      );
      info.user_details_birthdate_year = birthdateParts[2];
    }

    // Disponibilités
    const availabilityElement = Array.from(
      requestElement.querySelectorAll("div")
    ).find((el) => el.textContent.trim() === "Disponibilités");
    if (availabilityElement) {
      const availabilityText = availabilityElement.nextElementSibling
        ? availabilityElement.nextElementSibling.innerText.trim()
        : "";
      info.user_details_electionsDates_0 =
        availabilityText.includes("2024-06-30");
      info.user_details_electionsDates_1 =
        availabilityText.includes("2024-07-07");
    }

    // Contact Citipo
    const contactElement = Array.from(
      requestElement.querySelectorAll("div")
    ).find((el) => el.textContent.trim() === "Contact Citipo/OpenAction");
    if (contactElement) {
      info.contact = contactElement.nextElementSibling
        ? contactElement.nextElementSibling.innerText
            .trim()
            .includes("Confiance")
          ? "Confiance"
          : ""
        : "";
    }

    // Commentaire
    const commentElement = Array.from(
      requestElement
        .querySelector(".text-xs.my-2.space-y-2")
        .querySelectorAll("div")
    ).find((el) => el.textContent.trim() === "Commentaire");
    if (commentElement) {
      const comment = commentElement.nextElementSibling
        ? commentElement.nextElementSibling.innerText.trim()
        : "";
      info.user_details_comment = encodeURIComponent(comment);
    }

    return info;
  }

  // Fonction pour extraire les informations du proposant
  function extractFromMatchProposalInfo(proposalElement) {
    const info = {};

    // Nom et prénom
    const nameElement = proposalElement.querySelector(".font-bold");
    if (nameElement) {
      const name = nameElement.innerText.trim().split(" ");
      info.user_details_fullName = nameElement.innerText.trim();
      info.user_details_lastName = name.pop();
      info.user_details_firstNames = encodeURIComponent(name.join(" "));
    }

    // Adresse
    const addressElement = proposalElement.querySelector(
      ".text-xs.my-2.space-y-2"
    );
    if (addressElement) {
      const address = addressElement.children[0].children[1]
        ? addressElement.children[0].children[1].innerText.trim()
        : "";
      info.user_details_infoParentElement = addressElement;
      info.user_details_rawAddress = address;
      info.user_details_address = encodeURIComponent(
        address.replace(/\s+/g, " ").trim()
      );
    }

    // Bureau de vote
    const votePlaceElement = Array.from(
      proposalElement.querySelectorAll("div")
    ).find((el) => el.textContent.trim() === "Bureau de vote");
    if (votePlaceElement) {
      const votePlace = votePlaceElement.nextElementSibling.textContent.trim();

      let lignes = votePlace.split("\n");
      const ville = lignes[1].split("(")[0].trim();
      const departement = lignes[1].match(/\(([^)]+)\)/)[1];
      info.user_details_rawVotePlace = lignes[0].trim();
      info.user_details_votePlace = encodeURIComponent(lignes[0].trim());
      info.user_details_electoralListCityName = encodeURIComponent(ville);
      info.user_details_electoralListCityDepartment =
        encodeURIComponent(departement);
    }

    // Numéro d'électeur
    const voterNumberElement = Array.from(
      proposalElement.querySelectorAll("div")
    ).find((el) => el.textContent.trim() === "Numéro d'électeur");
    if (voterNumberElement) {
      const voterNumber = voterNumberElement.nextElementSibling
        ? voterNumberElement.nextElementSibling.innerText.trim()
        : "";
      info.user_details_voterNumber = voterNumber;
    }

    // Email
    const emailLink = proposalElement.querySelector('a[href^="mailto:"]');
    if (emailLink) {
      info.user_details_rawEmail = emailLink.innerText.trim();
      info.user_details_email = encodeURIComponent(emailLink.innerText.trim());
    }

    // Téléphone
    const phoneLink = proposalElement.querySelector('a[href^="tel:"]');
    if (phoneLink) {
      info.user_details_phone = phoneLink.innerText.trim();
    }

    // Date de naissance
    const birthdateElement = Array.from(
      proposalElement.querySelectorAll("div")
    ).find((el) => el.textContent.trim() === "Date de naissance");
    if (birthdateElement) {
      const birthdateText = birthdateElement.nextElementSibling
        ? birthdateElement.nextElementSibling.innerText.trim()
        : "";
      const birthdateParts = birthdateText.split(" ");
      info.user_details_birthdate_day = birthdateParts[0];
      info.user_details_birthdate_month = mapMonthTextToValue(
        birthdateParts[1]
      );
      info.user_details_birthdate_year = birthdateParts[2];
    }

    // Disponibilités
    const availabilityElement = Array.from(
      proposalElement.querySelectorAll("div")
    ).find((el) => el.textContent.trim() === "Disponibilités");
    if (availabilityElement) {
      const availabilityText = availabilityElement.nextElementSibling
        ? availabilityElement.nextElementSibling.innerText.trim()
        : "";
      info.user_details_electionsDates_0 =
        availabilityText.includes("2024-06-30");
      info.user_details_electionsDates_1 =
        availabilityText.includes("2024-07-07");
    }

    // Contact Citipo
    const contactElement = Array.from(
      proposalElement.querySelectorAll("div")
    ).find((el) => el.textContent.trim() === "Contact Citipo/OpenAction");
    if (contactElement) {
      info.contact = contactElement.nextElementSibling
        ? contactElement.nextElementSibling.innerText
            .trim()
            .includes("Confiance")
          ? "Confiance"
          : ""
        : "";
    }

    // Commentaire
    const commentElement = Array.from(
      proposalElement.querySelectorAll("div")
    ).find((el) => el.textContent.trim() === "Commentaire");
    if (commentElement) {
      const comment = commentElement.nextElementSibling
        ? commentElement.nextElementSibling.innerText.trim()
        : "";
      info.user_details_comment = encodeURIComponent(comment);
    }

    return info;
  }

  // Liste des scripts à exécuter pour chaque chemin
  const scripts = {
    "/console/proposals": scriptForProposals,
    "/console/requests": scriptForRequests,
    "/console/matches": scriptForMatches,
  };

  function scriptForProposals() {
    // Ajouter les boutons aux demandeurs
    const proposalElements = document.querySelectorAll('div[id^="proposal-"]');
    proposalElements.forEach((element) => {
      const contactInfo = extractInfo(element);
      const formButton = createFormButton("proposant", contactInfo);
      element.querySelector(".text-xs.my-2.space-y-2").appendChild(formButton);
      const searchButton = createSearchButtons(contactInfo);
      element
        .querySelector(".text-xs.my-2.space-y-2")
        .appendChild(searchButton);
      checkBadContactinfo(contactInfo);
    });
  }

  function scriptForRequests() {
    // Ajouter les boutons aux demandeurs
    const requestElements = document.querySelectorAll('div[id^="request-"]');
    requestElements.forEach((element) => {
      const contactInfo = extractInfo(element);
      const button = createFormButton("demandeur", contactInfo);
      element.querySelector(".text-xs.my-2.space-y-2").appendChild(button);
      checkBadContactinfo(contactInfo);
    });
  }

  function scriptForMatches() {
    // Ajouter les boutons aux demandeurs
    const requestElements = document.querySelectorAll('div[id^="request-"]');
    requestElements.forEach((element) => {
      const contactInfo = extractFromMatchRequestInfo(element);
      const button = createFormButton("demandeur", contactInfo);
      element.querySelector(".text-xs.my-2.space-y-2").appendChild(button);
      checkBadContactinfo(contactInfo);
    });

    // Ajouter les boutons aux proposants
    const proposalElements = document.querySelectorAll('div[id^="match-"]');
    proposalElements.forEach((element) => {
      const contactInfo = extractFromMatchProposalInfo(element);
      const button = createFormButton("proposant", contactInfo);
      element.appendChild(button);
      checkBadContactinfo(contactInfo);
    });

    const links = document.querySelectorAll("a");

    links.forEach((link) => {
      const href = link.getAttribute("href");
      // Vérifier si le lien correspond au modèle spécifié
      if (
        href &&
        href.startsWith("/console/matches/") &&
        href.includes("/reject")
      ) {
        link.style.display = "none";
      }
    });
  }

  function addButtonsFirstDiv(buttonDataArray) {
    const divs = document.querySelectorAll("div");
    if (divs.length === 0) {
      return;
    }

    const firstChildDiv = divs[0].querySelector("div");
    if (firstChildDiv) {
      buttonDataArray.forEach((buttonData) => {
        const button = createUsefullButton(buttonData.url, buttonData.text);
        firstChildDiv.appendChild(button);
      });
    }
  }

  // Exemple de données pour les boutons
  const buttonDataArray = [
    {
      url: "https://barnabegeffroy.github.io/cp/",
      text: "Recherche villes voisines avec CP",
    },
    {
      url: "https://docs.google.com/spreadsheets/d/15AlV23fz-w8uzp0XQRW2E96uu04wdgJYG_zYJopdBYw/edit?gid=423634231#gid=423634231",
      text: "Calendrier SAV + demandes",
    },
    {
      url: "https://docs.google.com/spreadsheets/d/15AlV23fz-w8uzp0XQRW2E96uu04wdgJYG_zYJopdBYw/edit?gid=2025753569#gid=2025753569",
      text: "Calendrier Mises en relation",
    },
    {
      url: "https://www.notion.so/Plateforme-de-procuration-Front-Populaire-cbda3768fbad45d9bb389adadeb68223?pvs=4",
      text: "Notion (FAQ)",
    },
  ];

  function addNavButtonsEndOfList() {
    const list = document.querySelector("#list");

    const navBar = list.querySelectorAll("div")[1];
    const navBarBottomClone = navBar.cloneNode(true);
    list.appendChild(navBarBottomClone);

    const backToTopButton = document.createElement("button");
    backToTopButton.innerText = "Haut de Page";
    backToTopButton.className = "btn btn-primary";
    backToTopButton.style.margin = "10px";
    backToTopButton.addEventListener("click", () => {
      document.querySelector("h2").scrollIntoView()
    });
    list.appendChild(backToTopButton);
  }

  function createAlertDiv(message) {
    const alertDiv = document.createElement("div");
    alertDiv.className = "custom-alert"; // Classe pour le style personnalisé
    alertDiv.innerHTML =
      `<strong>${message}</strong> `;
    alertDiv.style.padding = "15px";
    alertDiv.style.backgroundColor = "orange";
    alertDiv.style.color = "black";
    alertDiv.style.fontWeight = "bold";
    alertDiv.style.borderRadius = "10px";
    alertDiv.style.marginBottom = "10px";
    return alertDiv
  }

  function warningAssigned() {
    const assignedPeolpe = document.querySelectorAll(
      'turbo-frame[id^="proposal-assigned-"], turbo-frame[id^="request-assigned-"], turbo-frame[id^="match-assigned-"]'
    );
    assignedPeolpe.forEach((element) => {
      const email = element.querySelector("div.flex-1").textContent.trim();
      if (email != "Aucun") {
        const alertDiv = createAlertDiv("Attention ! En cours de traitement possible");

        element.parentElement.parentElement.insertBefore(
          alertDiv,
          element.parentElement.parentElement.firstChild
        );
      }
    });
  }

  function checkBadContactinfo(contactInfo) {
    DEBUG && console.log("Check contact info", contactInfo);
    // On cherche zip et ville, si c'est en France (" FR")
    if (contactInfo.user_details_rawAddress 
      && ! regexAddr.test(contactInfo.user_details_rawAddress)
      && contactInfo.user_details_rawAddress.includes(" FR")) {
        DEBUG && console.log("Bad Address:", contactInfo.user_details_rawAddress);

        const alertDivAddress = createAlertDiv("Attention ! Addresse imprécise, ajouter le CP");
      
        contactInfo.user_details_infoParentElement.insertBefore(
          alertDivAddress,
          contactInfo.user_details_infoParentElement.firstChild
        );
    }
    if (contactInfo.user_details_voterNumber
        && !regexNumElect.test(contactInfo.user_details_voterNumber)
    ) {
      DEBUG && console.log("Bad Elect Number:", contactInfo.user_details_voterNumber);

      const alertDivElectNum = createAlertDiv("Attention ! Numéro d'électeur pas commun");
      
      contactInfo.user_details_infoParentElement.insertBefore(
        alertDivElectNum,
        contactInfo.user_details_infoParentElement.firstChild
      );

    }
    // Contact name has numbers
    if (contactInfo.user_details_fullName
        && contactInfo.user_details_fullName.match(/\d+/) != null
    ) {
      DEBUG && console.log("Bad Name Format:", contactInfo.user_details_fullName);

      const alertDivName = createAlertDiv("Attention ! Nom/Prénom non conforme");
      
      contactInfo.user_details_infoParentElement.insertBefore(
        alertDivName,
        contactInfo.user_details_infoParentElement.firstChild
      );
    }

    // On regarde si le contact a été recréé à la main pour le 2nd tour, si oui, bandeau d'info
    if (contactInfo.user_details_rawEmail) {
      sha256(contactInfo.user_details_rawEmail).then(hash => {
        DEBUG && console.log(`Check recreated, email ${contactInfo.user_details_rawEmail} with hash ${hash}`);
        if (recreatedDemands.includes(hash)) {
          console.log(`${contactInfo.user_details_rawEmail} was recreated for 2nd`);
          const alertDivName = createAlertDiv("FICHE RECREEE -> Contacter le mandat avant de vous lancer dans une mise en relation complexe car il n'a peut-être plus besoin");
          contactInfo.user_details_infoParentElement.insertBefore(
            alertDivName,
            contactInfo.user_details_infoParentElement.firstChild
          );
        }
      });
    }
  }


  // Fonction pour exécuter le script en fonction du chemin
  function executeScript() {
    const path = window.location.pathname;
    addButtonsFirstDiv(buttonDataArray);
    addNavButtonsEndOfList();
    if (scripts[path]) {
      scripts[path]();
    } else {
      console.log("No script defined for this path");
    }
    warningAssigned();
  }

  // Observer les changements d'URL
  if (window.onurlchange === null) {
    window.addEventListener("urlchange", (info) => {
      executeScript();
    });
  }

  // Exécuter le script lors du chargement initial
  executeScript();
})();
