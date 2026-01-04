// ==UserScript==
// @name         Шаблоны Ксю
// @version      0.2
// @description  ///+перевод шаблонов
// @author       Gusev
// @include        https://taximeter-admin.taxi.yandex-team.ru/dkb/Branding
// @include        https://taximeter-admin.taxi.yandex-team.ru/qc?exam=branding
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/396525/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%20%D0%9A%D1%81%D1%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/396525/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%20%D0%9A%D1%81%D1%8E.meta.js
// ==/UserScript==

const items = [
    {label: 'Стикеры',
    th: true},

    {text: 'отсутствует брендирование. Для получения статуса и приоритета, пожалуйста, оклейте машину. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
     am: 'Բացակայում է բրենդավորումը։ Կարգավիճակ և առաջնահերթություն ստանալու համար խնդրում ենք ավտոմեքենային բրենդային ձևավորում ավելացնել։ Բրենդավորման մասին ավելի մանրամասն կարող եք իմանալ հետևյալ հղումով՝ https://driver.yandex/branding_rules_2/)',
     az: 'brendləmə yoxdur. Status və prioritet əldə etmək üçün maşına brend nişanı yapışdırın. Brendləmə haqqında daha ətraflı öyrənmək üçün aşağıdakı keçidə keçin: (https://driver.support-uber.com)',
     est: 'Bränding puudub. Brandingu ja prioriteedi saamiseks, palun katke auto kleebisega. Täpsemalt saab kaubamärgistamisest teada lingi kaudu: (https://driver.yandex/branding_rules_2/)',
     geo: 'არ არის ბრენდირება. სტატუსისა და პრიორიტეტის მისაღებად გადააკარით ავტომობილს. ბრენდირების შესახებ დაწვრილებით შეგიძლიათ გაიგოთ ბმულზე: (https://driver.yandex/branding_rules_2/)',
     kaz: 'брендинг жоқ. Мәртебе мен басымдық алу үшін машинаға жапсырма жапсыруды өтінеміз. Брендинг туралы толығырақ мына сілтеме арқылы білуге болады: (https://driver.yandex/branding_rules_2/)',
     kgz: 'брендинг жок. Статус жана артыкчылык алуу үчүн унааны чаптаңыз. Брендинг тууралуу кеңири маалыматты бул шилтеме аркылуу алсаңыз болот: (https://driver.yandex/branding_rules_2/)',
     lat: 'auto nav brendots. Lai iegūtu statusu un prioritāti, lūdzu, aplīmējiet automašīnu. Vairāk informācijas par brendingu var atrast, sekojot saitei: (https://driver.yandex/branding_rules_2/)',
     ltu: 'nėra prekės ženklų. Kad gautumėte statusą ir prioritetą, aplipdykite automobilį. Išsamią informaciją apie prekės ženklo naudojimą rasite apsilankę: (https://driver.yandex/branding_rules_2/)',
     rou: 'lipsește branding-ul. Pentru a primi un statut și prioritate, vă rugăm să lipiți autocolantele pe mașină. Mai multe detalii despre branding pot fi găsite la adresa: (https://driver.yandex/branding_rules_2/)',
     cro: 'nema brendinga. Kako biste dobili status i prioritet, molimo vas da brendirate svoj automobil. Detaljnije o brendiranju možete saznati na linku: (https://driver.yandex/branding_rules_2/)',
     uzb: 'brending mavjud emas. Maqom va ustuvorlikka erishish uchun, iltimos, mashinaga yopishtirma yorliqlarni joylashtiring. Brending toʻgʻrisidagi batafsil maʼlumotlarni havola orqali bilib olishingiz mumkin: (https://driver.yandex/branding_rules_2/)'},

    {text: 'оклейка не соответствует стандартам. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
    am: 'Բրենդային ձևավորումը չի համապատասխանում ստանդարտներին։ Բրենդավորման մասին ավելի մանրամասն կարող եք իմանալ հետևյալ հղումով՝ https://driver.yandex/branding_rules_2/)',
    az: 'yapışdırılan brend nişanı standartlara uyğun deyil. Brendləmə haqqında daha ətraflı öyrənmək üçün aşağıdakı keçidə keçin: (https://driver.support-uber.com)',
    est: 'kleebis ei vasta standarditele. Täpsemalt saab brändingust teada lingi kaudu: (https://driver.yandex/branding_rules_2/)',
    geo: 'გადაკვრა არ შეესაბამება სტანდარტებს. ბრენდირების შესახებ დაწვრილებით შეგიძლიათ გაიგოთ ბმულზე: (https://driver.yandex/branding_rules_2/)',
    kaz: 'жапсырма стандарттарға сай емес. Брендинг туралы толығырақ мына сілтеме арқылы білуге болады: (https://driver.yandex/branding_rules_2/)',
    kgz: 'чаптама стандарттарга шай келбейт. Брендинг тууралуу кеңири маалыматты бул шилтеме аркылуу алсаңыз болот: (https://driver.yandex/branding_rules_2/)',
    lat: 'virsmas marķējums neatbilst standartiem. Vairāk informācijas par brendingu var atrast, sekojot saitei: (https://driver.yandex/branding_rules_2/)',
    ltu: 'lipdukai neatitinka standartų. Išsamią informaciją apie prekės ženklo naudojimą rasite apsilankę: (https://driver.yandex/branding_rules_2/)',
    rou: 'aplicarea autocolantelor nu corespunde standardelor. Mai multe detalii despre branding pot fi găsite la adresa: (https://driver.yandex/branding_rules_2/)',
    cro:'Brendirane nalepnice nisu u skladu sa standardima. Detaljnije o brendiranju možete saznati na linku: (https://driver.yandex/branding_rules_2/)',
    uzb: 'brending yopishtirma qismi standartlarga mos kelmaydi. Brending toʻgʻrisidagi batafsil maʼlumotlarni havola orqali bilib olishingiz mumkin: (https://driver.yandex/branding_rules_2/)'},

    {only: 'оклейка не соответствует стандартам'},

    {only: 'есть сомнения в подлинности брендинга'},

    {text: 'оклейка заднего стекла не соответствует стандартам. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
    am: 'Հետևի ապակու բրենդային ձևավորումը չի համապատասխանում ստանդարտներին։ Բրենդավորման մասին ավելի մանրամասն կարող եք իմանալ հետևյալ հղումով՝ https://driver.yandex/branding_rules_2/)',
    az: 'arxa şüşəyə yapışdırılan brend nişanı standartlara uyğun deyil. Brendləmə haqqında daha ətraflı öyrənmək üçün aşağıdakı keçidə keçin: (https://driver.support-uber.com)',
    est: 'tagumise akna kleebis ei vasta standarditele. Täpsemalt saab brändingust teada lingi kaudu: (https://driver.yandex/branding_rules_2/)',
    geo: 'გადაკვრა უკანა საქარე მინაზე არ შეესაბამება სტანდარტებს ბრენდირების შესახებ დაწვრილებით შეგიძლიათ გაიგოთ ბმულზე: (https://driver.yandex/branding_rules_2/)',
    kaz: 'артқы әйнектің жапсырмасы стандарттарға сай емес. Брендинг туралы толығырақ мына сілтеме арқылы білуге болады: (https://driver.yandex/branding_rules_2/)',
    kgz: 'арткы айнектин чаптамасы стандарттарга шай келбейт. Брендинг тууралуу кеңири маалыматты бул шилтеме аркылуу алсаңыз болот: (https://driver.yandex/branding_rules_2/)',
    lat: 'aizmugurējā stikla virsmas marķējums neatbilst standartiem. Vairāk informācijas par brendingu var atrast, sekojot saitei: (https://driver.yandex/branding_rules_2/)',
    ltu: 'lipdukai ant galinio stiklo neatitinka standartų. Išsamią informaciją apie prekės ženklo naudojimą rasite apsilankę: (https://driver.yandex/branding_rules_2/)',
    rou: 'aplicarea autocolantelor pe parbrizul din spate nu corespunde standardelor. Mai multe detalii despre branding pot fi găsite la adresa: (https://driver.yandex/branding_rules_2/)',
    cro: 'brendirana nalepnica na zadnjem staklu nije u skladu sa standardima. Detaljnije o brendiranju možete saznati na linku: (https://driver.yandex/branding_rules_2/)',
    uzb: 'orqa oynaning brending yopishtirma qismi standartlarga mos kelmaydi. Brending toʻgʻrisidagi batafsil maʼlumotlarni havola orqali bilib olishingiz mumkin: (https://driver.yandex/branding_rules_2/)'},


    {text: 'невозможно подтвердить наклейку. Сфотографируйте, пожалуйста, ближе',
    am: 'Հնարավոր չէ հաստատել բրենդային ձևավորումը։ Խնդրում ենք ավելի մոտ լուսանկարել:',
    az: 'yapışdırmanı təsdiqləmək mümkün deyil. Fotoşəklini daha yaxından çəkin',
    est: 'kleebist pole võimalik kinnitada. Palun pildistage lähemalt',
    geo: 'სტიკერის დადასტურება შეუძლებელია. უფრო ახლოს გადაუღეთ',
    kaz: 'жапсырманы растау мүмкін емес Суретке жақынырақ түсіруіңізді өтінеміз',
    kgz: 'чаптаманы ырастоо мүмкүн эмес. Сүрөткө жакыныраактан тартыңыз',
    lat: 'nav iespējams apstiprināt virsmas marķējumu. Lūdzu, nofotografējiet tuvāk',
    ltu: 'neįmanoma patvirtinti lipduko. Nufotografuokite iš arčiau',
    rou: 'confirmarea aplicării autocolantului este imposibilă. Vă rugăm să fotografiați de mai aproape',
    cro: 'nemoguće je potvrditi nalepnicu. Molimo vas, fotografišite bliže',
    uzb: 'yopishqoq yorliqni tasdiqlashning iloji yoʻq. Iltimos, yaqinroqdan fotosuratga oling'},

    {text: 'темное фото не позволяет подтвердить оклейку. Рекомендуем выбрать более освещенное место',
    am: 'Մուգ լուսանկարը թույլ չի տալիս հաստատել բրենդային ձևավորումը։ Խորհուրդ ենք տալիս ավելի լուսավոր տեղ ընտրել:',
    az: 'qaranlıq fotoşəkil brend nişanını təsdiqləməyə imkan vermir. Daha işıqlı yer seçməyi tövsiyə edirik',
    est: 'tume ülesvõte ei võimalda kleebist kinnitada. Soovitame valida valgusküllasema koha',
    geo: 'ბნელი ფოტო არ იძლევა გადაკვრის დადასტურების საშუალებას. გირჩევთ, აირჩიოთ უფრო განათებული ადგილი',
    kaz: 'бұлыңғыр фото арқылы жапсырманы растау мүмкін емес. Барынша жарық орын таңдауға кеңес береміз',
    kgz: 'караңгы сүрөт чаптаманы ырастоого мүмкүн кылбайт. Жарыгыраак жерге барууну сунуштайбыз',
    lat: 'tumša fotogrāfija neļauj apstiprināt virsmas marķējumu. Ieteicams izvēlēties labāk apgaismotu vietu',
    ltu: 'dėl tamsios nuotraukos negalima patvirtinti lipduko. Rekomenduojame pasirinkti geriau apšviestą vietą',
    rou: 'o fotografie întunecată nu permite confirmarea branding-ului cu autocolante. Vă recomandăm să alegeți un loc mai luminos',
    cro: 'fotografija je previše tamna da bi se potvrdila brendirana nalepnica Predlažemo da odaberete mesto sa boljim osvetljenjem.',
    uzb: 'fotosurat qorongʻi joyda olinganligi sababli brending yopishtirma qismini tasdiqlashning imkoni yoʻq. Yorugʻroq joyni tanlashni tavsiya etamiz'},

    {text: 'нет ни одной фотографии автомобиля',
    am: 'չկա ավտոմեքենայի որևէ լուսանկար',
    az: 'avtomobilin heç bir fotoşəkli yoxdur',
    est: 'sõidukist pole ühtegi ülesvõtet',
    geo: 'ავტომანქანის არცერთი ფოტო არ არის',
    kaz: 'автокөліктің бірде бір фотосуреті жоқ',
    kgz: 'автоунаанын бир дагы сүрөтү жок',
    lat: 'nav nevienas automašīnas fotogrāfijas',
    ltu: 'nėra nė vienos automobilio nuotraukos',
    rou: 'nu a fost încărcată nicio fotografie a automobilului',
    cro: 'ne postoji nijedna fotografija vozila',
    uzb: 'avtomobilning bitta ham fotosurati yoʻq'},

    {text: 'брендированная наклейка попала в кадр не полностью',
    am: 'բրենդավորված նշանը կադրում լրիվ չի երևում',
    az: 'brendlənmiş yapışdırma kadra tam düşməyib',
    est: 'Brändiga kleebis ei sattunud üleni kaadrisse',
    geo: 'ბრენდირებული სტიკერი კადრში არასრულად მოხვდა',
    kaz: 'брендинг жапсырмасы кадрға толық түспеген',
    kgz: 'брендинг чаптамасы кадрга толук түшпөй калган',
    lat: 'brendinga uzlīme kadrā nav redzama pilnā apmērā',
    ltu: 'nuotraukoje matosi ne visas prekės ženklo lipdukas',
    rou: 'autocolantul de branding nu a intrat complet în cadru',
    cro: 'brendirana nalepnica nije cela u kadru',
    uzb: 'brending yopishqoq yorligʻi kadrga toʻliq tushmagan'},

    {text: 'нечеткое фото не позволяет подтвердить оклейку',
    am: 'ոչ հստակ լուսանկարը թույլ չի տալիս հաստատել բրենդային ձևավորումը',
    az: 'bulanıq fotoşəkil brend nişanını təsdiqləməyə imkan vermir',
    est: 'ebaselge ülesvõte ei võimalda kleebist kinnitada',
    geo: 'ბუნდოვანი ფოტო არ იძლევა გადაკვრის დადასტურების საშუალებას',
    kaz: 'айқын емес фото арқылы жапсырманы растау мүмкін емес',
    kgz: 'даана тартылбаган сүрөт чаптаманы ырастабайт',
    lat: 'neskaidra fotogrāfija neļauj apstiprināt virsmas marķējumu',
    ltu: 'dėl neryškios nuotraukos negalima patvirtinti lipduko',
    rou: 'o fotografie neclară nu permite confirmarea branding-ului cu autocolante',
    cro: 'zbog mutne fotografije ne može se potvrditi brendirana nalepnica',
    uzb: 'fotosuratning xiraligi tufayli brending yopishtirma qismini tasdiqlashning imkoni yoʻq'},

    {text: 'ваш автомобиль не подлежит брендированию',
    am: 'ձեր ավտոմեքենան բրենդավորման ենթակա չէ',
    az: 'avtomobiliniz brendləmə üçün yararlı deyil',
    est: 'teie sõiduk ei kuulu kaubamärgistamisele',
    geo: 'თქვენი ავტომანქანა არ ექვემდებარება ბრენდირებას',
    kaz: 'сіздің автокөлікке брендинг жасау мүмкін емес',
    kgz: 'автоунааңыз бренддегенге ылайык келбейт',
    lat: 'jūsu automašīnai brendings nevar tikt veikts',
    ltu: 'ant jūsų automobilio negalima naudoti prekės ženklo',
    rou: 'mașina dvs. nu poate fi supusă branding-ului',
    cro: 'vaš automobil nije pogodan za brendiranje',
    uzb: 'sizning avtomobilingiz brending qilishga toʻgʻri kelmaydi'},

    {text: 'фотографирование автомобиля с экрана компьютера является грубым нарушением',
    am: 'ավտոմեքենայի լուսանկարումը համակարգչի էկրանից կոպիտ խախտում է',
    az: 'avtomobilin fotoşəklinin kompüterin ekranından çəkilməsi kobud pozuntudur',
    est: 'sõiduki pildistamist arvutiekraanilt loetakse raskeks rikkumiseks',
    geo: 'კომპიუტერის ეკრანიდან გადაღებული ავტომანქანის ფოტოები წარმოადგენს უხეშ დარღვევას',
    kaz: 'автокөлікті компьютер экранынан суретке түсіру өрескел бұзушылық болып табылады',
    kgz: 'автоунааны компьютердин экранынан сүрөткө тартуу эрежени одоно бузуу болуп саналат.',
    lat: 'automašīnas fotografēšana no datora ekrāna ir rupjš pārkāpums',
    ltu: 'automobilio fotografavimas naudojant kompiuterio ekraną yra grubus pažeidimas',
    rou: 'fotografierea unei mașini de pe ecranul unui computer este o încălcare gravă',
    cro: 'fotografisanje vozila sa ekrana kompjutera predstavlja grub prekršaj.',
    uzb: 'avtomobilni kompyuterning ekranidan fotosuratga olish qoʻpol buzilish deb hisoblanadi'},

    {text: 'оклейка повреждена',
    am: 'բրենդային ձևավորումը վնասված է',
    az: 'brend nişanı zədələnib',
    est: 'kleebis on kahjustatud',
    geo: 'გადაკვრა დაზიანებულია',
    kaz: 'жапсырма бүлінген',
    kgz: 'чаптамасы бузулган',
    lat: 'virsmas marķējums bojāts',
    ltu: 'pažeistas lipdukas',
    rou: 'autocolantul este deteriorat',
    cro: 'brendirane nalepnice su oštećene',
    uzb: 'brending yopishtirma qismi shikastlangan'},

    {text: 'брендирование не соответствует требованиям сервиса. Размещать любую рекламу на брендированном автомобиле можно только по согласованию с Яндекс.Такси. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
    am: 'Բրենդավորումը չի համապատասխանում ծառայության պահանջներին։ Բրենդավորված ավտոմեքենայի վրա ցանկացած գովազդի տեղադրումը հնարավոր է միայն Yandex.Taxi-ի հետ համաձայնեցնելուց հետո։ Ավելի մանրամասն տեղեկատվություն կարող եք ստանալ հետևյալ հղումով՝ https://driver.yandex/branding_rules_2/)',
    az: 'brendləmə xidmət tələblərinə uyğun deyil. Brendlənmiş avtomobildə hər hansı reklamın yerləşdirilməsi yalnız Uber ilə razılaşdırıldıqdan sonra mümkündür. Daha ətraflı məlumat əldə etmək üçün aşağıdakı keçiddən yararlanın: (https://driver.support-uber.com)',
    est: 'kaubamärgistamine ei vasta teeninduse nõuetele. Mistahes reklaami võib bränditud sõidukile paigaldada ainult Yandex.Taxi‘ga kooskõlastatult. Täpsema teabe saamiseks klõpsake lingil: (https://driver.yandex/branding_rules_2/)',
    geo: 'ბრენდირება არ შეესაბამება სერვისის მოთხოვნებს. ნებისმიერი რეკლამის განთავსება ბრენდირებულ ავტომანქანაზე შესაძლებელია მხოლოდ Yandex.Taxi-სთან შეთანხმებით. დეტალური ინფორმაციისთვის გადადით ბმულზე: (https://driver.yandex/branding_rules_2/)',
    kaz: 'брендинг сервис талаптарына сай келмейді. Брендинг жасалған автокөлікке тек Яндекс.Такси келісімі бойынша кез келген жарнама орналастыруға болады. Толығырақ ақпарат алу үшін мына сілтеме арқылы өтіңіз: (https://driver.yandex/branding_rules_2/)',
    kgz: 'брендинг сервистин талаптарына туура келбейт. Брендделген автоунаага ар кандай жарнамаларды Яндекс.Такси менен макулдашкан соң гана жайгаштырса болот. Кеңири маалымат алүү үчүн шилтеме аркылуу өтүңүз: (https://driver.yandex/branding_rules_2/)',
    lat: 'brendings neatbilst servisa prasībām. Izvietot jebkura veida reklāmu uz automašīnas, kuras virsbūvei veikts brendings, atļauts vienīgi, saņemot Yandex.Taxi piekrišanu. Lai iegūtu vairāk informācijas, sekojiet saitei: (https://driver.yandex/branding_rules_2/)',
    ltu: 'prekės ženklai neatitinka mūsų reikalavimų. Dėti reklamą ant automobilio su mūsų prekės ženklu galima tik susitarus su Yandex.Taxi. Išsamią informaciją rasite apsilankę šiuo adresu: (https://driver.yandex/branding_rules_2/)',
    rou: 'branding-ul nu îndeplinește cerințele serviciului. Orice publicitate poate fi plasată pe un automobil branduit numai cu acordul Yandex.Taxi. Pentru informații detaliate, accesați linkul: (https://driver.yandex/branding_rules_2/)',
    cro: 'brendiranje nije u skladu sa zahtevima servisa. Postavljanje bilo kakvih reklama na brendiran automobil je moguće tek nakon dogovora sa Yandex.Taxi-jem. Za detaljnije informacije posetite link: (https://driver.yandex/branding_rules_2/)',
    uzb: 'brending xizmatning talablariga mos kelmaydi. Brending qilingan avtomobilga har qanday reklamani, faqatgina Yandex.Taxi bilan kelishilgan holda joylashtirish mumkin. Batafsil maʼlumot uchun havola orqali oʻting: (https://driver.yandex/branding_rules_2/)'},

    {text: 'автомобиль на фото не соответствует тому, что указан в профиле. Обновить данные в профиле может ваш таксопарк',
    am: 'Լուսանկարում պատկերված ավտոմեքենան չի համապատասխանում անձնական բաժնում նշվածին։ Անձնական բաժնի տվյալները կարող է թարմացնել ձեր տաքսոպարկը:',
    az: 'fotoşəkildəki avtomobil profildə qeyd olunana uyğun gəlmir. Profildə olan məlumatları taksi parkınız yeniləyə bilər',
    est: 'ülesvõttel olev sõiduk ei vasta profiilis märgitule. Profiilis saab andmeid uuendada teie taksofirma',
    geo: 'ფოტოზე არსებული ავტომანქანა არ შეესაბამება იმას, რაც პროფილშია მითითებული. პროფილში მონაცემების განახლება შეუძლია თქვენს ტაქსოპარკს',
    kaz: 'суреттегі автокөлік парақшада көрсетілген көлікке сай келмейді. Сіздің парақшаңыздағы мәліметтерді сіздің таксопарк жаңарта алады',
    kgz: 'сүрөттөгү автоунаа профилде көрсөтүлгөн унаага туура келбейт. Профилдеги маалыматтарды сиздин таксопаркыңыз жаңырта алат.',
    lat: 'fotogrāfijā redzamā automašīna neatbilst profilā norādītajam. Atjaunot profila informāciju var jūsu taksometru parks',
    ltu: 'automobilis nuotraukoje neatitinka nurodyto profilyje. Profilio duomenis gali atnaujinti Jūsų automobilių parkas',
    rou: 'automobilul din fotografie nu coincide cu cel menționat în profil. Datele de profil pot fi actualizate de compania dvs. de taximetrie',
    cro: 'vozilo na fotografijama ne odgovara podacima koji su navedeni na profilu. Vaše taksi udruženje može da ažurira podatke na profilu.',
    uzb: 'fotosuratdagi avtomobil, profilda koʻrsatilganga mos kelmaydi. Sizning taksoparkingiz profildagi maʼlumotlarni yangilashi mumkin'},

    {text: 'брендирование данного типа неактуально и не соответствует требованиям сервиса. Обновите брендирование в соответствии с новыми требованиями. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
    am: 'Տվյալ տիպի բրենդավորումը արդիական չէ և չի համապատասխանում ծառայության պահանջներին։ Թարմացրեք բրենդավորումը նոր պահանջներին համապատասխան։ Ավելի մանրամասն տեղեկատվություն կարող եք ստանալ հետևյալ հղումով՝ https://driver.yandex/branding_rules_2/)',
    az: 'bu növ brendləmə zəruri deyil və xidmət tələblərinə uyğun deyil. Brendləməni yeni tələblərə uyğun olaraq yeniləyin. Daha ətraflı məlumat əldə etmək üçün aşağıdakı keçiddən yararlanın: (https://driver.support-uber.com)',
    est: 'seda tüüpi bränditamine pole päevakohane ja ei vasta teeninduse nõuetele. Uuendage kaubamärgistus vastavalt uutele nõuetele. Täpsema teabe saamiseks klõpsake lingil: (https://driver.yandex/branding_rules_2/)',
    geo: 'ამ ტიპის ბრენდირება არ არის აქტუალური და არ შეესაბამება სერვისის მოთხოვნებს. განაახლეთ ბრენდირება ახალი მოთხოვნების შესაბამისად. დეტალური ინფორმაციისთვის გადადით ბმულზე: (https://driver.yandex/branding_rules_2/)',
    kaz: 'берілген түрдегі брендинг өзекті емес және сервис талаптарына сай келмейді. Брендингті жаңа талаптарға сай жаңартыңыз. Толығырақ ақпарат алу үшін мына сілтеме арқылы өтіңіз: (https://driver.yandex/branding_rules_2/)',
    kgz: 'мындай түрдөгү брендинг актуалдуу эмес жана сервистин талаптарына ылайык келбейт. Брендингди жаңы талаптарга ылайык кылып жаңыртыңыз. Кеңири маалымат алүү үчүн шилтеме аркылуу өтүңүз: (https://driver.yandex/branding_rules_2/)',
    lat: 'šāda veida brendings nav aktuāls un neatbilst servisa prasībām. Atjaunojiet automašīnas brendingu atbilstoši jaunām prasībām. Lai iegūtu vairāk informācijas, sekojiet saitei: (https://driver.yandex/branding_rules_2/)',
    ltu: 'šio tipo prekės ženklai yra pasenę ir neatitinka mūsų reikalavimų. Atnaujinkite prekės ženklus pagal naujus reikalavimus. Išsamią informaciją rasite apsilankę šiuo adresu: (https://driver.yandex/branding_rules_2/)',
    rou: 'branding-ul de acest tip nu este actual și nu îndeplinește cerințele serviciului. Actualizați brandingul în conformitate cu noile cerințe. Pentru informații detaliate, accesați link-ul: (https://driver.yandex/branding_rules_2/)',
    cro: 'brendiranje ovog tipa nije aktuelno i ne odgovara zahtevima servisa. Obnovite brendiranje u skladu sa novim zahtevima. Za detaljnije informacije posetite link: (https://driver.yandex/branding_rules_2/)',
    uzb: 'bunday turdagi brending hozirgi kunda ahamiyatga ega emas va xizmatning talablariga mos kelmaydi. Brendingni yangi talablarga muvofiq yangilang. Batafsil maʼlumot uchun havola orqali oʻting: (https://driver.yandex/branding_rules_2/)'},,

    {only: 'брендирование данного типа неактуально и не соответствует требованиям сервиса. Обновите брендирование в соответствии с новыми требованиями'},

    {label: 'Лайтбоксы',
    th: true},

    {text: 'отсутствует световой короб. Для получения статуса и приоритета, пожалуйста, установите его',
    am: 'Բացակայում է լայթբոքսը։ Կարգավիճակ և առաջնահերթություն ստանալու համար խնդրում ենք տեղադրել այն:',
    az: 'laytboks yoxdur. Status və prioritet əldə etmək üçün onu quraşdırın',
    est: 'puudub plafoon. Sotsiaalse seisundi ja esimuse saamiseks palun paigaldage see',
    geo: 'არ არის ლაითბოქსი. სტატუსისა და პრიორიტეტის მისაღებად დააყენეთ ის',
    kaz: 'лайтбокс жоқ. Мәртебе мен басымдық алу үшін оны орнатуды өтінеміз',
    kgz: 'лайтбокс жок. Статус жана артыкчылыкты алуу үчүн аны орнотуңүз',
    lat: 'nav gaismas pazīšanas zīmes. Lai iegūtu statusu un prioritāti, lūdzu, uzstādiet to',
    ltu: 'nėra plafono. Uždėkite plafoną, kad gautumėte statusą ir prioritetą',
    rou: 'caseta luminoasă lipsește. Pentru a primi un statut și prioritate, vă rugăm să o instalați',
    cro: 'nedostaje svetleća tabla. Kako biste dobili status i prioritet, molimo vas da je stavite.',
    uzb: 'chiroqli laytboks mavjud emas. Maqom va ustuvorlikka erishish uchun, iltimos, uni oʻrnating'},

    {text: 'брендирование такого типа устарело. Об актуальном брендировании вы можете узнать по ссылке: (https://driver.yandex/branding_rules_2/)',
    am: 'Նմանատիպ բրենդավորումը հնացել է։ Արդիական բրենդավորման մասին կարող եք իմանալ հետևյալ հղումով՝ https://driver.yandex/branding_rules_2/)',
    az: 'bu növ brendləmə köhnəlib. Zəruri brendləmə haqqında öyrənmək üçün aşağıdakı keçiddən yararlanın: (https://driver.support-uber.com)',
    est: 'see kaubamärgistamise tüüp on vananenud. Päevakohase kaubamärgistamise kohta võite teada saada lingi kaudu: (https://driver.yandex/branding_rules_2/)',
    geo: 'ასეთი ტიპის ბრენდირება მოძველებულია. აქტუალური ბრენდირების შესახებ შეგიძლიათ გაიგოთ ბმულზე: (https://driver.yandex/branding_rules_2/)',
    kaz: 'мұндай түрдегі брендинг ескірген. Өзекті брендинг туралы мына сілтеме арқылы білуге болады: (https://driver.yandex/branding_rules_2/)',
    kgz: 'мындай түрдөгү брендинг эскирип кеткен. Актуалдуу брендинг тууралуу шилтеме аркылуу биле аласыз: (https://driver.yandex/branding_rules_2/)',
    lat: 'šāda veida brendings ir novecojis. Par aktuālo brendingu jūs varat uzzināt, sekojot saitei: (https://driver.yandex/branding_rules_2/)',
    ltu: 'šio tipo prekės ženklai yra pasenę. Apie dabar naudojamus prekės ženklus galite sužinoti apsilankę šiuo adresu: (https://driver.yandex/branding_rules_2/)',
    rou: 'branding-ul de acest tip este învechit. Informații despre branding-ul actual pot fi găsite la adresa: (https://driver.yandex/branding_rules_2/)',
    cro: 'ovaj tip brendiranja je zastareo. O aktuelnom brendiranju se možete informisati na linku: (https://driver.yandex/branding_rules_2/)',
    uzb: 'bunday turdagi brending eskirgan. Hozirgi kunda ahamiyatga ega brending toʻgʻrisida havola oraqli bilib olishingiz mumkin: (https://driver.yandex/branding_rules_2/)'},

    {text: 'световой короб не закреплен. Для получения статуса и приоритета, пожалуйста, закрепите короб',
    am: 'Լայթբոքսն ամրացված չէ։ Կարգավիճակ և առաջնահերթություն ստանալու համար խնդրում ենք ամրացնել լայթբոքսը:',
    az: 'laytboks bərkidilməyib. Status və prioritet əldə etmək üçün laytboksu bərkidin',
    est: 'plafoon pole kinnitatud. Brändingu ja prioriteedi saamiseks palun kinnitage plafoon',
    geo: 'ლაითბოქსი არ არის დამაგრებული. სტატუსისა და პრიორიტეტის მისაღებად, გთხოვთ, დაამაგროთ ლაითბოქსი',
    kaz: 'лайтбокс бекітілмеген. Мәртебе мен басымдық алу үшін лайтбоксты бекітуіңізді өтінеміз',
    kgz: 'лайтбокс карматылган эмес. Статус жана артыкчылык алуу үчүн лайтбоксту карматыңыз.',
    lat: 'gaismas pazīšanas zīme nav nostiprināta. Lai iegūtu statusu un prioritāti, lūdzu, nostipriniet gaismas pazīšanas zīmi',
    ltu: 'plafonas nepritvirtintas. Pritvirtinkite plafoną, kad gautumėte statusą ir prioritetą',
    rou: 'caseta luminoasă nu este fixată. Pentru a primi un statut și prioritate, vă rugăm să fixați caseta',
    cro: 'svetleća tabla nije pričvršćena. Kako biste dobili status i prioritet, molimo vas da pričvrstite svetleću tablu',
    uzb: 'chiroqli laytboks mahkamlab qoʻyilmagan. Maqom va ustuvorlikka erishish uchun, iltimos, chiroqli laytboksni mahkamlab qoʻying'}
],
      remarks = [
          {label: 'НЕ ИСПОЛЬЗУЕМ',
          th: true}
      ],

      countryTranslate = {
          Russian: 'РФ',
          Armenian: 'Армения',
          Azerbian: 'Азербайджан',
          Estonian: 'Эстония',
          Georgian: 'Грузия',
          Kazahstan: 'Казахстан',
          Kyrgyz: 'Киргизия',
          Latvian: 'Латвия',
          Lithuanian: 'Литва',
          Romanian: 'Румыния',
          Croatia: 'Хорватия',
          Uzbek: 'Узбекистан',
      },

      cities = {
          Armenian: ["Араратская область","Ванадзор","Горис","Гюмри","Ереван","Капан","Котайкская область", "Армавирская область"],
          Azerbian: ["Баку"],
          Estonian: ["Таллин","Тарту"],
          Georgian: ["Батуми","Кутаиси","Рустави","Тбилиси"],
          Kazahstan: ["Актау","Актобе","Алматы","Астана","Атырау","Караганда","Кокшетау","Костанай","Кызылорда","Павлодар","Петропавловск","Семей","Темиртау","Тараз","Туркестан","Уральск","Усть-Каменогорск","Шымкент","Экибастуз","Жезказган","Талдыкорган"],
          Kyrgyz: ["Бишкек","Ош"],
          Latvian: ["Рига"],
          Lithuanian: ["Вильнюс"],
          Romanian: ["Бухарест"],
          Croatia: ["Загреб", "Сплит", "Риека", "Осиек"],
          Uzbek: ["Ташкент"]
      }

