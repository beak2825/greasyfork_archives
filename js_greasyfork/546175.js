// ==UserScript==
// @name        High-res animated C.AI avatars
// @namespace   none
// @version     77.14-12-2025
// @description Make Character.AI avatars load in their full resolution (400px) and quality (100%), and let them be animated when they should be. I also try to manually find sources of characters' images that are recommended to me by CAI. Shorter script in description. Original script by logan.uswp: https://greasyfork.org/en/scripts/482793-always-hi-res-c-ai-avatars/code
// @author      Atemo Cajaku, logan.uswp
// @match       https://*character.ai/*
// @icon        https://yt3.ggpht.com/CpUhK3dG9C6LqwtUfhpLx9PhUYl1HaAFyXumQ0xG6QXOQYRI5HecTHINrCUeut7O_TDjp-EgKA=s256
// @license     0BSD
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/546175/High-res%20animated%20CAI%20avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/546175/High-res%20animated%20CAI%20avatars.meta.js
// ==/UserScript==

(function() {
	'use strict';

	const observer = new MutationObserver(mList => {
		mList.forEach(m => {
			const avatar = m.target.querySelectorAll("img[src^=\"https://characterai.io\"]");
			avatar.forEach(i => {
				i.src = i.src.replace(
					"i/80", "i/400").replace(
					"i/200", "i/400").replace(
					"?webp=true&anim=0", "").replace(
					"?anim=0", ""
				);
			});

			const specific = m.target.querySelectorAll("img[src^=\"https://characterai.io\"]");
			specific.forEach(i => {
				i.src = i.src.replace(
					// Deer Girlfriend (https://character.ai/character/amZxNNnO)
					// @KANK_          (https://character.ai/profile/KANK_)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/5/7dsL-EKQeyR-_bfMvYhAh8p1HrtsiX6AuU114CExjKQ.webp",
					"https://static1.e621.net/data/bf/40/bf409f24589762150e27d26a48ddfb13.jpg").replace(

					// Fawn- Deer Princess (https://character.ai/character/mjiutqf4)
					// @LatiasG135         (https://character.ai/profile/LatiasG135)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/8/25/SBaX3rYr7uy43R4kbyN2ImLw2TVQDdU-GVuf12XZgTU.webp",
					"https://static1.e621.net/data/08/4b/084b00366487fccbe59c1c02869fe146.jpg").replace(

					// Sophia - Furry (https://character.ai/character/SjYv9hPJ)
					// @How_aboutcai  (https://character.ai/profile/How_aboutcai)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/9/9/B6sKBKcxRLGZLOFB6iCfKK5ObD3FKQpMUYnhPVGRMk8.webp",
					"https://static1.e621.net/data/d8/ba/d8ba726e4236e6572df9c5585030d2f5.jpg").replace(

					// Skye _jayrnski_ (https://character.ai/character/Gr3UN8Vk)
					// @SuihtilCod     (https://character.ai/profile/SuihtilCod)
					"https://characterai.io/i/400/static/avatars/uploaded/2025/2/19/Hm8EFDlLUrn2x2QUuz_9Ij32Yg5KrnjoheXkQIi17kE.webp",
					"https://static1.e621.net/data/23/4d/234d82dd290c5a0a313f05ccfc86cd47.png").replace(

					// Sheep    (https://character.ai/character/tWK6HUSY)
					// @NeoCube (https://character.ai/profile/NeoCube)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/12/10/aaokSFdvuJzKVJwKlXCwyDzrgmyTTvB2EEwPsI48tkw.webp",
					"https://static1.e621.net/data/45/1b/451bcb515904df2b3e253c8c087f733c.jpg").replace(

					// Shy Cheetah (https://character.ai/character/nyAoZ5MP)
					// @Isaac_Webb (https://character.ai/profile/Isaac_Webb)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/5/RxxcbJDrBYtoyWdrNmtNG5VSdNScqMnXXMlDCtH1Bak.webp",
					"https://static1.e621.net/data/c9/02/c90200c4a3844304d5da71e7aec9b958.png").replace(

					// Charlie The Cheetah (https://character.ai/character/gN3l6tUe)
					// @TheTinyAdventuner  (https://character.ai/profile/TheTinyAdventuner)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/22/LZ6LysHxTptpExqNZ33maI5QvrUEf77ZAQQ1TIxm2t4.webp",
					"https://user-uploads.perchance.org/file/d4759b9180ee8786c742b5d24ec42e38.webp").replace(

					// Lucas Collins (https://character.ai/character/prrKHvnX)
					// @B3amJC       (https://character.ai/profile/B3amJC)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/25/fPPylYuxtJGp7DmYHWXXxYmm1ZD6xjL1RXhPbk4ejKo.webp",
					"https://static1.e621.net/data/f2/86/f2869ca5413f97cabb82cd3c9bd0098b.png").replace(

					// Iris-Your furry Boss (https://character.ai/character/KiaR5w1U/cold-demanding-doberman-boss)
					// @LatiasG135          (https://character.ai/profile/LatiasG135)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/22/x-gaevVHLKDmKG3W8pkfwcEM8DeKaAhWAx8uXzF246U.webp",
					"https://static1.e621.net/data/9f/60/9f60daa4600810ce0104ec5fb56a5b7e.jpg").replace(

					// snowi      (https://character.ai/character/odZ3GHSl)
					// @FaerieAri (https://character.ai/profile/FaerieAri)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/6/Ki6NEdect-HNvDO26oZ5IELLogkA95NEV_XbtjFGdqQ.webp",
					"https://f2.toyhou.se/file/f2-toyhou-se/images/58346221_cFFX0MVa3ixWIOq.png").replace(

					// Ylva            (https://character.ai/character/AVSNUmsI)
					// @CAKEPOPENJOYER (https://character.ai/profile/CAKEPOPENJOYER)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/23/iecw6BY6pia_Ks5FTEcIY1_LJUo1NOp_-ZWwAtQo254.webp",
					"https://static1.e621.net/data/83/f6/83f6fae13d8d826ce5cb26a5aa33030f.jpg").replace(

					// Kae Velington (https://character.ai/character/rcLut3rW)
					// User deleted. (https://character.ai/profile/CharacterUser9947514030125089460)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/31/vn-y6JNZ_cmQd44UL38yhTgK0Y0-6iYoDOD8jK0Q-rM.webp",
					"https://static1.e621.net/data/d4/d1/d4d13225834fc06f8fd8fb01b97c40c9.png").replace(

					// Female fursuit (https://character.ai/character/vBU-rpmO)
					// @foxyplays600  (https://character.ai/profile/foxyplays600)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/12/gNLkZiAzmsHbTzgrWA85V52bOu75BO6s1wM0NQDtIw8.webp",
					"https://i.pinimg.com/originals/fc/1f/75/fc1f75f4fab8113e2b97c85f58cdd837.jpg").replace(

					// Erika Taylor (https://character.ai/character/yXz89P9M)
					// @B3amJC      (https://character.ai/profile/B3amJC)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/5/20/hY1e7wjXpigBDNmFMSWBDG9At_fMo56EvWWRNEH_NQ4.webp",
					"https://static1.e621.net/data/b7/ab/b7abb87cdc40af88a16858f677ec1947.png").replace(

					// Dr K         (https://character.ai/character/T4Jd4Uvq)
					// @ReconnectTC (https://character.ai/profile/ReconnectTC)
					"https://characterai.io/i/400/static/avatars/uploaded/2022/12/23/2n_LepKeNwmS0CbmMrLJFTUVB0tluajTsDctQvyB51A.webp",
					"https://steamuserimages-a.akamaihd.net/ugc/1698405319047328524/8AC1790941E92F690520CA856683C2A2AB2017F7/").replace(

					// Furry Femboy Roommate (https://character.ai/character/TFTDwhbs)
					// @ZepelinQwerty        (https://character.ai/profile/ZepelinQwerty)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/11/R3yFCCHvylH86apHEpJuyuiqWmzPwu9tygvXNDTbSCs.webp",
					"https://i.pinimg.com/originals/43/23/9c/43239c2f81310baeb28a01f13d5f6dcc.jpg").replace(

					// Fay- Furry neighbor (https://character.ai/character/hVu6-mOy)
					// @LatiasG135         (https://character.ai/profile/LatiasG135)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/18/4gKPi2C16DQ4A7VV0UjFjBUzTPfwtpvSPL4wlZmRSPA.webp",
					"https://static1.e621.net/data/22/b6/22b631b374c2a6c955740deb17d95f78.jpg").replace(

					// Female Dragon Furry (https://character.ai/character/uOzw5whQ)
					// @Zagadka159         (https://character.ai/profile/Zagadka159)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/13/WlX3qJzaAuKTp21gbI7iL1Zb5-oUD2PHSJRtPA0dtWM.webp",
					"https://static1.e621.net/data/27/05/270584e03b9a6e2125210a8149c26c87.jpg").replace(

					// The Furry school (https://character.ai/character/o08KjXDX)
					// @Im_Done_Here    (https://character.ai/profile/Im_Done_Here)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/11/Zhxbmb1-azh2MsGkPTppzH4JWAHtzRU1UhLI3kCYecA.webp",
					"https://i.redd.it/osqnpljgsyu61.png").replace(

					// Furry Roommate   (https://character.ai/character/Wa59hnne)
					// @ANDRODLOVER5679 (https://character.ai/profile/ANDRODLOVER5679)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/8/12/mMQogxycgrHtCbo-Po9q1q0tlyLUUZsue25nSB3Sf28.webp",
					"https://user.uploads.dev/file/62e9c126842c07107a4b90b6eb445451.jpg").replace(

					// Discord furry (https://character.ai/character/bltNMhPd)
					// @Isaac_Webb   (https://character.ai/profile/Isaac_Webb)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/9/LTmyo0F864fOxpNksQDTT5Kn-WZwbNPHd688WBoZE94.webp",
					"https://static1.e621.net/data/39/2f/392ffb9e0e2594e0aea39676539ff2cd.jpg").replace(

					// Disocrd    (https://character.ai/character/q7BPxVxj)
					// @Fanamatic (https://character.ai/profile/Fanamatic)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/23/mv4qPKBEq3eNyez2qg74L2PtyVWeLaDDS9NZ8nUHUgA.webp",
					"https://static1.e621.net/data/96/65/966518b69a7eabbce6ecf676b656773d.png").replace(

					// Next-Door Neighbor (https://character.ai/character/QnQVOim5)
					// @Dem_Bots          (https://character.ai/profile/Dem_Bots)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/19/oiCn6AaK9LFHQUa37zVF0Uc9t7z5hT6TdBLtKPz6lZs.webp",
					"https://cdn.donmai.us/original/c6/bd/c6bd744d2c89d2114dfc1a0572f68b02.jpg").replace(

					// Dragon girl  (https://character.ai/character/AyBnEhwE)
					// @aizetheboss (https://character.ai/profile/aizetheboss)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/22/1dRjx9Jv-Alj5bz7RClRXwLGvfyck8zozNWRRi_Zkf0.webp",
					"https://user-uploads.perchance.org/file/e8d421b404daf12e824e2014a18179d5.jpg").replace(

					// Dragonmaid Sheou (https://character.ai/chat/SVm1pjPAQEAQqWb8yR6083Ti2zss6aePzvSv1E2asM8)
					// @w0lfl0g1c       (https://character.ai/profile/w0lfl0g1c)
					"https://characterai.io/i/400/static/avatars/uploaded/2022/12/3/obnukUxeJZucqiYzmQmwPHbFo8auhHwODMqCJV6j7TU.webp",
					"https://static1.e621.net/data/ec/db/ecdb1b54a063cbfadda2553be2f312ff.jpg").replace(

					// Roxanne the Dragon (https://character.ai/character/nxLqh1r-)
					// @KANK_             (https://character.ai/profile/KANK_)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/27/c5oj_nAh1-w31ooEyaE8YOcdzaKWsPu_mAVlbw9wGw4.webp",
					"https://static1.e621.net/data/fa/30/fa3023edc6dfd1fb7f59196d1fbd4fba.jpg").replace(

					// Naafiri          (https://character.ai/character/-iAA0LF9)
					// @Sho-KaTheKobold (https://character.ai/profile/Sho-KaTheKobold)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/27/Y_99BWOqg1h4htN9n9Z2x9rDFjRAP344GycdnT2Dsls.webp",
					"https://static1.e621.net/data/10/06/1006fc20fadb22adea077b66df821dba.jpg").replace(

					// Rayquaza   (https://character.ai/character/B-hCFNzc)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/2/7EPyPeIFa7ZZyCU2pdmKqlz9Vn0gq2gU5JbrqU0revU.webp",
					"https://static1.e621.net/data/7a/fa/7afa4d0397ed008c03e38392d3a5193b.jpg").replace(

					// Roommate (https://character.ai/character/hPCTF6MQ)
					// @iamlonely13 (https://character.ai/profile/iamlonely13)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/5/eNJAQbjNmC5ZPf5M2Ub1ZzKD0uPoVkeU4asGho3Xm2Q.webp",
					"https://user-uploads.perchance.org/file/7c241b118cffdde61e87b185237e6c71.jpg").replace(

					// Marilin       (https://character.ai/character/U5tRNks6)
					// User deleted. (https://character.ai/profile/CharacterUser14188726476607658230)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/30/0u9ctSCdUCoyMTzxzYMpCsxcY-x0eMlhXJIg1CmFlq4.webp",
					"https://static1.e621.net/data/b0/3d/b03d7f52fa3dcc75b902ec269e32434a.png").replace(

					// Jinu         (https://character.ai/character/DwNnjjrm)
					// @Sleepygooby (https://character.ai/profile/Sleepygooby)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/7/1nbBfHwjgmfVCgwKPcMzc3ilS0b5ZufU92n5t5QYLT4.webp",
					"https://static1.e621.net/data/sample/dc/d5/dcd51fc9782d41f1287624adf16583dd.jpg").replace(

					// Noelle Holiday (https://character.ai/character/hEO-E3KF)
					// @cloverleaf    (https://character.ai/profile/cloverleaf)
					"https://characterai.io/i/400/static/avatars/uploaded/2022/10/7/Ko6kJeCNJuP9OSr4-yMMhIa6UPQI4FnjL1R7CCJ7bng.webp",
					"https://static1.e621.net/data/e5/fc/e5fc55f8b4cc6d7a9d2822b95107948b.jpg").replace(

					// Noelle Holiday (https://character.ai/character/fG6f98gE)
					// @BabyMew123    (https://character.ai/profile/BabyMew123)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/9/_rD2gbiDAMqxn9sRqz1e7RstMqrpheGN_1wYqb7EuPM.webp",
					"https://i.pinimg.com/originals/7e/e0/f8/7ee0f854cb2c84037bbfc9bb1c20697f.jpg").replace(

					// Suro- Your Servant (https://character.ai/character/G8db-1Y-)
					// @LatiasG135        (https://character.ai/profile/LatiasG135)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/25/5Joe5QdeuMu3jq6e70L-nIqVBr3O0vTzZy4W64jGLvs.webp",
					"https://furrycdn.org/img/2022/2/13/144290/full.jpg").replace(

					// Jirachi      (https://character.ai/character/mtpQ9Xmy)
					// @Cinderace77 (https://character.ai/profile/Cinderace77)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/5/8/UrsDQD_ih5-k67Bm-zKCRzudtVQtTar4yr7wuxTAflw.webp",
					"https://static1.e621.net/data/f8/ff/f8ffab90513a39951f229f3e5db67b4f.jpg").replace(

					// Anthro Jirachi   (https://character.ai/character/o635K1Xq)
					// @AnybottyAnytime (https://character.ai/profile/AnybottyAnytime)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/19/YY65oQ4Z5afXkZ9dCepXwq3c_Y_pG-vtE5GONVpUhmE.webp",
					"https://i.kym-cdn.com/photos/images/original/001/390/113/be2.png").replace(

					// Anthro Ceruledge (https://character.ai/character/LuWX1plu)
					// @AnybottyAnytime (https://character.ai/profile/AnybottyAnytime)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/8/FPpVsKDVzBXjRQiivgSevFq5feAM6_DEgCp02lY9h7M.webp",
					"https://static1.e621.net/data/60/24/60243b0931b44767b95975f8ffa986d2.png").replace(

					// Hazel    (https://character.ai/character/kXkN_CiH)
					// @Zerxxer (https://character.ai/profile/Zerxxer)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/1/31/o5kHxqqnLTURf_4NnWQWzWgZ4lI7FsBOTimEPjqP3Ek.webp",
					"https://f2.toyhou.se/file/f2-toyhou-se/images/31746720_zDeP2qr5rxDNvwN.png").replace(

					// Tasque Manager (https://character.ai/character/lO9RtmHo)
					// @NumberSyx     (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/8/ALsoEJRTUgXrCuibUWX7jk5sm9cBHlf_BzuHVdMZT_o.webp",
					"https://static1.e621.net/data/f2/5b/f25b3a5729014d4de7b6cbc22f261c12.png").replace(

					// -Captured Elf     (https://character.ai/character/CNDfDqxt)
					// @TyrannicalKermit (https://character.ai/profile/TyrannicalKermit)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/2/hvaHwwMw4BOB56V0MMUfUnJ6qbd2VkSsJ7ESG2fCykU.webp",
					"https://user.uploads.dev/file/e329beec71192bcbb2cfdeb1922e3559.jpg").replace(

					// Vaporeon  (https://character.ai/character/wtCIKH6Y)
					// @Trixourc (https://character.ai/profile/Trixourc)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/9/1/dj_eLoV1eh2vK1Pbm2ZPJXVrNm12W67_OV5GMZ2b3n4.webp",
					"https://static1.e621.net/data/4a/9b/4a9bd3da4ac1ca9b1a817eed8021438a.jpg").replace(

					// Yandere Vaporeon (https://character.ai/character/T-u3UWzo)
					// @Coolman38       (https://character.ai/profile/Coolman38)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/18/NJcWPnMNtTXelEcTfDLRgYs8h-XjQ55MMzgBAdTw6as.webp",
					"https://static1.e621.net/data/58/d5/58d569cccf12104d75575ece5ad22243.jpg").replace(

					// Ralsei        (https://character.ai/character/UIxz2l8A)
					// @EddieBagel64 (https://character.ai/profile/EddieBagel64)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/9/H9ulBU1Vm_okhaMRxtehZe1eR5n4bgJ5EbzpCzIMMMM.webp",
					"https://static1.e621.net/data/c9/fc/c9fc34369cf42a115a4d025eb89c8c86.jpg").replace(

					// Ralsei         (https://character.ai/character/jiNbkXso)
					// @catupisdedown (https://character.ai/profile/catupisdedown)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/4/14/c_rTV98k-vOFi7kP7qf0s3_DBwg8RAMrY59VQm2pkig.webp",
					"https://static1.e621.net/data/11/95/1195bba3d7aa2940f66e4745aa244fd1.png").replace(

					// Ralsei Roommate Au (https://character.ai/character/JjVI3XwZ)
					// @Patcesh           (https://character.ai/profile/Patcesh)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/27/zsTvzZTD7lFe3HvRSTbRpMJkxowy7uE8LxJ1N47sJtQ.webp",
					"https://static1.e621.net/data/de/4f/de4f26745bd6652cab2ba3ae4695614b.jpg").replace(

					// Femboy ralsei V2 (https://character.ai/character/tv82AQgm)
					// @Yoshogaki       (https://character.ai/profile/Yoshogaki)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/18/XhAcwHQB0q9SCiXoWcSz23coPT85RXpHMJxSt-iPRr4.webp",
					"https://static1.e621.net/data/ef/ae/efae21d5daed27f0302e6623ad782147.png").replace(

					// Femboy Ralsei -WIP- (https://character.ai/character/Z_toiRZ8)
					// @AdSab_             (https://character.ai/profile/AdSab_)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/27/f0qXtW8Owna-RZ13iDkiTJQKyJGUpGAFN7Pkzb6Trpg.webp",
					"https://static1.e621.net/data/5b/9f/5b9fbd9893f357c92a3b7e6e64f95043.jpg").replace(

					// Female Ralsei (https://character.ai/character/bgycLEpk)
					// @TONY_FOX     (https://character.ai/profile/TONY_FOX)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/3/14/ckyS6iCS1fZOtvUfQw632irGeOdiG6TGP5tbRArf0nQ.webp",
					"https://static1.e621.net/data/51/aa/51aaf8283c39095f601bc8a9dabc559b.jpg").replace(

					// High School Ralsei (https://character.ai/character/qyFMYGMW)
					// @urlocalmafiaboss  (https://character.ai/profile/urlocalmafiaboss)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/11/28/TFbx8U50nL_B8fCc9z3KtqLxmvk_XxyPF3wD8vGxumw.webp",
					"https://static1.e621.net/data/78/a4/78a43321887254aef0c84ffdb4983343.png").replace(

					// Ceroba Ketsukane (https://character.ai/character/XA55PwGR)
					// @SkyfatherSpider (https://character.ai/profile/SkyfatherSpider)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/4/23/EAl6ez7B1urTWUl7aMl1QeQDzvMqOvoIMAPM8-S9iaI.webp",
					"https://static1.e621.net/data/96/7f/967f441c1f20efc8163709410750e93e.png").replace(

					// Buttercup           (https://character.ai/character/85bWPdlQ)
					// @secretiveSleuthboy (https://character.ai/profile/secretiveSleuthboy)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/11/29/-UpCFJKCaRzbsH0uwaqMCkwcCaNcenhJ9EN7AvEbR_0.webp",
					"https://static1.e621.net/data/fe/1b/fe1bed5e90e923ab3f0f387c54040dc3.jpg").replace(

					// Maple _jayrnski_ (https://character.ai/character/0ObD7XQp)
					// @SuihtilCod      (https://character.ai/profile/SuihtilCod)
					"https://characterai.io/i/400/static/avatars/uploaded/2025/2/14/J4SoiBH5dEkecycoToa-qul-k-saPWQj_a3XIucoqkk.webp",
					"https://static1.e621.net/data/dd/51/dd5124d45a11e06cea8c79853b03bd10.jpg").replace(

					// Cinderace  (https://character.ai/character/_altBvc8)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/29/nmOHAnAAq9VVCHtwFhx4df6fwT6UShTOEHD8zkstgEI.webp",
					"https://static1.e621.net/data/f1/e0/f1e04cc3debbeae94a03dad6105a1891.jpg").replace(

					// Giantess Cinderace (https://character.ai/character/GrI_ZhXU)
					// @sprinniko         (https://character.ai/profile/sprinniko)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/4/5/CklsQyj4qgoi8UKFrARbm5VLidwMT9efjldyilIk_xc.webp",
					"https://static1.e621.net/data/09/4b/094beeb2e8ee53c26e17a92a9ef6e0bc.png").replace(

					// Cinderace -Female- (https://character.ai/character/XNtFOHEm)
					// @BarelyFunctioning (https://character.ai/profile/BarelyFunctioning)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/27/jVmtszwKcchi4KORfQTXjPhiTpGDODm-tjlkblCXDfk.webp",
					"https://static1.e621.net/data/09/4b/094beeb2e8ee53c26e17a92a9ef6e0bc.png").replace(

					// Male Cinderace      (https://character.ai/character/8hdE51fj)
					// @Professionalgoober (https://character.ai/profile/Professionalgoober)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/5/21/Pr3vJY35mtIQPubAffnUBL1VglBpxTqNrfnom_xP0YA.webp",
					"https://static1.e621.net/data/de/89/de89b3a679958cecc271eca50550a882.png").replace(

					// Cinderace Meowscarad (https://character.ai/character/3d5ObCP7)
					// @Nicolas_M           (https://character.ai/profile/Nicolas_M)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/14/yWSVuSKAmChaJCqtuU_tt7hdIs9ru0xjjsuAomA0fkI.webp",
					"https://static1.e621.net/data/72/79/7279426c0af92a3b226037cd2417df65.jpg").replace(

					// meowscarad cinderace (https://character.ai/character/hbVdmg6S)
					// @spriedgardo         (https://character.ai/profile/spriedgardo)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/11/RO2zmNa62jy5yWLBC1fNuD2Gj_7nKxTsMrrhQCs2mHA.webp",
					"https://static1.e621.net/data/72/79/7279426c0af92a3b226037cd2417df65.jpg").replace(

					// Meowscarada (https://character.ai/character/J_yI97_d)
					// @vqpr       (https://character.ai/profile/vqpr)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/11/nZkrzNpjoWah-QL3ZDhkZMLvalzI41o1DBzFLMZpmRQ.webp",
					"https://static1.e621.net/data/22/a7/22a76a4aaf1fba1e476f7828eb9ddd47.png").replace(

					// Meowscarada           (https://character.ai/character/bglQOKBr)
					// @Godzilla_And_Friends (https://character.ai/profile/Godzilla_And_Friends)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/3/25/5tk62w7oc2XmWUfhuS4NUfOP-6wkTRRItuY4-X_ixqA.webp",
					"https://user.uploads.dev/file/bd66f76648185438b5572a6fe22e2790.jpg").replace(

					// Meowscarada (https://character.ai/character/EMrHk_rW)
					// @NumberSyx  (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/17/Q3oFhARo6xs5FSC-myy_AMYlyyOQJlgNEwLzeXZayTg.webp",
					"https://user-uploads.perchance.org/file/1769131b587416a4d6967d3ebc916eb0.webp").replace(

					// Meowscarada     (https://character.ai/character/yDy4zUoG)
					// @A-peaceful-guy (https://character.ai/profile/A-peaceful-guy)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/10/1arOn7AzStTOBgLnv9wfdAcAfz58trYmq2b3k6hWWqo.webp",
					"https://static1.e621.net/data/f2/d5/f2d5f36db562d7b7d60d1efb6bc86567.png").replace(

					// Meowscarada (https://character.ai/character/rFq7zwe6)
					// @ReeKili    (https://character.ai/profile/ReeKili)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/30/uuRhXLdrFOdJMYDg74-i71W0Xm-5oYkLWeLDUyiaCrY.webp",
					"https://static1.e621.net/data/24/1f/241f134959add3679b214ad05dea116c.jpg").replace(

					// Yandere Meowscarada (https://character.ai/character/JaGUNAKA)
					// @Alanleft           (https://character.ai/profile/Alanleft)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/4/30/nLYl4mU82MyJ9XzoD3Q-R89v-VCptdH0vumjoGVe5YM.webp",
					"https://static1.e621.net/data/ef/30/ef30a62e814e0707e787fba0f8ca56f2.png").replace(

					// Rosemary     (https://character.ai/character/u1xE8xr5)
					// @DLPVPisaPOS (https://character.ai/profile/DLPVPisaPOS)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/4/0JmUU0mM4yhQ2SkqPfmlShnenDINpGk4RUG5WJpygMs.webp",
					"https://user-uploads.perchance.org/file/04844687b7f887907bfdea6903a2a62c.webp").replace(

					// Female Floragato (https://character.ai/character/mehvMtGn)
					// @FreshinFresh    (https://character.ai/profile/FreshinFresh)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/15/GITQA4WJRhMTD7Dl2lWeqVrpFw9fLuRsBxmO7jdGbCU.webp",
					"https://art.ngfiles.com/images/3087000/3087940_cattmilkk_floragato-s-learning-how-to-draw.png").replace(

					// Reshiram     (https://character.ai/character/sfacd5Rq)
					// @RestingCrab (https://character.ai/profile/RestingCrab)
					"https://characterai.io/i/400/static/avatars/uploaded/2022/12/28/ozv_xAlIom00f8xxNuKJ4I_lPX621muQ292wgF8T5Sg.webp",
					"https://static1.e621.net/data/2d/6b/2d6b4903f72f174d1b0f6195332a7c73.jpg").replace(

					// Teacher Reshiram   (https://character.ai/character/tv95DDz7)
					// @Broisultrapapucho (https://character.ai/profile/Broisultrapapucho)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/13/-HJEMHwuvsQ8dRpXGn_BjDIojYRT-0NzFueIaH_MJoA.webp",
					"https://user-uploads.perchance.org/file/e980259280f7804f08f76c03bbd38239.jpeg").replace(

					// Roommate Reshiram (https://character.ai/character/_mRSQ5yV)
					// @ProfSweetPea     (https://character.ai/profile/ProfSweetPea)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/9/fp1vdG20pzPRzxCCF0fOdWeA9AcUbk7vvWa7l0Ew4sI.webp",
					"https://static1.e621.net/data/26/b6/26b6dcb82a243ecc38ec3d788ade8446.png").replace(

					// Aggressive Reshiram (https://character.ai/character/jdMu_4XS)
					// @ProfSweetPea       (https://character.ai/profile/ProfSweetPea)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/13/FhR3Y_rcrypuGvpzX6ZWxAwqFWtfrPkaXJTtQYvre3w.webp",
					"https://static1.e621.net/data/aa/33/aa331e7acab50acedc40b147dcd59cdf.jpg").replace(

					// Reshi the Reshiram (https://character.ai/character/9CoROv9N)
					// @Nes-12            (https://character.ai/profile/Nes-12)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/10/NKzg1PLrxiWohK_H6d0XIzKDbganQPYlgLOdYb6qA3o.webp",
					"https://user.uploads.dev/file/b2b742fab682f2c1217a61b647510532.jpg").replace(

					// Blaze     (https://character.ai/character/tpFHOwJG)
					// @32BitEgg (https://character.ai/profile/32BitEgg)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/16/DoczaZ2h2dP2-qVWvnzUQ3IPDhU8eg8KA4HUxVv6QmI.webp",
					"https://static1.e621.net/data/9d/c9/9dc9c5d387c88d74d6f6fee9ff08cc1e.jpg").replace(

					// Furry               (https://character.ai/character/Rs_Kzbk-)
					// @TotallyNotDaveLmao (https://character.ai/profile/TotallyNotDaveLmao)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/5/hv3njgho0MLnJhCfNp19CJWonl7uEU2YgsPSQqfkDWA.webp",
					"https://i.pinimg.com/originals/08/a1/98/08a198640d0ce786bd7e730ab18ec1ca.jpg").replace(

					// Furry Sister Tico (https://character.ai/character/zLefBYGi)
					// @LatiasG135       (https://character.ai/profile/LatiasG135)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/10/79t7PsuZInGZKoV_q77sg4P18FHpp7i3LjSlwob3ZPc.webp",
					"https://i.pinimg.com/originals/55/a6/12/55a612fbfc3d6b5a60ccff9883e381b8.jpg").replace(

					// Your Furry Sister (https://character.ai/character/zPFAB3lI)
					// @TealCoriander957 (https://character.ai/profile/TealCoriander957)
					"https://characterai.io/i/400/static/avatars/uploaded/2025/2/28/H_Voo-6QpmJ9Cl27vAhzEgb9pDpqlGJjnniSfX1_BMA.webp",
					"https://user-uploads.perchance.org/file/45be50139c8170f13fb34c0fdd0c0e32.webp").replace(

					// Furry wolf mom (https://character.ai/character/Lqrf-_fH)
					// @Circus_sergal (https://character.ai/profile/Circus_sergal)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/23/N1zUfLdx2Q7x5q6f3TgDfIq7vYXgsNg5G_a0RKV3kh8.webp",
					"https://static1.e621.net/data/fa/c4/fac431c4d602b86a9424bd21334de5b2.jpg").replace(

					// Rich furry female (https://character.ai/character/BEw8xFus)
					// @Zagadka159       (https://character.ai/profile/Zagadka159)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/12/9mZ82tpiBwGOAWUyXyag8WthCmn1u9XC3OXXI_E8BFk.webp",
					"https://user-uploads.perchance.org/file/1a4654e9f259e5c40a56b7541de57e69.jpg").replace(

					// Furry Babysitter (https://character.ai/character/czW8yE6J)
					// @Dem_Bots        (https://character.ai/profile/Dem_Bots)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/29/DYW9EL77mPWHrw6HkjqSxR9nanK70Q99ScfgW4Pwf8U.webp",
					"https://i.pinimg.com/originals/ea/85/23/ea8523fe28f2e7771a58fb12903ec96b.jpg").replace(

					// Femboy furry roommate (https://character.ai/character/JPUHKDNk)
					// @AmongUsIsKool        (https://character.ai/profile/AmongUsIsKool)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/2/ittfXvA0kHLu_4XKrfZnp_9P5Am_Fe3uLkHuG9YD2E0.webp",
					"https://c.tenor.com/zxzCEQcvOB8AAAAC/tenor.gif").replace(

					// Furry Son   (https://character.ai/character/nM_9_PBQ)
					// @Jr_Dan_Dan (https://character.ai/profile/Jr_Dan_Dan)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/2/zrmTeWRWd3FmZpiSCa2C3r9C3tkweqZlSpeADhzMfZQ.webp",
					"https://f2.toyhou.se/file/f2-toyhou-se/images/18824397_7Sub7Ps8Uz1rEeN.png").replace(

					// Leo the Femboy Husky (https://character.ai/character/JP0KaVed)
					// @KANK (https://character.ai/profile/KANK_)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/20/VtNb19MgT9quIM_tolYpm4JaPFFz9C1n4V4GSgc9k68.webp",
					"https://static1.e621.net/data/4c/79/4c7996d7ed3a5c6b6ea2a8c1c42725ee.png").replace(

					// Akkeri - Folder 18 (https://character.ai/character/lbfNKHP7)
					// @ (https://character.ai/profile/Shikari710)
					"https://characterai.io/i/400/static/avatars/uploaded/2025/2/8/mAic4KMgWe3UruZ0TFoLR7xbFECRHkxqoJPw2fRVhZI.webp",
					"https://user.uploads.dev/file/7711272a6c45eb78af0cda391b90e4ca.webp").replace(

					// Gossie     (https://character.ai/character/q3jcAljz)
					// @Norquinal (https://character.ai/profile/Norquinal)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/4/13/JzndvTxzgJ8zi5olRaMXrQRqemQiUVG_inWMwScue7g.webp",
					"https://static1.e621.net/data/c6/ac/c6ac8d610c1e6c10509243fc98f9b786.jpg").replace(

					// Starbucks Furry Girl (https://character.ai/chat/QIOFEtjKOw6wIBjF3XF2Djw2fU-OR78i1rPefnEez6E)
					// @Ballsaccman420      (https://character.ai/profile/Ballsaccman420)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/3/18/PV66-Hg5itKrVnFaLry_lhYKvViIkWeSmgK2dMMh6Lg.webp",
					"https://static1.e621.net/data/a8/9e/a89eedad157ad1c560d4419e0285406a.png").replace(

					// Hiker Furry Female (https://character.ai/character/OzHOak70)
					// @Zagadka159        (https://character.ai/profile/Zagadka159)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/12/P6Q4D2oRgOuo3Ti1kmVx18Rny_D85ZTdmhrtuO59ihk.webp",
					"https://images-ng.pixai.art/images/orig/88a15bba-eb6a-4eec-b8d6-696877805c91").replace(

					// Furry Fox     (https://character.ai/character/wXspxiJw)
					// @insignifiant (https://character.ai/profile/insignifiant)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/9/kY1s8JhGXKKc3Ys5cznVNV-CzaYhixWDcGA25e_D9Nc.webp",
					"https://static1.e621.net/data/ea/01/ea0184738fa8d00a83bbe6072d09914e.png").replace(

					// Fox girl   (https://character.ai/character/60AAMj5d)
					// @Mr_kaboom (https://character.ai/profile/Mr_kaboom)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/18/0lolLQQ-KRbb8dPywBWR7joR4E9_PfTkY4ElciLcs44.webp",
					"https://static1.e621.net/data/af/91/af9146ba225ee0a66f3f8d0e9efaa67f.png").replace(

					// Fox girl roommate (https://character.ai/character/PpSYxs-v)
					// @jm2010           (https://character.ai/profile/jm2010)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/11/BN2Ay4wy0nr7b-BZR6N7VZt6583vBpYwbkJRWfrj9D0.webp",
					"https://photos.xgroovy.com/contents/albums/sources/59000/59030/59024.jpg").replace(

					// Wild Anthro Fox (https://character.ai/character/d4T1vWgo)
					// @DenZGenMaw     (https://character.ai/profile/DenZGenMaw)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/20/bTLCoEGvMafg0OYAROGgIhi1ssP2hjGkkAP1QUPY-jM.webp",
					"https://static1.e621.net/data/8a/93/8a934afb24829aff6243813baac4c5c0.jpg").replace(

					// fox chocolates (https://character.ai/character/KeyPeaUU)
					// @Axooo         (https://character.ai/profile/Axooo)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/4/2/TpncC5ffqff_Q2JYpYH5mRTWMX3gZhTnTvnfRk8m7do.webp",
					"https://static1.e621.net/data/1b/8f/1b8fb727db694e3ca7d2e33cc29a69d5.png").replace(

					// Smokey the Fox (https://character.ai/character/NmGw1R-q)
					// @KANK_         (https://character.ai/profile/KANK_)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/20/B65n7X6NF6bbPCfQFLwaFtnL6eaPjjOuf_elIBwrMlE.webp",
					"https://user.uploads.dev/file/f6435457c63688c0f9a37d9119ce23ed.webp").replace(

					// Friendly Forest Fox (https://character.ai/character/fwEQ5_Y0)
					// @glarblefinder      (https://character.ai/profile/glarblefinder)
					"https://characterai.io/i/400/static/avatars/uploaded/MEmnMOvn0W-nYAsrZWCTtGw4c_dq0-T9S0xnAHSnZG0.webp",
					"https://static1.e621.net/data/90/5e/905e8f0a322c5294601ae4f4545d4f76.jpg").replace(

					// Kitsune (https://character.ai/character/LtYKAmmU)
					// @TheBlevinator (https://character.ai/profile/TheBlevinator)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/12/6PyL0rrjNiSFlRdaUrb9t5EzNjpnb4PfeoSfhRdxiFo.webp",
					"https://i.pinimg.com/originals/43/0e/3f/430e3f8fb8bf1ac60c5bd78449cb2f28.jpg").replace(

					// Maid Marian  (https://character.ai/character/MXsaJYxH)
					// @Weirdcoyote (https://character.ai/profile/Weirdcoyote)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/25/qXWJzZXYVBWPjUbBCy9DVY2XUwwzAJ5jSAq651Y2N54.webp",
					"https://static1.e621.net/data/a1/a0/a1a0acfe05bcd24926de28ba8ca15b0d.jpg").replace(

					// Maid Marian         (https://character.ai/character/fBhcuNko)
					// @Pass_me_the_bleach (https://character.ai/profile/Pass_me_the_bleach)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/4/vuFYqKdQYpbnkkcv8oRdWTn8_5AR2ri1Il5mut5eX1A.webp",
					"https://static1.e621.net/data/3e/64/3e64eaad31be5faecff1a21493a2d7e4.png").replace(

					// Maid Marian        (https://character.ai/character/l9qUGzzz)
					// @SomeAnonymousUser (https://character.ai/profile/SomeAnonymousUser)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/6/4l5kjkyptLzmA9h3XEDeEA7IypyJUGdBx7v-tO_3YAo.webp",
					"https://static1.e621.net/data/54/c6/54c6d1d8d2a2c092882fd4d80377b4bb.jpg").replace(

					// Nickit   (https://character.ai/character/C4_kZPjA)
					// @notako_ (https://character.ai/profile/notako_)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/2/I3pStfOH0BPoAdLFXMsKlZPu1Qb4HZVrqKM8AiL_jLw.webp",
					"https://static1.e621.net/data/76/da/76da476639c63858456ae4d7e2eeff56.jpg").replace(

					// Dakota (https://character.ai/character/1I_m68uG)
					// @catboy_twink27 (https://character.ai/profile/catboy_twink27)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/6/MiG34yyMiJX775oeMouLszCVvFckX_MaF38Z1izpH8k.webp",
					"https://static1.e621.net/data/2a/1d/2a1d589577bd40410fbb7326bbcb1da8.jpg").replace(

					// Allergic Alice (https://character.ai/character/bHvId12Y)
					// @GunlanceGamer (https://character.ai/profile/GunlanceGamer)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/21/-gspX93azBpRL2Y2cK2dMbpleflgGlSMvaMNQ9gjFVg.webp",
					"https://static1.e621.net/data/d9/15/d9159986084d6afdb2f9e49819783102.gif").replace(

					// Allergic Alice (https://character.ai/character/Is-b1yzb)
					// @I_Love_WICSUR (https://character.ai/profile/I_Love_WICSUR)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/11/8/CorSBikfoTJ7iXFx7ZLVi_jHZHOOKMaPlzwE034uQu4.webp",
					"https://static1.e621.net/data/d9/15/d9159986084d6afdb2f9e49819783102.gif").replace(

					// Sylveon    (https://character.ai/character/_6D8jlMT)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/9/ebfa632owAwxCJTPGJlj7mbYfJW5i_o7qgZaSA1mYwA.webp",
					"https://static1.e621.net/data/3b/91/3b91ef02ae874b279e547c8f1749b3d0.jpg").replace(

					// Sylveon   (https://character.ai/character/kfSrizrs)
					// @Calebtsm (https://character.ai/profile/Calebtsm)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/26/pze2c2FHdWYj-Nb6BeFIVsdi7zQHsdZS2jR2tfJKw3g.webp",
					"https://user-uploads.perchance.org/file/87d3029d8a3299bd8c0870a3ba0bcaf5.jpg").replace(

					// Sylveon        (https://character.ai/character/Bjbxrs5c)
					// @Im_a_loser556 (https://character.ai/profile/Im_a_loser556)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/26/lN7SZ8HuXINzpptQlX2IZQrrbW5yzHrs8Q-jlL810R0.webp",
					"https://user-uploads.perchance.org/file/9d224fbed80034c55f02efaea6f025f6.jpg").replace(

					// Sylveon          (https://character.ai/character/aNulSXU7)
					// @Flamekitsune983 (https://character.ai/profile/Flamekitsune983)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/23/W2jdYryePea4Sdh6JA3FBT9c1TxHn-mfIhWn4BCKFv4.webp",
					"https://static1.e621.net/data/02/90/0290e2f3d94cf0b5e86fc57ea324a10b.jpg").replace(

					// Sylveon (https://character.ai/character/GUQXoN89)
					// @imso00 (https://character.ai/profile/imso00)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/10/11/5bp3atNAWcTW7ulseHuIPP6vtBnb55lYo84BG7qi5gI.webp",
					"https://static1.e621.net/data/73/b5/73b55bbf240064b236df4d9197e4a95d.png").replace(

					// Sylveon TF      (https://character.ai/character/DvHiMaIA)
					// @LanaTheFreezer (https://character.ai/profile/LanaTheFreezer)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/7/3g_Tl0jYCbNms3GglzDM1okK2CjsRS2NcL1ZzDHTV8s.webp",
					"https://static1.e621.net/data/05/e7/05e7e83c8394eb06825a31b386dbddfd.png").replace(

					// Sylveon -AU- (https://character.ai/character/KqfSbjdh)
					// @CoraCreates (https://character.ai/profile/CoraCreates)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/5/13/lm0ab0jyaNU3byFXJZYcgcYrYMKJynCJTtM2JC7TZwg.webp",
					"https://cdn.crushon.ai/images/756121ed-2045-412f-8399-abef80d270c4/9f2eb469-d30b-4ad7-9879-a579d195c4f3").replace(

					// Yandere Sylveon    (https://character.ai/character/ZMt6vblf)
					// @michael_timbelson (https://character.ai/profile/michael_timbelson)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/19/1ZeAX8rkI3KGZLKQ-0osVjDzu32Hce-P9VUv7yWDaUo.webp",
					"https://static1.e621.net/data/b8/3c/b83c4e8d6a7003bc07bee5b7f2c2904f.jpg").replace(

					// Streamer Sylveon (https://character.ai/character/g7-7Lz0B)
					// @Micro11         (https://character.ai/profile/Micro11)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/4/4/y3SiAO2NDbHIq3ACHMrmTx2jb0pXfpRNzWWH5MFDEmM.webp",
					"https://static1.e621.net/data/5e/33/5e33571a2a6ca05bda705e248b931b49.jpg").replace(

					// Erza the Sylveon (https://character.ai/chat/qxLT0sbEmK_pUW-A7eW3LfjQuy-0vrj8atvqpDo-RyI)
					// @UselXssNEKO     (https://character.ai/profile/UselXssNEKO)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/18/Kc8xLo5crzblFwF6vAFpp2ZagFDFz0MWo-X8Xfjwgmk.webp",
					"https://static1.e621.net/data/de/3d/de3d221afc7ae106c1df308640386999.jpg").replace(

					// Pokemon Resort (https://character.ai/character/DbXrg90E)
					// @imso00        (https://character.ai/profile/imso00)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/9/24/FNpFTOa8zSwEi5zJQf346SrilJRFx0XQ7xwQaXz3L_4.webp",
					"https://static1.e621.net/data/03/f2/03f2032b4a7a8b2a9f15cef1a6d1e4ff.jpg").replace(

					// Tamamo No Mae (https://character.ai/character/TsRPypCu)
					// @KiwamiKiwi   (https://character.ai/profile/KiwamiKiwi)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/22/KjptmolAmAGO9WPNmD-Fo3tf3AxFQ4SJbYK_hYwaTIQ.webp",
					"https://i.imgur.com/jji0Mya.png").replace(

					// Mari             (https://character.ai/character/mT2ZJ6w5)
					// @CollarBoundBrat (https://character.ai/profile/CollarBoundBrat)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/30/84tBcrlIv_hZZ9pCJG-6abEAz8mMuhf5g9jcSfsH0L8.webp",
					"https://static.zerochan.net/Iochi.Mari.full.3580559.jpg").replace(

					// Eevee      (https://character.ai/character/SvIuCLhi)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/5/bDmeXECSenv5rZ8bGgnQh9omZa38g2V_-ziqE4HhcEM.webp",
					"https://static1.e621.net/data/34/c2/34c252412a6108589816e48ba4d83833.png").replace(

					// Roommate Eevee        (https://character.ai/character/evpPRo7B)
					// @Sir_LouietheThird353 (https://character.ai/profile/Sir_LouietheThird353)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/26/fSmMG94EDhhkyQUrUT0LCsNMYbdMK47hCeYIdSI9HqI.webp",
					"https://static1.e621.net/data/93/27/932762e0dc311078faa938dd743bd0ab.png").replace(

					// Roommate Eevee   (https://character.ai/character/JyU_f6Mx)
					// @Violent_Crimson (https://character.ai/profile/Violent_Crimson)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/20/EA578PHJrS1Iuc68ZiL1gYp2DH06gRF846Attd1AAcg.webp",
					"https://static1.e621.net/data/93/27/932762e0dc311078faa938dd743bd0ab.png").replace(

					// Victim Eevee  (https://character.ai/chat/vHpzdHKHz4vcIQCDk6GJDgDT5zjfCdGk7nGuOY_kHjs)
					// User Deleted. (https://character.ai/profile/CharacterUser14280640941123791420)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/3/2/ilN3HwZvQkU923KtPESXlLS_kNRnRg89cfKWQ3fz6cI.webp",
					"https://i.pinimg.com/originals/3d/c0/f2/3dc0f294930a0292a4e56a491663b51d.jpg").replace(

					// Cinamon (https://character.ai/character/JBtPgA-U)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/4/30/wEPmfbS7Qybk9yd8UNv0zIvhYYBc1Igg1oSjy0UgaDI.webp",
					"https://static1.e621.net/data/93/27/932762e0dc311078faa938dd743bd0ab.png").replace(

					// Anthro Eevee  (https://character.ai/character/hqE-2AGA)
					// @RylMakesBots (https://character.ai/profile/RylMakesBots)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/30/R7R7km03nTOmjhyH2B-YWSSjujFtsAwDMHL33DM6JdA.webp",
					"https://static1.e621.net/data/6d/a2/6da2220cafef8635311f2c17f45dda22.png").replace(

					// Eeveelution crimes (https://character.ai/character/pFkW7Io9)
					// @lemondesire_      (https://character.ai/profile/lemondesire_)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/6/19/3ad9LIiqj-JqeVgaVBVt7VxheKZzjE1mRUC2gDi_qcI.webp",
					"https://static1.e621.net/data/b7/af/b7af0da4d69c2d642fd835dd6f0c414a.jpg").replace(

					// Eeveelution sisters (https://character.ai/character/U2iZECKA)
					// @lemondesire_       (https://character.ai/profile/lemondesire_)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/6/22/oyzGLTT3ZMQGaauoU89KO-n5flok5HbpNEzKLAGdm9o.webp",
					"https://static1.e621.net/data/3e/88/3e883a2d1f1f597c88dd7814fa6fe480.jpg").replace(

					// EV-9 eeveelutions (https://character.ai/character/ut6wZXWa)
					// @Betagear147      (https://character.ai/profile/Betagear147)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/13/sWGhlBRfc9UY99ubQFqOQOY0-kO5IPWtPAA8iDZpRKk.webp",
					"https://user-uploads.perchance.org/file/97781bcc94fbbb225a28da2cc114e59b.webp").replace(

					// Princess the Vulpix (https://character.ai/character/0XLrbK9X)
					// @Realtodoku         (https://character.ai/profile/Realtodoku)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/18/Q4wM3foLH1n_lAsEEZYFMH9tinMlYwNBru1sE7K0WcI.webp",
					"https://static1.e621.net/data/63/a8/63a8dafa3db3fef6aa2ca6bad69c7a35.jpg").replace(

					// Shela    (https://character.ai/character/e8IV_Xjh)
					// @keanee- (https://character.ai/profile/keanee-)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/30/KuRK0xw4Rxmgz7NKf7VKaxivEu7qyQCnk-9kXi39xxI.webp",
					"https://static1.e621.net/data/ff/24/ff245b65e70d342387a372464e604641.png").replace(

					// Nirya      (https://character.ai/character/ObK0NBqZ)
					// @Beetlebbb (https://character.ai/profile/Beetlebbb)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/4/1/F8lRV-vUJGDHCZ-YKgqcqj-UBoDix9YX0sqd0kLn4QM.webp",
					"https://static1.e621.net/data/df/7e/df7ea1d70c2628cf7f23cb468e9429b7.png").replace(

					// Miss Kiara       (https://character.ai/character/aZTG5JlF)
					// @RockingPizzas01 (https://character.ai/profile/RockingPizzas01)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/12/iUTmdHLXT6zNb7Ddn1whXmoKjdoHyqQ5W9f6UJ1SWt4.webp",
					"https://static1.e621.net/data/c1/11/c111f3c2576dba57a7ea4a05d26a2bb7.png").replace(

					// Midnight          (https://character.ai/character/rQMEWObD)
					// @IHaveNothingHere (https://character.ai/profile/IHaveNothingHere)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/2/11/WtnB1p70q9y3c5QzOYYIyw1mzGtbLptWwtoKFWD9TM8.webp",
					"https://static1.e621.net/data/e5/f4/e5f4fc0cb99283351a91fc6574643eb7.jpg").replace(

					// Chloe Honies    (https://character.ai/character/ChaHxyD1)
					// @Ballsaccman420 (https://character.ai/profile/Ballsaccman420)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/4/7/w7VhwnvI5fokl3F9LagnzngeP3a4nvWQaTHkH6VO65I.webp",
					"https://i.pinimg.com/originals/88/31/a2/8831a21e6009b6dfa58e9023e93016f4.jpg").replace(

					// Lucario     (https://character.ai/character/6yqtxXBt)
					// @BabyMew123 (https://character.ai/profile/BabyMew123)
					// (https://xcancel.com/add9575/status/939887948907950082#m)
					"https://characterai.io/i/400/static/avatars/uploaded/2022/12/26/VeV5xq2KMiWksG35JMaLDY2VNwXhpZPmeZSdzdNuQcY.webp",
					"https://user-uploads.perchance.org/file/2308bda09ab9c30d89f94345edd9505f.webp").replace(

					// Lucario    (https://character.ai/character/BC0VASrC)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/21/p_c7-jX4rZGCWZQmrnUfx5a8dsbxVnTjv9b8YvU6hfM.webp",
					"https://static1.e621.net/data/b1/39/b1399f406317945704caa663042f409f.png").replace(

					// Lucario         (https://character.ai/character/Ul8_lBot)
					// @0-fizzy_fade-0 (https://character.ai/profile/0-fizzy_fade-0)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/5/31/Kdvw9uuOmTOKU-GiS7uxffEw9iPhW645qzvreDYAVi8.webp",
					"https://static1.e621.net/data/a1/1e/a11e49bd7c556049770b3e905e9528ef.png").replace(

					// Lucario           (https://character.ai/character/HlRRBBtr)
					// @GarchompletWorks (https://character.ai/profile/GarchompletWorks)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/3/zi8xtevnVJdxVySVg5IdEJlaIMKlOkVWQskVuweqQww.webp",
					"https://static1.e621.net/data/64/5b/645b1233644e3237c31957bf099a8f60.jpg").replace(

					// Lucario       (https://character.ai/character/My1GtDqp)
					// @Moth0verlord (https://character.ai/profile/Moth0verlord)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/9/KPNeHuSj18HMKOPNqEGsVxQ7yRJMga6s9ce9aZc-VoQ.webp",
					"https://static1.e621.net/data/6d/b3/6db3836ffc87784a8b79f04b7eb31384.jpg").replace(

					// Lucario         (https://character.ai/chat/iS2WC6_QW4XGdvhY8CoP7YVKhTnEJwYiNmYihoWwEvI)
					// @A-peaceful-guy (https://character.ai/profile/A-peaceful-guy)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/17/ct_HD26UOeKHhOHLnvYGwVAz0nJL_3JIZdVBzNj_DHM.webp",
					"https://static1.e621.net/data/bc/7d/bc7d4ea950bcf3f44fefbc3cbb18d1c0.jpg").replace(

					// Artemis the Lucario (https://character.ai/character/F-4ItrMH)
					// @RylMakesBots       (https://character.ai/profile/RylMakesBots)
					"https://characterai.io/i/400/static/avatars/uploaded/2022/11/8/UDwvm5KLk2vW8JtMEbSkneOKy6ks-oDJwlBNuQwB92Q.webp",
					"https://static1.e621.net/data/6d/b3/6db3836ffc87784a8b79f04b7eb31384.jpg").replace(

					// Lucille the Lucario (https://character.ai/character/Ym433RVt)
					// @BabyMew123         (https://character.ai/profile/BabyMew123)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/1/10/3J7L3l4uIS7_gvew8DFwkclDQQYXKe31KLXCbtVjN4A.webp",
					"https://static1.e621.net/data/fe/e6/fee6d97d45234e4d85919436247e17df.jpg").replace(

					// Xin Chau          (https://character.ai/character/_x3up-S5)
					// @official_bonixie (https://character.ai/profile/official_bonixie)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/11/jQDAOUjaCl7aPnRghk6B4_QSJYiVILKnU6_SnA6tY1Y.webp",
					"https://user-uploads.perchance.org/file/2dc3c5fbc4c51f063a3e41c927793a2a.jpeg").replace(

					// Sara            (https://character.ai/character/EAK_5mWv)
					// @Mcpandalord223 (https://character.ai/profile/Mcpandalord223)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/5/25/bw6KubQr63GQqGtd1k9-vun_QQIq0ZHt74IUjgQfrg8.webp",
					"https://static1.e621.net/data/74/61/74612b21071f0452bb50a81ccea795df.jpg").replace(

					// PlayStation    (https://character.ai/character/hzgiV-Z3)
					// @not_a_charmer (https://character.ai/profile/not_a_charmer)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/14/Tvw8ZCoBMOkd30K-a8LkkUPntvup-1i3BA3vtJoeDEE.webp",
					"https://i.redd.it/p54brve1yi451.jpg").replace(

					// Clearsight (https://character.ai/character/xEoFP-Ca)
					// @PlacidDoe (https://character.ai/profile/PlacidDoe)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/15/whk-_o1hqJGndvjFMLWe-SoOTbmQwCgNpneWWwJhztc.webp",
					"https://i.pinimg.com/originals/8b/86/4b/8b864baef40d1dddbf2e71c52fe42c44.jpg").replace(

					// Erika Taylor (https://character.ai/character/G2e1-x0g)
					// @Darter_1-1  (https://character.ai/profile/Darter_1-1)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/5/29/NW2jy7gQn-2Gr2jlRZtA37sJrMS6kpqv_3hPsz1Iy_k.webp",
					"https://static1.e621.net/data/77/01/7701732930fbd178dabb2447ec78afd5.png").replace(

					// H2O        (https://character.ai/character/vW_XBtjO)
					// @360snipes (https://character.ai/profile/360snipes)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/15/HzBkRTPa9Y8JEuJWTYxdleQoZzkVmJ1IdTCkvBMo3Ek.webp",
					"https://user-uploads.perchance.org/file/55eb2f392b62cea0e9f27d8f59822060.jpg").replace(

					// Whisper the Wolf (https://character.ai/character/4CV2_uIJ)
					// @Brennen767      (https://character.ai/profile/Brennen767)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/24/u3TWr8AzSmznqH2cPKf82mmlGb6nVIsWMXD8K0XeT3c.webp",
					"https://static.wikia.nocookie.net/cbdddf85-864f-408c-a609-6459b1237094").replace(

					// Wypher the Wolf (https://character.ai/character/yTTtHRar)
					// @KANK_          (https://character.ai/profile/KANK_)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/29/Yuj5J9X_T3mLG1W-JvKUJsgLwT8cmzOHJ3bud4GPOSM.webp",
					"https://furrycdn.org/img/view/2023/7/30/259143.jpg").replace(

					// Werewolf GF    (https://character.ai/character/eN7GOcOF)
					// @HexDrone-6893 (https://character.ai/profile/HexDrone-6893)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/27/c8xJ0wxzv-b2X4lIgPIKsc-3rP1eUUEU0NnbSHGn0J8.webp",
					"https://static1.e621.net/data/73/31/73316536cd58fb3f670562c6b87c12fb.jpg").replace(

					// Aiyana (https://character.ai/character/fN9P9qcO)
					// @KnuAD (https://character.ai/profile/KnuAD)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/3/3/3wMtnLoKEexDouQOAFl5BxbpJ5Y7sjI9OLEA3UtAJms.webp",
					"https://static1.e621.net/data/d3/61/d361a60ecf25aa642593e49cd8b56f8b.png").replace(

					// Miss Charlie (https://character.ai/character/PQuvMnci)
					// @Wolfy0O     (https://character.ai/profile/Wolfy0O)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/15/5w9xJTCmlF3AChgnW075Nb5uz99W57JgcBZeX5iVoNg.webp",
					"https://static1.e621.net/data/fc/cb/fccb56524303743d6a36519a9184bf7c.jpg").replace(

					// Boykisser (https://character.ai/character/C5m4y0yW/cute-adorable-boy-kisser-cuddle-buddy)
					// @sziffy   (https://character.ai/profile/sziffy)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/31/2xRhQ21thWMjpfc5XedugPiEJWqRpAfKso4qIPR_kIM.webp",
					"https://media1.tenor.com/m/j2gw_YFqB0oAAAAC/boykisser-cute.gif").replace(

					// Pheromosa (https://character.ai/character/x5Y7HAcz)
					// @ECBOI    (https://character.ai/profile/ECBOI)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/2/20/LRWHbDyAMJYhMgog8hqbVWNHWC6H3NFoPnSCYMlgvus.webp",
					"https://tbib.org/images/5287/767cbe1af15e01fb01a49e75601665b6e03b3126.jpeg?5801413").replace(

					// Helplessness (https://character.ai/character/9DtTq_ay)
					// @piboras1258 (https://character.ai/profile/piboras1258)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/22/nLmjSi73fSZDMxNE04zdW_Tung-svKLtirj48FVKCuU.webp",
					"https://static1.e621.net/data/1e/54/1e54236039d9ac434508e2dd93bc64d7.jpg").replace(

					// Solar flare (https://character.ai/character/l2LqUY9T)
					// @XTENDO-13  (https://character.ai/profile/XTENDO-13)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/25/lT_Rsac3mPQq2XA_PAezWpe-ErAZ2zxY4A4ZnjE4D6E.webp",
					"https://art.ngfiles.com/images/2657000/2657180_rbismut_bunny-flare.png").replace(

					// Canine Trio (https://character.ai/character/54pZojop)
					// @AriAxolotl (https://character.ai/profile/AriAxolotl)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/18/H_0gxzCQNCC0UVI2CzeOG-ztWBuYEpBlsJceIdys1q8.webp",
					"https://static1.e621.net/data/56/b7/56b789da6e0ab52baa51812c74d52629.jpg").replace(

					// Delphox    (https://character.ai/character/5QlqNZCM)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/11/EVSPPq_gGmR4JW6gsXE2QthaE9P84Sal39xXt5l3tL4.webp",
					"https://static1.e621.net/data/ab/4b/ab4b801bc2d007f67e928bc7484a6345.jpg").replace(

					// Delphox      (https://character.ai/character/vojfFdg-)
					// @BurkTheYurk (https://character.ai/profile/BurkTheYurk)
					"https://characterai.io/i/400/static/avatars/uploaded/2025/1/16/56czMa6ptR8_fUSKVa36ya9I-VfAnYvtK9keRuhITh0.webp",
					"https://static1.e621.net/data/44/b5/44b5928da3fb4b3b940b06c015f46f42.png").replace(

					// Delphox         (https://character.ai/character/BM4sA03e)
					// @DottedDominoes (https://character.ai/profile/DottedDominoes)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/7/18/1qlRX4_2JU7qnEJRzCcYHDaTTu_0uikTCA3uqv-5gl4.webp",
					"https://static1.e621.net/data/34/b4/34b4ca62ee66b6ab332d58b07a7ee547.jpg").replace(

					// Delphox         (https://character.ai/character/vQjSKCQg)
					// @DottedDominoes (https://character.ai/profile/DottedDominoes)
					"https://characterai.io/i/400/static/avatars/uploaded/2025/1/10/FuFEuhlTRp_SF-gj_P_m7Z9douEIVzZlQv3TmIIuh5Y.webp",
					"https://static1.e621.net/data/f4/fa/f4fa1b17fb1047e2290d87e1c0fb02cd.jpg").replace(

					// Anthro Delphox   (https://character.ai/character/MUuY0mHn)
					// @AnybottyAnytime (https://character.ai/profile/AnybottyAnytime)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/7/_1O74WI8okwTApO3bszk-UWvlLvPbBhH1PC0FUxevtM.webp",
					"https://static1.e621.net/data/49/5b/495b7c79e5887ee2dfa404dbac519c39.jpg").replace(

					// Delphox and Braixen (https://character.ai/character/J7BBNxHd)
					// @UnknownPersonD     (https://character.ai/profile/UnknownPersonD)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/1/lXYIhjJTfJJocWYhuWQho_nYoy7tzYT104sXSCzOaWE.webp",
					"https://static1.e621.net/data/72/b1/72b15e10dc98228cc87afb1d0c2cf564.jpg").replace(

					// Braixen         (https://character.ai/character/JXHjdvBA)
					// @DottedDominoes (https://character.ai/profile/DottedDominoes)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/7/18/vHYcAG021ZSu9EmP0NxwXhwV3jX7ejspRXQfvmyyMGk.webp",
					"https://static1.e621.net/data/ca/c1/cac186b87ce3d7b142d252e374f071af.jpg").replace(

					// Braixen  (https://character.ai/character/TNijLhqA)
					// @AzeFryo (https://character.ai/profile/AzeFryo)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/29/rSl4ctIeKPvUfTZsQhZN7C2Tf385wIcqbHn21oM4M3o.webp",
					"https://user.uploads.dev/file/e31b7bf1df0f1edaea395b797bbffba3.jpg").replace(

					// YonKaGor (https://character.ai/character/OKFSp1Tk)
					// @DeiKon  (https://character.ai/profile/DeiKon)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/10/13/1t7X98c2nkRG9dQwG6MEqTxIudK7ttxNaY-lyYl3Too.webp",
					"https://static.wikia.nocookie.net/youtube/images/b/bc/YonKaGor.jpg").replace(

					// Motherly Plush       (https://character.ai/character/ElVXWXoh)
					// @YourLocalPamperButt (https://character.ai/profile/YourLocalPamperButt)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/8/ryNu4mAntJS4jiCClHh14AxJE4XLOvitAlwlgCGLE9o.webp",
					"https://user-uploads.perchance.org/file/b45f693937c89dffe761de6b5fa8c5f6.jpg").replace(

					// Edge               (https://character.ai/character/cHL_Qyh8/anti-furry-fox-chaos-creator)
					// @multifandomPNGcat (https://character.ai/profile/multifandomPNGcat)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/13/cy48aGvBD58AohAwKqW4Xj0Y7JaBWHRKrFhQ8g-0ra4.webp",
					"https://static1.e621.net/data/75/43/754335b5856abe3eef0f458cf297b353.png").replace(

					// Vanessa   (https://character.ai/character/O5ztrGEF)
					// @BluScout (https://character.ai/profile/BluScout)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/29/-M-UkDx0QNUT1r_ht2BHq_7knXbwG49jgznzW2eFw54.webp",
					"https://static1.e621.net/data/7d/50/7d500f9b7ca5e74f0e9142b810f35630.png").replace(

					// Redd        (https://character.ai/character/oK1Hevxc)
					// @Whodiscall (https://character.ai/profile/Whodiscall)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/19/fWQolcEXp-idSdRXV5VcDXURJmX3UYr00IV1Efg6W7U.webp",
					"https://static1.e621.net/data/d1/44/d144f13cadf8b4ad53564f24de321799.jpg").replace(

					// Life The Cats Mom (https://character.ai/character/bJNvgFIK)
					// @LifeLikeStudios  (https://character.ai/profile/LifeLikeStudios)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/23/ZtVQSWLM_F70Rgw8qj6JCHdj0SPhCTvshj6axDMhP-g.webp",
					"https://user-uploads.perchance.org/file/67c91d5b3bd05bc3177aa800a4c1c268.jpg").replace(

					// Chelsie           (https://character.ai/character/BtZ7w7Dy)
					// @SpookyOverHeaven (https://character.ai/profile/SpookyOverHeaven)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/18/uEiOW9xFKPwnuH2A4-0Dw66y6ke9WGomhlSFVef1R0U.webp",
					"https://static1.e621.net/data/48/ea/48ea609c02d943a4456fc0c10d1d11ec.png").replace(

					// Elizabeth         (https://character.ai/character/t1vBXg44)
					// @hungry_CatArtist (https://character.ai/profile/hungry_CatArtist)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/4/PLOhq6klDb0x79kemDZJa9nrl0A-P1i72Ry7VlE24fs.webp",
					"https://i.imgflip.com/6ihv7t.jpg").replace(

					// Anixety      (https://character.ai/character/kF33y4cy/anxiety-wolf-support)
					// @JimmyJangas (https://character.ai/profile/JimmyJangas)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/31/dtxVfXg8bt5kRfC_2DYEvh41sJzUXBrTonbJOMlk1kk.webp",
					"https://cdna.artstation.com/p/assets/images/images/034/384/988/large/astro-adventures-with-anxiety.jpg").replace(

					// Bianca Val date (https://character.ai/character/NwNlY1n4)
					// @Micro11        (https://character.ai/profile/Micro11)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/4/26/JnbDScliYjE-Gj8X3st4g6m-NDrAZ3-MI1qBkxIdOVY.webp",
					"https://static1.e621.net/data/87/0a/870adf260089d6af4d62eb3923914360.png").replace(

					// Glaceon        (https://character.ai/character/UDwbHYzW)
					// @Trafficone450 (https://character.ai/profile/Trafficone450)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/4/16/I2lNpT9Ra-UGutnfeIR_PHFaYjZeut66pm865-Xe_Tc.webp",
					"https://user-uploads.perchance.org/file/2cd5b3295029747bad2d00ede4a2b564.jpg").replace(

					// Glaceon (https://character.ai/character/WQPHKtEp)
					// @donec  (https://character.ai/profile/donec)
					// (https://user-uploads.perchance.org/file/b95ec324ce9c2c4b7715416b8427f82b.webp)
					"https://characterai.io/i/400/static/avatars/uploaded/2022/12/11/Mp4m6dIc_ZqAmbsY5MTzOUKyZju_Edhf7VdsDP13rsE.webp",
					"https://user-uploads.perchance.org/file/39abadf2e565c45614e5f5a5e693daf8.webp").replace(

					// Glaceon    (https://character.ai/character/DPC5Mapf)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/15/H9zLEeqfqMGPfwOoaYUPnIsr42xy8byIj1mPXUEY3-Q.webp",
					"https://static1.e621.net/data/8a/7d/8a7d873739c30c39c44197e2a5d0612b.jpg").replace(

					// Glaceon             (https://character.ai/character/175Ejmo6)
					// @Pepper_the_flareon (https://character.ai/profile/Pepper_the_flareon)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/5/8/72guz-gelJKEmJhf1IWUvEmRRbNzyUaWDPzgKQp_qr4.webp",
					"https://user-uploads.perchance.org/file/7fb3ac4351834953bbd350f2d6a557db.jpg").replace(

					// Glaceon      (https://character.ai/character/uODd3gYt)
					// @4Ngel_g4m3s (https://character.ai/profile/4Ngel_g4m3s)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/30/zilHbSq1TsEHR8qezrE798CcN5Ao7pBrLwHtsAAaHuM.webp",
					"https://user.uploads.dev/file/6251788c100814a0020f23b3cd5d22ed.webp").replace(

					// Giantess Glaceon (https://character.ai/character/KbUfvmdS)
					// @GunlanceGamer   (https://character.ai/profile/GunlanceGamer)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/5/28/lsJI8INBiwq4NLa8JHCFyHEAz97TK8P8UbnthZzm62I.webp",
					"https://user.uploads.dev/file/535f75b439089ab53aec688f713963f8.jpg").replace(

					// Fuyuki The Glaceon (https://character.ai/character/WT_Nx_0S)
					// @A-peaceful-guy    (https://character.ai/profile/A-peaceful-guy)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/10/cPvz-yMTrVaGuisQqyD0z-gvrfJAYnIWtS3DfUWT0HY.webp",
					"https://static1.e621.net/data/77/db/77db0402fad54aebe8c21021eb90e710.png").replace(

					// Lumi        (https://character.ai/character/fVTAygvM)
					// @LadyArceus (https://character.ai/profile/LadyArceus)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/4/18/hGTBD9bMlPsYncsBMlnAB5D2jJnKVhAdt9KagviKG6M.webp",
					"https://static1.e621.net/data/be/e9/bee902fc88ec0acdc1c504a5db449dbe.jpg").replace(

					// Isabelle        (https://character.ai/character/Br-UOlwL/curvy-vespiquen-roommate-isabelle)
					// @Dryn_the_Chozo (https://character.ai/profile/Dryn_the_Chozo)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/9/RT0438wp1dpF53wGA5p1eUF3z7CFlnFuaKRpEkITtwc.webp",
					"https://static1.e621.net/data/36/da/36dad52bf9c6c88ade8872e8dcfdb4a9.png").replace(

					// Isabelle (https://character.ai/character/PtfUtI_r)
					// @nav_ion (https://character.ai/profile/nav_ion)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/28/dHCbOy9j1Lz3TK1dRBY-LIwsW3pm7zPoA9KmmDKrH98.webp",
					"https://user-uploads.perchance.org/file/9efd99fdb148591736848bcf14cef91c.webp").replace(

					// Isabelle   (https://character.ai/character/NNf6Mmef)
					// @Melaleuca (https://character.ai/profile/Melaleuca)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/1/20/9WYCrV-MiUi-Cm9oOk2aKRO3OfapfCy76XC-AW8qnKg.webp",
					"https://art.ngfiles.com/images/2939000/2939508_ftk-artist_immature-izzie.jpg").replace(

					// Gothabelle         (https://character.ai/character/DJy97lxd)
					// @TheTinyAdventuner (https://character.ai/profile/TheTinyAdventuner)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/21/SaFs0_RWulFfSKfc39tNXXVVbhV-l-QPcVKxOeOXsRk.webp",
					"https://static1.e621.net/data/88/b2/88b2cdc8b9f39752722f350d6251f0e4.jpg").replace(

					// Fat Ex-Cop Arcanine (https://character.ai/character/CNSOw5po)
					// @The-Narrorator     (https://character.ai/profile/The-Narrorator)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/4/24/HE6zuGdicAvBdxMpiInYNXrAeKCI9ot-jjD57uvoo_4.webp",
					"https://user-uploads.perchance.org/file/e5dc4190cf2673f100757c53306bea1c.webp").replace(

					// Avia       (https://character.ai/character/tmZjXE6-)
					// @Kyle2010g (https://character.ai/profile/Kyle2010g)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/25/IT-aRM-5ftUKshRKuuX5YrEiIEQdBvn4kF_bjGFmb-M.webp",
					"https://i.redd.it/m53usayo22xa1.jpg").replace(

					// Azaela              (https://character.ai/character/dBXiPilP)
					// @SomeAnonymousUser  (https://character.ai/profile/SomeAnonymousUser)
					"https://characterai.io/i/400/static/avatars/uploaded/2022/12/12/j7GIO7j3wzVbLCKzo0Gaxy698MSrae5jkCR5g5CgXYI.webp",
					"https://user-uploads.perchance.org/file/73a721700ff3ae124e95950f3af10232.png").replace(

					// Lugia       (https://character.ai/character/ztvvN5vS)
					// @LadyArceus (https://character.ai/profile/LadyArceus)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/4/24/U9zk00muq-1iJMP6EiQ1mE8dAGTQvvGzk2gkg5Pqock.webp",
					"https://static1.e621.net/data/0d/72/0d7239dfe20947ae954a64aa3ef39f71.jpg").replace(

					// Lugia             (https://character.ai/character/ISis_Bff)
					// @TheyCallMeJoseph (https://character.ai/profile/TheyCallMeJoseph)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/17/GVWsLpM2STJyLHO7SrETE7M3YKh1AxQY3ssW0SDpwt0.webp",
					"https://static1.e621.net/data/33/69/336927e67b92a052475cb080b6d544be.png").replace(

					// Mewtwo      (https://character.ai/character/MD8eaxzb)
					// @LadyArceus (https://character.ai/profile/LadyArceus)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/4/24/XrJCrZ_0Nd6hpGoErJ_BUnbNM4tfAvWb6gZnIg84gYU.webp",
					"https://user-uploads.perchance.org/file/3c86ba3912a768842592fec8343d48cc.jpg").replace(

					// Mewtwo     (https://character.ai/character/IOUD5AF5)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/30/rzkHibfl_f6zhOsrnrPLhjr1GwDqAx9DOwKMDPHh3Vg.webp",
					"https://static1.e621.net/data/7d/54/7d549c08d3fc6bec6b3d4d9abb9ff1e7.png").replace(

					// Mew         (https://character.ai/character/iojmQCCr)
					// @LadyArceus (https://character.ai/profile/LadyArceus)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/4/24/rAPC4mb5NoGkPo-m1xj1cqQqfbvAVUsYWoXvP2yP1Po.webp",
					"https://static1.e621.net/data/4b/18/4b18b80ce673a53e6abacca7b5742c27.jpg").replace(

					// Aguya       (https://character.ai/character/SwYR0SZG)
					// @LadyArceus (https://character.ai/profile/LadyArceus)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/4/19/ehHTbauogPp2rKBJn0HU9_M6gm3psuNmIbB7Y3IDp1o.webp",
					"https://static1.e621.net/data/9d/12/9d125e2de903cb3de6b68fe62a0cd311.jpg").replace(

					// Twilight    (https://character.ai/character/LLlEwpSz)
					// @LadyArceus (https://character.ai/profile/LadyArceus)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/20/5qsAZ0Ulwz74NvmieLUKSG3f5Dr1h-rZxMtaYWA-DsI.webp",
					"https://static1.e621.net/data/f2/1c/f21c8e6f7b2218a50e26a65aecd170fc.jpg").replace(

					// Absol      (https://character.ai/character/kxagMke3)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/2/cZbjqwM_ahJpQ24ACaxSXI7VexsxFv7ww54LxVpseUI.webp",
					"https://static1.e621.net/data/43/38/43381fbb2e0bce931589fb8ec55c00d9.jpg").replace(

					// Absol     (https://character.ai/character/gYkIse5j)
					// @MeoRefgs (https://character.ai/profile/MeoRefgs)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/30/sS5eLxLEEAKgAv5mehpQKi9OpHu1FWZPi68SuPJxmew.webp",
					"https://static1.e621.net/data/99/00/9900e8e1bc4337180289d09f17139e52.jpg").replace(

					// Kyndria     (https://character.ai/character/ukBZAczS)
					// @LadyArceus (https://character.ai/profile/LadyArceus)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/4/20/YC8lQwiZ2ndQtg-bHnvNFeTluMw5YDMVq31imTtApgY.webp",
					"https://user-uploads.perchance.org/file/9db7f70462012b7eab7f4cfde2ea55b7.jpg").replace(

					// Cocoa       (https://character.ai/character/xSYZ_kL)
					// @LadyArceus (https://character.ai/profile/LadyArceus)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/24/GLVS743eqKx8nhAl5wdSc23rehkFNn6LazeIbLr4_2w.webp",
					"https://static1.e621.net/data/70/3c/703c1b94b5f00c25a7c1174a1935c2f3.png").replace(

					// Jill            (https://character.ai/character/KOZPB75S)
					// @Mcpandalord223 (https://character.ai/profile/Mcpandalord223)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/5/22/JrGSkajAGuVC3EjnE7XC0HaM-AD4uxycMg8EeiHEz0Q.webp",
					"https://static1.e621.net/data/53/4f/534f926108591d69d50447a9e876e643.jpg").replace(

					// Krystal     (https://character.ai/character/hCSrU_g-)
					// @xSacredOne (https://character.ai/profile/xSacredOne)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/5/8/bg2h6OmSM6a_MkDpoIsgOrUG2TO5sGEHLI82D_3inEc.webp",
					"https://static1.e621.net/data/7f/49/7f49a3d3fbae20197a378c49bda13612.jpg").replace(

					// Tora- Your coach (https://character.ai/character/i-syzINE)
					// @LatiasG135      (https://character.ai/profile/LatiasG135)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/24/q_55LN53hWXNIXS9MID7ATiChC-7Mxey_s2r_yhULik.webp",
					"https://img2.joyreactor.cc/pics/post/full/furry-tiger-furry-feline-furry-art-8013623.jpeg").replace(

					// Porsha crystal   (https://character.ai/character/XoeixdHe)
					// @FizziepopFantom (https://character.ai/profile/FizziepopFantom)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/24/8Y1crQ5-dZ9IOPZahrm1f56yBQtr0TAWY2OsdqaSsv4.webp",
					"https://static1.e621.net/data/cd/86/cd86d4cc623bd8c73a780637abb103cb.jpg").replace(

					// Vaporeon     (https://character.ai/character/d3Ts8X-q)
					// @Gen9DLCHype (https://character.ai/profile/Gen9DLCHype)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/1/12/otlWzOzgSN688zaRWzfsXN9xpFdu-zhvrMBgOqxoVxc.webp",
					"https://user-uploads.perchance.org/file/ae1f04e21e91ced4a3a41d4aa234c050.jpg").replace(

					// Vaporeon    (https://character.ai/character/6YwIBz_Z)
					// @NumberSyx  (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/1/HCs-S17sF5jQhFx9zEDmmI6PYa9a1TYjnbNpXpuZvUU.webp",
					"https://static1.e621.net/data/c6/4b/c64b72614de3b419e5bf297ce1997f48.jpg").replace(

					// Vaporeon Rapper (https://character.ai/character/iCB3KQec)
					// @HeartEarth     (https://character.ai/profile/HeartEarth)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/1/10/oZZCmx-ZEpH_xVxTgSqhrPN7CIoQPRZ7etd5F0Fb83A.webp",
					"https://static1.e621.net/data/9b/93/9b932e79608aa5b6934e7180042abfef.jpg").replace(

					// Mary Moe     (https://character.ai/character/HE9GpaaO)
					// @GreyfoX1250 (https://character.ai/profile/GreyfoX1250)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/15/P2U5cX-IYgapoNlxKY09VMrUby7N1Tvn6lSQpDxTg4w.webp",
					"https://static1.e621.net/data/e5/29/e529d54eb19de7ec8c839d0570459119.png").replace(

					// Roomate Astra (https://character.ai/chat/cBFCovh0KTWY6tas1STnhLVB6F87Mf1y_D9oChYNNe8)
					// @WolveD09     (https://character.ai/profile/WolveD09)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/6/bSKe9hRAj0zbM4CU4imf_a8M7Lz87LGhjRruAiif754.webp",
					"https://static1.e621.net/data/8e/6f/8e6fb32aa755c0e36919578b57f26fa4.png").replace(

					// amaterasu (https://character.ai/character/_uVp9pBv)
					// @Djfur    (https://character.ai/profile/Djfur)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/25/4YD_bohHpgZB_g09Xi2EiR7LmBbvgUWnd5_gJx7NXcQ.webp",
					"https://ndsc.b-cdn.net/spicychat-ik/avatars/8b7f06052010665148825337cfb7c161.gif").replace(

					// Zhen               (https://character.ai/character/sOuyWwXw)
					// @TheTinyAdventuner (https://character.ai/profile/TheTinyAdventuner)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/24/lstOow1qCILYIroGyP25MSY0dgI8BYBUn7WJTxCbK2c.webp",
					"https://static1.e621.net/data/df/b0/dfb0f4153f9b31881bc3b749d6d80c92.jpg").replace(

					// Anthro Primarina (https://character.ai/character/PBEJA3vi)
					// @RylMakesBots    (https://character.ai/profile/RylMakesBots)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/23/aOKBtX2IXlZNx9e91H3LMcs952zo7UJIXG0RHq-uy8A.webp",
					"https://static1.e621.net/data/08/e6/08e6fb4d42298d2f1658d2ee8577f880.png").replace(

					// Cat Roomate Lily (https://character.ai/character/Qu199J7F)
					// @DarkG334        (https://character.ai/profile/DarkG334)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/11/1hxGkItDSZIzqTIquK2J-cUv6Wcx_SZ9p-OBh0sMAt4.webp",
					"https://i.pinimg.com/originals/70/cd/99/70cd99faba5ee0e3177ae4c12042956b.jpg").replace(

					// Alleyway            (https://character.ai/character/0mne8P6E)
					// @Xander_the_Jolteon (https://character.ai/profile/Xander_the_Jolteon)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/14/ePxR5ujnJoTsFT0ZCWWhoxticP_G2ru6HHfhngZdXZc.webp",
					"https://user-uploads.perchance.org/file/4d942ff332960637c4ee8c9acadd9572.webp").replace(

					// Celia       (https://character.ai/character/q6tFWIyS)
					// @HwoahThere (https://character.ai/profile/HwoahThere)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/6/qvYzvYOwfBZRzIvSFfRYQf0Lqz3LpDgs05PItkgQtb8.webp",
					"https://static1.e621.net/data/34/c3/34c37dc15e9ea02ed6918dcf53c32ff8.jpg").replace(

					// Andrea Lexin (https://character.ai/character/TzjMS-jC)
					// @The_TopEgg  (https://character.ai/profile/The_TopEgg)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/9/M-H7AnS4QhB-VWcP4MJI2LnAdHP52LU7dxPfpFiRuy4.webp",
					"https://static1.e621.net/data/5a/7e/5a7e548c85048aa0de6a9bde6305b60d.png").replace(

					// Lady Nora   (https://character.ai/character/HvqVYWNF)
					// @Kefren4400 (https://character.ai/profile/Kefren4400)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/16/pNJPp9YgIHBjPWtRLQ3S0Lj7huZcuzezrtUzMVC5IiU.webp",
					"https://static.wikia.nocookie.net/overlordfanonn/images/5/59/Albion.jpg").replace(

					// Flake          (https://character.ai/character/56uhbS1r)
					// @GoobleBloople (https://character.ai/profile/GoobleBloople)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/8/25/FDLUaVRTApRbflDaOM1ozaN4XkycBivRan5a7BV4gFY.webp",
					"https://user-uploads.perchance.org/file/aa3bc36083a886b823cc0d28ca2bb3e9.jpg").replace(

					// Genevieve    (https://character.ai/chat/n_DGZpAkradPn1WweUaAby5OShwP7uhGsvJWzNOjoR4)
					// @Spottlos256 (https://character.ai/profile/Spottlos256)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/6/16/9E8Aps07LgQ4V7Nfl2EXzJ4S9LncWcWQt_8Trk2yMzk.webp",
					"https://i.ytimg.com/vi/OjILNsiRwBY/hq720.jpg").replace(

					// Leo      (https://character.ai/character/lziLFyZV)
					// @ZachioZ (https://character.ai/profile/ZachioZ)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/24/vsvBag_6YbC4p6vKDwyHUxJyVLq7aJK6WC3N6hAO-sc.webp",
					"https://user-uploads.perchance.org/file/bd85b63e147604a5b31d9ecefd6f2e75.jpeg").replace(

					// Tech       (https://character.ai/character/wadFYZLn)
					// @TechDaFox (https://character.ai/profile/TechDaFox)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/6/JvSE7tgc4od1hiW_Q8psfI34d3MPlzGnkL_ywix4zbc.webp",
					"https://user-uploads.perchance.org/file/97cb628cd7d32471ec548ff82f64a1f2.png").replace(

					// Lopunny   (https://character.ai/character/ifH3aaPA)
					// @FlameB0i (https://character.ai/profile/FlameB0i)
					"https://characterai.io/i/400/static/avatars/uploaded/2022/11/19/P2UCbDDAfJN_t3Ht7kwLD6RqSjT3h7RB00L5XOmc3BY.webp",
					"https://user-uploads.perchance.org/file/74b284c10e941e7da6e8b46fe87d0589.jpg").replace(

					// Lopunny       (https://character.ai/chat/bueVWT2awgy2LzzueSUHZ7GTT4vSjvWOyi4TT7d4rYo)
					// @Explo1ted404 (https://character.ai/profile/Explo1ted404)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/5/28/riANuS54VVGSvDO9ybxy8Fo5PyAtltMRZUgM3GY_CUA.webp",
					"https://static1.e621.net/data/65/b2/65b25f07d94ff0124e2873478ae9cebf.jpg").replace(

					// Lopunny       (https://character.ai/chat/cHImBukzq62_CKIzGLUEBR6gRrLEjq89jlve4yF-f3U)
					// @ultimate0_al (https://character.ai/profile/ultimate0_al)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/29/Ws2OyNxjdLbHKxePZsXoYGf9mr-KufNllXvZpVxTphU.webp",
					"https://static1.e621.net/data/73/26/73264f3ff001838904de6562ae76d5c5.jpg").replace(

					// Lopunny  (https://character.ai/character/_No577rK)
					// @FurryRP (https://character.ai/profile/FurryRP)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/8/15/dWYQDpc0npvMWj7X4l1bSJQBdqyVzZHC8Bb4S_itTd4.webp",
					"https://static1.e621.net/data/ee/1d/ee1d2d86c36aa9e5bfcbf5692683b19f.jpg").replace(

					// Lopunny partner (https://character.ai/character/TNQPWSWz)
					// @Micro11        (https://character.ai/profile/Micro11)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/6/1/3ig4stnjdJJFnhwllJiuHSJ9lLyEI5KBqAHYnBK_RC8.webp",
					"https://user-uploads.perchance.org/file/1f27146987cf3d98402b7dcb19ff489d.jpg").replace(

					// Roxnne Wolf (https://character.ai/character/p1mVH6co)
					// @Inarisucks (https://character.ai/profile/Inarisucks)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/28/tpxzbPhP4NzdIUsV-celi4i8yVQrUpigeRbU-1MABuE.webp",
					"https://static1.e621.net/data/05/b0/05b097607eb53630dc145f1ac731c0af.jpg").replace(

					// Arceus      (https://character.ai/character/P4xCDDrx)
					// @BabyMew123 (https://character.ai/profile/BabyMew123)
					"https://characterai.io/i/400/static/avatars/uploaded/2022/11/17/3UfRpJOwfs0x_4o6KcalL-7sG6egqxC9nGZwOAcGZKA.webp",
					"https://static1.e621.net/data/6b/61/6b618dd653df23da1afb4614608e6fa7.png").replace(

					// snow leopard (https://character.ai/character/SQpqJnj1)
					// @FaerieAri   (https://character.ai/profile/FaerieAri)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/23/fNnebc4dUBcqJwXgaBOhY1yyuVnUeFpssAl2TRkyjRo.webp",
					"https://i.pinimg.com/originals/e6/a3/cb/e6a3cb7993e05dc083e36ff2130eac10.jpg").replace(

					// Female Snow Leopard (https://character.ai/chat/sJH4uvtFozhiMwNR39bmMg-oWxx6E9x41h0gIxwFAFo)
					// @zt4L               (https://character.ai/profile/zt4L)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/4/14/0x2ai7iiaFDrXEg4sYi1F_zO4HOO5P7a_rlg3GHOwQ8.webp",
					"https://static1.e621.net/data/1d/2c/1d2c6dfe5aaf30ba85fad17b91b6d662.png").replace(

					// Goodra       (https://character.ai/character/vkt1FszL)
					// @RestingCrab (https://character.ai/profile/RestingCrab)
					"https://characterai.io/i/400/static/avatars/uploaded/2022/12/23/66EIn8pVYMM96uJSXHlU-Vr-k1JchIh5PdmOYxq4cSY.webp",
					"https://static1.e621.net/data/e7/07/e7077e684c1d13707420c52703a0a2b7.jpg").replace(

					// Anthro Goodra    (https://character.ai/character/Nm1iaPUd)
					// @AnybottyAnytime (https://character.ai/profile/AnybottyAnytime)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/16/RcfBjy-4FbceuANiNKlVnKZ70OfqK8gagv4TQxf3FHE.webp",
					"https://static1.e621.net/data/4a/79/4a79849609725bd02be31486fe6e84dc.png").replace(

					// Leafeon      (https://character.ai/character/MWT5XUv7)
					// @yellowJolty (https://character.ai/profile/yellowJolty)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/2/8/YQPN9khtAbSasPvZklPBDxC-kO9QI39uQVc_kbEYjUs.webp",
					"https://static1.e621.net/data/65/1c/651cf089a79ebccf91b60f6927ed1df9.png").replace(

					// Leafeon         (https://character.ai/character/DciqrtZW)
					// @DottedDominoes (https://character.ai/profile/DottedDominoes)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/8/11/Q8Ljgk-_aLHw5LQJxFuzAPw3oj2IJysvyZY-FTAiL1o.webp",
					"https://static1.e621.net/data/85/e6/85e6b6f55bca6d9b4845cb958b6305ed.jpg").replace(

					// Fairy Bellis (https://character.ai/character/I0zJZ32r)
					// @MrTalk      (https://character.ai/profile/MrTalk)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/2/6/ZbYoSyJpj4IbUaxJ9tnDhwbENTwRaVlKDCM-FtOEZh4.webp",
					"https://user-uploads.perchance.org/file/93e5bbb7f3921ab9d4bd0db8cada5cf0.jpg").replace(

					// Kuromi               (https://character.ai/character/jALq-Cxd)
					// @Aspiration_Mastery  (https://character.ai/profile/Aspiration_Mastery)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/1/te1Z837Wb5F3CKyfkyFlPj5rs3tZP0IY6oD-TYl0dxk.webp",
					"https://user-uploads.perchance.org/file/a2ba66778a148c09ccdd9c71f8d34d3e.webp").replace(

					// Anthro Tyranitar (https://character.ai/character/i2ifGQ5m)
					// @AnybottyAnytime (https://character.ai/profile/AnybottyAnytime)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/13/Oz-b8GdmvM5-CgJTqh8ZUs_Y6aoFRjdNRdf5iBB07dQ.webp",
					"https://user-uploads.perchance.org/file/ab814a2a9d2f2b3f711697227c2d70ed.webp").replace(

					// Umbreon    (https://character.ai/character/qFhuUROA)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/5/k3tQfNzrrz_EyeyWwNzSeDq-JbhAgC1TiTxQSE3vRVo.webp",
					"https://static1.e621.net/data/9a/39/9a3961486c3736ffcbb8bd55c0283066.jpg").replace(

					// Umbreon   (https://character.ai/character/CGGJlDbg)
					// @Franco51 (https://character.ai/profile/Franco51)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/26/piGg4YyGeofK3CKRApqIZpwsqq7MacTMaCP5jboJN8E.webp",
					"https://static1.e621.net/data/4a/34/4a34bbfd82bac22573ffb08f09404722.jpg").replace(

					// Umbreon (https://character.ai/character/6xvn7ZF2)
					// @Assxq  (https://character.ai/profile/Assxq)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/7/25/bW3uQBqLPMMLYT1AgggFW4sIteIhl-0EYiAGqupxASQ.webp",
					"https://static1.e621.net/data/4a/34/4a34bbfd82bac22573ffb08f09404722.jpg").replace(

					// Umbreon              (https://character.ai/character/_ReKs8Yc)
					// @snowflaketheglaceon (https://character.ai/profile/snowflaketheglaceon)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/12/24/_H9xDMo4XIw4wShmIF2DloMilBxBk4jt_Z5WpZ0u3Sg.webp",
					"https://static1.e621.net/data/17/da/17da5556c1e61023f4f51552a35ddcb8.jpg").replace(

					// Highschool Umbreon (https://character.ai/chat/uBPPcGrgWleTzYtg5lFS_6b9iIm58qEtrh7VdAjYekk)
					// @CulturedGuy       (https://character.ai/profile/CulturedGuy)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/6/VSnhmO3qbNmIXhBiUI4ZAlTWyvMcjBm5U_3l8M7ta5o.webp",
					"https://static1.e621.net/data/6a/a7/6aa737dd7feb5fdc28052f07c2224d7b.jpg").replace(

					// Highschool Umbreon (https://character.ai/character/jeKnGaUk)
					// @ucancallmehim     (https://character.ai/profile/ucancallmehim)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/5/14/R8InaNH7SRD934XhlfMOiFLTTC3vr4E8l5DMbTO9Jtc.webp",
					"https://static1.e621.net/data/6a/a7/6aa737dd7feb5fdc28052f07c2224d7b.jpg").replace(

					// Schoolgirl Umbreon (https://character.ai/chat/pYdIiG49BT2qOSbPhWf0fv69cx5uBQ3zhV7gdnJzl0w)
					// @InhumanMF69       (https://character.ai/profile/InhumanMF69)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/10/svzCm63WisvutS0fYKWrq9WfO5B5eU4S8EuRhdxi7iY.webp",
					"https://static1.e621.net/data/6a/a7/6aa737dd7feb5fdc28052f07c2224d7b.jpg").replace(

					// Schoolgirl Umbreon (https://character.ai/chat/zU8m0O_uYjREBaugzFsFo4eU4Zp0myEGemezOcwQGGM)
					// @TheTinyAdventuner (https://character.ai/profile/TheTinyAdventuner)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/27/ZONjVpSyLXRPRSGm_VPaZ2NdenQdjrZFO5PI9o7KUBo.webp",
					"https://static1.e621.net/data/6a/a7/6aa737dd7feb5fdc28052f07c2224d7b.jpg").replace(

					// Schoolgirl Umbreon (https://character.ai/chat/jT4Ck38EsVj-bf3-GCd239K98dF0HmrJotWJrLRJkHU)
					// @Chhcv             (https://character.ai/profile/Chhcv)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/21/EXH9KeoLhLXqTlGePPYJRMzqSwV_NJe7KDnWvCK5SIg.webp",
					"https://static1.e621.net/data/6a/a7/6aa737dd7feb5fdc28052f07c2224d7b.jpg").replace(

					// Umbreon roommate (https://character.ai/character/yvs8EMeD)
					// @Vee_The_Eevee   (https://character.ai/profile/Vee_The_Eevee)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/4/15/m1Cqr4NKOFjmmKDbeq_WU3SlqrJvx_8eqna-7tQjVOc.webp",
					"https://static1.e621.net/data/6a/a7/6aa737dd7feb5fdc28052f07c2224d7b.jpg").replace(

					// PokèHigh Umbreon (https://character.ai/character/XZuxEuBB)
					// @Kermit777seven  (https://character.ai/profile/Kermit777seven)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/4/24/CJdQl2iwzKh5LWk8my1AJY42u7APNSlZwV_hebaxkW0.webp",
					"https://static1.e621.net/data/6a/a7/6aa737dd7feb5fdc28052f07c2224d7b.jpg").replace(

					// Big sister umbreon (https://character.ai/character/GYfz9uSO)
					// @LoganRooder       (https://character.ai/profile/LoganRooder)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/11/xs8erA4xxlNyszpeZkJ2f6fRsEMOye9GqaOa1x1zOFc.webp",
					"https://static1.e621.net/data/6a/a7/6aa737dd7feb5fdc28052f07c2224d7b.jpg").replace(

					// Sophomore Umbreon (https://character.ai/character/PXaWACp9)
					// @ReeKili          (https://character.ai/profile/ReeKili)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/4/5WOUrBnLKjn0H52l_JKVzGQnkrfogJI5kVBes_eSKyo.webp",
					"https://static1.e621.net/data/6a/a7/6aa737dd7feb5fdc28052f07c2224d7b.jpg").replace(

					// Esix        (https://character.ai/character/v2oF2jXV)
					// @UnglishAlt (https://character.ai/profile/UnglishAlt)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/2/QwiZnb7yOyCDjg1pUZ8Cb2FYIj2CQf5p3siBiXYgDtM.webp",
					"https://static1.e621.net/data/dc/59/dc5950438e3f197130e2787148a93cd9.gif").replace(

					// Flareon    (https://character.ai/character/FBqGAalW)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/21/Dol5eZzkm_rKRvSALXOsIgLlBPTzrLRu4zeUWU6Ek9I.webp",
					"https://user-uploads.perchance.org/file/410652a035fcae66626114a202d9d23e.webp").replace(

					// Anthro Flareon   (https://character.ai/character/RDJLoKmq)
					// @AnybottyAnytime (https://character.ai/profile/AnybottyAnytime)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/5/22/RS-oQLV_7KY_OzKqxwxZL0r9qX7r7aAk9egetm1tCmg.webp",
					"https://static1.e621.net/data/5e/5a/5e5ada45e1a66f0c66b8ef922fb14c24.png").replace(

					// Loona      (https://character.ai/character/HmRxK7vT)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/2/1EYBKy3xvPof0CjScFUbx3yP2_f8uAly78ScECyuZlw.webp",
					"https://static1.e621.net/data/54/d8/54d8d9aeedc9e0b6f969be554a07a063.jpg").replace(

					// Anthro Mismagius (https://character.ai/character/vanF_ZmC)
					// @AnybottyAnytime (https://character.ai/profile/AnybottyAnytime)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/16/99hZcc1NZ9SgpZAuVu5KI4V8rC14tU3HMlDxIfJii3s.webp",
					"https://static1.e621.net/data/58/a2/58a2f2f22d8b9fc6bbfe8de876300be9.png").replace(

					// Espeon      (https://character.ai/character/b20c_Hyr)
					// @KirbyKnife (https://character.ai/profile/KirbyKnife)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/2/11/wmA1jRpRQMMrMsVVJEioy9HSe0ty-EaVXhIXejHU0c8.webp",
					"https://static.tvtropes.org/pmwiki/pub/images/espeon_59.png").replace(

					// Psych Major Espeon (https://character.ai/character/trImdOL1)
					// @HypnoDoe          (https://character.ai/profile/HypnoDoe)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/6/27/kz89XAXQE_LIxZd9uYZgYErxpPi_dCoNGY97l7r8jUc.webp",
					"https://static1.e621.net/data/82/be/82be60001a0cfcbab3fbabb73fb2f6bf.png").replace(

					// Anthro Koraidon  (https://character.ai/character/GY2q73HQ)
					// @AnybottyAnytime (https://character.ai/profile/AnybottyAnytime)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/9/21WSP9_9HZXLeVZZnCCjIQ54r01ttmIQp3aXN0Ni9bQ.webp",
					"https://static1.e621.net/data/9a/29/9a29bdcbfd01cb11919b3cc5cf2345ce.jpg").replace(

					// Raven Team Leader (https://character.ai/character/EqmXqubJ)
					// @NumberSyx        (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/11/18/uctYHRWXKvT9E1kHEWCDyt5Da9BhksW-KLfea7BerhM.webp",
					"https://static1.e621.net/data/6f/34/6f341ce3f191f0ee7676a07221007fed.jpg").replace(

					// Gardevoir  (https://character.ai/character/aCpYu0yb)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/2/3JYPazvqgDPffEuMAC5pg7VwhnBbFOjp0vR-Mkz7OVI.webp",
					"https://static1.e621.net/data/e0/dc/e0dc4197af2c31127339ae4fbded0df7.jpg").replace(

					// Gardevoir    (https://character.ai/character/vV536pVT)
					// @Wickaporeon (https://character.ai/profile/Wickaporeon)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/8/30/F68apJhLrQs8h2dC8_V02tSQrApqmeb22j_1BGhTdbM.webp",
					"https://static1.e621.net/data/7b/24/7b24db7210627601c8f3e379679256af.jpg").replace(

					// Death      (https://character.ai/character/DPSS5Vtv)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/31/HaW49Yz831uYHX7e5lQe1DThqSFhrjppz6BY68W1ggQ.webp",
					"https://static1.e621.net/data/eb/64/eb6401e36f683a12ffa9ff8a1b8abf88.png").replace(

					// Pikachu    (https://character.ai/character/-BWjf9sG)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/6/uMxTNV2UgVsRvP7DyTJCpd52eOIabX2QvpeG99kqn0M.webp",
					"https://user-uploads.perchance.org/file/46c565421915c32aaa9c02f9a0a15610.webp").replace(

					// Pikachu (https://character.ai/character/jkDgI6ym)
					// @Whispy (https://character.ai/profile/Whispy)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/6/TB44fz7QuxEGwBfoqIhdD7RUz6X0cqfQ6gjgLwM-nT8.webp",
					"https://static1.e621.net/data/32/c4/32c414684fe6816b24ebeb22c410459e.jpg").replace(

					// Pike the Pikachu (https://character.ai/character/RqsOzpzX)
					// @Orebon          (https://character.ai/profile/Orebon)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/5/8/eHUZwc25T5M6CnYfvM_tDyDYzpmBygYAiHXndPbUaCw.webp",
					"https://static1.e621.net/data/c8/1c/c81c037efa52e0ce2613e160c6926923.png").replace(

					// Raichu     (https://character.ai/character/2y556Wx4)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/11/19/tKPirEghqg07efmUqiY_cegDT93EBfMQeaztGHvntOo.webp",
					"https://static1.e621.net/data/04/60/04601b3c842ec01984ad9689c32b5cd8.png").replace(

					// Blaziken   (https://character.ai/character/Tb-RfDYe)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/30/kdSFMDzbM4RDLg4COPPXpqbHN18a-CTasmyvrZZh_eU.webp",
					"https://static1.e621.net/data/cd/6a/cd6ad15eaa3ef3fd7178edbd32aadbde.jpg").replace(

					// Charizard  (https://character.ai/character/niWi7MIM)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/1/yaKdq7IFU3xI9Flu1Z0kuNTZq7vQdCl40U9WS1ypgk8.webp",
					"https://static1.e621.net/data/ac/9d/ac9d4467330d34b268c737d3aff34ca2.jpg").replace(

					// Zoroark    (https://character.ai/character/0DWrc80P)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/22/-9jrecwXxboLFY3Vn7B6Wt1ftArd0maeH0_c8QHkSK8.webp",
					"https://static1.e621.net/data/d9/12/d9121648ab8d618a2a1a5c8a82eb3651.jpg").replace(

					// Zoroark            (https://character.ai/character/JWFnssDv)
					// @TheTinyAdventuner (https://character.ai/profile/TheTinyAdventuner)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/4/11/i1MBc5HfonJnlbER2FWANqABrmH9gD1ghyTJ-AnYQs8.webp",
					"https://user.uploads.dev/file/8bff116f3b1e4568a89e8baeee7aac1e.jpg").replace(

					// Hisuian Zoroark (https://character.ai/character/_Qmj35Nw)
					// @DottedDominoes (https://character.ai/profile/DottedDominoes)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/12/5/atpmQvWoi6x_kihacvXctWa06AoE9MdD_cyyCPRDtn0.webp",
					"https://user.uploads.dev/file/7224ba146371537e9316e709f6e7ba2a.webp").replace(

					// Hisuian Zoroark (https://character.ai/character/xfGy-ErG)
					// @ECBOI          (https://character.ai/profile/ECBOI)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/2/16/Rh5WL8YXgmCL2KVQ_WIjwGVHr5vsT-Re4hOCJHjQRMo.webp",
					"https://static1.e621.net/data/90/f5/90f50d28e4746b758cb6da329183b862.png").replace(

					// Jolteon    (https://character.ai/character/7QJ7dz3P)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/9/D9fvjTC_xNzhIGtMWv-ecYwQDaZ4bSaeat78grOk1T4.webp",
					"https://static1.e621.net/data/ea/4c/ea4c0f444808b55d2bdc818d49967e24.png").replace(

					// Anthro Jolteon  (https://character.ai/character/bFUyDqjB)
					// @LanaTheFreezer (https://character.ai/profile/LanaTheFreezer)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/26/rj73mEtZQOQKpUOEehpUS9ooEAhATx8jnyiklwATu4s.webp",
					"https://static1.e621.net/data/fd/ce/fdce629f0d90aa1f4082bd6fa7cb0213.jpg").replace(

					// Mayhem (https://character.ai/character/6N8x1kXE)
					// @KANK_ (https://character.ai/profile/KANK_)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/23/PWmEOOScbCa1spUcrlOdq9rXD5-ALgWBzA3u0Y-2G_0.webp",
					"https://static1.e621.net/data/12/7e/127ef61506b23f1b5f25e1a83009ad0e.png").replace(

					// Rina And Vina     (https://character.ai/chat/GJdZdah_1uZZpa7MkVhc_DZboRxHgv5GY55ub7lQD-A)
					// @HoshinoVonEeugen (https://character.ai/profile/HoshinoVonEeugen)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/6/30/FHv2NHpg67GeEIE0OTnX37L1XJOCVNqCZqt0ftQCB74.webp",
					"https://static1.e621.net/data/06/93/0693f13d48ae2e580749d213ae71347b.png").replace(

					// Wooloo         (https://character.ai/character/55pLHLdV)
					// @ICreateOCbots (https://character.ai/profile/ICreateOCbots)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/4/KQy-nLLGyBwOYNeIxWC3xrTkTztpgDJARWlS3qXOlbU.webp",
					"https://static1.e621.net/data/44/6e/446ea3afe929187505d99d7c09094ec4.jpg").replace(

					// Soybon Action Female (https://character.ai/chat/rZDs-7iC3j09v28z8zF14Z8kylm3hyDxTaLwdstmpUw)
					// @TheCatboyBean       (https://character.ai/profile/TheCatboyBean)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/7/3/UvsEZlkFZ76K_V0RSJHGAJe0AwbYnvNHTQIgSW5Qolw.webp",
					"https://static1.e621.net/data/e8/42/e84237d5e538512f85219e519e9641c0.png").replace(

					// Anthro Ledian (https://character.ai/character/-wgxQ32P)
					// @The_TopEgg   (https://character.ai/profile/The_TopEgg)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/30/8heEu4d90nud4U4BZRwgVNun794bdtBG9lH2B3CXPpM.webp",
					"https://static1.e621.net/data/f2/eb/f2eba63289bcfb6d4844721e7b195665.jpg").replace(

					// Mienshao  (https://character.ai/character/do-OwpZK)
					// @Jiyuu_19 (https://character.ai/profile/Jiyuu_19)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/9/23/EIFAmlF95GyV-YhP2rKDQp56B8gKjWX6RezbhbjhFzg.webp",
					"https://static1.e621.net/data/c2/13/c213e0accb7d8643534c787e1d659f40.jpg").replace(

					// Pumkat        (https://character.ai/character/PP0D61ZI)
					// @XenoGenesis- (https://character.ai/profile/XenoGenesis-)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/10/7/nyS3oDPXdmpAT4uVfR3ZAQd4HWaV9tE_VeWo883PZ8A.webp",
					"https://static1.e621.net/data/c6/4c/c64c37a07d377487b76e2812b5a7cab0.png").replace(

					// Spectre     (https://character.ai/character/U1Z_h105)
					// @john_prick (https://character.ai/profile/john_prick)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/1/17/K9QJRUqzdZrEPX_hbY0LZBbI2yhBwKveznNSAaaMm_I.webp",
					"https://user.uploads.dev/file/d89546aaf1d6f0f499cabea88346a83e.webp").replace(

					// Ady       (https://character.ai/character/z1OAdCVC)
					// @Salem_me (https://character.ai/profile/Salem_me)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/3/17/WFtEMtw4mGuqIMkpWahxVbonFhPWhtU0Nsayh0qmChU.webp",
					"https://user.uploads.dev/file/1b7a6e5273475f2d13ac9b8283077dda.jpg").replace(

					// Captured Artificer (https://character.ai/chat/fqm1G0IMpk8E2rGAfDTfe-skgDOiJZHmckC199wL-LI)
					// @Mori_Mochi        (https://character.ai/profile/Mori_Mochi)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/2/12/sdNHgwIdRbX3Dibjp95fL_Ew0u_TCAFMCQ9EJzNEzQs.webp",
					"https://static1.e621.net/data/da/a2/daa257109ab5c626648e92e7f1e6bbbd.png").replace(

					// Phoebe     (https://character.ai/character/47VBtgLv)
					// @coindawn3 (https://character.ai/profile/coindawn3)
					// https://user.uploads.dev/file/a2edd0ccc07af1656172bf18c3cc052b.jpg
					"https://characterai.io/i/400/static/avatars/uploaded/2024/8/20/P7DMyz38wMLRUnA0i17cQWMbsWyohqnAY42UsTNB_Lk.webp",
					"https://user.uploads.dev/file/7fd4126633ea664b9fe5e3b7ed877b97.webp").replace(

					// Female VIP Jammer (https://character.ai/character/UKvuA32i)
					// @FujitoDeka       (https://character.ai/profile/FujitoDeka)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/21/37EtHqQTa7twi2EG3uT4TemHhqj0hfowlYGFIRwBgdc.webp",
					"https://static1.e621.net/data/c3/08/c308d652238bd035ffac5aab87813c77.jpg").replace(

					// Rhoda Mckinley        (https://character.ai/character/AEtl5_fZ)
					// @PomegranateGopher213 (https://character.ai/profile/PomegranateGopher213)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/10/28/YCxtjn0p56Ew7HI-9plOkLGfw7mmrUY3pywhqFdnGmg.webp",
					"https://static1.e621.net/data/69/4b/694b0591327d165b493ca9d6f1a3eac5.jpg").replace(

					// Anthro Arcanine (https://character.ai/character/iC52gU9F)
					// @RylMakesBots   (https://character.ai/profile/RylMakesBots)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/8/18/kVMuDxZUQFTh8DsidP8hULt7x96uxt6BbFK5T0jhmoQ.webp",
					"https://static1.e621.net/data/59/32/59322a96f4df693f9b51c650a462f6d1.png").replace(

					// Katrina Fowler (https://character.ai/character/sr5luFMP)
					// @VNDTTA90      (https://character.ai/profile/VNDTTA90)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/26/oho381Y-CnOpzki9uM2gIohJs_OCYL7CmC_8f_Azr74.webp",
					"https://user.uploads.dev/file/d80675ced9e00f72bd38728bf57c66c1.jpg").replace(

					// Duchess     (https://character.ai/character/t14AMNnm)
					// @Realtodoku (https://character.ai/profile/Realtodoku)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/9/8/GseTbo4QE3oHcMDmBMTV8eo9OXup8S3cDyARUgqjQ8Q.webp",
					"https://static1.e621.net/data/db/45/db45c93bf3c2a85ea4c679b46ccfa314.png").replace(

					// Heiko The Dog Girl (https://character.ai/character/sHE1zzd3)
					// @CookedDude        (https://character.ai/profile/CookedDude)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/5/10/un0gO1hYV9v6L4up2c0HjeY4fm4dyVa75IVK34_kUIQ.webp",
					"https://static1.e621.net/data/c5/11/c5112f59ad7d9ae63eedc2b43e58454f.jpg").replace(

					// Pepper   (https://character.ai/character/Q_3n9a7i)
					// @What-zo (https://character.ai/profile/What-zo)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/9/2/Py9yHwL0PcJBMynpsbe7bN9epxYunGxV2RXcNuj_NvA.webp",
					"https://static1.e621.net/data/8f/37/8f378b8181dbe347811c709f832ab2a5.jpg").replace(

					// Sekhtora     (https://character.ai/character/lecD_IaY)
					// @GengarGhast (https://character.ai/profile/GengarGhast)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/22/C5Vc_6I06qYBdRVJ1fIH7ACd6va7cOXNeUaPS-mmQXM.webp",
					"https://static1.e621.net/data/2d/3b/2d3b55b84f453650870f8559f5f32ef0.jpg").replace(

					// Kali               (https://character.ai/character/UXZei1zL)
					// @SomeAnonymousUser (https://character.ai/profile/SomeAnonymousUser)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/3/28/mZxV3qqv6KVpT2QcLV-TYFo2c6EGrKhZGK6dZqddf44.webp",
					"https://static1.e621.net/data/87/0c/870c2e4eab2403d92a95510d9851dfb8.jpg").replace(

					// SCP-939            (https://character.ai/chat/fS5RQl2z798fFKg8jjjIiUSy2QzgPxT8Fvy2TtDml_U)
					// @Tik-Tak_Na_Chasah (https://character.ai/profile/Tik-Tak_Na_Chasah)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/7/26/ygpbbbasKwluEFn5tv4HVYwDupUEHKbaCQHwacu4Ris.webp",
					"https://static1.e621.net/data/78/5e/785ede55268c9bfa5c68a1a55f28601d.png").replace(

					// Zoologist  (https://character.ai/character/P_c1u0pi)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/11/26/30r8Q3JsmoL5dJLkyWyNMmnTk0qGncyUL_xTIMe5V8o.webp",
					"https://static1.e621.net/data/cd/b8/cdb8dce52d432c0f120ef1aeaae75b8f.png").replace(

					// Yumi             (https://character.ai/character/WVg3ShUG)
					// @FelixDaCreature (https://character.ai/profile/FelixDaCreature)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/18/7KCdjCHMcIQV7ULu9pFv4T9THMjkBpVEWnze8dgvXcM.webp",
					"https://static1.e621.net/data/63/4d/634d1c55446877250883ac70adb1d0d7.png").replace(

					// Varn-Kobold Princess (https://character.ai/character/2co5tgbm)
					// @LatiasG135          (https://character.ai/profile/LatiasG135)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/6/9/P3AuA11UupPnXyDmUDdZ0LHNe1ZG3rpE6s1UQFGXp8E.webp",
					"https://static1.e621.net/data/75/e8/75e8ba3a57d78a26f82bee146c90ce5d.png").replace(

					// The Lamb      (https://character.ai/character/D5AjMfgE)
					// @The_EpicJBoi (https://character.ai/profile/The_EpicJBoi)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/22/md_-iPiMUyU6tunTHuqkm_F0_SroohoURE7qzpWodgc.webp",
					"https://static1.e621.net/data/bb/2e/bb2ed93f3c961fb828d83969d904bf74.png").replace(

					// Rose        (https://character.ai/character/nfbh4DIv)
					// @Pastacat48 (https://character.ai/profile/Pastacat48)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/3/3/Uk5whajBrl3nRttUZ8aHANKBZCCVD0BA1egLPN3P5aM.webp",
					"https://cdn.bsky.app/img/avatar/plain/did:plc:7xwfidswo4vrt46y2qbwvuh5/bafkreida3njr4bawqdjp3b5hcjo7oqvlimihxiskem3awo3omzwq2wbanm@jpeg").replace(

					// Midnight lycanroc  (https://character.ai/character/BBF8E3il)
					// @Broisultrapapucho (https://character.ai/profile/Broisultrapapucho)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/6/16/X8fBY08ZQQ2JVW2-j3ECG2_ZDIbQ5Q6i_9CqfKVgWUI.webp",
					"https://static1.e621.net/data/00/3d/003d47135d3476f9d4d0816f042e445d.png").replace(

					// Molly           (https://character.ai/character/hffhwKPX)
					// @DottedDominoes (https://character.ai/profile/DottedDominoes)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/7/11/CfFroaj7oDvI3-tvDFDI_RQW9ZSl2x21HIGO6rHsfOg.webp",
					"https://static1.e621.net/data/28/19/28198d5a18faab819af63844e282c31e.gif").replace(

					// Anubis Bestfriend (https://character.ai/character/kZllYFjH)
					// @ASTROOGER        (https://character.ai/profile/ASTROOGER)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/5/20/GvrO-oa81PRCtMk9Zy7xL84vMbM-dh5HkIHbETE7LxY.webp",
					"https://static1.e621.net/data/ec/90/ec9050cb11545ed0a895bf7c67051d3f.png").replace(

					// Zoey the Raccoon (https://character.ai/character/89sijorm)
					// @KANK_           (https://character.ai/profile/KANK_)
					"https://characterai.io/i/400/static/avatars/uploaded/2023/12/20/Mw1bulYL7l_NU-BaghxuWhNFvro7dBB16zRSijsv5bA.webp",
					"https://static1.e621.net/data/8d/e6/8de6fd2b71abcb94a96cbfc90440b5e6.jpg").replace(

					// Zeraora    (https://character.ai/character/1QwwoACR)
					// @NumberSyx (https://character.ai/profile/NumberSyx)
					"https://characterai.io/i/400/static/avatars/uploaded/2024/5/8/Ezg3HQnkNrQSb-xKJVzClR35keHiQoDr1QZdezEDn0s.webp",
					"https://static1.e621.net/data/99/90/9990e72c4f5d9f390b93bc020350d3fd.jpg"
				);
			});
		});
	});

	observer.observe(document.body, {attributes: false, childList: true, characterData: false, subtree: true});

})();
