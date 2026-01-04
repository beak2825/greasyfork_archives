// ==UserScript==
// @name         YouTube Porn and Brainrot Blocker (BETA)
// @namespace    http://tampermonkey.net/
// @version      1.2 beta
// @description  Bloquea contenido NSFW en YouTube basado en palabras clave y canales específicos.
// @author       Bon Riley Ridley y Gabriel Gary Ridley
// @match        *://www.youtube.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527982/YouTube%20Porn%20and%20Brainrot%20Blocker%20%28BETA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527982/YouTube%20Porn%20and%20Brainrot%20Blocker%20%28BETA%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Lista de palabras clave NSFW (extraídas de los títulos bloqueados)
    const nsfwKeywords = [
        "kill abuse", "gore", "brainrot", "turbio", "papi que rico", "cum", "Sus Cartoon Moments", "video del teleférico", "Breast expansion", "porno", "worth it", "porno recortado", "Is worth it",
        "ø·ø ̈ùšù„ø©", "ø£øoù†ùšø©", "ù„ù„ø£ø·ù ø§ù„", "ù„ùšø ̈ùšø©", "terror", "فاعل خير", "smile", "liveleak", "chicken homicide",
        "Ochaco is Worth it", "Froppy is Worth it", "Momo Yaoyorozu is Worth it", "Toru Hagakure is Worth it", "Inko Midoriya is Worth it",
        "Jiro is Worth it", "Toga is Worth it", "Mirko is Worth it", "Akari is Worth it", "Dawn is Worth it", "Nessa is Worth it", "Arezu is Worth it",
        "Rosa is Worth it", "Hilda is Worth it", "Marin Kitagawa is Worth it", "La Brava is Worth it", "Hinata is Worth it", "Tsunade is Worth it",
        "Temari is Worth it", "Sakura is Worth it", "Mikasa is Worth it", "Gwen Tennyson is Worth it", "Jinx is Worth it", "Raven is Worth it",
        "Aqua is Worth it", "Wiz is Worth it", "Megumin is Worth it", "Darkness is Worth it", "Tracer is Worth it", "Pharah is Worth it", "Mercy is Worth it",
        "Mei is Worth it", "D.va is Worth it", "Widowmaker is Worth it", "Midnight is Worth it", "Mount Lady is Worth it", "Mei Hatsume is Worth it",
        "Akebi is Worth it", "Mitsuri is Worth it", "Cortana is Worth it", "Tamaki is Worth it", "Maki Oze is Worth it", "Zero Two is Worth it",
        "Shinobu is Worth it", "Nezuko is Worth it", "Lucy Heartfilia is Worth it", "Erza is Worth it", "Noelle Silva is Worth it", "Nami is Worth it",
        "Boa Hancock is Worth it", "Fubuki is Worth it", "Nejire is Worth it", "Camie is Worth it", "Tatsumaki is Worth it", "Juvia is Worth it",
        "Lucoa is Worth it", "Tohru is Worth it", "Rem is Worth it", "Diane is Worth it", "Elizabeth is Worth it", "Mirajane is Worth it", "Sonia is Worth it",
        "Gardenia is Worth it", "Skyla is Worth it", "Bea is Worth it", "Misty is Worth it", "Hex Maniac is Worth it", "Yor Forger is Worth it",
        "Marnie is Worth it", "Jessie is Worth it", "skibidi toilet", "Mitsuki Bakugo is Worth it", "Yamato is Worth it", "Katara is Worth it", "Gloria is Worth it",
        "Gardevoir is Worth it", "Melony is Worth it", "Ahsoka Tano is Worth it", "Mavis is Worth it", "Chika Fujiwara is Worth it", "Korra is Worth it",
        "Azula is Worth it", "Ty Lee is Worth it", "Mina Ashido is Worth it", "Peach is Worth it", "Velma is Worth it", "Komi is Worth it", "Shuuko Komi is Worth it",
        "Raphtalia is Worth it", "Harley Quinn is Worth it", "Spider Gwen is Worth it", "Jolyne Kujo is Worth it", "Nicole is Worth it", "Lusamine is Worth it",
        "Fuyumi Todoroki is Worth it", "Frankie is Worth it", "BonBon and ChuChu are Worth it", "Loona is Worth it", "Ms. Incredible is Worth it",
        "Vanessa is Worth it", "Professor Sada is Worth it", "Nemona is Worth it", "Meru is worth it", "Millie is worth it", "Charlie Magne is worth it",
        "Mommy Long Legs is Worth it", "Creeper Girl is Worth it", "Enderwoman is Worth it", "Sarvente is Worth it", "Aunt Cass Checks if She's Worth it",
        "Alex is Worth it", "Mommy Mearest is Worth it", "Kai'sa is Worth it", "Qiyana is Worth it", "Ahri is Worth it", "Zeri is Worth it", "Akali is Worth it",
        "Lux is Worth it", "Penny is Worth it", "Rebecca is Worth it", "Makima is Worth it", "Iono is Worth it", "Power is Worth it", "jenny sus", "Damn Girls",
        "🤓", "A Quick Peek", "One Piece Yamato Boobs +18 Rule34", "Anime Nozoki Ana OVA", "Hora de Antojar", "hora de antojar sin censura", "Toma cap wasa",
        "Beautiful Scorbunny Buns", "twisted grim comp", "Cowgirl Breast Expansion", "Sexy Woman Breast Expansion", "Cop Girl Breast Expansion", "Padoru Padoru",
        "Himiko TogAss", "Antojando Ahri", "MsRoBUF", "y7jjk02md0451", "SpanishAbandonedKronosaurus mobile", "ms. pauling nude", "nurse boobs",
        "towel falls anime enf", "classroom anime enf", "tops pulled anime enf", "clothes explode anime enf", "ahsoka", "soul eater", "raven", "breast expansion",
        "aliany garcia da tutorial de como bañarse", "Breast expansion girl transform", "rule34 de canela", "rule34 de fnaf", "Jenny SlipperyT takes off her clothes",
        "cow tf", "itty bitty bunny milkies", "Art video: Oaks grove by Amit Bar", "Bouncing Boobs No Bra Challenge", "#Zero Two Nude", "Hentai(18+ Only)",
        "live wallpaper jeanne d'arc 18+", "Genshin impact lisa 18+", "e", "One piece yamato boobs", "Slipperyt - jenny waking you up with affection",
        "Y O U   W A N T   K I N D   O F   M I L K", "Uraraka Sits", "Timelapse // I'm for dinner", "SlipperyT Christmas Dance",
        "Jill Valentine Chubby Kinkster Got Milk Showcase", "Amanda Left or Right Patreon", "sad cat dance 18+", "full Ghast", "Wither full",
        "SlipperyT REAL", "NIKKE THE RULE34 WORLD", "The loli must Stay", "Yor Forger Rule34", "Furry up skirt Animation", "Yes", "chun-li 🔞",
        "Chun-Li Mommy Kicks Li-Fen Wins $5 SF6 MOD", "Kagome Higurashi (LEWD and Nude)", "Mesmerize (1999)", "Tifa Lockhart || Final Fantasy 7",
        "Boob", "Hora de antojar +18", "lopunny dance 2", "Rule 34 Part-1", "hip sway gardevoir", "No Bra Challenge Bouncing Titties New TikTok 2023",
        "EL SECRETO QUE YOUTUBE NO QUIERE QUE SEPAS", "Zootopia Comic: I Wish", "Malas Enseñanzas (Bad Teacher)", "El Rey Cambiaba De Mujer Cada Semana",
        "EL TIENE UNA MALD1CIÓN QUE LO HACE ENAMÓRAR A TODAS Y SER IRRESISTIBLE", "Sam is worth it", "Amber is Worth It (16+)", "DVA is worth it",
        "Raven is worth it [4K]", "skibidi", "Amy rose is worth 😶", "Gwen Stacy Is Worth It?", "Velma is Worth it [4K]", "Do you love God? (Norkle San Reupload)",
        "my favorite seat || made by norkle san", "Vanessa kinda bad tho... by norkle san", "stuff online by Norkle San", "Slime Cat Needs To Stop!",
        "MISS CIRCLE IS PREGNANT | Fundamental Paper Education Animation", "creditos a @michitac", "Cuando te roban pero recuerdas...", "Ser alfa:",
        "ANIMACIONES #DON ZUELA", "Chikn Nuggit Lore Pt. 3", "(Corngak minecraft animation). Steve Are You OK", "Rule #34 (Fish in a Birdcage)",
        "HICE un CONCURSO de DIBUJO y me hicieron RULE 34 😩", "RULE 34 SARVENTE", "Vanny Rule 34 is Worth it", "Melly finds out that Zen has more Rule 34 than her..",
        "Sonic Vs Rule 34 Reaction @Mashed", "Sonic vs Rule 34 (1-5) REACTION", "Rule 34 comments are CRAZY...", "TE VAS PERMABANEADO FRACASADOO!!!",
        "FPMV: 'PFUDOR'", "Cute Female Knight Fell into My Trap...", "Fattening Zekrom Video", "Exploding Stomach.", "20 Mins Of Sus Cartoon Moments",
        "this is the most cleanest edit but hated edit I've ever made!", "Lady Liberty #Rule34", "✅Stress Relief On Plane _ Comic",
        "Mujer de video sexual en cablebús arremete contra quien lo filtró", "Reaparece pareja que tuvo relaciones en teleférico; buscarán reparar su imagen",
        "Aerovia Guayaquil video|video de la aerovia |", "Video Completo Teleférico.", "LO QUE EN REALIDAD PASO CON LOS JOVENES DEL TELEFERICO Y VIDEO COMPLETO",
        "Dragon Ball Súper censura de Azteca 7 #5", "Boyfriend Material | UCLA Animation Workshop 2023", "cook the bnnuy", "Full Stop Punctuation",
        "....ø·ø ̈ùšù„ø© ... ø£øoù†ùšø© ù„ù„ø£ø·ù ø§ù„ ... ù„ùšø ̈ùšø§ шрек", "....ø·ø ̈ùšù„ø© ... ø£øoù†ùšø© ù„ù„ø£ø·ù ø§ù„ ... ù„ùšø ̈ùšø",
        ".... ø·ø ̈ùšù„ø© ... ø£øoù†ùšø© ù„ù„ø£ø·ù ø§ù„ ... ù„ùšø ̈ùšø§ шрек", ".... ø·ø ̈ùšù„ø© ... ø£øoù†ùšø© ù„ù„ø£ø·ù ø§ù„ ... ù„ùšø ̈ùšø§",
        "liveleak chicken homicide ø·ø ̈ùšù„ø© ... ø£øoù†ùšø© ù„ù„ø£ø·ù ø§ù„ ... ù„ùšø ̈ùšø§ terror فاعل خير", ".... ø·ø ̈ùšù„ø© ... ø£øoù†ùšø© ù„ù„ø£ø·ù ø§ù„ ... ù„ùšø ̈ùšø§",
        "....ø·ø ̈ùšù„ø© ... ø£øoù†ùšø© ù„ù„ø£ø·ù ø§ù„ ... ù„ùšø ̈ùšø", "... ø·ø ̈ùšù„ø© ... ø£øoù†ùšø© ù„ù„ø£ø·ù ø§ù„ ... ù„ùšø ̈ùšø§",
        ".... ø·ø ̈ùšù„ø© ... ø£øoù†ùšø© ù„ù„ø£ø·ù ø§ù„ ... ù„ùšø ̈ùšø§ smile :)", "ø·ø ̈ùšù„ø© ø£øoù†ùšø© ù„ù„ø£ø·ù ø§ù„ ù„ùšø ̈ùšø§",
        "...ø·ø ̈ùšù„ø© ... ø£øoù†ùšø© ù„ù„ø£ø·ù ø§ù„ ... ù„ùšø ̈ùšø§ terror", "...ø·ø ̈ùšù„ø© ... ø£øoù†ùšø© ù„ù„ø£ø·ù ø§ù„ ... ù„ùšø ̈ùšø§ terror فاعل خير😏"
    ];

    // Lista de canales bloqueados (puedes agregar más si es necesario)
    const blockedChannels = [
        'UCZi4tjUJxHeFdSewH9V-1DQ', // ElRinconDeReddit
        'UCk6cM9HzJe5I9Bv77S6SD7A', // Historias Reddit
        'UCTxwHissiCnxMQ591w-_uYQ', // Didiwinx
        'UCO5eS-P1S0Sv8Zc-bQFbl-w', // Didiwinx_fp
        'UCbU_V7fD7WkNCLERnYgxKXQ', // ZamyALX
        'UC1fWWHy4P7CIN0-Fx44PQow', // Alex Avellana
        'UChevJ57SXeYPDSdWLhbO19w', // MrBrauza
        'UCiTUkKaaZbIo1Le7Jf_GD0g', // RidiculousCake
        'UCOicc9kd58k_XR3D7bTx8oA', // Rico Animations
        'UChRSuyHn0zwiBvZ6blqrKfA', // Pink Box
        'UCYf2Zi6BMDcztIgMsUoa4Qw', // KIK
        'UCYAteaDkv50diBSqtUBuylw', // NewTrollWsp
        'UCgx-T6WYsyQod1-zmurrOAg', // EL DE LOS MEMES
        'UCzG3yE6QkWB7z1PryPoyvkg', // CosasdeNoobs
        'UCeNSXn6hnEICQx2oextjiCA', // Izumy12
        'UCRsSfYANYPaa0qbTXnxjxTw', // goblinblin
        'UCyKji5f2P5y05Ebs4wIFu-w', // TNT?KING_BS
        'UCRRScw48whXuxERDZB939Gg', // Comic Cherry
        'UCf2kXWkkhUJ0_1xRc4OBUlw', // TryTo_oN
        'UCDaZIIzTZfyoL1YEsWR8uIA', // SKRcomic
        'UCu1VJpM5bTDRdKm5YsqTj6g', // Jinx Comic
        'UCCEDF78hjKNVrtwwwQff1Lg', // Saikorin
        'UCYL0au6V77nHEhVP9kUMwlQ', // Cougar macdowall Va
        'UCNIwyVMzpPsO8Ong4IBeaQw', // FASH
        'UCnsvxzAqYyCuMNBdqcsip9g', // fluffy pony abuse
        'UC-KxWgtRULEGhZ91m0-G62g', // Gayroommate2020
        'UC6xP6vCHNHq0P6OqrI-9rSw', // The Bangladesh Man
        'UCfHB89q9F1i7zjNRON2G6IQ', // Smiley The Smile
        'UCxFPGRIJ8yOAd61evqWd4CA', // Naocchi Vtuber
        'UCJc2D2-_POvDSoODlP9UsdQ', // 🌹 Mina Kraviz
        'UCE-IbEHusm_nEv4U9NpMIDw', // m1s3n
        'UCJvGHGUY18GbAPPbNinuEFg', // Vibezx (no.digas.nada🙏)
        'UCosthX4tp3AjavtarwSBFFg', // UN POCO DE MLP EG
        'UCrZ8Y072j9gExvRcgSuJYJA', // muslos, anime y más
        'UCYwCRImvpAR8RuqWbY2-w5Q', // PanLover_69
        'UCIie7gv7g6Vxrig4j0B7ULA', // campeón legendario Tobias
        'UCTcK8F1BSF8JN858xLMM89w', // Tsunude
        'UCdsWER5fWI6Q3e3C4-U0YlA', // 𝙍𝙊𝙓𝙏𝙄𝙇
        'UCUWKzAQf4vWYcyDND8Hmubw', // Mr. Baiter
        'UCx5xUie-SBVsryNyHxd8Egw', // Corngak
        'UCjoDs9tr1VuWnblB-jn5slQ', // Viruz 51
        'UCO2sGBoqgbAjYq3GEXqSeNQ', // Lola
        'UChuqW8AoT8sjxmDRH33rH8A', // Minutka
        'UC0m9Mzw-lW3dGjkDekQ-u3w', // Mr.farras
        'UC_BJe2SQOJTvMo-6hLMRU6Q', // Michi Tactico
        'UCXoRb5fEVQGnGErwh1MpbmA', // indiana souf
        'UC61uTBdIR5ZGsvB94474SDg', // Doko
        'UCsXOgsJJXM1x1aMHvwRcD9w', // Tio Kevin san
        'UC4a9AkQ8aq_RSZQ_EcDts2A', // ¡ Tu Chica Anime !
        'UCrFQtSwMv57G0iZ_1A3Knrg', // FlipBook XD
        'UCxQsC0VniVN1dNXARHoquBg', // Jiko
        'UCJXQd-ETaPttewQfBNUgiGg', // ⚓Captain Alex Stars 94er⚓
        'UCc1-oQT5Lp9aOXcTsTIlksg', // Recopilados yt
        'UCnyBg3e3M1gdB7r9xHy717Q', // Erick GC
        'UCCFtFrqcAjWM8Xq5jeia4ZA', // DonZuela👞
        'UCYnb52ZkjgfucRrvjThhKZw', // MATI PLAY
        'UC1ZNVXzh3O5GIV9Pi0yR_7A', // Raydon XD
        'UC2vsHlx2yLgiTGYEOp9OIMw', // Donovyegg
        'UCRYJoh-akJUo6UOGBYdqPQQ', // [CookingwithStella]
        'UCz37glUmTcvid7czLKzYEOQ', // skipos
        'UCar10ktDvbT9kgW2tZEftUg', // KnucklesXAkiza
        'UC4jZNqqWS7BSwkGorurICJw', // Toot Club
        'UCs7TeHQOhO5-he5iiLXNZZQ', // Sauce-Kun
        'UCH7qSEkpreXUBQ71aD6uWSQ', // Glubbable
        'UCh-W5cTLc5sXxleeLdDmEJQ', // Parlo
        'UCJ8HyoTd8hhSFsU1uMnJeaA', // randomTF2
        'UCxsgLtJmweWlUstYdoHQOxg', // PinkShonen
        'UC8vFMORzjB1VPDfpTW5cOCw', // YapCreations
        'UCfgSc6n-m75F_uKZiS960cA', // Chaos
        'UCA8WXl7HpoCY3ZYQeTjicMw', // SilentManJoe
        'UCUSX21O7Ii2DKuAoIY6iCiA', // Aniais FNF
        'UCNW-bwnZrK3KDBmfaAIIEuA', // PuckerPon
        'UCaHHiLAGG4J4FGWywbsM9Ig', // Ditto
        'UCAns8jRaSTKE8kaO32_HtLQ', // Kenin
        'UCxiPpmnUh0XtwegF3T2Qt1g', // mushroom animation
        'UCsod2dnT1HPTaQTQ4g10Qrg', // Daffis
        'UCz_uh6SXJTSTitLztbBGJQA', // FuqDa!?Boom!
        'UCbFoRtScpCpyMIzn8tEj3qA', // Camera Capucino Up
        'UCzpZBFXKFDhZZqGSPqNncXw', // Đức Trần
        'UC_5c5V4p5h3lhBdhG0-IKHQ', // BobGTX
        'UCXwxCN1C5wXKrYZxk-t-K4Q', // ImSan
        'UC9NW02f4-2c20dDStSoewBA', // Disar Animation
        'UCkehNCk4XGHCIXQiZ5Y8C7w', // TITAN CAMERA MAN IS THE BEST
        'UCGAkB7UJJgkuUgJmIDpzKZA', // PKR SHOW
        'UC50kFXc88nhTbssvkW9aF1w', // Girlfriend 7w7
        'UCVWa881fZYk6CgnaPQZ2IAA', // Alpha
        'UC4ExhL_rliDVKYLCU0fASQA', // Kayoko
        'UCD93n3ON_5KX6BDwl0IHezQ', // Gatman3033
        'UCQknKKnwlpzDS7bjMULUjcg', // sum
        'UCzeGuwia6Ac4A5d2Rh8FJ7g', // Mimss gacha
        'UCLRLbvBw0nA-o1xHY5871SA', // Anishok 2
        'UCEKCU6GS5fzu3qQhSFYbqig', // Lucutik
        'UC1PmDUEduj6cu37X--pVe0w', // GALAxySenpai Ch.
        'UCX9bRQrpt56nt1P_5VhimVA', // orako bat ^_^
        'UCGtG3La2FuYHuvOTE24OhMg', // `ArlettaRawrrr🕷️
        'UCCJS5Mu0q0BGYTS4NRgHPUQ', // What if Animation
        'UCk7ssty0Bqi8_8V6Pciz5lg', // PoppyZoneR63
        'UCOy5iE8aG5JZ1NUYWXBGalg', // GoipMan Anims
        'UC8aJFCPMd4GXwJgLCjjFsww', // SANT!N
        'UCH8FpDNjZtcCa_qB271rKIw', // Pejuang profit
        'UC_bewnFiwc3UlXzPie-2qfQ', // Chill Viewer
        'UCCn62cYVpl0e_GN-yo1H9yQ', // mashed
        'UC2V1ul4ul85kac0Y81wXTqQ', // Kwite
        'UCVdZRHsyvTruUWY2PjQkKEQ', // cemi𓍢ִ໋
        'UCnFiU5kxDwo9FHIYBxc827A', // AntonyBRB: shorts
        'UCdlRVQuG8LDke5KUcg9vbGA', // Zone 69
        'UCYHsjqj3Tm2Iz5vmcnIa6hQ', // El Sombrero de Mona
        'UCK0455034E3Aqxks3krzpkQ', // Pile Driver vs Gaming
        'UCEkw75Xaz_WWO3UlYDVNKCw', // Uni44
        'UCbnvcv8ar_R3q8eGpiAc3Sw', // MEXICAN UNCLE
        'UCrKLQNsUOdEEvS14u8wDK7A', // Rule34 Zone
        'UCEe3zrOJNlCjqjHzaPwIVhw', // Rulekun2
        'UCwW890m2ukV2tGr4zglW2Hw', // Duerandrop 355
        'UCMx71OPzNIftzzrvZmb3ZeA', // ChaolinToons (OGISM)(GCIM)
        'UC5dk0p_QBmJKyBlQehXMHmA', // Missy Bel's Realm
        'UCmhR1SLH9gjyV9ssMfOwXSw', // Candles' Health and Sex Education
        'UCGk9IcAm_TIox9HCC4H8SiA', // Lloryd With
        'UCnvTNVHK1vEpYVDhL6arWYw', // Mon-Supes
        'UCZg7oZXUzGuiqZG6zDgahqQ', // RuleKami
        'UCUF7wgYAcotBS7yy8vIN3jA', // Dean Animations
        'UCjXxnwYMVFh1ewAMLECYewg', // ShadowLynx6
        'UC_WUp1CcR16wGTixchsjNKg', // AgenteConfusión
        'UC9wnQR321rnX1g6uhJ84X9Q', // Wasabi Clips [Vtubers]
        'UCRWtQBm48X_KB8HANjr7_gA', // Liana
        'UCsfAFhyc2FaMueIOcNYqMUA', // Worst.
        'UClPj_VKQOuRBlYfpAvg810Q', // xBLACKSTAR
        'UCfEtJbNjktdSQKl70iGnV_Q', // SauceSan
        'UC2niwPGgiZ2J0G4mwMChLRA', // @fahrimois
        'UCsiXtBN7eaUMWR-QkVB_pzQ', // Anime Shorts Sama
        'UCu3qHXj1SONva7jP1Zd4JIg', // Flying S'more
        'UCyn1918ULy-zrYKEkUP9Zog', // Whacka jm
        'UCbZ5k7BpGsdUumsnRaT1KMw', // Dr. VideoGames And Memes
        'UCsv-2yV3eMXc_OGj-1DexoQ', // Subscribe To Ending4u
        'UCSuVvJFr2KV1NdKNWuTelPg', // Mairusu
        'UCJQCc9KJ8s_bxJ3WKh5Fumg', // ItsCoryeo
        'UCUuaLmzoWAS_BKW6T1nnD6g', // Aerius
        'UCJ-jgTJ1p4Tq2EaJJwkXRGQ', // Kuruippu Dayo
        'UCADCJG5Q8fkpgAUEjwc2W_g', // Alexander loves sun
        'UCwBIXYD_TC-ztR327Mwry2w', // The Cuckoo Show
        'UCJInRNVHsJ7q3c96dGXHK3Q', // •La Prodigiosa•
        'UCDvP0BOY865H7aLvSu3a0Hg', // NiXxY 2
        'UCvXo51h0xzrU5SbZKcDmycQ', // venezonalito morocho13 playground 😈
        'UCIcg7-9-soEAsyEFWlW9RtQ', // El tío Muñaño
        'UC1xYGam4mITtUoCdF-NC4Rg', // TM2 SMG
        'UCMeCq8YGTxxTiySg_goAQpA', // Shiyoern Senpai
        'UCBBU7zUOhR_qShfMV26UUCA', // Nux Taku
        'UC9bdra1twXbcvnt1ilVhjmg', // Jeffrey & Benson
        'UCAnIP_k-054_HIUYGv0TKqA', // HAMBURGUESAsaber
        'UC5iK6nCUkP-XvgBF30Kkq0Q', // Gingeinodaups And Firekaborayan
        'UC3GvdAXb9FslQ1AbLIS5mXQ', // Android 34
        'UCc8c91UBpHBcH5bZXLN-Jrw', // KissAnime
        'UCNelwgmpYJHWpNWTn8IaHaQ', // upgraded titan cameraman
        'UCMdl1oqjLFXKiWXSxrOu6Fg', // HakuchoLatex
        'UCMiBVk5Gn4SAYKCO8KF9OOA', // Jason Garza
        'UCTy8Y-v1e-qip_dwmhcf5wQ', // Tea! @silly:3
        'UCdIQW5tfpES5Ll0kTMibDIA', // Lextorias
        'UC0RO0RGDWZwRSMg_4AsUuYw', // animeme
        'UCnihGK_JNUYF2fdC-tQluQw', // coisas aleatórias
        'UCZUzyI3BRt8z2huLyNS4Unw', // Julbox
        'UCq84lllunOzin0yXZGHnXYA', // Señor gato
        'UCdXcgP3qnc28xdcEzfdNsDA', // ★Furro Fan de Timba★
        'UCFMtfouLQBKMNUeoJsmklfA', // 💜•Gacha-Pauli•💜
        'UC8IUgI_taLq1XypHSt18cBA', // ❤️ YuliGacha TV ❤️
        'UCWOhOV8AucYfWF_rIsinPTQ', // ●_●Dylan *_*
        'UCf9IHE--EaP6zeKUfhiu1ig', // Janeth OuO
        'UC8s64eZmjaEB6thCaR9jkZQ', // AILE_SEMPAI
        'UCkzTB50MGO-kCnLEqqG415A', // ♡Mari_dust♡
        'UCdNgRdpNlNGIfqkbwsq44Bg', // Bad Rabbit
        'UCpqLeCVs85EvsMtxs9AdEuA', // Milky Animations
        'UC97C6-bNHtKjwcMmFYd5Rvw', // Iscrem girl
        'UCYFKFf7nIPsiVeMD3TQNqRQ', // Kai Amuro FD
        'UC4JBlR_5Fb2XNh3f-XKucCw', // nokurlo am dub
        'UC76iCjy-aSs5NiwPkGA4NDQ', // BlueHeart Dubs
        'UCGcLZwPIaxbJ3hGoAdJlZDg', // Kuro Wolf Knight
        'UCNOpOyRXR1fQ6IZeH60d6Ug', // Chamel Dubs
        'UCPFEtNRUn0GEpkNB38-TmfA', // GaoGaiKingTheGreatVA
        'UC4ixSA8_ihdUpazk0rv73HQ', // Pixie VO
        'UCGVT6E5sAeCbchzKRwISUMw', // Lou's Dubs
        'UC9dmt12Gi-xJry_U5gADZyA', // Blue fox Plush
        'UC9kS-fjEZXAFIxJht--Gzig', // Aduubo
        'UCfpJTphk-IGm-XKMSkWnO4w', // Hazbin Fanworks - Comic Dubs
        'UCN6yaKdepLDWjsfX7Yy5OvQ', // COMBIS
        'UCBAa-Mep6HfV8E_QfmKdKkg', // Antoni Tabla Sonic Covers
        'UCk6zj5V4swBbDZwxDge2hAA', // Devy-D
        'UCORLlk5ooHH_hs-tHEAz3tg', // Daisy`s Comics
        'UCxAvWiU0ovMU9LI5nAX9pag', // Rocky Rakoon
        'UCuzuP8jBX1Rb2MfdfIJzdpA', // pi geon
        'UCaytIPSPoQswy2Oqb76mQ_A', // POKERFACE
        'UCzT73gKv9LH9MhIZa14VQNA', // EBF MUSIC
        'UCxjaqMCRrUFXEMcDO6r0ngw', // Mlg’s Transit!
        'UCPutLlg6TUWKBWpnp515R4w', // Mikurule34
        'UCDLU7UERq5AqrZBB5UkwgmA', // TheRedmation
        'UCrVSR_eTan2AruUvDQuefRw', // WilloFazArte
        'UCflylRstsfXcG6JwjOmktRg', // Nevermind
        'UCmokYipj3WLLlt8WrPUocxg', // RK VLOGS
        'UCVptnyE-1w5UoRUDQA--J3Q', // Weebs Territory
        'UCqMvR3_bFPtbQv4dbHFfilA', // Aysrel Eroshulm
        'UCBZoGxO47d4Zb0MwEbRyPqQ', // D-LUX
        'UC6hC5_g4JVKYGBJ23DkgUHg', // ~Gacha_vore_accaunt~
        'UCIMG4T7C6JP2GXFmFrqbt7Q', // Peachmisu
        'UCQ6zmfrsN5iJS0Ah6n3R0AQ', // Cross nl
        'UCm6cn3ncWr_8eIKlW1a8IxQ', // VDZ Games
        'UCpFqwO64i3P3XRp0TZpDq8A', // MARMILEDI SEBASTIAN
        'UCGZwpWL5n0zN8yNXRh_HtQA', // Elany_vore
        'UCDH4VwydvdWNCOUtV4JGNww', // Steam On Deck
        'UChZA5rqc5EM56tpEFhvG5Nw', // FAT UNIVERSITY
        'UCQeKnRFxNerjEk-71MjyPeA', // KUKRETUZA
        'UChM_VJw6W4pN-ILv5Fe4R_w', // T.G.Animation
        'UCBZEL0hguMlvNO-r3iZkd9w', // CouRage Reacts
        'UC0Yz_HCRmJZQeDtwtOZqQeQ', // CD Mill
        'UCxuDpPPA0htwM2-xXOuKwqQ', // Random Dudes
        'UCuvqxHNgkejJlnLSGXixOig', // Mr Kamal
        'UC6ARIuw49oCRMtm6CECufmA', // Kavex Channel
        'UCN_LIIiCPHQ5UMbwHz1S9rw', // BRIGHT 360 VR
        'UCiFvJHlhGHgHufH8Qxt0m0w', // RICHLEV
        'UCBaJVMx5fcWOHsmPH3IxKKQ', // Wubzzy
        'UCrJES2nHaS3so8yxoreKapQ', // Animatedgoddess
        'UCFOcZ5as0OeNzpBmo-O654w', // Canada Drew
        'UC3SZsAIEuqV43E9VUE65Uaw', // Prince Ohakam
        'UC2--GpCAPjQiZJUajBDthlw', // Jonny Englsh
        'UC7lwShdn-od_KOJrl0qIPyw', // 슬롯여신[소연]TV
        'UCB9CoSqU7SQseQRX5IoJM_g', // Meriel
        'UClO4dN-cmh3GL1mz3vf7s1Q', // TzuNamii
        'UC-3Hil-SglzWOnDMCM5D0LA', // SimbaThaGod
        'UC4anWIJB8bPmT-ZzfDOfA9g', // Dickhead
        'UCfQO8HHAHVlywfnZ6jw0CJw', // Thirdy
        'UCZl4BbEkxPWHdXdeieHAq7A', // Dominic and jolteon
        'UCEXkbdMpPGQmYCszziNDj-Q', // The Best of Compilations
        'UCTsCyHqGrWGr4A6RaqnfthA', // blank4
        'UCKC725227kUrIiW-52TESyw', // CartierFamily
        'UCHdTVw89QU6coU1MgN-9RHA', // GorTheMovieGod
        'UCRuDNoPURwSu0CgOV8IfZgA', // anzutops777
        'UCzeKXO9CxuHK_WG3MHJwiBw', // Vanessa Pilar [MSA Official]
        'UCqJ1kR4HAOImWZj7971TRqw', // Teenzy Crew
        'UCFVHovBie6A-O3NC9oqdLSg', // lemon animations
        'UC_oj8aZJAy-kTPG1GP8nXVg', // Ph!lippin3s
        'UCZS2G7zuu4tG_k-wackAr1Q', // de4ler
        'UC9_YTn1GavgpSnDDtnhPgfQ', // 55+ OCs guy
        'UCPnGjtlu5PWXe0AEmp28egQ', // DandyReneXboxAngel279
        'UCsSeToq5g_dq8wXNxuFohBA', // R34kun
        'UCkvAKTNEei8s2bjrEZAAW3g', // COM4YOU - Comic Dubs
        'UCOYe0OnlBFMoE6hjOCnTLCg', // Oxaya design Pro
        'UCuH-IRNxtdiQ-lCFbb-rdGA', // BarinaAnimator
        'UCzdDCZXwVRfSrnkCYYibWyQ', // YTComicsToyolunaxx
        'UCKidLSGK8uu-ZsbWRqZO8XQ', // Opal Toons
        'UCtoE1tBJPuxplCCs7B-LIFQ', // Klasss
        'UCCQ5YLEbnwzOu64InYjn4xg', // CatToon
        'UCSERqQ4GYp3Hlb-6nlEucmQ', // 𝑆𝑙𝑎𝑣𝐾𝑜𝑟𝑡
        'UC8WqrQBw5xsVn3dBGHitkvg', // Anime Replay Hub
        'UCrT3C5OutvMqNHbg9-GtDuw', // MALON
        'UCSWx1oQ6OVDnXfuW_eiGTfg', // NismanXD
        'UCAjvu6phQO6J_-Dx0axdjCA', // Dжент 2.0
        'UCnWRjdYCwAiGIJ-2jLZE2fQ', // BIG IMP
        'UCEpsdhNM_g66uruDjscH3kA', // ThunderFX
        'UC52HJ8kjIEU062Lq22SxQxw', // Determine
        'UCnilOJap_DoasQkovXY7pzA', // ball_5656
        'UCOT3XvPm2pc8bD0ldQjUbeA', // Rule 34 Kun
        'UC6f_a_GazhKu5sYCe6SP5iw', // KitKatz345
        'UCtWzoQzznj6yXBWduHfGTwQ', // killexe
        'UCkLYMCskzXMby7uuYJy4Vew', // 🍬 Pizzelle 🍬
        'UCrVHlmiR7R5iZtn6zvkYLfg', // Daebom
        'UCyVfm89Sw62xvDbYb37jfJA', // Mitrass
        'UC4eYM8s9kJeztY9gk62OeSg', // FantazyKatt21 YT
        'UC98FqLb-fljVb4l6e_FdWjw', // PEAR哥
        'UCT25C9zy0369O_ehz0eCeeQ', // Devidration “Dave Otniel”
        'UCI64u4Yzpon2SUqc8wXm9FQ', // Elexheart
        'UCoXk0KgUxzNxoAWqZU5G9rw', // OnTheRise
        'UCl-C7imRZJATZ9UgL0qf9wA', // Gamar 0710
        'UC34kGAogKZvSS9e47NmSnCg', // Solus Astorias
        'UCZDwFs-fp3pVqoBZJ05NcqQ', // kc1610
        'UCuZu1x8e5wMskddpBLO2sqQ', // SP HOT NEWS
        'UCHXz9ujbxHp5l51xEy2T70Q', // ستوريات HD
        'UC0XXjZ3gODmDYTrKpvb3Vqg', // SK Nehal_ gaming
        'UCM30Utw40PYZTGgvrMXNuWw', // Kurlyheadmarr
        'UCOsiUGr6QDJ14qCF3714cPA', // Pha nun ff
        'UCRWYJQkkdvpo-N-xJ9M6nlQ', // The camera man…
        'UC1DAYpC7BqoPiE0n2gQP0Ow', // MrCemtur
        'UCetvekJS7MgMeTC7kvpABLg', // TorridBlu
        'UCGda6vVs1fIGju66hHHDMsg', // gore animator
        'UC8Avfy0Kxm0UbstdsgTJ0qg', // مستر بريتل
        'UCi2vipYHjRcs701oJrzHdrg', // داكلر
        'UCEK23jBR5usp6wF3EYEEU1Q', // Mingi ming
        'UC0XFkgDxTpEG_0ZWC8U3ZJA', // Cuenta Brasileña
        'UCupIzdeLlfPDTzoobFJZ7HQ', // شهد ال فشيله💖.
        'UCFVVCg0cd0OBsJBcf8biNkA', // saleh abdalla
        'UCraObTGXj7LbyQbSFwCOI4Q', // has2
        'UCxp0bT2WIQRylhMrDxtZRxQ', // glassbooty
        'UCSxlLLKVB8ZHKZOGOgMbqtw', // Gran Autismo
        'UCEXC0TWysHfxHr96hVE28iw', // zabloing
        'UCq3CZDXaYywVyvqWbB_87ww', // DREZ YT
        'UCR4poWYia9BryPmPuuIf92g', // Suavesuave suavecito
        'UC4EXBjVM8YmhN0GKJHgMqRw', // BN FIRE
        'UCT1ojOWYG0yBHigeiSsgebA', // Jazmine Fox
        'UCWrVOD_amL7LgMDBQ75UCcg', // PuedecitoRD
        'UCTsLCQXtHQbT-g9wCLdR2WA', // MorthyRosas
        'UClSopyk6ud45cS-45t_yloA', // El Informante !
        'UCroBuCLF3nj8dlk5fozEIuw', // RIOPLEY
        'UCeYb5W9Wc5pDrezZ-OrW-hQ', // Tyger Lyrics Shorts
        'UC-GKXw7ByZRK7sz7NCnLMpQ', // Jesus Campoz
        'UCGSYf4DHE2F52SFQciCFnLg', // Para fanatico
        'UCU2ax8S0owrS3r4HjONaLDA', // Darlin vid
        'UCdYo4S3hV8ZTtCWHKc0rJBA', // DANJELO MEDINA
        'UClIitlvkQ_Pekjxaw-2l_bg', // UK voice
        'UC6_pAvfT0U05lW79NxbgG1g', // LoFi Baby
        'UCMqIhkHe7inls-7fYDdem7Q', // Junior Gonzalez
        'UCDZQqL35UDJ2KSm6fy__nWw', // EnderTriesToAnimate
        'UC2TBaTjjdWRE1jXhvtNuIPw', // Huetito - Vtuber Clips
        'UCWj39o5iBuiq4HKJlV2_ZJw', // El Caballero Chilango
        'UCSaMJOS0VBuoolEQn6QRbvw', // ElMejorLechero
        'UC98-GD-o_N1sFfN5Eun76LA', // NeroMai
        'UCRd41MwpGxblnxK6o6HQoDg', // Mr.Waffle
        'UCXfj0IvS326kyR_Jb4X0XlQ', // Jefmelor06
        'UCyAGbpcdcl9Upq75jeBo37A', // JAVI
        'UCliFT5uWGon9yc6buF-t7HQ', // Grindsons 2
        'UCEztcW0S6qwHAUknD8je3wQ', // 学君
        'UCNgJMSq9onkoqN1_pWAxOwg', // Federico
        'UCOxMvTZknfXIPoTCFcHAtUQ', // execsdll£scort412
        'UCT2_eUDgj08gxutkefdk64A', // Tripheny♡ 𓃠𓅿𓂻𓃱𓃗𓅓
        'UC2Q0jN95RF1__amg0kBuSFA', // Logro Raro
        'UCSdhj25L31Fp7OvVH0bwxuA', // W.d. gaster
    ];

    // Función para verificar si un video es NSFW
    function isNSFW(title, channel) {
        const lowerTitle = title.toLowerCase();
        const lowerChannel = channel.toLowerCase();

        // Verifica si el título contiene palabras clave NSFW
        const hasNSFWKeyword = nsfwKeywords.some(keyword => lowerTitle.includes(keyword.toLowerCase()));

        // Verifica si el canal está bloqueado
        const isBlockedChannel = blockedChannels.includes(lowerChannel);

        return hasNSFWKeyword || isBlockedChannel;
    }

    // Función para bloquear videos NSFW
    function blockNSFWVideos() {
        const videos = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer');

        videos.forEach(video => {
            const title = video.querySelector('#video-title').textContent.trim();
            const channel = video.querySelector('#channel-name').textContent.trim();

            if (isNSFW(title, channel)) {
                video.style.display = 'none'; // Oculta el video
                console.log(`Video bloqueado: ${title}`);
            }
        });
    }

    // Observar cambios en la página para bloquear videos dinámicamente
    const observer = new MutationObserver(blockNSFWVideos);
    observer.observe(document.body, { childList: true, subtree: true });

    // Ejecutar la función inicialmente
    blockNSFWVideos();
})();