document.querySelector('.modal-dialog').style.width = '50%'

const commentList = document.getElementById('comment-list'),
      btnBlock = document.getElementById('btn-block'),
      btnRemarks = document.getElementById('btn-dkb-minor-remarks'),

      head = document.querySelector('head'),
      style = document.createElement('style'),

      divTranslate = document.createElement('div'),
      select = document.createElement('select'),
      templateList = document.createElement('ul')

//inline style
head.append(style)
style.innerHTML = '.templates-item{border-bottom: 1px solid #cacaca; padding: 4px 8px;}.template-head{background-color:#d8e6ea;font-weight:bold;padding:2px 10px}.templates-item:hover{background-color: #f3f3f3; cursor: pointer}'
//вставка селекта перевод
commentList.style.width = '100%'
commentList.before(divTranslate)
divTranslate.append(select)
//стили селекта
select.style = 'float: right; margin: 5px'
//заполнение селекта
for (let key in countryTranslate) select.innerHTML += `<option value="${key}">${countryTranslate[key]}</option>`

//функция автоматисекого выбора перевода от города и страны
let city
$(document).bind('item_info', function (e, params) {
    city = params.city;
    console.log(city)
});

const ifCity = () => {
    for (let key in cities) {
        if (cities[key].indexOf(city) >=0) {
            console.log(key)
            //cityOf(key)
            select.value = key
            return
        }
    }
}

