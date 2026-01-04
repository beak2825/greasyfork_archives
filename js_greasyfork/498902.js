// ==UserScript==
// @name MooMoo styles
// @namespace http://tampermonkey.net/
// @version 4.1
// @description Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @author Gaston
// @match *://moomoo.io/*
// @match *://dev.moomoo.io/*
// @match *://sploop.io/*
// @match *://sandbox.moomoo.io/*
// @match *://tjmoomoo.ml/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addValueChangeListener
// @grant GM_info
// @grant GM_xmlhttpRequest
// @grant GM_info
// @grant GM_info
// @grant GM_info
// @license MIT
// @name:en MooMoo styles
// @name:da Moomoo Styles
// @name:ar أنماط موومو
// @name:es Estilos de moomoo
// @name:fi Moomoo Styles
// @name:de Moomoo -Stile
// @name:bg Стилове Moomoo
// @name:cs Moomoo styly
// @name:eo Moomoo -Stiloj
// @name:el Στυλ Moomoo
// @name:it Stili moomoo
// @name:ko Moomoo 스타일
// @name:hr Moomoo Styles
// @name:he סגנונות Moomoo
// @name:ka Moomoo Styles
// @name:mr मुमू शैली
// @name:hu Moomoo stílusok
// @name:id Gaya Moomoo
// @name:ja Moomooスタイル
// @name:fr Styles moomoo
// @name:pt-BR MooMoo styles
// @name:nb MooMoo styles
// @name:ro Moomoo Styles
// @name:ru Moomoo Styles
// @name:sk Štýly Moomoo
// @name:sv Moomoo -stilar
// @name:pl Style MOOMOO
// @name:sr Моомоо стилови
// @name:nl Moomoo Styles
// @name:th สไตล์ Moomoo
// @name:zh-CN Moomoo风格
// @name:vi Phong cách Moomoo
// @name:zh-TW Moomoo風格
// @name:fr-CA Styles moomoo
// @name:tr Moomoo Styles
// @name:uk Стилі Moomoo
// @name:aa MooMoo maagaxxi
// @name:ab MooMoo астильқәа
// @name:ckb ستایلەکانی مووموو
// @name:ug Moomo styles
// @name:ast MooMoo styles
// @name:ae MooMoo styles
// @name:ba MooMoo стилдәре
// @name:af Moomoo Styles
// @name:ak Moomoo Nneɛma a Wɔde Yɛ Nneɛma .
// @name:am MoOOOOOOOs ቅጦች
// @name:as Mooomoo শৈলী
// @name:ay Moomoo ukax mä jach’a uñacht’äwiwa.
// @name:av MoMoo стили
// @name:az Moomoo üslubları
// @name:bi MooMoo styles
// @name:bh MooMoo styles
// @name:bn মুমু স্টাইলস
// @name:ca Estils Moomoo
// @name:bs Moomoo Styles
// @name:ce MooMoo стилаш
// @name:bm MOOMOO Stilis .
// @name:be Moomoo Styles
// @name:bo མོ་མོ་ཡི་རྣམ་པ།
// @name:br Doareoù MooMoo
// @name:cr MooMoo styles
// @name:chr MooMoo styles
// @name:cu MooMoo styles
// @name:dv މޫމޫ ސްޓައިލްސް
// @name:co Stili di Moomo
// @name:ch estilo MooMoo
// @name:ceb MOOMOO PETLES
// @name:cy Arddulliau moomoo
// @name:cv MooMoo стилĕсем
// @name:dz མུ་མོ་བཟོ་རྣམ་ཚུ།
// @name:ee Moomoo ƒe Atsyãwo .
// @name:fil Mga Estilo ng Moomoo
// @name:fa سبک های Moomoo
// @name:fy Moemano Styles
// @name:ff Ko styles MooMoo
// @name:et Moomoo stiilid
// @name:fo MooMoo stílar
// @name:fj Vinaka
// @name:ga Stíleanna Moomoo
// @name:eu Moomoo estiloak
// @name:ho MooMoo styles
// @name:gsw-berne MooMoo styles
// @name:gd Stoidhlichean MooMoo
// @name:gl Estilos de Moomoo
// @name:hmn Moomo Cont
// @name:hi मूमू स्टाइल्स
// @name:ha Moomoo Styles
// @name:gu મોર શૈલીઓ
// @name:gv Stiydyn MooMoo
// @name:gn Estilos de Moomoo .
// @name:ia MooMoo styles
// @name:ik MooMoo styles
// @name:hz MooMoo styles
// @name:ie MooMoo styles
// @name:ht Moomoo Styles
// @name:is Moomoo stíll
// @name:jv Gaya Moomoo
// @name:ig Style Styles
// @name:hy Moomoo ոճերը
// @name:iu MooMoo ᓴᓇᒪᓂᖏᑦ
// @name:kj MooMoo styles
// @name:ks MooMoo styles
// @name:ki MooMoo styles
// @name:km រចនាប័ទ្ម Moomoo
// @name:kk Moomoo стильдері
// @name:kl MooMoo-mik stilit
// @name:kn ಮೂಮೂ ಶೈಲಿಗಳು
// @name:kr Fasalwa MooMoo
// @name:kg Ba style ya MooMoo
// @name:ku Styles Moomoo
// @name:lif MooMoo styles
// @name:kw MooMoo styles
// @name:la Moomoo Styles
// @name:lo ຄໍເຕົ້າໄຂ່ທີ່ Moomoo
// @name:ln Moomoo Styles .
// @name:lg Emisono gya Moomoo .
// @name:lb Moomoo Stiler
// @name:kv МуМу стильяс .
// @name:ky Moomoo Styles
// @name:lt „Moomoo“ stiliai
// @name:mo MooMoo styles
// @name:ms Gaya Moomoo
// @name:mk Моомо стилови
// @name:ml MOOMOO ശൈലികൾ
// @name:mn Moomoo styles
// @name:mh Moo Moo Moo
// @name:mt Stili Moomoo
// @name:mg Moomoo styles
// @name:mi Nga momo moomoo
// @name:lv Moomoo stili
// @name:nd MooMoo styles
// @name:nn MooMoo styles
// @name:ng MooMoo styles
// @name:nv MooMoo styles
// @name:na MooMoo styles
// @name:ny Masitayilo
// @name:my Moomoo စတိုင်များ
// @name:nr Ubusuku ubukhulu .
// @name:ne Moomo शैलीहरू
// @name:oc MooMoo estils
// @name:rm MooMoo styles
// @name:pi MooMoo styles
// @name:pt-PT Estilos Moomoo
// @name:or Moomoo Styles |
// @name:pt Estilos Moomoo
// @name:qu Estilos Moomoo .
// @name:pa Moomoo ਸ਼ੈਲੀ
// @name:om Akkaataa Moomaa .
// @name:os MooMoo стильтæ
// @name:ps موومیو سټایلونه
// @name:sco MooMoo styles
// @name:sc MooMoo styles
// @name:sh MooMoo styles
// @name:se MooMoo stiillat
// @name:sg MooMoo style
// @name:rw Moomoo
// @name:rn MooMoo imideri
// @name:sd مومو اسٽائلس
// @name:sa मूूम शैली 1 .
// @name:si මොමූව් මෝස්තර
// @name:syr MooMoo styles
// @name:sw Mitindo ya Moomoo
// @name:sn Moomoo Styles
// @name:sm Motooo i sitaili
// @name:st Litaele tsa Moomoo
// @name:ss Tindlela te-MooMoo
// @name:su Gaya momoo
// @name:so Qaababka momooto
// @name:sq Stilet e Moomoo
// @name:sl Moomoo Styles
// @name:tl Mga Estilo ng Moomoo
// @name:tk Moomoo stilleri
// @name:tn Ditaele tsa MooMoo
// @name:tt Moomoo стильләре
// @name:ta மூமூ ஸ்டைல்கள்
// @name:te మూమూ శైలులు
// @name:tg Услубҳои MOOMOO
// @name:ti ቅዲታት ሙሞ
// @name:to MooMoo ngaahi sitaila
// @name:ts Switayili swa Moomoo .
// @name:tw MooMoo styles
// @name:za MooMoo styles
// @name:ur موومو اسٹائلز
// @name:yi מאָומאָאָ סטיילז
// @name:uz MoMoo uslublari
// @name:ve Zwitaila zwa MooMoo
// @name:wo stilu Moomoo
// @name:xh Izitayile ze-moomoo
// @name:ty Te mau hoho'a MooMoo
// @name:yo Symoo styles
// @name:zu Izitayela ze-moomoo
// @description:en Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:de Moomoo.io/sploop.io mod [Texture Pack Editor/ Music Player/ Hat Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:el Moomoo.io/sploop.io mod [Επεξεργαστής συσκευασίας υφής/ Music Player/ Hat Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:cs Moomoo.io/sploop.io mod [texturní balíček editor/ hudební přehrávač/ klobouk keyBinds/ hudba vizualizátor/ přepínač kůže/ anti-kok/ automatické přihlášení]
// @description:ar moomoo.io/sploop.io mod [محرر حزمة الملمس/ مشغل الموسيقى/ القبعة keybinds/ music visualizer/ skin switcher/ anti-kick/ auto login]
// @description:eo Moomoo.io/sploop.io Mod [Tekstura Paka Redaktilo/ Muzika Ludilo/ Ĉapelo Klavoj/ Muzika Vidilo/ Haŭta Ŝaltilo/ Kontraŭ-Kick/ Aŭtomata Ensaluto]
// @description:da Moomoo.io/sploop.io mod [tekstur pack editor/ musikafspiller/ hat keyBinds/ musikvisualizer/ hud switcher/ anti-kick/ auto login]
// @description:bg Moomoo.io/sploop.io mod [Редактор на текстурен пакет/ музикален плейър/ шапка ключове/ музикален визуализатор/ превключвател на кожата/ анти-удар/ автоматично влизане]
// @description:fi Moomoo.io/sloop.io mod [tekstuuripakkauseditori/ musiikkisoitin/ hat Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Automaattinen sisäänkirjautuminen]
// @description:es Moomoo.io/sploop.io mod [editor de paquetes de textura/ reproductor de música/ keybinds/ music visualizer/ skin switcher/ anti-kick/ inicio de sesión automático]
// @description:id Moomoo.io/sploop.io mod [Editor Paket Tekstur/ Pemutar Musik/ Hat Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:ko moomoo.io/sploop.io mod [텍스처 팩 편집기/ 음악 연주자/ 모자 키 바인드/ 음악 시각 자/ 스킨 스위처/ 킥/ 킥/ 자동 로그인]
// @description:it Moomao.io/sploop.io mod [Texture Pack Editor/ Player Music/ Hat KeyBinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:fr Mooomoo.io/splophy.io mod [Texture Pack Editor / Music Player / Hat Keybinds / Music Visualizer / Skin Swither / Anti-Kick / Auto Connexion]
// @description:he Moomoo.io/sploop.io mod [עורך חבילות טקסטורה/ נגן מוסיקה/ כובע מקש/ מוסיקה Visualizer/ Skiner Stringer/ Anti-בעיטה/ כניסה אוטומטית]
// @description:hr Moomoo.io/sploop.io mod [Uređivač paketa teksture/ glazbeni uređaj/ hat keybinds/ glazbeni vizualizator/ preklopnik kože/ anti-kick/ automatska prijava]
// @description:ja Moomoo.io/sploop.io mod [テクスチャパックエディター/音楽プレーヤー/帽子Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:hu Moomoo.io/sploop.io mod [Texture Pack szerkesztő/ zenelejátszó/ HAT KeyBinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Bejelentkezés]
// @description:mr Moomoo.io/sploop.io मोड [टेक्स्चर पॅक एडिटर/ संगीत प्लेयर/ हॅट कीबिंड्स/ संगीत व्हिज्युअलायझर/ स्किन स्विचर/ अँटी-किक/ ऑटो लॉगिन]
// @description:ka Moomoo.io/sploop.io mod [ტექსტურული პაკეტის რედაქტორი/ მუსიკალური პლეერი/ ქუდი კლავიშები/ მუსიკალური ვიზუალიზატორი/ კანის შემტევი/ კისერი/ ავტომატური შესვლა]
// @description:pt-BR Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:nb Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:ru Moomoo.io/sploop.io mod [Редактор текстурных пакетов/ музыкальный игрок/ шляпа Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:th moomoo.io/sploop.io mod [Texture Pack Editor/ Music Player/ Hat Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:sr Моомоо.ио / сплооп.ио мод [Тектуре Пацк Едитор / Музички плејер / шешир Кеибиндс / Музика Висуализер / Скин Свитцхер / Анти-Кицк / Ауто Логин]
// @description:nl MOOMOO.IO/SPLOOP.IO MOD [Texture Pack Editor/ Music Player/ Hat Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:sk MOOMOO.IO/SPLOOP.IO MOD [EDITOR BALUCKÉHO PACIEK A AND MUSIC/ HAT KEYBINDS/ Hudba vizualizátora/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:ro Moomoo.io/sploop.io Mod [Texture Pack Editor/ Music Player/ Hat KeyBinds/ Music Visualizator/ Skin Switcher/ Anti-Kick/ Conectare automată]
// @description:sv Moomoo.io/Sploop.io Mod [Texture Pack Editor/ Music Player/ Hat KeyBinds/ Music Visualizer/ Skin Switcher/ Anti-kick/ Auto Login]
// @description:pl Mooomoo.io/sploop.io mod [edytor pakietu tekstury/ odtwarzacz muzyki/ czapkę kluczowe/ muzyczne wizualizator/ przełącznik skóry/ anty-kick/ auto login]
// @description:vi Moomoo.io/sploop.io mod [Biên tập viên gói kết cấu/ máy nghe nhạc/ hat keybinds/ music Visualizer/ skin Switcher/ anti-kick/ auto đăng nhập]
// @description:zh-TW moomoo.io/ sploop.io mod [紋理包編輯器/音樂播放器/帽子鑰匙扣/音樂可視化器/皮膚切換器/ anti-kick/ auto登錄]
// @description:tr Moomoo.io/sploop.io Mod [Doku Paketi Düzenleyici/ Müzik Oyuncusu/ Hat Keybinds/ Müzik Görselleştirici/ Cilt Değiştiricisi/ Anti-Bick/ Otomatik Giriş]
// @description:zh-CN moomoo.io/ sploop.io mod [纹理包编辑器/音乐播放器/帽子钥匙扣/音乐可视化器/皮肤切换器/ anti-kick/ auto登录]
// @description:uk Moomoo.io/sploop.io mod [редактор текстурного пакету/ музичний програвач/ ключ-кейс/ музичний візуалізатор/ перемикач шкіри/ анти-kick/ auto Login]
// @description:ab Moomoo.io/Sploop.io mod [Текстура апакет аредатор/ МУЗИКАТӘИ АПЛЕЙЕР/АХАТӘЫЛА АМУЗЫКА АВИСУАЛИЗЕР/ СКИН СВИТЧЕР/ АНТИ-КИК/АВТО ЛОГИН]
// @description:aa Moooo.io/Sploop.io mood [fokkaaqoh batabih ayyuftitte/ MUSIC PLAYSER/ MUBUKOH FAXXIMTA/ FAXXIMTA/ FAXXIMTA/ KICI-KICKOUT LOGIN] kinni.
// @description:ckb MOOMOO.IO/SPLOOP.IO MOD [دەستکاریکەری پاکەتی Texture/ یاریزانی میوزیک/ کڵاوەی کیت/میسیک گێڕانەوە/ سویچەری پێست/ دژە لێدان/خۆ چوونەژوورەوە]
// @description:ug Moomoo.io/sploop.io mod [تېكىستلىك بوغچا) / مۇزىكا قويغۇچ
// @description:fr-CA Mooomoo.io/splophy.io mod [Texture Pack Editor / Music Player / Hat Keybinds / Music Visualizer / Skin Swither / Anti-Kick / Auto Connexion]
// @description:ae Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:ast Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:ak moomoo.io/sploop.io mod [texture pack editor/ nnwom a wɔbɔ/hat keybinds/ nnwom ho mfoniniyɛ/ honam ani switcher/ anti-kick/auto login].
// @description:af Moomoo.io/sploop.io mod [Texture Pack Editor/ Music Player/ Hat KeyBinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:ay moomoo.io/sploop.io Mod [Editor de pack de textura/ musica reproductor/Hat keybinds/ Music Visualizador/ Switcher de piel/ Anti-Copias/Auto Login]
// @description:as Mooomoo.io/sploop.io মড [টেক্সচাৰ পেক সম্পাদক/ মিউজিক প্লেয়াৰ/হেট কীবাইণ্ডছ/ মিউজিক ভিজুৱেলাইজাৰ/ স্কাইন চুইচাৰ/ এণ্টি-কিক/অটো লগইন]
// @description:av Moomoo.io/Sppoop.io мод [Текстура пакет редактора/ МУСИК ПЛАЙЕР/ХАТ КЕЙБИНДС/ МУСИКА ВИСУАЛИЗЕР/ СКИН СВИТЧЕР/ АНТИ-КИКК/АУТО ЛОГИН]
// @description:az Moomoo.io/sploop.io mod [tekstura paketi redaktoru / Musiqi pleyeri / papaq keybinds / musiqi vizualizmi / dəri dəyişdiricisi / anti-vuruş / avtomatik giriş]
// @description:ba Moomoo.io/Sploop.io мод [Текстура пакет мөхәррире/ МУЗИК ПЛАЙЕР/ХАТ КЕЙБИНДАР/ МУЗИК ВИСУАЛИЗЕР/ СКИН СВИТЧЕР/ АНТИ-КИК/АУТО ЛОГИН]
// @description:am ሞፊኦ.ኦ.ዮፕ.ዮ.ዮ.ዮ.ኦ.ኦ.ኦ.ኬ.ኬ.ኬ.ኬ.ኬ.ኬ. ጥቅል አርታ editor ት / ኮፍያ ቁልፍ ሰሌዳዎች / COME VIRTIZE / SAM SWITER / STAR MIX MATITE / AURDER MARTED]
// @description:bi Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:bh Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:br Moomoo.io/Sploop.io mod [Embreger ar pakad testenn/ PLAYER SEMIK/EO KEYBINDS/ MUSIC VUSULIZER/ SKIN SWITCHER/ ANTI-KEK/AUTOÙ AN AUT]]
// @description:be Moomoo.io/sploop.io mod [Рэдактар ​​тэкстуры пакета/ музычны прайгравальнік/ капялюш клавішы/ музычная візуалізацыя/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:bn Moomo.io/sploop.io Mod [টেক্সচার প্যাক এডিটর/ সংগীত প্লেয়ার/ হ্যাট কীবাইন্ডস/ সংগীত ভিজ্যুয়ালাইজার/ স্কিন স্যুইচার/ অ্যান্টি-কিক/ অটো লগইন]
// @description:ca Moomoo.io/sploop.io mod [editor de textures/ reproductor de música/ barret keybinds/ visualitzador de música/ commutador de pell/ anti-kick/ inici de sessió automàtic]
// @description:ce Moomo.io/Sploop.io мод [Текстуран пачка редактор/ МУЗИКАН ПЛИБИНДАШ/ МУЗИК ВИСУАЛИЗЕР/ СКИН СВИТКЕР/ АНТИ-КИК/АУТО ЛОГИН].
// @description:bm moomoo.io/sploop.io mod [Texture Pack Editor/ Musique Player/Hat Keybinds/ Musique Visualiser/ Skin Switcher/ Anti-Kick/Auto Login].
// @description:bs Moomoo.io/sPloop.io mod [Uređivač teksture / Muzički player / Hat Keybinds / Muzika Vizualizator / Skin Switch / Protiv-Kick / Auto se prijave]
// @description:bo མོའོ་ཨོ་.ཡོ་/སི་པལ་.ཡོ་མོ་ཌི [ཊེག་སི་ཊར་གྱི་རྩོམ་སྒྲིག་པ། ཤ་མོ་རྩེད་མཁན།
// @description:chr Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:cu Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:cy MOOMOO.IO/SPLOOP.IO MOD [Golygydd Pecyn Gwead/ Chwaraewr Cerddoriaeth/ Hat KeyBinds/ Music Visualizer/ Skin Switcher/ gwrth-gic/ mewngofnodi Auto]
// @description:cr Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:co Moomoo.Io/sploop.io MOD Pack Editor / Music Player / Music Player / Hat Teat Teatici / Music Visuals / anti-Kick / Auto Login]
// @description:ceb Moomoo.io/Sploop.io mod [Texture Pack Editor / Music Player / Hat Keybinder / Music Spiter / Auto-Kick Switcher / Anti-Kick Switch
// @description:dv MOOMOO.IO/SPLOOP.IO MOD [TEXCHOR
// @description:cv Moomoo.io/Splaop.io мод [Текстура пакетĕн редакторĕ/ МУЗИЧЕСКИЙ ПЛЕЙЕР/ХАТ КИЛĔН/ МУЗИКĂЛЛĂ ВИСУАЛИЗЕР/ СКИН СВИТЧЕР/ АНТИ-КИКК/АУТО ЛОГИН].
// @description:ch I fina'tinas-mu para i tinige'-mu BISISISISUU I KUALISISISISIO-mu TAUT INUTIO
// @description:dz Moomoo.io/Sploop.io mod [Texture ཐུམ་སྒྲིལ་རྩོམ་སྒྲིག/ མུ་སི་ པ་ལེ་ཡར་/ཧེཊ་ཀིབིནཌ/ མུ་ལི་ཟར་/ སི་ཀིན་ སིཝིཊ་ཅར་/ སི་ཀིན་ སིཝིཊ་ཅར་/ སྭིཊ་ཅར།
// @description:fa moomoo.io/sploop.io mod [ویرایشگر بسته بندی Texture/ Music Player/ HAT Keybinds/ Music Visualizer/ Switcher Skin/ Anti-Kick/ Auto Login]
// @description:ff Moomo.io/Sploop.io mod [Editor pack texture/ MUSIC ƊAƊƊAARE/ ƊUM WONI SWITCHER/ SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:eu Moomoo.io/sploop.io mod [Texture Pack Editorea / Musika Jokalaria / Hat Keybinds / Music Visualizer / Skin Switcher / Anti-Kick / Auto Login]
// @description:ee moomoo.io/sploop.io mod [Texture Pack Editor/ Hadzila/Hat Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/Auto Login].
// @description:fil Moomoo.io/sploop.io mod [Texture Pack Editor/ Music Player/ Hat Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:fo Moomoo.io/Sploop.io mod [Teksturpakki ritstjóri/ TÓNLEIKARI/HAVA HØVUÐSLOG/ TÓNLEIKARI VISUALIZER/ SKINN SWITCHER/ ANTI-KICK/AUTO LOGIN].
// @description:fj Moooo.
// @description:et Moomoo.io/splop.io mod [Texture Pack Editor/ Music Player/ Hat Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ automaatne sisselogimine]
// @description:fy Moomoo.io/sploop.io mod [texture Pack bewurker / muzykspiler / hat Keybinds / Muzyk Visualizer / Skin Switcher / Anti-Kick / Auto Oanmelde]
// @description:ga Moomoo.io/sploop.io mod [Eagarthóir Pacáiste Uigeachta/ Imreoir Ceoil/ Hat Keybinds/ Ceol Visualizer/ Switcher Skin/ Frith-Chic/ Logáil isteach Auto]
// @description:gsw-berne Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:ho Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:gn moomoo.io/sploop.io mod [Textura paquete editor/ reproductor de música/sombrero keyBinds/ Música Visualizador/ Interruptor de piel/ Anti-kick/Auto jeike].
// @description:gd Mooomo.io/SPLOOP.IO Mod [Neach-deasachaidh Pasgan Innealan / Cluicheadair Ciùil / Switcher Hiectional / MacKick / Auto Log a-steach / Auto Enger Log a-steach
// @description:ha Moomoo.i/sploop.io Mod [Rubutun kiɗa / Kiɗa Kiɗa / Skin Skin Skins
// @description:gv Moo.io/Sploop. mode [Then-Thentyr/MUSIC PLAYER/HAT ER NYNBINDS/SHEE ER NYN CHEET/CHENYN ER NIUST.
// @description:gl Moomoo.io/sploop.io mod [editor de paquetes de textura/ reprodutor de música/ hat Keybinds/ Music Visualizer/ Skin Switer/ Anti-Kick/ Auto Login]
// @description:hi Moomoo.io/sploop.io mod [बनावट पैक संपादक/ संगीत खिलाड़ी/ हैट कीबाइंड/ संगीत विज़ुअलाइज़र/ स्किन स्विचर/ एंटी-किक/ ऑटो लॉगिन]
// @description:hmn Moomoo.io/sploop.io mod [kev ntxhib lo lus / lub kaus mom Keybinder / Music Visualizer / Cov tawv nqaij hloov / Ntaus / pib nkag mus / Auto Auto ID nkag mus]
// @description:gu Momoo.io/sploop.io મોડ [ટેક્સચર પેક સંપાદક/ મ્યુઝિક પ્લેયર/ હેટ કીબાઇન્ડ્સ/ મ્યુઝિક વિઝ્યુલાઇઝર/ સ્કિન સ્વિચર/ એન્ટી-કિક/ Auto ટો લ login ગિન]
// @description:ik Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:ia Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:hz Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:ie Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:jv Moomo.io/SSPLOOP.IO Mod / pamuter musik / Hat Keybinds / Musik Visualizer / Skiter Kulit / Anti-Kick / Login Auto]
// @description:iu Moomo.io/Sploop.io [ᐱᓕᕆᐊᖑᔪᖅ ᐸᐃᑉᐹᖅ/ᐊᐅᓚᑦᑎᔪᖅ/ᐊᖓᔪᖅᑳᖅ/ᐊᒃᓱᕈᕐᓇᖅᑐᒃᑰᕐᓂᖅ/ ᐊᒡᒍᖅᑐᖅᓯᒪᓂᖅ/ᐊᐅᓚᑦᑎᔨ/ ᓯᑭᑑᖅ/ᑭᒪᓇᖅᑐᖅᓯ/ᐊᕕᒃᑐᖅᑎ-ᑭᖑᓇᖓ/ᐊᐅᓚᑦᑎᓂᖅ/ᐊᐅᒪᑐᖅ/ᐊᐅᓚᑦᑎᓂᖅ
// @description:is MOOMOO.IO/SPLOOP.IO MOD [Texture Pack Editor/ Music Player/ Hat KeyBinds/ Music Visualizer/ Skin Switcher/ Anti-spark/ Auto Login]
// @description:ig Miomdoo.oooop.oo mod [detude Pack Sector / Player Player / A na-ahụ egwu egwu / akpụkpọ ahụ / Auto Nbanye]
// @description:ht Moomoo.io/sploop.io mod [teksti pake editè/ mizik jwè/ chapo keybinds/ mizik visualizer/ po commutateur/ anti-choute/ oto login]
// @description:hy Moomoo.io/sploop.io mod [Texture pack խմբագիր / երաժշտական ​​նվագարկիչ / hat keybinds / music visualizer / մաշկի անջատիչ / Հակա-հարված / Auto Login]
// @description:ki Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:ks Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:kj Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:km moomoo.io/splop.io mod [កម្មវិធីនិពន្ធវាយនភាព / វាយនភាព / មួកគ្រាប់ចុច Headbinds / ឧបករណ៍ប្តូរស្បែក / ការចូលស្បែក / ការចូលទាត់ / Atti / Atti / Atti / Atti / Atti / Atti / Atti / At-Spin / Atti / Atti / Arte / Arti / Atti / Atti / Scon / Atti / Atti / Atti / Sce-Spin / Arte / Arte / Arti / Atti / Atti / Sce-Cuse / Auto)
// @description:kn Moomoo.io/sploop.io mod [ಟೆಕ್ಸ್ಚರ್ ಪ್ಯಾಕ್ ಎಡಿಟರ್/ ಮ್ಯೂಸಿಕ್ ಪ್ಲೇಯರ್/ ಹ್ಯಾಟ್ ಕೀಬೈಂಡ್ಸ್/ ಮ್ಯೂಸಿಕ್ ವಿಷುಯರ್/ ಸ್ಕಿನ್ ಸ್ವಿಚರ್/ ಆಂಟಿ-ಕಿಕ್/ ಆಟೋ ಲಾಗಿನ್]
// @description:kk Moomoo.iou/sploop.io mod [Текстуралық бумалық редактор / музыка ойнатқышы / Hat Кілтсөздер / Музыкалық визуализация / Тері ауыстырғышы / Anti-Corm / Auto Logine]
// @description:ku Moomoo.io/ploop.io mod [Nivîsarek Texture Pakêtê / Muzîka Player / Muzîka Keybinds / Muzîka Visualizer / Skincher / Login Login]
// @description:kg Moomoo.io/Sploop.io mod [editeur ya paquet ya texture/ PLAYER YA MUSIE/YO KE KANSI/ MUTIKU YA VISUALER/ SKIN SWITCHER/ ANNT-KICK/AUTO LOGIN]].
// @description:kr Momoo.io/Sploop.io mod [Rudi ruwobe/BE YIWO/KƏRMA KEYBINDS/KƏRMA/KƏNƏNGƏ YIWO/ SKIN SKIN-A KICK/KICK/AUGIN]
// @description:kl Moomoo.o/Sploop.io mod [Teksturpakke-editor/ MUSIC PLAYER/KEYBIDS/ PISSARSIARTORNEQ/ SKIN SWITKER/ ANTI-KICK/AUTO LOGIN]
// @description:kw Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:lif Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:lb Moomoo.io/sploop.io Mod [Textur Pack Editor / Musekspiller / Hutt Keybinds / Musekvalualizer / Anti-Kick / Autoservicer
// @description:lg moomoo.io/sploop.io mod [Ekiwandiiko ky'okupakinga/omukubi w'ennyimba/ Enkoofiira Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/Auto Login].
// @description:ln moomoo.io/sploop.io mod [Texture Pack Editor/ Music Lector/Hat Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/Auto Login]
// @description:la Moomoo.io/sploop.io mod [Texoure Pack Editor / Musica Ludio ludius / Hat Keybinds / Musica Visualizer / Skin Switcher / Anti-calcitrant / Auto Login]
// @description:ky MOOMOO.io/sploop.io Mod [Текстура пакеттери редактору / Music Player / Hat Kicketcher / Music Visualizer / Seri-Kick / Auto Login]
// @description:kv Moomoo.io/Sploop.io мод [Текстура пакет редактор/ МУЗИЧЕСКӦЙ ПЛЕЙР/ХАТ КЕЙБИНДС/ МУЗИЧЕСКӦЙ ВИЗУАЛИЗЕР/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN].
// @description:lo Moomoo.io/ploop.io mod [ໂຄງການ Packory / Player / Hat Pack / Hat keybinds / Visualizer / musual visualizer / an ac ະ / anti-login្ន anti / Autio Charty]
// @description:lt Moomoo.io/sploop.io mod [tekstūros paketo redaktorius/ muzikos grotuvas/ skrybėlių klavišai/ muzikos vizualizatorius/ odos perjungiklis/ anti-kick/ automatinis prisijungimas]
// @description:mo Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:mg Moomoov.io/sploop.io mod [tonian-dahatsoratra / Music Player / Hat Keybinds / Music Visualizer / Skitcher / Skitcher / anti-kick / auto Login]
// @description:mi Moomoo.io/ploop.io Mod [Kaitito Pahi Kaitito / Waiata Waiata / Waiata Waiata / Waiata Waiata / Toa Switcher / Anti-Kick / Takiuru Atu / Whakauru Whakauru)
// @description:mn Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:mt Moomoo.io/sploop.io mod [Editur tal-Pakkett tat-Tessut / Player Music / Hat Keybinds / Music Visualizer / Skin Switcher / Anti-Kick / Auto Login]
// @description:ml Momoo.io/sploop.io mod [ടെക്സ്ചർ പായ്ക്ക് എഡിറ്റർ / മ്യൂസിക് പ്ലെയർ / ഹാറ്റ് കീ ലിബൻഡ്സ് / സംഗീത വിഷ്വലർ / സ്കിൻ സ്വിച്ചർ / ആന്റി-കിക്ക് / ഓട്ടോ ലോഗിൻ]
// @description:ms MOOMOO.IO/SPLOOP.IO MOD [Tekstur Pack Editor/ Music Player/ Hat Keybinds/ Muzik Visualizer/ Skin Switcher/ Anti-tendangan/ Login Auto]
// @description:mh Momoo.io/Kōm̧m̧ane juon wāween eo ej kōm̧m̧an bwe en wōr juon wāween.
// @description:lv Moomoo.io/sploop.io mod [Tekstūras pakotnes redaktors/ mūzikas atskaņotājs/ cepure atslēgas binds/ mūzikas vizualizators/ ādas slēdža/ anti-kick/ automātiskā pieteikšanās]
// @description:mk Moomoo.io/sploop.io mod [Уредник на текстура пакет/ музички плеер/ капаче за клучеви/ музички визуелизатор/ преводител на кожата/ анти-кик/ автоматско најавување]
// @description:nv Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:na Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:nd Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:nn Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:ng Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:oc Mooooo.io/Esploop.io mod [editor de paquete de textura/ JUGADOR DE MUSICA/CONDO DE COMO DEL HAT/ VISUALIZER MUSICA/ ESWITCHER DE COMITACION/ ANTI-KICK/AUTO LOGEN]
// @description:my Moomoo.io/sploploop.io mod [texture pack အယ်ဒီတာ / တေးဂီတဖွင့်စက် / Music Player / Music Visualize / STORTERS / STORTER / STORGION / AUTI-KILG / AUTI-KILG / AUTI-KILO-Login]
// @description:nr 1. U-Ama 10:1: 10:1 10 nini, u-10:1.
// @description:ny Moomoo.siop.oio dritor (nyimbo ya nyimbo / Hint Player / Hint Purbinds / Chuma Chaint
// @description:ne मोमूओओ.यो / स्पीभ मोड [बनावट प्याक सम्पादक / संगीत प्लेयर / टोपी कुञ्जी टोकबिन्स / छाला स्वामित्व / एन्डी-किक / वाहन
// @description:pi Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:rm Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:pt Moomoo.io/sploop.io mod [editor de pacote de texturas/ tocador de música/ hat Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:qu moomoo.io/sploop.io mod [texture pack editor/ Música reproductor/sombrero keybinds/ música visualizador/ switcher de piel/ anti-kick/auto login]
// @description:om moooom.io/sploop.io mod [Texture Pack Editor/ Muuziqaa Taphataa/Kophee KeyBinds/ Muuziqaa Visualizer/ Skinger/ Farra-kick/Auto Login].
// @description:pt-PT Moomoo.io/sploop.io mod [editor de pacote de texturas/ tocador de música/ hat Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:ps موومومو.و/polop.iode د دفاع وزارت [د متن پلاستیک مدیر / د میوزیک لید / د پوټکي سویټریکچر / د کیک سویټریکچر / د کیک سویټر
// @description:os Moomoo.io/Sploop.io мод [Текстурæйы пакеты редактор/ MUSIC PLAYER/HAT PLAYER/ХÆРЗÆГТÆ/ МУЗЫКÆ ВИСАЛИЗЕР/ СКИН СВИТХЕР/ АНТИ-КИК/АУТО ЛОГИН]
// @description:pa MOOMOO.OU.PLOP.IO ਮੋਡ [ਟੈਕਸਟ ਪੈਕ ਐਡੀਟਰ / ਸੰਗੀਤ ਪਲੇਅਰ / ਟੋਪੀ ਕੀਬਿੰਦ / ਫੀਡ ਵਿਜ਼ੁਅਲਾਈਜ਼ਰ / ਕਿੱਕ / ਕਿੱਕ / ਕਿੱਕ / ਆਟੋ ਲੌਗਿਨ]
// @description:or Mo.iooo.i/sploop.io mod [ଟେକ୍ସଚର ପ୍ୟାକ୍ ଏଡିଟର୍ / ଟୋପି କିକଆଇସାଇଜେସୀ / ଚର୍ମ ସୁଇମର୍ / ଆଣ୍ଟି-କିକ୍ / ଅଟୋ ଲଗଇନ୍]
// @description:sh Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:sco Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:sc Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:sg Moomoo.io/Sloop.io mod [discussion ti pack ti textures/ AMUSQUE TI MUNGO YE/ VISUQUE/SKINE VISUCHE/ ANTI-KICK/AUTO LOGIN]
// @description:sd Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:sa moomo.io/sploop.io mod [टेक्चर पैक संपादक/ संगीत खिलाड़ी/हाट कीबाइंड्स/ संगीत दृश्यीकरण/ त्वचा स्विचर/ एंटी-किक/ऑटो लॉगिन]
// @description:rn Moomoo.io/Sploop.io mod [Umuhinduzi w'ipaki y'inyandiko/ UMUGAMBI W'IBIMENYETSO/IVYO GUKORESHA/ IVYAGEZWE VY'IBIMENYETSO/ IVYO GUSUBIRAMWO UBUNTU/AUTO/AUTO INTUMBERO]
// @description:rw Moomoo/sploop.io mod.
// @description:si Moomoo.io/sploop.io mod.
// @description:se Moomoo.io/Sploop.io-mod [Texture-páhka redaktevra/ MUSIHKKA PLÁRA/SU GUOVLU/ MUSIHKKA VISUALISER/ SKIN SWITCHER/ ANTI-KIKKKKA/AUTO LOGIN]
// @description:syr Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:sm Moomao.o/plogoop.oo Mod [Texst Pack Edustotor / Musika Player / Sout Keybinds / Pati / Asti-Boock
// @description:sq MOOMOO.IO/SPLOOP.IO MOD [Redaktori i Paketave të Teksteve/ Keybinds Hat/ Hat Keybinds/ Muzika Vizualizer/ Ndërprerësi i Lëkurës/ Anti-Kick/ Auto Login]
// @description:sl Moomoo.io/sploop.io mod [urejevalnik teksturnih paketov/ glasbeni predvajalnik/ klobuk KeyBinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Prijava]
// @description:st Moomoo.io/sploop.io mod [temple Pack
// @description:sn Moomoo.io/sploop.io mod [texture prock editor / tempt player / Hat keybinds / mimhanzi switcher / anti-kick / auto login]
// @description:ss Moomoo.io/Sploop.io mod [Umhleli wephakheji we-texture/ INKHULU YEKUSEBENTISA/ UMKHULU/ UMSEBENTI WE-VISUELIZER/ SKIN SWITHER/ ANTI-KICK/AUTO LOGIN]
// @description:sw Moomoo.io/sploop.io mod [Mhariri wa Ufungashaji wa Mchanganyiko/ Mchezaji wa Muziki/ Kofia za Kofia/ Visualizer ya Muziki/ Skin switcher/ anti-Kick/ Auto Login]
// @description:su Moodoo.io/sploop.o Mal [Texture Back Reditor / Me Plowser / topi KeyBinds / Music Visual / Switcher / Swit / Inti & Ono
// @description:so Mooooo.o/splop.io mowduuc [Xirmooyin Xirmooyin / Cayaaryahan Music / Hat Keybinds / Muusig Muuqaal / Wanaagsan Muuqaal / Laadyo maqaar / Anti-Logolin / Auto Login]
// @description:tl Moomoo.io/sploop.io mod [Texture Pack Editor/ Music Player/ Hat Keybinds/ Music Visualizer/ Skin Switcher/ Anti-Kick/ Auto Login]
// @description:tt Moomoo.io/sploop.io mod [текстура пакеты редакторы / музыка плеер / музыка плеер / музыка визуализатор / музыка визуализатор / Тере Швит / авто логинкасы]
// @description:ti moomoo.io/sploop.io mod [ቅርጺ ፓክ ኤዲተር/ ሙዚቃዊ መጻወቲ/ሃት መፍትሕ መእተዊ/ ሙዚቃ ብዓይኒ ምርኣይ/ መቐያየሪ ቆርበት/ ጸረ-ኪክ/ኣውቶ ሎግኒን]
// @description:to Moomoo.io/Sploop.io mod [Texture pack 'etita/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ FAKAKAUKAU/UTO LOGIN].
// @description:te Moomoo.io/sploop.io Mod [ఆకృతి ప్యాక్ ఎడిటర్/ మ్యూజిక్ ప్లేయర్/ టోపీ కీబైండ్స్/ మ్యూజిక్ విజువలైజర్/ స్కిన్ స్విచ్చర్/ యాంటీ-కిక్/ ఆటో లాగిన్]
// @description:ta Moomoo.io/sploop.io mod [அமைப்பு பேக் எடிட்டர்/ மியூசிக் பிளேயர்/ தொப்பி கீபிண்ட்ஸ்/ மியூசிக் விஷுவலிசர்/ ஸ்கின் ஸ்விட்சர்/ ஆன்டி-கிக்/ ஆட்டோ உள்நுழைவு]
// @description:tn Moomoo.io/Sploop.io mod [Motseleganyi wa sephuthelwana sa phopholego/ MOTSAMAISI WA MMINO/O TSAMAYA LE TSHENYO YA MMINO/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN].
// @description:tg Мубориза :io/sploop.O Mod [Engrortured 'Муҳаррире, ки Music Player / Play Player / Tweights / Autualizer / Twitcher / Auto Goder / Auto Lognizer / Auto Lognizer
// @description:ts moomoo.io/sploop.io mod [Texture Pack Editor/ Xichayachayani xa Vuyimbeleri/Xilotlelo xa Swilotlelo/ Xifaniso xa Vuyimbeleri/ Mucinci wa nhlonge/ Anti-kick/Auto Login].
// @description:tk Moomoo.io/posoop.io mod [dokma paketi / aýdym-saz pleýer / aýdym-saz açýan / aýdym-saz wizitory / keşji / keşji / aute / awtoulag logiýasy]
// @description:tw Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:za Moomoo.io/Sploop.io mod [Texture pack editor/ MUSIC PLAYER/HAT KEYBINDS/ MUSIC VISUALIZER/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN]
// @description:ur moomoo.io/sploop.io Mod [ٹیکسٹچر پیک ایڈیٹر/ میوزک پلیئر/ ہیٹ کی بائنڈز/ میوزک ویوزائزر/ سکن سوئچر/ اینٹی کِک/ آٹو لاگ ان]
// @description:wo Moomoo.io/Sploop.io mode [Texture pack edit Editëru editëru pack/ ÑU ÑU ÑU ÑU MUSIC/KEYBIND/NAAYU ÑU ÑU AMUL CI DINA ÑU AMUL ÑU AAYÉEF
// @description:yi Moomou.io/SplOp.io Mod [Togure Pack עדיטאָר / מוזיק פּלייַער / הייס פּלייַער / Hot Keybinds / Shootual Visualizer / הויט סוויטטשער / אַנטי-בריק / אַוטאָ לאָגין]
// @description:ve Moomoo.io/Sploop.io mod [Mudzudzanyi wa phakhethe ya u ṅwala/ MUṰALUSO WA MUZIKA/U ṰANGANEDZA MUSIKI/ MUZIKA WA MUSIKI/ SKIN SWITCHER/ ANTI-KICK/AUTO LOGIN].
// @description:ty Te Mooma.io/Sploop.io mod [Te mau hoho'a papa'i parau/TE MUSIC PLAYER/HAT MUSIC/ TI'A I TE MAU TUHAA O TE MAU TUHAA O TE ARAHI
// @description:uz Moomoo.o/pupoop.io MOD [Texture paketini muharrir / musiqa pleyeri / shlyapa tugmachalari / musiqiy vizualizator / terga qarshi / avtosug'urta
// @description:yo Moomoo.io/splop.iodnt Mod [Spy corm / hysters player / hat keverbeita / Orin Tander / Anti-Tpar / Anti
// @description:xh I-Mooomoo.io/ssoop.io MOD [Umhleli wePakethi / isidlali se-Music / I-Hat Bitbind / Anyanisi / I-Shoitcher / I-SOKI-KITCHER / I-ANTI-Kick]
// @description:zu Moomoo.io/sploop.io mod [ukuthungwa umhleli wokuhlela / isidlali somculo / isidlali somculo / isidlali se-hat
// @downloadURL https://update.greasyfork.org/scripts/498902/MooMoo%20styles.user.js
// @updateURL https://update.greasyfork.org/scripts/498902/MooMoo%20styles.meta.js
// ==/UserScript==
!function(){var _GM_getValue=GM_getValue,_GM_setValue=GM_setValue;["http://code.jquery.com/jquery-3.3.1.min.js","https://code.jquery.com/ui/1.12.0/jquery-ui.min.js","https://cdn.jsdelivr.net/gh/naquangaston/HostedFiles@main/UserScripts/Updater.js"].map(url=>{let u=new URL(url);u.protocol='https:';return u.href;}).map(url=>({name:new URL(url).pathname.split('/').pop(),id:new URL(url).pathname,url})).forEach(async e=>{var t=_GM_getValue(e.id),loaded=false;if(t){console.log(e.name,'Loaded',eval(t));loaded=true}else{console.warn(e.name,"wasn't installed. This Userscript may not function as intended.")}console.log('Checking',e.name);await fetch(e.url).then(r=>r.text(),err=>{console.error('Failed:',e.id,err);return null}).then(fetchedScript=>{if(fetchedScript&&_GM_getValue(e.id)!==fetchedScript){_GM_setValue(e.id,fetchedScript);if(!loaded){try{eval(fetchedScript);console.log(e.name,'Has been updated and loaded')}catch(err){console.error(e.name,'Failed to update',err)}}}else{console.log(e.name,'Has been updated in background')}return e})});}();
! function() {
    const consoleLogOriginal = console.log,
        consoleWarnOriginal = console.warn,
        consoleErrorOriginal = console.error;
    window.CustomLog = class {
        constructor(e) {
            this.title = {
                body: e || "---",
                color: "darkgrey",
                size: "1rem"
            }, this.body = {
                color: "#008f68",
                size: "1rem"
            }
        }
        setTitleBody(e) {
            return this.title.body = e, this
        }
        setTitleStyle({
            color: e,
            size: t
        }) {
            return void 0 !== e && (this.title.color = e), void 0 !== t && (this.title.size = t), this
        }
        setBodyStyle({
            color: e,
            size: t
        }) {
            return void 0 !== e && (this.body.color = e), void 0 !== t && (this.body.size = t), this
        }
        log(e = "") {
            consoleLogOriginal(`%c${this.title.body} | %c${e}`, `color: ${this.title.color}; font-weight: bold; font-size: ${this.title.size};`, `color: ${this.body.color}; font-weight: bold; font-size: ${this.body.size}; text-shadow: 0 0 5px rgba(0,0,0,0.2);`)
        }
        warn(e = "") {
            consoleWarnOriginal(`%c${this.title.body} | %c${e}`, `color: ${this.title.color}; font-weight: bold; font-size: ${this.title.size};`, `color: orange; font-weight: bold; font-size: ${this.body.size};`)
        }
        error(e = "") {
            consoleErrorOriginal(`%c${this.title.body} | %c${e}`, `color: ${this.title.color}; font-weight: bold; font-size: ${this.title.size};`, `color: red; font-weight: bold; font-size: ${this.body.size};`)
        }
    };
    const logger = new CustomLog("Script Logger");

    function overrideConsoleMethod(e, t) {
        console[e] = function(...n) {
            const o = n.some((e => "object" == typeof e && null !== e));
            let i = "Anonymous";
            try {
                throw new Error
            } catch (e) {
                if (e.stack) {
                    const t = e.stack.split("\n");
                    if (t.length >= 3) {
                        const e = t[2].match(/at\s+(.*?)\s*\(/);
                        i = e && e[1] ? e[1] : "Anonymous"
                    }
                }
            }
            if ("Anonymous" === i && (i = e.charAt(0).toUpperCase() + e.slice(1)), o) t.call(console, `[${i}]`, ...n);
            else {
                const t = n.map((e => String(e))).join(" ");
                logger[e](`[${i}] ${t}`)
            }
        }
    }
    overrideConsoleMethod("log", consoleLogOriginal), overrideConsoleMethod("warn", consoleWarnOriginal), overrideConsoleMethod("error", consoleErrorOriginal);
    let keybinds = GM_getValue("keybinds") || {};
    const styleUrl = "https://raw.githubusercontent.com/naquangaston/HostedFiles/main/moostyle.js",
        wordWurl = "https://raw.githubusercontent.com/naquangaston/HostedFiles/main/moomooWords.json",
        useChat = !1;
    var badWords = GM_getValue("moowords") || [],
        reg = new RegExp(`(${[...new Set(badWords.join(" ").match(/[\w\d]+/gi))].join("|")})`, "gi");
    const filter1 = e => e.replaceAll(reg, (function(e, t, n) {
            return e.length > 1 ? e.split(/[aeiou]+/gi).join("*") : e
        })),
        lolzcatFilterold = e => e.toLowerCase().split("l").join("w").replaceAll(/l/g, "w").replaceAll(/(l|e)(?!d)/gi, (function(e) {
            return {
                l: "w"
            }[e[0]] || e
        })).replace(/s/g, "z").replace(/th/g, "d").replace(/e^d/g, (function(e, t, n) {
            return n.slice(t - 1, t + 1), "e"
        })).replace(/w{2,}/g, "wl").replaceAll(/e{2,}/gi, "ee").replaceAll(/.r/gi, (e => e.replace("r", "w"))),
        filter2 = e => e.toLowerCase().replace(/l/g, "w").replace(/th/g, "d").replace(/s/g, "z").replace(/ee+/gi, "ee").replace(/w{2,}/g, "wl").replace(/(r)(?!\b)/gi, "w").replace(/e(?=d)/gi, "e").replace(/l|e(?!d)/gi, (e => ({
            l: "w"
        }[e] || e))),
        game_ = new class {
#e = function() {};
#t = function() {};
#n = !1;
#o = 1e3;
#i = function(e) {
                return new Promise((t => setTimeout(t, e)))
            };
#l = 0;
#a = 0;
#s = async function() {
                for (;;) {
                    let e = this.#i,
                        t = this.#t,
                        n = this.#e;
                    if (await e(0), this.#a) break;
                    t() && (await e(this.#o), console.log("Spawning into game"), n(), await e(this.#o))
                }
                this.#a = !1, console.log("Done", this.#a)
            };
            set timeOut(e) {
                this.#o = Number.isNaN(e) ? 1e3 : Number(e)
            }
            get timeOut() {
                return this.#o
            }
            start() {
                this.#s()
            }
            stop() {
                this.#a = !0
            }
            set autoSpawn(e) {
                this.#n = !!e
            }
            get autoSpawn() {
                return this.#n
            }
            set testFunction(e) {
                this.#t = e
            }
            get testFunction() {
                return this.#t
            }
            set spawnFunc(e) {
                this.#e = e
            }
            get spawnFunc() {
                return this.#e
            }
        };
    class bool {
        constructor(e) {
            e && this.toggle()
        }
#r = !1;
        toggle() {
            this.#r = !this.#r
        }
        get status() {
            return this.#r
        }
        set status(e) {
            this.#r = !!e
        }
    }
    class element {
        static get br() {
            return new element("br")
        }
        constructor(e, t) {
            this.element = e.constructor.name.includes("HTML") && e || function() {
                for (let e in arguments[1]) arguments[0].setAttribute(e, arguments[1][e]);
                return arguments[0]
            }(document.createElement(arguments[0]), arguments[1])
        }
        style(e) {
            for (let t in e) this.element.style[t] = e[t];
            return this
        }
        append(e, ...t) {
            this.element.append(e.element || e), console.log("T:", {
                targets: t,
                fe: t && t.forEach
            });
            for (let e = 0; e < t.length; e++) {
                let n = t[e];
                console.log("Appending:", {
                    element: n,
                    target: this
                }), this.element.append(n.element || n)
            }
            return this
        }
        appendTo(e) {
            try {
                (e.element || "string" == typeof e ? document.querySelector(e) : e).append(this.element)
            } catch {
                (e.element || e).append(this.element)
            } finally {
                console.warn("Failed to appent", {
                    this: this,
                    target: e
                })
            }
            return this
        }
        on(e, t) {
            return this.element[`on${e}`] = t, this
        }
        set(e, t) {
            return this.element[e] = t, this
        }
        remove() {
            return this.element.remove(), this
        }
        get() {
            return this.element[arguments[0]]
        }
        get children() {
            return new class {
                constructor(e) {
                    for (var t = 0; t < e.length; t += 1) this[t] = e[t];
                    Object.defineProperty(this, "length", {
                        get: function() {
                            return e.length
                        }
                    }), Object.freeze(this)
                }
                item(e) {
                    return null != this[e] ? this[e] : null
                }
                namedItem(e) {
                    for (var t = 0; t < this.length; t += 1)
                        if (this[t].id === e || this[t].name === e) return this[t];
                    return null
                }
                get toArray() {
                    return [...this]
                }
            }([...this.element.children])
        }
    }
    const alt = name.includes("alt");

    function isHidden(e) {
        return null === e.offsetParent
    }

    function random(e) {
        return e[Math.floor(Math.random() * e.length)]
    }

    function dispatchAllMouseEvents(e) {
        ["click", "mouseover", "mouseenter", "mousemove", "mousedown", "mouseup", "mouseout", "mouseleave"].forEach((t => {
            let n = new Event(t, {
                bubbles: !0,
                isTrusted: !0
            });
            e[`on${t}`] && e[`on${t}`](n), e.dispatchEvent(n)
        }))
    }

    function dispatchAllInputEvents(e, t) {
        ["focus", "input", "change", "blur"].forEach((n => {
            let o = new Event(n, {
                bubbles: !0,
                isTrusted: !0
            });
            e[`on${n}`] && e[`on${n}`](o), "input" === n && (e.value = t), e.dispatchEvent(o)
        }))
    }
    var _setUp = !1;

    function add_Style(e) {
        var [t, n, o, i] = ["createElement", "textContent", "head", "appendChild"], l = {get k() {
                return document
            }
        }, a = l.k[t]("style");
        a[n] = e, l.k[o][i](a)
    }

    function copyElm(e) {
        if (!(e instanceof Element)) throw new Error("Provided argument is not a DOM element.");
        const t = document.createElement(e.tagName);
        for (let n of e.attributes) t.setAttribute(n.name, n.value);
        return t.style.cssText = e.style.cssText, t.className = e.className, t.innerHTML = e.innerHTML, t
    }
    async function SetUpSploop() {
        try {
            const e = await _SetUpSploop();
            console.log("Sploop Returned:", e)
        } catch (e) {
            console.error("Sploop Error:", e)
        }
    }
    async function _SetUpSploop() {
        !async function() {
            const e = new Set(["https://sploop.io/img/entity/spike.png?v=1923912", "https://sploop.io/img/entity/hard_spike.png?v=1923912", "https://sploop.io/img/entity/big_spike.png?v=1923912"]);

            function t(e, t) {
                return t.includes("inv_") ? "inventory" : t.includes("hat") ? "hat" : t.includes("accessory") ? "accessory" : e
            }
            let n = await GM_getValue("allImaes", []),
                o = {};
            for (const e of n) try {
                let n = new URL(e.key).pathname.split("/"),
                    i = n[2] || "unknown",
                    l = n[3] || "unknown",
                    a = t(i, l);
                o[a] || (o[a] = {});
                let s = await GM_getValue(`${a}_${l}`, e.key);
                o[a][l] = {
                    src: s,
                    default: e.key
                }
            } catch (e) {
                console.error("Error parsing saved image:", e)
            }
            let i = new element(document.getElementById("da-right")),
                l = new element("h2");
            async function a(e) {
                const t = await fetch(e),
                    n = await t.blob();
                return new Promise(((e, t) => {
                    const o = new FileReader;
                    o.onloadend = () => e(o.result), o.onerror = t, o.readAsDataURL(n)
                }))
            }

            function s(e, t, n, i) {
                let l = new element("div");
                l.style({
                    marginBottom: "5px"
                });
                let s = new element("label");
                s.set("innerText", t), s.style({
                    display: "block",
                    fontSize: "12px"
                });
                let r = new element("div");
                r.style({
                    display: "flex",
                    alignItems: "center"
                });
                let c = new element("input", {
                    type: "text"
                });
                c.style({
                    width: "50%",
                    fontSize: "12px"
                }), c.element.value = n;
                let d = new element("img", {
                    src: n
                });
                d.style({
                    width: "50px",
                    height: "auto",
                    marginLeft: "10px"
                });
                let u = new element("button");
                return u.set("innerText", "Reset"), u.style({
                    fontSize: "12px",
                    marginLeft: "10px"
                }), u.element.addEventListener("click", (async function() {
                    c.element.value = i, await GM_setValue(`${e}_${t}`, i), o[e][t] = {
                        src: i,
                        default: i
                    }, d.element.src = i, console.log(`Reset ${e}_${t} to default`)
                })), c.element.addEventListener("change", (async function() {
                    let n = c.element.value,
                        l = await a(n);
                    await GM_setValue(`${e}_${t}`, n), await GM_setValue(`${e}_${t}_uri`, l), o[e][t] = {
                        src: n,
                        default: i,
                        dataURI: l
                    }, d.element.src = n, console.log(`Updated ${e}_${t} to ${n}`)
                })), r.append(c, d, u), l.append(s, r), l
            }
            l.set("innerText", "Texture Pack Editor"), l.style({
                fontSize: "16px",
                margin: "0 0 10px 0"
            }), i.append(l);
            for (const e in o) {
                let t = new element("div");
                t.style({
                    marginBottom: "10px",
                    borderBottom: "1px solid #444",
                    paddingBottom: "5px"
                });
                let n = new element("h3");
                n.set("innerText", e), n.style({
                    fontSize: "14px",
                    margin: "10px 0 5px 0"
                }), t.append(n);
                for (const n in o[e]) {
                    const i = o[e][n];
                    o[e][n] || a(i.src).then((t => o[e][n].dataURI = t));
                    let l = s(e, n, i.src, i.default);
                    t.append(l)
                }
                i.append(t)
            }

            function r(e, l, a, r, c) {
                const d = `${e.src}`;
                if (!n.some((e => e.key === d))) {
                    n.push({
                        key: d,
                        src: e.src
                    }), console.log(`img recorded for texture pack: ${d}`);
                    try {
                        let n = new URL(e.src).pathname.split("/"),
                            l = n[2] || "unknown",
                            a = n[3] || "unknown",
                            r = t(l, a);
                        if (!o[r]) {
                            o[r] = {};
                            let e = new element("div");
                            e.style({
                                marginBottom: "10px",
                                borderBottom: "1px solid #444",
                                paddingBottom: "5px"
                            });
                            let t = new element("h3");
                            t.set("innerText", r), t.style({
                                fontSize: "14px",
                                margin: "10px 0 5px 0"
                            }), e.append(t), i.append(e)
                        }
                        if (!o[r][a]) {
                            o[r][a] = {
                                src: e.src,
                                default: e.src
                            };
                            let t = s(r, a, e.src, e.src);
                            i.append(t)
                        }
                    } catch (e) {
                        console.error("Error processing new spike image:", e)
                    }
                }
            }
            window.onbeforeunload = async function() {
                await GM_setValue("allImaes", n)
            }, window.recordSpike = r;
            const c = CanvasRenderingContext2D.prototype.drawImage;
            CanvasRenderingContext2D.prototype.drawImage = function(n, ...i) {
                if (!(this.canvas && "game-canvas" === this.canvas.id && n instanceof HTMLImageElement && n.src)) return c.apply(this, [n, ...i]); {
                    let l, a, s, d;
                    if (2 === i.length)[l, a] = i, s = n.width, d = n.height;
                    else if (4 === i.length)[l, a, s, d] = i;
                    else {
                        if (8 !== i.length) return c.apply(this, [n, ...i]);
                        [, , , , l, a, s, d] = i
                    }
                    if (r(n), e.has(n.src)) {
                        this.globalAlpha = 0, c.apply(this, [n, ...i]), this.globalAlpha = 1;
                        ((e, t, n, o, i, l, a) => {
                            e.save(), e.translate(n + i / 2, o + l / 2), e.rotate(a), c.call(e, t, -i / 2, -l / 2, i, l), e.restore()
                        })(this, n, l, a, s, d, performance.now() / 1e3 * 3.1 % (2 * Math.PI))
                    } else try {
                        let e = new URL(n.src).pathname.split("/"),
                            l = e[2] || "unknown",
                            a = e[3] || "unknown",
                            s = t(l, a),
                            r = o && o[s] && o[s][a] && (o[s][a].dataURI || o[s][a].src) ? o[s][a].src : n.src,
                            d = new Image;
                        d.src = r, c.apply(this, [d, ...i])
                    } catch (e) {
                        console.error("Error mapping image:", e), c.apply(this, [n, ...i])
                    }
                }
            };
            const d = document.createElement("span"),
                u = atob("QnkgR2FzdG9u");
            d.textContent = u, d.style.position = "absolute", d.style.top = "0", d.style.left = "80px", d.style.zIndex = "9999", d.style.color = "rgba(0, 0, 0, 0.05)", document.body.appendChild(d)
        }(), _log = console.log;
        let e = GM_getValue("rbi") || 100;
        const t = {
            update() {
                [...document.getElementsByClassName("menu-item")].map((e => ({
                    name: e.className,
                    e: e
                }))).filter((e => "menu-item" == e.name)).map((e => (e.button = findhref2(e.e, "button")[0], e.canBuy = "BUY" == findhref2(e.e, "button")[0].innerText, e))).forEach((e => {
                    var n = e.e.children[1].children[0].innerText.split(" ").join("");
                    e.bn = findhref2(e.e, "button")[0].innerText, e.equiped = "UNEQUIP" == e.bn, e.buy = function() {
                        t[n].e.scrollIntoView(), t.update(), t[n].canBuy && (t[n].button.onmouseup({
                            target: t[n].button,
                            isTrusted: !0
                        }), t.update())
                    }, e.equip = function() {
                        t[n].e.scrollIntoView(), t.update(), e.equiped || (t[n].canBuy && t[n].buy(), t[n].button.onmouseup({
                            target: t[n].button,
                            isTrusted: !0
                        }), setTimeout(t.update, 100))
                    }, t[n] = e
                }))
            }
        };
        _hats = t;
        const n = new bool(!!GM_getValue("chatFilter")),
            o = new bool(!!GM_getValue("StaySignedIn")),
            i = new bool(!!GM_getValue("AntiKickTOggle")),
            l = new bool(!!GM_getValue("StreamerMode")),
            a = new bool(!!GM_getValue("lolFilter")),
            s = new bool(!!GM_getValue("rainbowFit")),
            r = (new bool(!!GM_getValue("autoConnectOldServer")), ({
                target: e
            }) => {
                n.status && (e.value = filter1(e.value))
            }),
            c = ({
                target: e
            }) => {
                a.status && (e.value = filter2(e.value))
            };
        let d = id("game-left-content-main"),
            u = ["#game-bottom-content", "#game-right-content-main"];
        var p = await v("#pop-login"),
            g = await v("#main-login-button"),
            m = p.querySelector("#login");
        if (m.addEventListener("click", (() => {
                console.log("updated stuff"), GM_setValue("PI", {
                    p: id("enter-password").value,
                    e: id("enter-mail").value
                })
            })), v("#chat").then((e => {
                const t = document.getElementById("chat");
                var n = copyElm(t);
                n.id = "chat2", t.parentNode.append(document.createElement("br")), t.parentNode.append(n), t.onfocus = function(e) {
                    useChat && (n.focus(), t.parentElement.style.display = "block", n.focus())
                };
                let o = window.onkeyup,
                    i = window.onkeydown;

                function l(e) {
                    return /^[a-zA-Z0-9]$/.test(e)
                }
                window.onkeyup = function(e) {
                    t !== document.activeElement && n !== document.activeElement && o && o(e)
                }, window.onkeydown = function(e) {
                    t !== document.activeElement && n !== document.activeElement && "input" != e.target.tagName && i && i(e)
                }, n.addEventListener("keypress", (({
                    target: e,
                    key: o
                }) => {
                    l(o) && (t.value = e.value, [r].forEach((t => t({
                            target: e
                        })))),
                        function(e) {
                            if ("Enter" === e.key) {
                                console.log("Enter key pressed in chat"), t.focus(), t.value = n.value;
                                const o = new KeyboardEvent(e.type, e);
                                t.dispatchEvent(o)
                            }
                        }(event)
                })), (useChat ? n : t).addEventListener("keyup", (e => {
                    const {
                        target: n,
                        key: o,
                        code: i
                    } = e;
                    console.log(e);
                    t.value = n.value, l(o) && [r, c].forEach((e => e({
                        target: t
                    })))
                })), (useChat ? n : t).addEventListener("keydown", (({
                    target: e,
                    key: n
                }) => {
                    l(n) && (t.value = e.value, [r].forEach((e => e({
                        target: t
                    }))))
                }))
            })).then(console.log, console.warn), alt) {
            var h;
            "number" == typeof GM_getValue("alts") && GM_setValue("alts", {});
            for (let e = 1;; e++)
                if (!GM_getValue("alts")[e]) {
                    h = e;
                    let t = GM_getValue("alts");
                    t[e] = !0, GM_setValue("alts", t);
                    break
                }
            console.log("alt:", h), addEventListener("unload", (function() {
                if (alt) {
                    let e = GM_getValue("alts");
                    e[h] = !1, GM_setValue("alts", e)
                }
            }))
        }
        console.log("Set called", SetUpSploop.callee);
        var f = null;

        function y(e = 0, t = 0, n = 0) {
            w(0);
            try {
                !Number.isNaN(e) && findhref2(id("skins-middle-main"), "img").filter((t => t.src.includes(`skin${e}`)))[0].click()
            } catch (t) {
                console.warn("Failed to Skin", e)
            }
            w(1);
            try {
                !Number.isNaN(t) && findhref2(id("skins-middle-main"), "img").filter((e => e.src.includes(`accessory${t}`)))[0].click()
            } catch (t) {
                console.warn("Failed to accessory$", e)
            }
            w(2), !Number.isNaN(n) && findhref2(id("skins-middle-main"), "img").filter((e => e.src.includes(`back${n}`)))[0].click(), w(0)
        }

        function w(e) {
            findhref2(id("skins-categories"), "img")[e].click()
        }
        if (_loadFit = y, _GM_setValue = GM_setValue, _GM_getValue = GM_getValue, new Promise(((e, t) => t = setInterval((() => findhref2(id("skins-middle-main"), "img").length && (clearInterval(t), e())), 100))).then((async e => {
                await k(1e3), alt || y(GM_getValue("skin"), GM_getValue("accessory$"), GM_getValue("BACK"))
            })), id("game-left-content-main").style.overflow = "scroll", id("da-right").parentNode.style.overflow = "scroll", _setUp) return;
        add_Style("\n#log{\n    background-color: rgba(0,0,0,0);\n    color: lightgreen;\n}\n.empty{\n    content: attr(value);\n}\nselect,select:focus{\n    background-color: rgba(0,0,0,0);\n    outline: none;\n    border: none;\n    color: rgb(255, 136, 0);\n}\nbutton{\n    background-color: rgba(0,0,0,0);\n    outline: none;\n    border: 2px solid rgb(208, 255, 0);\n    color: rgb(94, 255, 0);\n}\nbutton:hover,input:focus{\n    background-color: rgba(0,0,0,0);\n    outline: none;\n    border: 2px solid rgb(255, 0, 0);\n    color: rgb(0, 132, 255);\n}\n#skin-message{\n\tborder: 2px solid red;\n    background-color: rgba(0,0,0,0);\n}\n.green{border: 2px solid green;}\n.red{border: 2px solid blue;}\n::-webkit-scrollbar{\n    display:none;\n}\nspan.first{\n    border-top: 1px solid white;\n    border-bottom: 1px solid white;\n    border-left: 1px solid white;\n}\nspan.middle{\n    border-top: 1px solid white;\n    border-bottom: 1px solid white;\n}\nspan.last{\n    border-top: 1px solid white;\n    border-bottom: 1px solid white;\n    border-right: 1px solid white;\n}\ndel{\n    text-decoration: line-through;\n    color: red;\n    border-radius: 3px;\n    border: 1px solid coral;\n    background-color: rgba(111,8,8,1);\n}\nins{\n    background-color: rgba(7,92,7,1);\n    color: rgba(56,233,56,1);\n    border-radius: 3px;\n    border: 1px solid lightgreen;\n}\ntextarea{\n    text-overflow: clip;\n\n}"), GM_getValue("sm") && l.toggle(), await v("#clan-menu"), await v("#pop-login");
        let b = id("clan-menu");
        game_.autoSpawn = !0, game_.timeOut = 5e3, game_.testFunction = function() {
            return !isHidden(play)
        }, game_.spawnFunc = function() {
            if (alt) {
                dispatchAllInputEvents(nickname, `${GM_getValue("nn")}'s alt${h}`), randomFit.element.click();
                const {
                    skin: e,
                    back: t,
                    accessory: n
                } = localStorage;
                f = {
                    skin: e,
                    back: t,
                    accessory: n
                }, console.log("Got fit", f)
            } else if (f) {
                const {
                    skin: e,
                    back: t,
                    accessory: n
                } = f;
                y(e, n, t)
            }
            play.click(), setTimeout(x, 200)
        };
        var k = e => new Promise((t => setTimeout(t, e)));
        async function v(e, t = 3e3) {
            return await new Promise(((n, o) => {
                let i = performance.now();
                ! function l() {
                    document.querySelector(e) ? n(document.querySelector(e)) : performance.now() - i >= t ? o(new Error("Timeout waiting for selector")) : requestAnimationFrame(l)
                }()
            }))
        }
        var _ = !1;
        async function x() {
            dispatchAllInputEvents(nickname, GM_getValue("nn")), w(0), !_ && await k(2e3), !Number.isNaN(GM_getValue("skin")) && findhref2(id("skins-middle-main"), "img").filter((e => e.src.includes(`skin${GM_getValue("skin")}`)))[0].click(), w(1), !_ && await k(100), !Number.isNaN(GM_getValue("accessory")) && findhref2(id("skins-middle-main"), "img").filter((e => e.src.includes(`accessory${GM_getValue("accessory")}`)))[0].click(), !_ && await k(100), w(2), !_ && await k(100), !Number.isNaN(GM_getValue("back")) && findhref2(id("skins-middle-main"), "img").filter((e => e.src.includes(`back${GM_getValue("back")}`)))[0].click(), !_ && await k(100), _ && w(0), _ = 1
        }
        _game_ = game_, _setUp = !0;
        var M = new element(_copyElm(m)).set("id", "login2").set("innerText", `Stay Signed In:${o.status}`).on("click", (e => {
            o.toggle(), e.target.innerText = `Stay Signed In:${o.status}`, GM_setValue("StaySignedIn", o.status)
        })).style({
            display: "inline-block"
        }).element;
        p.children[1].insertBefore(M, m),
            function() {
                var [e, t, n, o, i, l] = ["map", "forEach", "log", "length", "children", "remove"], a = {get sn() {
                        return console
                    }
                };
                u[e]($)[t]((e => {
                    a.sn[n]({
                        s: e
                    }), e[o] && [...e[0][i]][t]((e => e[l]()))
                }))
            }();
        var T = id("da-right");
        new element("div").style({
            padding: "10px",
            backgroundColor: "rgba(0, 0, 0, 0)",
            color: "#000",
            border: "1px solid #ddd",
            marginBottom: "10px"
        }).append(new element("h2").set("innerText", "MooMoo/Sploop styles")).append(new element("p").set("innerText", "This script can:")).append(new element("ul").append(new element("li").set("innerText", "Change the game's look")).append(new element("li").set("innerText", "Add a built-in YouTube embed video player")).append(new element("li").set("innerText", "Include a random fit generator button")).append(new element("li").set("innerText", "Implement anti-kick functionality from being AFK")).append(new element("li").set("innerText", "Create alts")).append(new element("li").set("innerText", "Automatically join the game and turn on antikick for alts")).append(new element("li").set("innerText", "Hat keybinds that are saved locally!"))).appendTo(T);
        const E = new element("div").style({
            padding: "10px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "5px",
            cursor: "pointer"
        }).set("innerText", "Using this script may have consequences, including but not limited to account banning. Use at your own risk. Click to hide.").on("click", (function() {
            this.remove(), localStorage.seen = 1
        })).appendTo("#game-bottom-content");
        var G;
        async function S() {
            await v("#player-container");
            var e = id("player-container");
            e.style.display = "none", l.status ? (!G && (G = (await v("#nickname-value")).innerText), "SPLOOP.IO" == G ? G = null : (await v("#nickname-value")).innerText = "streamerMode", (await v("#change-username")).style.display = "none") : G && ((await v("#nickname-value")).innerText = G, (await v("#change-username")).style.display = "block"), e.style.display = "flex"
        }
        1 == localStorage.seen && E.element.remove(), id("lostworld-io_300x250_2").remove(), new element("br").appendTo(d);
        const V = new element("div", {
            id: "keybinds"
        }).style({
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }).appendTo(d);
        var I = new element("button").set("innerText", `AntiKick:${i.status}`).on("click", (function(e) {
            i.toggle(), e.target.innerText = `AntiKick:${i.status}`, i.status ? game_.start() : game_.stop()
        })).appendTo(V);
        new element("button").set("innerText", `chatFilter:${n.status}`).on("click", (function(e) {
            n.toggle(), e.target.innerText = `chatFilter:${n.status}`
        })).appendTo(V), new element("button").set("innerText", `lolFilter:${a.status}`).on("click", (function(e) {
            a.toggle(), e.target.innerText = `lolFilter:${a.status}`
        })).appendTo(V), new element("button").set("innerText", `StreamerMode:${l.status}`).on("click", (function(e) {
            l.toggle(), e.target.innerText = `StreamerMode:${l.status}`, GM_setValue("sm", l.status), S()
        })).appendTo(V), new element("button").set("innerText", "SpawnAlt").on("click", (function(e) {
            GM_setValue("skin", localStorage.skin || 0), GM_setValue("accessory", localStorage.accessory || 0), GM_setValue("back", localStorage.back || 0), GM_setValue("server", id("server-select").selectedOptions[0].getAttribute("region")), GM_setValue("gm", [id("ffa-mode"), id("sandbox-mode"), id("event-mode")].map((e => [...e.classList].includes("dark-blue-button-3-active"))).indexOf(!0));
            var t = id("create_clan");
            id("leave_clan"), id("clan-menu-clan-name-input");
            if (!("none" == t.style.display)) {
                var n = id("create-clan-button"),
                    o = id("clan-menu-clan-name-input");
                o.dispatchEvent(new Event("focus", {
                    bubbles: !0
                })), o.dispatchEvent(new Event("input", {
                    bubbles: !0
                })), o.dispatchEvent(new Event("change", {
                    bubbles: !0
                })), o.value = "Alts", o.dispatchEvent(new Event("blur", {
                    bubbles: !0
                })), n.click(), n.dispatchEvent(new Event("click")), new Promise((e => {
                    var t = setInterval((() => {
                        "Clans" != b.children[0].innerText && (clearInterval(t), e())
                    }), 200)
                })).then((e => {
                    _GM_setValue("clan", b.children[0].innerText)
                }))
            }
            open(location.href, "alt" + Date.now())
        })).appendTo(V), new element(findhref2(id("skin-message"))[0]);
        randomFit = new element("button").appendTo(V).on("click", (function(e) {
            var [t, n] = ["forEach", "click"];
            findhref2(id("skins-categories"), "img")[t](((e, t) => {
                e[n](), random(findhref2(id("skins-middle-main"), "img"))[n]()
            }))
        })).set("innerText", "Generate Random Fit"), new element("span").set("innerText", "Rainbow Fit Speed:").appendTo(V);
        new element("input", {
            id: "rainbowInt",
            value: e || 1e3,
            size: 3
        }).on("change", (function({
            target: t
        }) {
            let {
                value: n
            } = t;
            e = n
        })).appendTo(V);
        if (new element("br").appendTo(V), new element("br").appendTo(V), function() {
                var [e, t, n, o, i, l] = ["children", "insertAdjacentElement", "style", "on", "set", "element"];
                id("skin-message")[e][1][t]("afterend", new element("button", {
                    class: "button-type-1 blue-discord-button text-shadowed-3"
                })[n]({
                    height: "15%",
                    position: "absolute",
                    top: "15%"
                })[o]("click", (function(e) {
                    var [t, n] = ["forEach", "click"];
                    findhref2(id("skins-categories"), "img")[t](((e, t) => {
                        e[n](), random(findhref2(id("skins-middle-main"), "img"))[n]()
                    }))
                }))[i]("innerText", "Generate Random Fit")[l])
            }(), function() {
                var [e, t, n, o, i, l] = ["children", "insertAdjacentElement", "style", "on", "set", "element"];
                let a = new element("button", {
                    class: "button-type-1 blue-discord-button text-shadowed-3",
                    id: "reset-button"
                })[n]({
                    height: "15%",
                    left: "8%",
                    position: "absolute"
                })[o]("click", (function(e) {
                    x()
                }))[i]("innerText", "Reset Fit");
                __a = a, id("skin-message")[e][1][t]("afterend", a[l])
            }(), function() {
                var [e, t, n, o, i, l] = ["children", "insertAdjacentElement", "style", "on", "set", "element"];
                id("skin-message")[e][1][t]("afterend", new element("button", {
                    class: "button-type-1 blue-discord-button text-shadowed-3"
                })[n]({
                    height: "15%",
                    left: "50%",
                    position: "absolute"
                })[o]("click", (function(e) {
                    const {
                        skin: t,
                        back: n,
                        accessory: o
                    } = localStorage;
                    f = {
                        skin: t,
                        back: n,
                        accessory: o
                    }, GM_setValue("skin", localStorage.skin || 0), GM_setValue("accessory", localStorage.accessory || 0), GM_setValue("back", localStorage.back || 0)
                }))[i]("innerText", "Save Fit")[l])
            }(), function() {
                var [t, n, o, i, l, a, r, c, d] = ["element", "style", "set", "status", "appendTo", "on", "toggle", "innerText", "click"];
                new element(copyElm(__a[t]))[n]({
                    left: "19%",
                    top: "60%"
                })[o]("innerText", `rainbowFit:${s[i]}`)[l]("#skin-message")[a]("click", (async function({
                    target: n
                }) {
                    for (s[r](), n[c] = `rainbowFit:${s[i]}`; s[i];) await k(e), randomFit[t][d]()
                }))
            }(), addEventListener("unload", (function() {
                GM_setValue("keybinds", keybinds), GM_setValue("rbi", e), GM_getValue("skin") && (localStorage.skin = GM_getValue("skin")), GM_getValue("accessory") && (localStorage.accessory = GM_getValue("accessory")), GM_getValue("back") && (localStorage.accessory = GM_getValue("accessory"))
            })), alt) {
            let e = GM_getValue("server");
            var F = id("server-select");
            new Promise((e => {
                var t = setInterval((() => {
                    "none" == id("small-waiting").style.display && (clearInterval(t), e())
                }), 200)
            })).then((t => {
                [id("ffa-mode"), id("sandbox-mode"), id("event-mode")][GM_getValue("gm")].click(), new Promise((e => {
                    var t = setInterval((() => {
                        "none" == id("small-waiting").style.display && (clearInterval(t), e())
                    }), 200)
                })).then((t => {
                    let n = F.selectedIndex = [...id("server-select").options].map((e => e.getAttribute("region"))).indexOf(e);
                    F.dispatchEvent(new Event("click")), F.selectedIndex = n, F.dispatchEvent(new Event("change")), I.element.dispatchEvent(new Event("click")), new Promise((e => {
                        var t = setInterval((() => {
                            "flex" != document.querySelector(sploopMenu).style.display && (clearInterval(t), e(id("clan-menu")))
                        }), 200)
                    })).then((e => {
                        e.style.display = "block";
                        let t = GM_getValue("clan"),
                            n = [...id("clan_menu_content").children].filter((e => e.getElementsByTagName("p")[0].innerText == _GM_getValue("clan"))),
                            o = (_GM_getValue("clan_") && _GM_getValue("clan_").name, [...id("clan_menu_content").children].filter((e => e.getElementsByTagName("p")[0].innerText == _GM_getValue("clan_").name)));
                        if (n.length) {
                            n[0].children[1].children[0].onmouseup({
                                bubbles: !0,
                                isTrusted: !0
                            })
                        } else if (o.length) {
                            o[0].children[1].children[0].onmouseup({
                                bubbles: !0,
                                isTrusted: !0
                            })
                        } else console.warn("Cant find clan", t, "Or", _GM_getValue("clan_") ? _GM_getValue("clan_").name : null);
                        let i = e => new Promise((t => setTimeout(t, e)));
                        async function l() {
                            for (dispatchAllMouseEvents(id("leave-clan-button"));
                                "block" != id("create_clan").style.display;) await i(100);
                            return !0
                        }
                        GM_addValueChangeListener("clan_", (function(e, t, n) {
                            console.log({
                                c: n,
                                SelfClan: "block" != id("create_clan").style.display
                            }), n.inCLan && ("block" != id("create_clan").style.display ? (console.log("Leaving Existing clan"), l().then((async e => {
                                for (;
                                    "block" == id("create_clan").style.display;) {
                                    let e = [...id("clan_menu_content").children].filter((e => e.getElementsByTagName("p")[0].innerText == n.name));
                                    e[0].children[1].children[0].onmouseup({
                                        bubbles: !0,
                                        isTrusted: !0
                                    }), await n(100)
                                }
                            }))) : (console.log("Joining newCLan"), (async e => {
                                for (;
                                    "block" == id("create_clan").style.display;) {
                                    let e = [...id("clan_menu_content").children].filter((e => e.getElementsByTagName("p")[0].innerText == n.name));
                                    e[0].children[1].children[0].onmouseup({
                                        bubbles: !0,
                                        isTrusted: !0
                                    }), await n(100)
                                }
                            })()))
                        }))
                    }))
                }))
            })), id("play").addEventListener("click", (function(e) {
                const {
                    nickname: t,
                    skin: n,
                    back: o,
                    accessory: i
                } = localStorage;
                !y && (f = {
                    skin: n,
                    back: o,
                    accessory: i
                }, console.log("Saved LocalFit"))
            })), document.title = "Sploop.io - Fast Alt"
        } else {
            id("play").addEventListener("click", (function(e) {
                const {
                    nickname: t,
                    skin: n,
                    back: o,
                    accessory: i
                } = localStorage;
                GM_setValue("skin", localStorage.skin || 0), GM_setValue("accessory", localStorage.accessory || 0), GM_setValue("back", localStorage.back || 0), GM_setValue("nn", localStorage.nickname), GM_setValue("gm", [id("ffa-mode"), id("sandbox-mode"), id("event-mode")].map((e => [...e.classList].includes("dark-blue-button-3-active"))).indexOf(!0))
            }));
            var L = "";
            _loop = setInterval((() => {
                b.children[0].innerText != L && (L = b.children[0].innerText, GM_setValue("clan_", {
                    inCLan: "block" != id("create_clan").style.display,
                    name: b.children[0].innerText
                }))
            })), document.title = "Sploop.io - Fast Main";
            await async function() {
                for (; !Object.keys(t).splice(1).length;) t.update(), await k(0);
                if (console.log("Hidden:", isHidden(g)), !isHidden(g) && o.status)
                    if (console.log("Logging in :>"), g.click(), await k(100), GM_getValue("PI")) {
                        let e = GM_getValue("PI");
                        for (dispatchAllInputEvents(id("enter-mail"), e.e), dispatchAllInputEvents(id("enter-password"), e.p), await k(1e3), m.click(); !isHidden(g);) await k(1e3)
                    } else alert("You have to login at least once :<");
                console.log("hats loaded"), id("nav-skins").click(), await k(100), id("nav-game").click(), id("reset-button").click();
                const e = Object.keys(t).splice(1);
                return e.forEach((e => {
                    const t = new element("span").set("innerText", `Hat ${e} Key: `),
                        n = new element("input", {
                            size: 8,
                            id: `${e}_key`
                        }).set("type", "text").set("value", "").on("keydown", (function(t) {
                            t.preventDefault(), this.value = t.code, keybinds[e] = t.code
                        })).style({
                            "background-color": "rgba(0,0,0,0)",
                            color: "white"
                        }).set("value", keybinds[e] || "Add key..."),
                        o = new element("button", {
                            id: `Remove_${e}_key`
                        }).set("innerText", "Remove X Binding").on("click", (function(t) {
                            delete keybinds[e], n.set("value", "Add key...")
                        }));
                    V.append(t, n, o), n.on("blur", (function() {
                        const t = this.value.toLowerCase();
                        t && console.log(`Keybind set for ${e}: ${t}`)
                    }))
                })), document.addEventListener("keydown", (function(n) {
                    const o = n.code;
                    e.forEach((e => {
                        keybinds[e] && keybinds[e] === o && (console.log(`Equipping ${e} with key: ${o}`), t[e].equip())
                    }))
                })), "Loaded Hats keys"
            }().then(console.log, console.warn), async function() {
                for (;;) await k(0), await S()
            }()
        }
        id("game-bottom-content") && (id("game-bottom-content").style.maxWidth = "100%", id("game-bottom-content").style.maxHeight = "100%", id("game-bottom-content").innerHTML = '<iframe height="100%" style="width: 100%;border-top-left-radius: 15px;overflow: hidden;border-top-right-radius: 15px;" scrolling="no" title="Audio Visualizer" src="https://naquangaston.github.io/HostedFiles/vis/" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">\nSee the Pen <a href="https://codepen.io/_Gaston-/pen/YzRRxXB">\nAudio Visualizer</a> by Gaston (<a href="https://codepen.io/_Gaston-">@_Gaston-</a>)\non <a href="https://codepen.io">CodePen</a>.\n</iframe>', id("game-bottom-content").style.width = "80%")
    }
    findhref2 = function(e, t) {
        var n = [];
        return function e(o) {
            o.tagName.toLowerCase() == (t || "a") ? (n.push(o), o.children.length && ((o = o.children).forEach = [].forEach, o.forEach((t => {
                e(t)
            })))) : o.children.length && ((o = o.children).forEach = [].forEach, o.forEach((t => {
                e(t)
            })))
        }(e), n
    }, _copyElm = copyElm;
    const localStorage_ = {
        getItem: e => GM_getValue(e),
        setItem(e, t) {
            return GM_setValue(e, t), GM_setValue("LC", this), this.getItem(e)
        }
    };
    window.once = window.on;
    let moomooMenu = "#mainMenu",
        sploopMenu = "#homepage";
    document.addEventListener("keydown", (function(e) {
        "`" === e.key && ($(moomooMenu) && $(moomooMenu).toggle && ($(moomooMenu).toggle(), console.log("Toggled MooMoo")), $(sploopMenu) && $(sploopMenu).toggle && (document.querySelector(sploopMenu).style.display = "none" == document.querySelector(sploopMenu).style.display ? "flex" : "none", console.log("Toggled Sploop")))
    })), $("#consentBlock").css({
        display: "none"
    }), $("#mapDisplay").css({
        background: "url('https://i.imgur.com/fgFsQJp.png')"
    });
    var [info2, myPlayer] = [window.info2 || {}, window.myPlayer || []];

    function pingcheck() {
        if (!location.href.includes("sploop")) {
            var e = document.createElement("h1");
            e.id = "Ping2", topInfoHolder.append(e), setInterval((() => {
                try {
                    e.innerText = pingDisplay.innerText + `DPS:${window.dps} Dir:${myPlayer.dir}`, 1 * pingDisplay.innerText.split(" ")[1].split(" m")[0] > window.pchek && chat(`Ping:${pingDisplay.innerText.split(" ")[1].split(" m")[0]}`)
                } catch {}
            }), 500), window.ping = 100, setInterval((() => {
                ping = 1 * pingDisplay.innerText.split(" ")[1].split(" m")[0], ping > window.pchek && chat(`Ping:${pingDisplay.innerText.split(" ")[1].split(" m")[0]}`)
            }), 500), ab = 1, i2 = 80, setInterval((() => {
                ping > pckech && chat(`ping:${ping}`)
            }), 500), window.pckech = 150
        }
    }
    window.selects = window.selects || [];
    var code_ = GM_getValue("styles.js"),
        excuted = !1;
    GM_getValue("styles.js") && (eval(code_), excuted = !0), console.log("Checking for styles updates"), fetch(styleUrl).then((e => e.text())).then((e => (GM_setValue("styles.js", e), e != code_ && console.log("Styles.js as updated"), !excuted && eval(e)))), fetch(wordWurl).then((e => e.json())).then((e => (GM_setValue("moowords", e), e.join() != badWords.join() && console.log("Filtered List updated"), e))).then((e => (badWords = e, reg = new RegExp(`(${[...new Set(badWords.join(" ").match(/[\w\d]+/gi))].join("|")})`, "gi")))),
        function() {
            const e = [];
            var t = {
                inventory: [],
                players: [],
                entities: {},
                buttons: {},
                boss: null,
                bossDrop: null,
                playerDrop: [],
                animals: [],
                bossDetected: !1,
                playerPosition: null
            };
            CanvasRenderingContext2D.prototype.drawImage, CanvasRenderingContext2D.prototype.clearRect;
            const n = e => ({
                x: e.width / 2,
                y: e.height / 2
            });
            window.imagesArray = e, window.tracer = e => {
                const {
                    boss: o,
                    bossDrop: i,
                    playerDrop: l,
                    players: a
                } = t;
                let s = n();
                if (s) {
                    if (e.strokeStyle = "yellow", e.lineWidth = 1.5, o) {
                        e.beginPath(), e.moveTo(s.x + s.width / 2, s.y + s.height / 2);
                        const t = o.centerX || o.x + o.width / 2,
                            n = o.centerY || o.y + o.height / 2;
                        e.lineTo(t, n), e.stroke()
                    }
                    i && (e.beginPath(), e.moveTo(s.x + s.width / 2, s.y + s.height / 2), e.lineTo(i.x + i.width / 2, i.y + i.height / 2), e.stroke()), l.length > 0 && l.forEach((t => {
                        e.beginPath(), e.moveTo(s.x + s.width / 2, s.y + s.height / 2), e.lineTo(t.x + t.width / 2, t.y + t.height / 2), e.stroke()
                    })), a.length > 0 && a.forEach((t => {
                        e.beginPath(), e.moveTo(s.x + s.width / 2, s.y + s.height / 2), e.lineTo(t.x + t.width / 2, t.y + t.height / 2), e.stroke()
                    }))
                }
            }
        }()
}();