//функция вставки и очистки списка
const resetList = () => {
    //очистка списка
    commentList.innerHTML = ''
    //вставка списка
    commentList.append(templateList)
    templateList.classList.add('list-group')

    templateList.innerHTML = ''
    select.disabled = false
    select.selectedIndex = 0
}
let renderItems
//функция выбора перевода и загрузки списка
function selectTranslate() {
    switch (select.value) {
        case 'Russian': items.map((item) => renderArr(item, (item.text || item.only), (item.text || item.only)))
            break
        case 'Armenian': {
            renderItems = items.filter((item) => item.label || item.am || item.text)
            renderItems.map((item) => renderArr(item, item.am, item.text))
            break
        }
        case 'Azerbian': {
            renderItems = items.filter((item) => item.label || item.az || item.text)
            renderItems.map((item) => renderArr(item, item.az, item.text))
            break
        }
        case 'Estonian': {
            renderItems = items.filter((item) => item.label || item.est || item.text)
            renderItems.map((item) => renderArr(item, item.est, item.text))
            break
        }
        case 'Georgian': {
            renderItems = items.filter((item) => item.label || item.geo || item.text)
            renderItems.map((item) => renderArr(item, item.geo, item.text))
            break
        }
        case 'Kazahstan': {
            renderItems = items.filter((item) => item.label || item.kaz || item.text)
            renderItems.map((item) => renderArr(item, item.kaz, item.text))
            break
        }
        case 'Kyrgyz': {
            renderItems = items.filter((item) => item.label || item.kgz || item.text)
            renderItems.map((item) => renderArr(item, item.kgz, item.text))
            break
        }
        case 'Latvian': {
            renderItems = items.filter((item) => item.label || item.lat || item.text)
            renderItems.map((item) => renderArr(item, item.lat, item.text))
            break
        }
        case 'Lithuanian': {
            renderItems = items.filter((item) => item.label || item.ltu || item.text)
            renderItems.map((item) => renderArr(item, item.ltu, item.text))
            break
        }
        case 'Romanian': {
            renderItems = items.filter((item) => item.label || item.rou || item.text)
            renderItems.map((item) => renderArr(item, item.rou, item.text))
            break
        }
        case 'Croatia': {
            renderItems = items.filter((item) => item.label || item.cro || item.text)
            renderItems.map((item) => renderArr(item, item.cro, item.text))
            break
        }
        case 'Uzbek': {
            renderItems = items.filter((item) => item.label || item.uzb || item.text)
            renderItems.map((item) => renderArr(item, item.uzb, item.text))
            break
        }
   }
}

//функция рендера массива
function renderArr(template, translate, text) {
    if (template.th) {
        templateList.innerHTML += `<li class='template-head'>${template.label}</li>`
    } else {
        templateList.innerHTML += `<li itemvalue='${translate}' class='templates-item'>${text}</li>`
    }
}

//функция фриза выбора перевода
const freeze = () => select.disabled = true

//события
btnBlock.addEventListener('click', () => {
    divTranslate.style.display = 'block'
    commentList.style.display = 'block'

    resetList()

    ifCity()
    selectTranslate()
})

btnRemarks.addEventListener('click', () => {
    divTranslate.style.display = 'none'
    commentList.style.display = 'block'

    resetList()
    remarks.map((item) => renderArr(item, item.text))
})

select.addEventListener('change', () => {

    //resetList()
    templateList.innerHTML = ''
    //ifCity()
    selectTranslate()
})

commentList.addEventListener('click', (event) => {

    const msgOriginal = document.getElementById('msg'),
          target = event.target

    if (!event.target.classList.contains('template-head')) {
        if (!msgOriginal.value) {
            msgOriginal.value = target.getAttribute('itemvalue')
            freeze()
        } else {
            freeze()
            msgOriginal.value = `${msgOriginal.value},\n${target.getAttribute('itemvalue')}`
        }
    }
})