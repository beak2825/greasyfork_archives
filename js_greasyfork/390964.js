// ==UserScript==
// @name         Брендинг шаблоны (Лена)
// @version      1.4
// @description  ///+перевод шаблонов
// @author       Youinvisible
// @include        https://taximeter-admin.taxi.yandex-team.ru/dkb/Branding
// @include        https://taximeter-admin.taxi.yandex-team.ru/qc?exam=branding
// @grant        none
// @namespace    https://greasyfork.org/ru/users/385595-elena-tuzikova
// @downloadURL https://update.greasyfork.org/scripts/390964/%D0%91%D1%80%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D0%B3%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%20%28%D0%9B%D0%B5%D0%BD%D0%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/390964/%D0%91%D1%80%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D0%B3%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%20%28%D0%9B%D0%B5%D0%BD%D0%B0%29.meta.js
// ==/UserScript==

const branding = [
    { label: 'Стикеры', th: true },
    {
      text:
        'отсутствует брендирование. Для получения статуса и приоритета, пожалуйста, оклейте машину. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
      am:
        'բացակայում է բրենդավորումը։ Կարգավիճակ և առաջնահերթություն ստանալու համար խնդրում ենք ավտոմեքենային բրենդային ձևավորում ավելացնել',
      az: 'brendləmə yoxdur. Status və prioritet əldə etmək üçün maşına brend nişanı yapışdırın.',
      est: 'kaubamärgistamine puudub. Staatuse ja prioriteedi saamiseks varusta auto palun kaubamärgikleebisega',
      geo: 'არ არის ბრენდირება. სტატუსისა და პრიორიტეტის მისაღებად გადააკარით ფირი მანქანას',
      kaz: 'брендинг жоқ. Мәртебе мен басымдық алу үшін машинаға жапсырма жапсырыңыз.',
      kgz: 'брендинг жок. Статус менен приоритетти алыш үчүн машинага чаптамаларды чаптатыңыз.',
      lat: 'nav brendinga. Lai iegūtu statusu un prioritāti, lūdzu, aplīmējiet automašīnu',
      ltu: 'nėra prekės ženklo. Apklijuokite automobilį, kad gautumėte statusą ir prioritetą',
      cro:
        'nema brendinga. Kako biste dobili status i prioritet, molimo vas da brendirate svoj automobil. Detaljnije o brendiranju možete saznati na linku: (https://driver.yandex/branding_rules_2/)',
      uzb: 'brendlash mavjud emas. Status va ustuvorlikka erishish uchun mashinaga brend yorliqlarini yopishtiring',
      gana: 'branding missing. Please apply a branded wrap to obtain this status and priority',
      mda: 'lipsește brandingul. Pentru a primi un statut și prioritate, te rugăm să aplici autocolante pe mașină',
      srb: 'nema brendinga. Kako biste dobili status i prioritet, molimo vas da brendirate automobil',
      kot: 'absence de branding. Veuillez appliquer un marquage pour obtenir ce statut et cette priorité',
      isr: 'חסר מיתוג. כדי להשיג את הסטטוס והקדימות האלה עליך להדביק מדבקת מיתוג על המונית',
      fin: 'brändäys puuttuu. Suorita ajoneuvon teippaus saadaksesi tämän tilan ja proriteetin',
    },
    {
      text:
        'использованы магнитные наклейки. Пожалуйста, оклейте машину в соответствии со стандартами, которые можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
      am:
        'օգտագործվել են մագնիսային նշաններ։ Խնդրում ենք ավտոմեքենայի բրենդային ձևավորումը կատարել ստանդարտներին համապատասխան',
      az: 'maqnit yapışdırmalardan istifadə olunub. Brend nişanını standartlara uyğun şəkildə yapışdırın',
      est: 'kasutatud on magnetkleebiseid. Palun varusta sõiduk standardikohase kleebisega',
      geo: 'გამოყენებულია მაგნიტური სტიკერები. გთხოვთ გადააკრათ ფირი მანქანას სტანდარტების შესაბამისად',
      kaz: 'магнит жапсырмалар қолданылған. Машинаға жапсырманы стандарттарға сәйкес етіп жабыстырыңыз',
      kgz: 'магниттик чаптамалар колдонулган. Өтүнүч, чаптамаларды машинага стандарттарга ылайык кылып чаптатыңыз',
      lat: 'izmantotas magnētiskās uzlīmes. Lūdzu, aplīmējiet automašīnu atbilstoši standartiem',
      ltu: 'panaudoti magnetiniai lipdukai. Apklijuokite automobilį pagal standartus',
      cro:
        'korišćene su magnetne nalepnice. Molimo vas da brendirate svoj automobil u skladu sa standardima o kojima se možete informisati na linku: (https://driver.yandex/branding_rules_2/)',
      uzb: 'magnitli yorliqlar ishlatilgan. Mashinaga materialni standartlarga muvofiq yopishtiring',
      gana: 'magnetic stickers used. Please brand your vehicle in accordance with the standards',
      mda:
        'au fost folosite autocolante magnetice. Te rugăm să aplici autocolante pe mașină în conformitate cu standardele',
      srb: 'korišćene su magnetne nalepnice. Molimo vas da brendirate automobil u skladu sa standardima',
      kot: 'des autocollants magnétiques ont été utilisés. Veuillez marquer votre véhicule conformément aux standards',
      isr: 'נעשה שימוש במגנטים. עליך למתג את המונית בהתאם לסטנדרטים',
      fin: 'käytetty magneettisia tarroja. Teippauta ajoneuvosi vaatimuksia vastaavalla tavalla',
    },
    {
      text:
        'оклейка не соответствует стандартам. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
      am: 'բրենդային ձևավորումը չի համապատասխանում ստանդարտներին',
      az: 'yapışdırılan brend nişanı standartlara uyğun deyil',
      est: 'kleebis ei vasta standardile',
      geo: 'გადაკვრა არ შეესაბამება სტანდარტებს',
      kaz: 'жапсырма стандарттарға сай емес',
      kgz: 'машинанын чаптамасы стандарттарга жооп бербейт',
      lat: 'virsmas marķējums neatbilst standartiem',
      ltu: 'lipdukai su prekės ženklu neatitinka standartų',
      cro:
        'Brendirane nalepnice nisu u skladu sa standardima. Detaljnije o brendiranju možete saznati na linku: (https://driver.yandex/branding_rules_2/)',
      uzb: 'yopishtirilgan material standartlarga mos emas',
      gana: 'branded wrap in violation of standards',
      mda: 'aplicarea autocolantelor nu corespunde standardelor',
      srb: 'brendirane nalepnice nisu u skladu sa standardima',
      kot: 'le marquage ne répond pas aux standards',
      isr: 'המדבקה לא עומדת בסטנדרטים',
      fin: 'teippaus ei vastaa sille asetettuja vaatimuksia',
    },
    {only:'отсутствует оклейка заднего стекла. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)', },
    {
      text:
        'оклейка заднего стекла не соответствует стандартам. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
      am: 'հետևի ապակու բրենդային ձևավորումը չի համապատասխանում ստանդարտներին',
      az: 'arxa şüşəyə yapışdırılan brend nişanı standartlara uyğun deyil',
      est: 'tagumise akna kleebis ei vasta standardile',
      geo: 'გადაკვრა უკანა საქარე მინაზე არ შეესაბამება სტანდარტებს',
      kaz: 'артқы әйнектің жапсырмасы стандарттарға сай емес',
      kgz: 'арткы айнектин чаптамасы стандарттарга жооп бербейт',
      lat: 'aizmugurējā stikla virsmas marķējums neatbilst standartiem',
      ltu: 'galinio lango lipdukas su prekės ženklu neatitinka standartų',
      cro:
        'brendirana nalepnica na zadnjem staklu nije u skladu sa standardima. Detaljnije o brendiranju možete saznati na linku: (https://driver.yandex/branding_rules_2/)',
      uzb: 'orqa oynaga yopishtirilgan material standartlarga mos emas',
      gana: 'rear window branded wrap in violation of standards',
      mda: 'aplicarea autocolantelor pe parbrizul din spate nu corespunde standardelor',
      srb: 'brendirana nalepnica na zadnjem staklu nije u skladu sa standardima',
      kot: 'le marquage de la lunette arrière ne répond pas aux standards',
      isr: 'המדבקה שעל השמשה האחורית לא עומדת בסטנדרטים',
      fin: 'takaikkunan teippaus ei vastaa sille asetettuja vaatimuksia',
    },
    {
      text: 'САМОДЕЛЫ',
      textFin: 'САМОДЕЛЫ',
      menu: true,
    },
    { text: 'АВТО', textFin: 'АВТО', menu: true },
    {
      text: 'есть сомнения в подлинности брендинга',
      am: 'կասկածներ կան բրենդինգի իսկության վերաբերյալ',
      az: 'brendinqin orijinallığı ilə bağlı şübhə var',
      est: 'kaubamärgistamise autentsuses on kahtlusi',
      geo: 'ბრენდინგის ნამდვილობა საეჭვოა',
      kaz: 'брендингтің шынайылығына күмән бар',
      kgz: 'брендингдин аныктыгында күмөн бар',
      lat: 'ir aizdomas par to, ka brendings ir viltots',
      ltu: 'kyla abejonių dėl prekės ženklo autentiškumo',
      cro: '',
      uzb: 'brending haqiqiyligi shubha ostida',
      gana: 'uncertainty about branding authenticity',
      mda: 'există suspiciuni cu privire la autenticitatea brandingului',
      srb: 'postoje sumnje u autentičnost brendinga',
      kot: 'incertitude relative à l`authenticité du branding',
      isr: 'חשד שמדבקת המיתוג מזויפת',
      fin: 'epäselvyyksiä teippauksen oikeellisuudesta',
    },
    {
      text:
        'автомобиль на фото не соответствует тому, что указан в профиле. Обновить данные в профиле может ваш таксопарк',
      am:
        'լուսանկարում պատկերված ավտոմեքենան չի համապատասխանում անձնական էջում նշվածին։ Անձնական էջի տվյալները կարող է նորացնել ձեր տաքսոպարկը',
      az:
        'fotoşəkildəki avtomobil profildə qeyd olunana uyğun gəlmir. Profildə olan məlumatları taksi parkınız yeniləyə bilər',
      est: 'fotol olev sõiduk ei vasta profiilis märgitule. Profiilis saab andmeid uuendada sinu taksofirma',
      geo:
        'ფოტოზე არსებული ავტომანქანა არ შეესაბამება იმას, რაც პროფილშია მითითებული. პროფილში მონაცემების განახლება შეუძლია თქვენს ტაქსოპარკს',
      kaz:
        'суреттегі автокөлік парақшада көрсетілген көлікке сай келмейді. Сіздің парақшаңыздағы мәліметтерді сіздің таксопарк жаңарта алады',
      kgz:
        'сүрөттөгү автоунаа профилде көрсөтүлгөн машинага туура келбейт. Профилдеги маалыматтарды сиздин таксопаркыңыз жаңырта алат',
      lat:
        'fotogrāfijā redzamā automašīna neatbilst profilā norādītajai. Jūsu taksometru parks var atjaunot profila informāciju',
      ltu:
        'automobilis nuotraukoje neatitinka nurodyto profilyje. Profilio duomenis gali atnaujinti Jūsų automobilių parkas',
      mda:
        'automobilul din fotografie nu coincide cu cel menționat în profil. Datele de profil pot fi actualizate de compania ta de taximetrie',
      cro:
        'vozilo na fotografijama ne odgovara podacima koji su navedeni na profilu. Vaše taksi udruženje može da ažurira podatke na profilu.',
      uzb:
        'fotosuratdagi avtomobil profilda koʻrsatilganga mos kelmaydi. Sizning taksoparkingiz profildagi maʼlumotlarni yangilashi mumkin',
      gana: "vehicle in the photo doesn't match vehicle indicated in profile. The taxi company can update your profile",
      srb:
        'vozilo na fotografijama ne odgovara podacima koji su navedeni na profilu. Podatke na profilu može da ažurira vaše taksi udruženje',
      kot:
        'le véhicule sur la photo ne correspond pas au véhicule indiqué dans le profil. Le partenaire peut mettre à jour votre profil',
      isr:
        'המונית המופיעה בצילום אינה תואמת למונית שפרטיה מופיעים בפרופיל. נציג תחנת המוניות יכול לעדכן את הפרופיל שלך',
      fin:
        'valokuvassa oleva ajoneuvo ei vastaa profiilissa ilmoitettua ajoneuvoa. Taksiyritys voi päivittää profiilisi',
    },
    {
      text:
        'брендирование данного типа неактуально и не соответствует требованиям сервиса. Обновите брендирование в соответствии с новыми требованиями. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
      am:
        'տվյալ տիպի բրենդավորումը արդիական չէ և չի համապատասխանում ծառայության պահանջներին։ Թարմացրեք բրենդավորումը նոր պահանջներին համապատասխան',
      az:
        'bu növ brendləmə qeyri-aktualdır və xidmət tələblərinə uyğun deyil. Brendləməni yeni tələblərə uyğun olaraq yeniləyin',
      est:
        'selline kaubamärgistamine pole ajakohane ega vasta teenuse nõuetele. Uuenda kaubamärgistus vastavalt ajakohastele nõuetele',
      geo:
        'ამ ტიპის ბრენდირება არ არის აქტუალური და არ შეესაბამება სერვისის მოთხოვნებს. განაახლეთ ბრენდირება ახალი მოთხოვნების შესაბამისად',
      kaz:
        'берілген түрдегі брендинг өзекті емес және сервис талаптарына сай келмейді. Брендингті жаңа талаптарға сәйкес етіп жаңартыңыз',
      kgz:
        'ушундай түрдөгү брендинг актуалдуу эмес жана сервистин талаптарына жооп бербейт. Брендингди жаңы талаптарга ылайык жаңыртыңыз',
      lat:
        'šāda veida brendings nav aktuāls un neatbilst servisa prasībām. Atjaunojiet automašīnas brendingu atbilstoši jaunajām prasībām',
      ltu:
        'šio tipo žymėjimas prekės ženklu neaktualus ir neatitinka paslaugos reikalavimų. Atnaujinkite žymėjimą prekės ženklu, atitinkančiu naujus reikalavimus',
      cro:
        'brendiranje ovog tipa nije aktuelno i ne odgovara zahtevima servisa. Obnovite brendiranje u skladu sa novim zahtevima. Za detaljnije informacije posetite link: (https://driver.yandex/branding_rules_2/)',
      uzb:
        'bunday turdagi brendlash hozirgi kunda eskirgan va xizmatning talablariga mos kelmaydi. Brendlashni joriy talablarga muvofiq yangilang.',
      gana:
        'this branding type is invalid and in violation of service standards. Update your branding in accordance with the new requirements',
      mda:
        'brandingul de acest tip nu este actual și nu îndeplinește cerințele serviciului. Actualizează brandingul în conformitate cu noile cerințe',
      srb:
        'brendiranje ovog tipa nije aktuelno i ne odgovara zahtevima servisa. Obnovite brending u skladu sa novim zahtevima',
      kot:
        'ce branding n`est pas conforme et ne répond pas aux standards de service. Veuillez modifier votre branding conformément aux nouvelles exigences',
      isr: 'סוג המיתוג הזה לא תקין ואינו עומד בסטנדרטים של השירות. עליך לעדכן את המיתוג בהתאם לדרישות החדשות',
      fin:
        'tämä brändäystyyppi on virheellinen eikä se vastaa palvelun vaatimuksia. Päivitä brändäyksesi uusien vaatimusten mukaiseksi',
    },
    {
     text:
        'брендирование не соответствует требованиям сервиса. Размещать любую рекламу на брендированном автомобиле можно только по согласованию с Яндекс.Такси. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
      am:
        'բրենդավորումը չի համապատասխանում ծառայության պահանջներին։ Բրենդավորված ավտոմեքենայի վրա ցանկացած գովազդի տեղադրումը հնարավոր է միայն համաձայնեցնելուց հետո',
      az:
        'brendləmə xidmət tələblərinə uyğun deyil. Brendlənmiş avtomobildə hər hansı reklamın yerləşdirilməsi yalnız razılaşdırıldıqdan sonra mümkündür',
      est:
        'kaubamärgistamine ei vasta teenuse nõuetele. Mistahes reklaami võib kaubamärgistatud sõidukile paigaldada ainult kokkuleppel',
      geo:
        'ბრენდირება არ შეესაბამება სერვისის მოთხოვნებს. ნებისმიერი რეკლამის განთავსება ბრენდირებულ ავტომანქანაზე შესაძლებელია მხოლოდ შეთანხმებით',
      kaz:
        'брендинг сервис талаптарына сай келмейді. Брендинг жасалған автокөлікке тек келісім бойынша кез келген жарнама орналастыруға болады.',
      kgz:
        'брендинг сервистин талаптарына жооп бербейт. Брендделген автоунаага макулдашуу боюнча гана жарнамаларды жайгаштырса болот',
      lat:
        'brendings neatbilst servisa prasībām. Uz automašīnas, kuras virsbūvei veikts brendings, jebkādu reklāmu izvietot drīkst tikai saskaņojot',
      ltu:
        'žymėjimas prekės ženklu neatitinka paslaugos reikalavimų. Bet kokią reklamą ant prekės ženklu pažymėto automobilio galima dėti tik susitarus',
      cro:
        'brendiranje nije u skladu sa zahtevima servisa. Postavljanje bilo kakvih reklama na brendiran automobil je moguće tek nakon dogovora sa Yandex.Taxi-jem. Za detaljnije informacije posetite link: (https://driver.yandex/branding_rules_2/)',
      uzb:
        'brendlash xizmatning talablariga mos kelmaydi. Brendlangan avtomobilga har qanday reklamani faqat kelishilgan tartibda joylashtirish mumkin',
      gana:
        'branding not in accordance with service requirements. Other advertisements can only be displayed on branded vehicles with formal approval',
      mda:
        'brandingul nu îndeplinește cerințele serviciului. Orice publicitate poate fi plasată pe un automobil branduit numai prin acord reciproc',
      srb:
        'brending nije u skladu sa zahtevima servisa. Postavljanje bilo kakvih reklama na brendiran automobil je moguće tek nakon dogovora',
      kot:
        'le branding ne correspond pas aux exigences du service. D`autres publicités peuvent uniquement être affichées sur des véhicules marqués à condition d`avoir reçu une autorisation officielle',
      isr: 'המיתוג לא עומד בדרישות השירות. כל פרסום אחר על מוניות ממותגות מותנה באישור רשמי',
      fin:
        'brändäystä ei voida suorittaa palvelun vaatimusten mukaisesti. Muita mainoksia voidaan näyttää brändätyissä ajoneuvoissa vain virallisella suostumuksella',
    },
    {
      text: 'ОТСУТСТВУЕТ ЭЛЕМЕНТ',
      textFin: 'ОТСУТСТВУЕТ ЭЛЕМЕНТ',
      menu: true,
    },
    {
      text: 'ЦВЕТОВАЯ СХЕМА',
      textFin: 'ЦВЕТОВАЯ СХЕМА',
      menu: true,
    },
     {
      text: 'невозможно подтвердить наклейку. Сфотографируйте, пожалуйста, ближе',
      am: 'հնարավոր չէ հաստատել բրենդային ձևավորումը։ Խնդրում ենք ավելի մոտիկից լուսանկարել',
      az: 'yapışdırmanı təsdiqləmək mümkün deyil. Fotoşəklini daha yaxından çəkin',
      est: 'kleebist pole võimalik kinnitada. Palun pildista lähemalt',
      geo: 'სტიკერის დადასტურება შეუძლებელია. უფრო ახლოს გადაუღეთ',
      kaz: 'жапсырманы растау мүмкін емес Суретке жақынырақ түсіруіңізді өтінеміз',
      kgz: 'чаптаманы ырастоо мүмкүн эмес. Сүрөткө жакыныраактан тартыңыз',
      lat: 'nav iespējams apstiprināt virsmas marķējumu. Lūdzu, nofotografējiet tuvāk',
      ltu: 'neįmanoma patvirtinti lipduko. Nufotografuokite iš arčiau',
      cro: 'nemoguće je potvrditi nalepnicu. Molimo vas, fotografišite bliže',
      uzb: 'yopishqoq yorliqni tasdiqlashning iloji yoʻq. Yaqinroqdan fotosuratga oling',
      gana: 'impossible to confirm sticker. Please take photographs closer to the vehicle',
      mda: 'confirmarea aplicării autocolantului este imposibilă. Te rugăm să fotografiezi de mai aproape',
      srb: 'nemoguće je potvrditi nalepnicu. Molimo vas, fotografišite bliže',
      kot: 'impossible de confirmer l`autocollant. Veuillez prendre des photos plus près du véhicule',
      isr: 'לא ניתן לאמת את המדבקה. צריך לעמוד קרוב יותר למונית כשמצלמים אותה',
      fin: 'tarran vahvistaminen ei onnistu. Ota ajoneuvosta valokuvat lähempää',
    },
    {
      text: 'темное фото не позволяет подтвердить оклейку. Рекомендуем выбрать более освещенное место',
      am:
        'մուգ լուսանկարը թույլ չի տալիս հաստատել բրենդային ձևավորումը։ Խորհուրդ ենք տալիս ավելի լուսավորված տեղ ընտրել',
      az: 'qaranlıq fotoşəkil brend nişanını təsdiqləməyə imkan vermir. Daha işıqlı yer seçməyi tövsiyə edirik',
      est: 'tume foto ei võimalda kleebist kinnitada. Soovitame valida parema valgusega koha',
      geo: 'ბნელი ფოტო არ იძლევა გადაკვრის დადასტურების საშუალებას. გირჩევთ აირჩიოთ უფრო განათებული ადგილი',
      kaz: 'бұлыңғыр фото арқылы жапсырманы растау мүмкін емес. Барынша жарық орын таңдауға кеңес береміз',
      kgz: 'сүрөт караңгы болуп калганы үчүн чаптаманы ырастоо мүмкүн эмес. Жарыгыраак жерге барууну сунуштайбыз',
      lat: 'tumša fotogrāfija neļauj apstiprināt virsmas marķējumu. Iesakām izvēlēties labāk apgaismotu vietu',
      ltu:
        'dėl tamsios nuotraukos negalima patvirtinti lipduko su prekės ženklu. Rekomenduojame pasirinkti geriau apšviestą vietą',
      cro:
        'fotografija je previše tamna da bi se potvrdila brendirana nalepnica Predlažemo da odaberete mesto sa boljim osvetljenjem.',
      uzb:
        'fotosurat qorongʻi joyda olinganligi sababli brending yopishtirma qismini tasdiqlashning imkoni yoʻq. Yorugʻroq joyni tanlashni tavsiya etamiz',
      gana: 'photograph too dark, impossible to confirm branded wrap. Please choose a more well-lit area',
      mda:
        'o fotografie întunecată nu permite confirmarea brandingului cu autocolante. Îți recomandăm să alegi un loc mai luminos',
      srb:
        'fotografija je previše tamna da bi se potvrdila brendirana nalepnica. Predlažemo da odaberete mesto sa boljim osvetljenjem',
      kot: 'la photo est trop sombre, impossible de confirmer le marquage. Veuillez choisir un endroit plus éclairé',
      isr: 'הצילום חשוך מדי ולכן לא ניתן לאמת את המדבקה. צריך לצלם באזור מואר יותר',
      fin:
        'valokuva on liian hämärä, teippauksen vahvistaminen ei onnistu. Valitse paremmin valaistu alue valokuvan ottamiseen',
    },
      ],
  uber = [
    { label: 'УБЕР', th: true },

    {only: 'использованы магнитные наклейки. Пожалуйста, оклейте машину в соответствии со стандартами',},
    {only: 'оклейка не соответствует стандартам'},
    {only: 'оклейка заднего стекла не соответствует стандартам' },
    {only: 'отсутствует оклейка заднего стекла'},
    {only: 'отсутствует шашечный пояс'},
    {only: 'брендирование не соответствует требованиям сервиса. Размещать любую рекламу на брендированном автомобиле можно только по согласованию',},
    {only: 'брендирование данного типа неактуально и не соответствует требованиям сервиса. Обновите брендирование в соответствии с новыми требованиями',},
  ],

  lightbox = [
    { label: 'Лайтбоксы', th: true },
      {
      text: 'отсутствует световой короб. Для получения статуса и приоритета, пожалуйста, установите его',
      am: 'Բացակայում է լայթբոքսը։ Կարգավիճակ և առաջնահերթություն ստանալու համար խնդրում ենք տեղադրել այն:',
      az: 'laytboks yoxdur. Status və prioritet əldə etmək üçün onu quraşdırın',
      est: 'puudub plafoon. Sotsiaalse seisundi ja esimuse saamiseks palun paigaldage see',
      geo: 'არ არის ლაითბოქსი. სტატუსისა და პრიორიტეტის მისაღებად დააყენეთ ის',
      kaz: 'лайтбокс жоқ. Мәртебе мен басымдық алу үшін оны орнатуды өтінеміз',
      kgz: 'лайтбокс жок. Статус жана артыкчылыкты алуу үчүн аны орнотуңүз',
      lat: 'nav gaismas pazīšanas zīmes. Lai iegūtu statusu un prioritāti, lūdzu, uzstādiet to',
      ltu: 'nėra plafono. Uždėkite plafoną, kad gautumėte statusą ir prioritetą',
      mda: 'caseta luminoasă lipsește. Pentru a primi un statut și prioritate, vă rugăm să o instalați',
      cro: 'nedostaje svetleća tabla. Kako biste dobili status i prioritet, molimo vas da je stavite.',
      uzb: 'chiroqli laytboks mavjud emas. Maqom va ustuvorlikka erishish uchun, iltimos, uni oʻrnating',
      fin: 'Yangon kattokyltti puuttuu kokonaan. Prioriteettiä ei voida antaa, ennen kuin asennat sen katolle.',
    },
     {only: 'световой короб не соответствует стандартам сервиса. Для получения статуса и приоритета, пожалуйста, обновите его',},
    {
      text: 'световой короб не закреплен. Для получения статуса и приоритета, пожалуйста, закрепите короб',
      am: 'Լայթբոքսն ամրացված չէ։ Կարգավիճակ և առաջնահերթություն ստանալու համար խնդրում ենք ամրացնել լայթբոքսը:',
      az: 'laytboks bərkidilməyib. Status və prioritet əldə etmək üçün laytboksu bərkidin',
      est: 'plafoon pole kinnitatud. Brändingu ja prioriteedi saamiseks palun kinnitage plafoon',
      geo: 'ლაითბოქსი არ არის დამაგრებული. სტატუსისა და პრიორიტეტის მისაღებად, გთხოვთ, დაამაგროთ ლაითბოქსი',
      kaz: 'лайтбокс бекітілмеген. Мәртебе мен басымдық алу үшін лайтбоксты бекітуіңізді өтінеміз',
      kgz: 'лайтбокс карматылган эмес. Статус жана артыкчылык алуу үчүн лайтбоксту карматыңыз.',
      lat:
        'gaismas pazīšanas zīme nav nostiprināta. Lai iegūtu statusu un prioritāti, lūdzu, nostipriniet gaismas pazīšanas zīmi',
      ltu: 'plafonas nepritvirtintas. Pritvirtinkite plafoną, kad gautumėte statusą ir prioritetą',
      mda: 'caseta luminoasă nu este fixată. Pentru a primi un statut și prioritate, vă rugăm să fixați caseta',
      cro:
        'svetleća tabla nije pričvršćena. Kako biste dobili status i prioritet, molimo vas da pričvrstite svetleću tablu',
      uzb:
        'chiroqli laytboks mahkamlab qoʻyilmagan. Maqom va ustuvorlikka erishish uchun, iltimos, chiroqli laytboksni mahkamlab qoʻying',
      fin: 'Kattokyltti ei ole kiinnitetty kattoon.',
    },
      {only: 'наклейка на световом коробе повреждена. Для получения статуса и приоритета, пожалуйста, обновите световой короб',},
      {only: 'световой короб поврежден. Для получения статуса и приоритета, пожалуйста, обновите его',},
      {
      text:
        'брендирование такого типа устарело. Об актуальном брендировании вы можете узнать по ссылке: (https://driver.yandex/branding_rules_2/)',
      am:
        'Նմանատիպ բրենդավորումը հնացել է։ Արդիական բրենդավորման մասին կարող եք իմանալ հետևյալ հղումով՝ https://driver.yandex/branding_rules_2/)',
      az:
        'bu növ brendləmə köhnəlib. Zəruri brendləmə haqqında öyrənmək üçün aşağıdakı keçiddən yararlanın: (https://driver.support-uber.com)',
      est:
        'see kaubamärgistamise tüüp on vananenud. Päevakohase kaubamärgistamise kohta võite teada saada lingi kaudu: (https://driver.yandex/branding_rules_2/)',
      geo:
        'ასეთი ტიპის ბრენდირება მოძველებულია. აქტუალური ბრენდირების შესახებ შეგიძლიათ გაიგოთ ბმულზე: (https://driver.yandex/branding_rules_2/)',
      kaz:
        'мұндай түрдегі брендинг ескірген. Өзекті брендинг туралы мына сілтеме арқылы білуге болады: (https://driver.yandex/branding_rules_2/)',
      kgz:
        'мындай түрдөгү брендинг эскирип кеткен. Актуалдуу брендинг тууралуу шилтеме аркылуу биле аласыз: (https://driver.yandex/branding_rules_2/)',
      lat:
        'šāda veida brendings ir novecojis. Par aktuālo brendingu jūs varat uzzināt, sekojot saitei: (https://driver.yandex/branding_rules_2/)',
      ltu:
        'šio tipo prekės ženklai yra pasenę. Apie dabar naudojamus prekės ženklus galite sužinoti apsilankę šiuo adresu: (https://driver.yandex/branding_rules_2/)',
      mda:
        'branding-ul de acest tip este învechit. Informații despre branding-ul actual pot fi găsite la adresa: (https://driver.yandex/branding_rules_2/)',
      cro:
        'ovaj tip brendiranja je zastareo. O aktuelnom brendiranju se možete informisati na linku: (https://driver.yandex/branding_rules_2/)',
      uzb:
        'bunday turdagi brending eskirgan. Hozirgi kunda ahamiyatga ega brending toʻgʻrisida havola oraqli bilib olishingiz mumkin: (https://driver.yandex/branding_rules_2/)',
    },
      {
      text:
        'брендирование не соответствует требованиям сервиса, потому что на лайтбоксе есть посторонняя реклама. Для получения статуса и приоритета, пожалуйста, обновите световой короб',
      am:
        'բրենդավորումը չի համապատասխանում ծառայության պահանջներին, քանի որ լայթբոքսի վրա առկա է կողմնակի գովազդ։ Կարգավիճակ և առաջնահերթություն ստանալու համար խնդրում ենք թարմացնել լայթբոքսը',
      az:
        'brendləmə xidmətin tələblərinə uyğun deyil, belə ki, laytboksun üzərində kənar reklam var. Status və prioritet əldə etmək üçün laytboksu yeniləyin',
      est:
        'kaubamärgistamine ei vasta teenuse nõuetele, kuna plafoonil on võõras reklaam. Staatuse ja prioriteedi saamiseks uuenda palun plafooni',
      geo:
        'ბრენდირება არ შეესაბამება სერვისის მოთხოვნებს, რადგან ლაითბოქსზე გარეშე რეკლამაა. სტატუსისა და პრიორიტეტის მისაღებად განაახლეთ ლაითბოქსი',
      kaz:
        'брендинг сервис талаптарына сай келмейді, себебі лайтбокста бөгде жарнама бар. Мәртебе мен басымдық алу үшін лайтбоксты жаңартуды өтінеміз',
      kgz:
        'брендинг сервистин талаптарына жооп бербейт, анткени лайтбоксто бөлөк жарнама бар. Өтүнүч, статус менен приоритетти алуу үчүн лайтбоксту жаңыртыңыз',
      lat:
        'brendings neatbilst servisa prasībām, jo uz pazīšanas zīmes izvietota sveša reklāma. Lai iegūtu statusu un prioritāti, lūdzu, atjaunojiet gaismas pazīšanas zīmi',
      ltu:
        'žymėjimas prekės ženklu neatitinka paslaugos reikalavimų, nes ant šviesdėžės yra pašalinė reklama. Norėdami gauti statusą ir prioritetą, atnaujinkite šviesdėžę',
      cro: '',
      uzb:
        'Laytboksda boshqa reklama mavjudligi tufayli, brendlash xizmat talablariga mos kelmaydi. Status va ustuvorlikka erishish uchun chiroqli laytboksni yangilang',
      gana:
        'branding in violation of service standards (third-party advertisements on the lightbox). Please update the lightbox to obtain this status and priority',
      mda:
        'brandingul nu corespunde cerințelor serviciului, deoarece pe caseta luminoasă se află o publicitate străină. Pentru a primi un statut și prioritate, te rugăm să actualizezi caseta luminoasă',
      srb:
        'brending nije u skladu sa zahtevima servisa, jer je na svetlećoj tabli tuđa reklama. Kako biste dobili status i prioritet, molimo vas da obnovite svetleću tablu',
      kot:
        'le branding ne correspond pas aux standards de service (publicités de tiers sur le lumineux). Veuillez modifier le lumineux pour obtenir ce statut et cette priorité',
      isr:
        'המיתוג מפר את דרישות השירות (פרסומות של צד שלישי מוצמדות לשלט המואר). עליך להסיר את הפרסומות מהשלט המואר כדי לקבל את הסטטוס הזה והקדימות',
      fin:
        'teippaus ei vastaa palvelun vaatimuksia (kolmannen osapuolen mainoksia taksikuvussa). Korjaa taksikuvun ongelmat saadaksesi tämän tilan ja prioriteetin',
    },
    ],
  samodel = [
    { label: 'Самодел', th: true },
    {
      only: 'ливрея не соответствует стандартам. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)'
    },
    {
      only: 'шрифт надписи не соответствует стандартам. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)'
    },
    { only: 'оклейка не соответствует стандартам' },
    {
      text:
        'оклейка заднего стекла не соответствует стандартам. Подробнее о брендировании можно узнать по [ссылке](https://driver.yandex/branding_rules_2/)',
      am: 'հետևի ապակու բրենդային ձևավորումը չի համապատասխանում ստանդարտներին',
      az: 'arxa şüşəyə yapışdırılan brend nişanı standartlara uyğun deyil',
      est: 'tagumise akna kleebis ei vasta standardile',
      geo: 'გადაკვრა უკანა საქარე მინაზე არ შეესაბამება სტანდარტებს',
      kaz: 'артқы әйнектің жапсырмасы стандарттарға сай емес',
      kgz: 'арткы айнектин чаптамасы стандарттарга жооп бербейт',
      lat: 'aizmugurējā stikla virsmas marķējums neatbilst standartiem',
      ltu: 'galinio lango lipdukas su prekės ženklu neatitinka standartų',
      cro:
        'brendirana nalepnica na zadnjem staklu nije u skladu sa standardima. Detaljnije o brendiranju možete saznati na linku: (https://driver.yandex/branding_rules_2/)',
      uzb: 'orqa oynaga yopishtirilgan material standartlarga mos emas',
      gana: 'rear window branded wrap in violation of standards',
      mda: 'aplicarea autocolantelor pe parbrizul din spate nu corespunde standardelor',
      srb: 'brendirana nalepnica na zadnjem staklu nije u skladu sa standardima',
      kot: 'le marquage de la lunette arrière ne répond pas aux standards',
      isr: 'המדבקה שעל השמשה האחורית לא עומדת בסטנדרטים',
      fin: 'takaikkunan teippaus ei vastaa sille asetettuja vaatimuksia',
    },
    {
      only:
        'элементы брендирования расположены некорректно [надпись должна располагаться параллельно нижней кромки стекла]. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
    },
    {
      only:
        'элементы брендирования расположены некорректно [расстояние между буквами и словами в 2 раза меньше положенного]. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
    },
    {
      only:
        'элементы брендирования расположены некорректно [расстояние между буквами и словами в 2 раза больше положенного]. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
    },
    {
      text:
        'элементы брендирования расположены некорректно [УКАЗАТЬ]. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
      am:
        'Բրենդավորման տարրերը սխալ են տեղադրված {УКАЗАТЬ}։ Ավելի մանրամասն տեղեկատվություն կարող եք ստանալ հետևյալ հղումով՝ https://driver.yandex/branding_rules_2/)',
      az:
        'brendləmə elementləri yanlış yerləşdirilib {УКАЗАТЬ}. Daha ətraflı məlumat əldə etmək üçün aşağıdakı keçiddən yararlanın: (https://driver.support-uber.com)',
      est:
        'Brändingu üksikosad pole veatult paigutatud {УКАЗАТЬ}. Täpsema teabe saamiseks klõpsake lingil: (https://driver.yandex/branding_rules_2/)',
      geo:
        'ბრენდირების ელემენტები არაკორექტულად არის განლაგებული {УКАЗАТЬ}. დეტალური ინფორმაციისთვის გადადით ბმულზე: (https://driver.yandex/branding_rules_2/)',
      kaz:
        'брендинг элементтері қате орналасқан {УКАЗАТЬ}. Толығырақ ақпарат алу үшін мына сілтеме арқылы өтіңіз: (https://driver.yandex/branding_rules_2/)',
      kgz:
        'брендингдин элементтери туура эмес жайгашкан {УКАЗАТЬ}. Кеңири маалымат алүү үчүн шилтеме аркылуу өтүңүз: (https://driver.yandex/branding_rules_2/)',
      lat:
        'brendinga elementi izvietoti nepareizi {УКАЗАТЬ}. Lai iegūtu vairāk informācijas, sekojiet saitei: (https://driver.yandex/branding_rules_2/)',
      ltu:
        'prekės ženklo elementai išdėstyti netinkamai {УКАЗАТЬ}. Išsamią informaciją rasite apsilankę šiuo adresu: (https://driver.yandex/branding_rules_2/)',
      mda:
        'elementele de branding sunt poziționate incorect {УКАЗАТЬ}. Pentru informații detaliate, accesați link-ul: (https://driver.yandex/branding_rules_2/)',
      cro:
        'elementi brendiranja nisu pravilno postavljeni{УКАЗАТЬ}. Za detaljnije informacije posetite link: (https://driver.yandex/branding_rules_2/)',
      uzb:
        'brendingning tarkibiy qismlari notoʻgʻri joylashgan {УКАЗАТЬ}. Batafsil maʼlumot uchun havola orqali oʻting: (https://driver.yandex/branding_rules_2/)',
    },
    {
      text:
        'бортовой номер и надпись размещены на разных уровнях. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
      am: 'կողային համարն ու գրվածքը տարբեր բարձրությունների վրա են',
      az: 'bort nömrəsi və yazı fərqli səviyyələrdə yerləşdirilib',
      est: 'pardanumber ja kiri on paigutatud eri kõrgusele',
      geo: 'ბორტის ნომერი და წარწერა განთავსებულია სხვადასხვა დონეზე',
      kaz: 'борттық нөмірі мен жазба әр түрлі деңгейде орналасқан',
      kgz: 'борт номери менен жазуу ар кандай деңгээлде жайгашып калган',
      lat: 'borta numurs un uzraksts izvietoti dažādos līmeņos',
      ltu: 'automobilio numeris ir užrašas yra skirtinguose lygiuose',
      cro:
        'broj taksi vozila i natpis nisu postavljeni u ravni. Za detaljnije informacije posetite link: (https://driver.yandex/branding_rules_2/)',
      uzb: 'bort nomeri va yozuv har xil darajada joylashtirilgan',
      gana: 'side number and inscription positioned at different levels',
      mda: 'numărul și inscripția de pe caroserie sunt plasate la niveluri diferite',
      srb: 'broj taksi vozila i natpis nisu postavljeni u ravni',
      kot: 'le numéro de côté et l`inscription sont positionnés à des niveaux différents',
      isr: 'המספר והכיתוב על צד המונית לא באותו גובה',
      fin: 'sivunumero ja teksti on aseteltu eri korkeudelle',
    },
    {
      text:
        'брендирование не соответствует требованиям сервиса. На сторонах одного транспортного средства наклейки разных форматов. Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
      am:
        'բրենդավորումը չի համապատասխանում ծառայության պահանջներին։ Տարբեր ձևաչափի բրենդային նշաններ մեկ տրանսպորտային միջոցի երկու կողմերում',
      az:
        'brendləmə xidmət tələblərinə uyğun deyil. Bir nəqliyyat vasitəsinin iki tərəfində olan yapışdırmalar müxtəlif formatdadır',
      est: 'kaubamärgistamine ei vasta teenuse nõuetele. Ühe transpordivahendi külgedel on erineva suurusega kleebised',
      geo:
        'ბრენდირება არ შეესაბამება სერვისის მოთხოვნებს. ერთი სატრანსპორტო საშუალების გვერდებზე სხვადასხვა ფორმატის სტიკერებია',
      kaz: 'брендинг сервис талаптарына сай келмейді. Бір көлік құралының екі жағында әр түрлі форматтағы жапсырма',
      kgz:
        'брендинг сервистин талаптарына жооп бербейт. Бир транспорт каражатынын ар башка жактарында ар кандай форматтагы чаптамалар чапталган',
      lat: 'brendings neatbilst servisa prasībām. Uz vieniem automašīnas sāniem izvietotas dažāda formāta uzlīmes',
      ltu:
        'žymėjimas prekės ženklu neatitinka paslaugos reikalavimų. Skirtingo formato lipdukai ant vienos transporto priemonės šonų',
      cro:
        'brendiranje nije u skladu sa zahtevima servisa. Postavljanje bilo kakvih reklama na brendiran automobil je moguće tek nakon dogovora sa Yandex.Taxi-jem. Za detaljnije informacije posetite link: (https://driver.yandex/branding_rules_2/)',
      uzb:
        'brendlash xizmatning talablariga mos kelmaydi. Bitta transport vositasining ikki tomonida har xil formatdagi yorliq joylashtirilgan',
      gana:
        'branding not in accordance with service requirements. Different sticker formats displayed on both sides of the same vehicle',
      mda:
        'brandingul nu îndeplinește cerințele serviciului. Pe părțile laterale ale aceluiași mijloc de transport sunt lipite autocolante cu formate diferite',
      srb: 'brending nije u skladu sa zahtevima servisa. Nalepnice na stranama istog vozila su različitog formata',
      kot:
        'le branding ne correspond pas aux exigences du service. Des formats d`autocollants différents sont affichés sur les deux côtés du même véhicule',
      isr: 'המיתוג לא עומד בדרישות השירות. מדבקות מסוגים שונים הודבקו על שני הצדדים של אותה מונית',
      fin:
        'brändäystä ei voida suorittaa palvelun vaatimusten mukaisesti. Saman ajoneuvon eri puolilla käytetään erilaista tarroitusta',
    },
  ],
  auto = [
    { label: 'АВТО', th: true },
    {
      text: 'ваш автомобиль не подлежит брендированию',
      am: 'ձեր ավտոմեքենան բրենդավորման ենթակա չէ',
      az: 'avtomobiliniz brendləmə üçün yararlı deyil',
      est: 'sinu sõiduk ei kuulu kaubamärgistamisele',
      geo: 'თქვენი ავტომანქანა არ ექვემდებარება ბრენდირებას',
      kaz: 'сіздің автокөлікке брендинг жасау мүмкін емес',
      kgz: 'автоунааңыз брендингге ылайык келбейт',
      lat: 'jūsu automašīnai brendings nevar tikt veikts',
      ltu: 'ant jūsų automobilio negalima naudoti prekės ženklo',
      mda: 'mașina ta nu poate fi branduită',
      cro: 'vaš automobil nije pogodan za brendiranje',
      uzb: 'sizning avtomobilingiz brendlash uchun mos kelmaydi',
      gana: 'your vehicle is ineligible for branding',
      srb: 'vaš automobil nije pogodan za brendiranje',
      kot: 'votre véhicule n`est pas éligible au branding',
      isr: 'המונית שלך לא עומדת בדרישות למיתוג',
      fin: 'ajoneuvosi ei ole kelvollinen brändättäväksi',
    },
    {
      text:
        'автомобиль на фото не соответствует тому, что указан в профиле. Обновить данные в профиле может ваш таксопарк',
      am:
        'լուսանկարում պատկերված ավտոմեքենան չի համապատասխանում անձնական էջում նշվածին։ Անձնական էջի տվյալները կարող է նորացնել ձեր տաքսոպարկը',
      az:
        'fotoşəkildəki avtomobil profildə qeyd olunana uyğun gəlmir. Profildə olan məlumatları taksi parkınız yeniləyə bilər',
      est: 'fotol olev sõiduk ei vasta profiilis märgitule. Profiilis saab andmeid uuendada sinu taksofirma',
      geo:
        'ფოტოზე არსებული ავტომანქანა არ შეესაბამება იმას, რაც პროფილშია მითითებული. პროფილში მონაცემების განახლება შეუძლია თქვენს ტაქსოპარკს',
      kaz:
        'суреттегі автокөлік парақшада көрсетілген көлікке сай келмейді. Сіздің парақшаңыздағы мәліметтерді сіздің таксопарк жаңарта алады',
      kgz:
        'сүрөттөгү автоунаа профилде көрсөтүлгөн машинага туура келбейт. Профилдеги маалыматтарды сиздин таксопаркыңыз жаңырта алат',
      lat:
        'fotogrāfijā redzamā automašīna neatbilst profilā norādītajai. Jūsu taksometru parks var atjaunot profila informāciju',
      ltu:
        'automobilis nuotraukoje neatitinka nurodyto profilyje. Profilio duomenis gali atnaujinti Jūsų automobilių parkas',
      mda:
        'automobilul din fotografie nu coincide cu cel menționat în profil. Datele de profil pot fi actualizate de compania ta de taximetrie',
      cro:
        'vozilo na fotografijama ne odgovara podacima koji su navedeni na profilu. Vaše taksi udruženje može da ažurira podatke na profilu.',
      uzb:
        'fotosuratdagi avtomobil profilda koʻrsatilganga mos kelmaydi. Sizning taksoparkingiz profildagi maʼlumotlarni yangilashi mumkin',
      gana: "vehicle in the photo doesn't match vehicle indicated in profile. The taxi company can update your profile",
      srb:
        'vozilo na fotografijama ne odgovara podacima koji su navedeni na profilu. Podatke na profilu može da ažurira vaše taksi udruženje',
      kot:
        'le véhicule sur la photo ne correspond pas au véhicule indiqué dans le profil. Le partenaire peut mettre à jour votre profil',
      isr:
        'המונית המופיעה בצילום אינה תואמת למונית שפרטיה מופיעים בפרופיל. נציג תחנת המוניות יכול לעדכן את הפרופיל שלך',
      fin:
        'valokuvassa oleva ajoneuvo ei vastaa profiilissa ilmoitettua ajoneuvoa. Taksiyritys voi päivittää profiilisi',
    },
    {
      text: 'госномер автомобиля указан неверно. Обновить данные в вашем профиле может таксопарк',
      am: 'ավտոմեքենայի պետհամարանիշը սխալ է նշված։ Ձեր անձնական էջի տվյալները կարող է նորացնել տաքսոպարկը',
      az:
        'avtomobilin dövlət qeydiyyat nişanı düzgün qeyd edilməyib. Profilinizdə olan məlumatları taksi parkı yeniləyə bilər',
      est: 'sõiduki registreerimismärk on vale. Profiilis saab andmeid uuendada sinu taksofirma',
      geo: 'ავტომანქანის სახ. ნომერი არასწორადაა მითითებული. თქვენს პროფილში მონაცემების განახლება შეუძლია ტაქსოპარკს',
      kaz:
        'автокөліктің мемлекеттік нөмірі қате көрсетілген. Сіздің парақшаңыздағы мәліметтерді таксопарк жаңарта алады',
      kgz:
        'автоунаанын мамлекеттик номери туура эмес көрсөтүлгөн. Сиздин профилиңиздеги маалыматтарды таксопарк жаңырта алат',
      lat: 'automašīnas numura zīme ir norādīta kļūdaini. Jūsu profila informāciju var atjaunot taksometru parks',
      ltu:
        'nurodytas netikslus automobilio valstybinis registracijos numeris. Profilio duomenis gali atnaujinti Jūsų automobilių parkas',
      mda:
        'numărul de înmatriculare al automobilului este indicat greșit. Datele tale de profil pot fi actualizate de compania de taximetrie',
      cro:
        'Registarske tablice vozila nisu pravilno navedene. Taksi udruženje može da ažurira podatke na vašem profilu.',
      uzb:
        'avtomobilning davlat raqami notoʻgʻri koʻrsatilgan. Sizning profilingizdagi maʼlumotlarni taksopark yangilashi mumkin',
      gana: 'license plate number indicated incorrectly. The taxi company can update your profile',
      srb: 'registarske tablice vozila nisu pravilno navedene. Vaše podatke na profilu može da ažurira taksi udruženje',
      kot:
        'le numéro de plaque d`immatriculation est indiqué de manière incorrecte. Le partenaire peut mettre à jour votre profil',
      isr: 'צוין מספר שגוי של לוחית רישוי. נציג תחנת המוניות יכול לעדכן את הפרופיל שלך',
      fin: 'rekisterinumero on ilmoitettu virheellisesti. Taksiyritys voi päivittää profiilisi',
    },
    {
      text: 'фотографирование автомобиля с экрана компьютера является грубым нарушением',
      am: 'ավտոմեքենայի լուսանկարումը համակարգչի էկրանից կոպիտ խախտում է',
      az: 'avtomobilin fotoşəklinin kompüterin ekranından çəkilməsi kobud pozuntudur',
      est: 'sõiduki pildistamine arvutiekraanilt on jäme reeglite rikkumine',
      geo: 'კომპიუტერის ეკრანიდან გადაღებული ავტომანქანის ფოტოები წარმოადგენს უხეშ დარღვევას',
      kaz: 'автокөлікті компьютер экранынан суретке түсіру өрескел бұзушылық болып табылады',
      kgz: 'автоунааны компьютердин экранынан сүрөткө тартуу эрежени одоно бузуу болуп саналат',
      lat: 'automašīnas fotografēšana no datora ekrāna ir rupjš pārkāpums',
      ltu: 'automobilio fotografavimas naudojant kompiuterio ekraną yra grubus pažeidimas',
      cro: 'fotografisanje vozila sa ekrana kompjutera predstavlja grub prekršaj.',
      uzb: 'avtomobilni kompyuterning ekranidan fotosuratga olish qoʻpol buzilish deb hisoblanadi',
      gana: 'photographing a vehicle from a computer screen is a serious violation',
      mda: 'fotografierea unei mașini de pe ecranul unui computer este o încălcare gravă',
      srb: 'fotografisanje vozila sa ekrana kompjutera predstavlja težak prekršaj',
      kot: 'photographier un véhicule à partir d`un écran d`ordinateur constitue une infraction grave',
      isr: 'צילום מונית מתוך מסך מחשב נחשב להפרה חמורה',
      fin: 'ajoneuvon kuvaaminen tietokoneen näytöltä on vakava sääntörikkomus.',
    },
    {
      text: 'нет ни одной фотографии автомобиля',
      am: 'չկա ավտոմեքենայի որևէ լուսանկար',
      az: 'avtomobilin heç bir fotoşəkli yoxdur',
      est: 'sõidukist pole ühtegi fotot',
      geo: 'ავტომანქანის არცერთი ფოტო არ არის',
      kaz: 'автокөліктің бірде бір фотосуреті жоқ',
      kgz: 'автоунаанын бир дагы сүрөтү жок',
      lat: 'nav nevienas automašīnas fotogrāfijas',
      ltu: 'nėra nė vienos automobilio nuotraukos',
      cro: 'ne postoji nijedna fotografija vozila',
      uzb: 'avtomobilning bitta ham fotosurati mavjud emas',
      gana: 'not a single vehicle photo',
      mda: 'nu a fost încărcată nicio fotografie a automobilului',
      srb: 'ne postoji nijedna fotografija vozila',
      kot: 'aucune photo de véhicule',
      isr: 'זו לא תמונה של מונית אחת',
      fin: 'ei kuvia ajoneuvosta',
    },
    {
      text: 'брендированная наклейка попала в кадр не полностью',
      am: 'բրենդավորված նշանը կադրում լրիվ չի երևում',
      az: 'brend nişanı kadra tam düşməyib',
      est: 'kaubamärgikleebis ei ole tervenisti kaadris',
      geo: 'ბრენდირებული სტიკერი კადრში არასრულად მოხვდა',
      kaz: 'брендинг жапсырмасы кадрға толық түспеген',
      kgz: 'брендделген чаптама кадрга толук түшпөй калган',
      lat: 'brendinga uzlīme kadrā nav redzama pilnīgi',
      ltu: 'nuotraukoje matosi ne visas prekės ženklo lipdukas',
      cro: 'brendirana nalepnica nije cela u kadru',
      uzb: 'brending yopishqoq yorligʻi kadrga toʻliq tushmagan',
      gana: 'branded wrap not fully in frame',
      mda: 'autocolantul de branding nu a intrat complet în cadru',
      srb: 'brendirana nalepnica nije cela u kadru',
      kot: 'le marquage n`est pas entièrement encadré',
      isr: 'המדבקה יוצאת מהמסגרת',
      fin: 'teippaus ei näy kuvassa kokonaan',
    },
    {
      text: 'нечеткое фото не позволяет подтвердить оклейку',
      am: 'ոչ հստակ լուսանկարը թույլ չի տալիս հաստատել բրենդային ձևավորումը',
      az: 'bulanıq fotoşəkil brend nişanını təsdiqləməyə imkan vermir',
      est: 'hägune foto ei võimalda kleebist kinnitada',
      geo: 'ბუნდოვანი ფოტო არ იძლევა გადაკვრის დადასტურების საშუალებას',
      kaz: 'айқын емес фото арқылы жапсырманы растау мүмкін емес',
      kgz: 'сүрөт даана тартылбаганы үчүн чаптаманы ырастоо мүмкүн эмес',
      lat: 'neskaidra fotogrāfija neļauj apstiprināt virsmas marķējumu',
      ltu: 'dėl neryškios nuotraukos negalima patvirtinti lipduko su prekės ženklu',
      cro: 'zbog mutne fotografije ne može se potvrditi brendirana nalepnica',
      uzb: 'fotosuratning xiraligi tufayli brending yopishtirma qismini tasdiqlashning imkoni yoʻq',
      gana: 'photograph out of focus, impossible to confirm branded wrap',
      mda: 'o fotografie neclară nu permite confirmarea brandingului cu autocolante',
      srb: 'zbog mutne fotografije se ne može potvrditi brendirana nalepnica',
      kot: 'la photo est floue, impossible de confirmer le marquage',
      isr: 'הצילום לא בפוקוס ולכן לא ניתן לאמת את המדבקה',
      fin: 'valokuva on epätarkka, teippauksen vahvistaminen ei onnistu',
    },
    {
      text: 'невозможно подтвердить наклейку. Сфотографируйте, пожалуйста, ближе',
      am: 'հնարավոր չէ հաստատել բրենդային ձևավորումը։ Խնդրում ենք ավելի մոտիկից լուսանկարել',
      az: 'yapışdırmanı təsdiqləmək mümkün deyil. Fotoşəklini daha yaxından çəkin',
      est: 'kleebist pole võimalik kinnitada. Palun pildista lähemalt',
      geo: 'სტიკერის დადასტურება შეუძლებელია. უფრო ახლოს გადაუღეთ',
      kaz: 'жапсырманы растау мүмкін емес Суретке жақынырақ түсіруіңізді өтінеміз',
      kgz: 'чаптаманы ырастоо мүмкүн эмес. Сүрөткө жакыныраактан тартыңыз',
      lat: 'nav iespējams apstiprināt virsmas marķējumu. Lūdzu, nofotografējiet tuvāk',
      ltu: 'neįmanoma patvirtinti lipduko. Nufotografuokite iš arčiau',
      cro: 'nemoguće je potvrditi nalepnicu. Molimo vas, fotografišite bliže',
      uzb: 'yopishqoq yorliqni tasdiqlashning iloji yoʻq. Yaqinroqdan fotosuratga oling',
      gana: 'impossible to confirm sticker. Please take photographs closer to the vehicle',
      mda: 'confirmarea aplicării autocolantului este imposibilă. Te rugăm să fotografiezi de mai aproape',
      srb: 'nemoguće je potvrditi nalepnicu. Molimo vas, fotografišite bliže',
      kot: 'impossible de confirmer l`autocollant. Veuillez prendre des photos plus près du véhicule',
      isr: 'לא ניתן לאמת את המדבקה. צריך לעמוד קרוב יותר למונית כשמצלמים אותה',
      fin: 'tarran vahvistaminen ei onnistu. Ota ajoneuvosta valokuvat lähempää',
    },
    {
      text: 'темное фото не позволяет подтвердить оклейку. Рекомендуем выбрать более освещенное место',
      am:
        'մուգ լուսանկարը թույլ չի տալիս հաստատել բրենդային ձևավորումը։ Խորհուրդ ենք տալիս ավելի լուսավորված տեղ ընտրել',
      az: 'qaranlıq fotoşəkil brend nişanını təsdiqləməyə imkan vermir. Daha işıqlı yer seçməyi tövsiyə edirik',
      est: 'tume foto ei võimalda kleebist kinnitada. Soovitame valida parema valgusega koha',
      geo: 'ბნელი ფოტო არ იძლევა გადაკვრის დადასტურების საშუალებას. გირჩევთ აირჩიოთ უფრო განათებული ადგილი',
      kaz: 'бұлыңғыр фото арқылы жапсырманы растау мүмкін емес. Барынша жарық орын таңдауға кеңес береміз',
      kgz: 'сүрөт караңгы болуп калганы үчүн чаптаманы ырастоо мүмкүн эмес. Жарыгыраак жерге барууну сунуштайбыз',
      lat: 'tumša fotogrāfija neļauj apstiprināt virsmas marķējumu. Iesakām izvēlēties labāk apgaismotu vietu',
      ltu:
        'dėl tamsios nuotraukos negalima patvirtinti lipduko su prekės ženklu. Rekomenduojame pasirinkti geriau apšviestą vietą',
      cro:
        'fotografija je previše tamna da bi se potvrdila brendirana nalepnica Predlažemo da odaberete mesto sa boljim osvetljenjem.',
      uzb:
        'fotosurat qorongʻi joyda olinganligi sababli brending yopishtirma qismini tasdiqlashning imkoni yoʻq. Yorugʻroq joyni tanlashni tavsiya etamiz',
      gana: 'photograph too dark, impossible to confirm branded wrap. Please choose a more well-lit area',
      mda:
        'o fotografie întunecată nu permite confirmarea brandingului cu autocolante. Îți recomandăm să alegi un loc mai luminos',
      srb:
        'fotografija je previše tamna da bi se potvrdila brendirana nalepnica. Predlažemo da odaberete mesto sa boljim osvetljenjem',
      kot: 'la photo est trop sombre, impossible de confirmer le marquage. Veuillez choisir un endroit plus éclairé',
      isr: 'הצילום חשוך מדי ולכן לא ניתן לאמת את המדבקה. צריך לצלם באזור מואר יותר',
      fin:
        'valokuva on liian hämärä, teippauksen vahvistaminen ei onnistu. Valitse paremmin valaistu alue valokuvan ottamiseen',
    },
      {
      text: 'оклейка повреждена',
      am: 'բրենդային ձևավորումը վնասված է',
      az: 'brend nişanı zədələnib',
      est: 'kleebis on kahjustatud',
      geo: 'გადაკვრა დაზიანებულია',
      kaz: 'жапсырма бүлінген',
      kgz: 'чаптама сыйрылып калган',
      lat: 'virsmas marķējums ir bojāts',
      ltu: 'pažeistas lipdukas su prekės ženklu',
      cro: 'brendirane nalepnice su oštećene',
      uzb: 'yopishtirilgan material shikastlangan',
      gana: 'branded wrap damaged',
      mda: 'autocolantul este deteriorat',
      srb: 'brendirane nalepnice su oštećene',
      kot: 'le marquage est endommagé',
      isr: 'המדבקה פגומה',
      fin: 'teippaus vaurioitunut',
    },
    {
     text: 'надпись повреждена',
      am: 'գրվածքը վնասված է',
      az: 'yazı zədələnib',
      est: 'kiri on kahjustatud',
      geo: 'წარწერა დაზიანებულია',
      kaz: 'жазба бүлінген',
      kgz: 'жазуу сыйрылып калган',
      lat: 'uzraksts ir bojāts',
      ltu: 'pažeistas užrašas',
      cro: 'natpis je oštećen',
      uzb: 'yozuv zararlangan',
      gana: 'inscription damaged',
      mda: 'inscripția este deteriorată',
      srb: 'natpis je oštećen',
      kot: 'l`inscription est endommagée',
      isr: 'הכיתוב פגום',
      fin: 'teksti vaurioitunut',
     },
    {only: 'сильное повреждение ТС' },
  ],
  colorSchema = [
    { label: 'ЦВЕТОВАЯ СХЕМА', th: true },
    {
      text:
        'не соблюдена цветовая схема оклейки автомобиля (__УКАЗАТЬ__). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
      am:
        'Չի պահպանվել ավտոմեքենայի բրենդային ձևավորման գունային սխեման ({УКАЗАТЬ}): Ավելի մանրամասն տեղեկատվություն կարող եք ստանալ հետևյալ հղումով՝ https://driver.yandex/branding_rules_2/)',
      az:
        'avtomobilin brend nişanı yapışdırılarkən rəng sxeminə riayət olunmayıb ({УКАЗАТЬ}). Daha ətraflı məlumat əldə etmək üçün aşağıdakı keçiddən yararlanın: (https://driver.support-uber.com)',
      est:
        'sõiduki kleebise värvikava pole järgitud ({УКАЗАТЬ}). Täpsema teabe saamiseks klõpsake lingil: (https://driver.yandex/branding_rules_2/)',
      geo:
        'არ არის დაცული ავტომობილის გადაკვრის ფერის სქემა ({УКАЗАТЬ}). დეტალური ინფორმაციისთვის გადადით ბმულზე: (https://driver.yandex/branding_rules_2/)',
      kaz:
        'автокөлік жапсырмасының түс сұлбасы сақталмаған ({УКАЗАТЬ}). Толығырақ ақпарат алу үшін мына сілтеме арқылы өтіңіз: (https://driver.yandex/branding_rules_2/)',
      kgz:
        'автоунаанын чаптамасында түс боюнча схема сакталган эмес ({УКАЗАТЬ}). Кеңири маалымат алүү үчүн шилтеме аркылуу өтүңүз: (https://driver.yandex/branding_rules_2/)',
      lat:
        'nav ievērota automašīnas virsmas marķējuma krāsu shēma ({УКАЗАТЬ}). Lai iegūtu vairāk informācijas, sekojiet saitei: (https://driver.yandex/branding_rules_2/)',
      ltu:
        'neišlaikyta spalvinė automobilio lipdukų schema ({УКАЗАТЬ}). Išsamią informaciją rasite apsilankę šiuo adresu: (https://driver.yandex/branding_rules_2/)',
      mda:
        'nu se respectă schema de culori a autocolantelor de pe automobil ({УКАЗАТЬ}). Pentru informații detaliate, accesați link-ul: (https://driver.yandex/branding_rules_2/)',
      cro:
        'nije ispoštovana kolor šema za brending automobila ({УКАЗАТЬ}). Za detaljnije informacije posetite link: (https://driver.yandex/branding_rules_2/)',
      uzb:
        'avtomobilga brending yopishtirma qismini joylashtirishda rang sxemasiga amal qilinmagan ({УКАЗАТЬ}). Batafsil maʼlumot uchun havola orqali oʻting: (https://driver.yandex/branding_rules_2/)',
      fin: 'Tarrojen väri on väärä.',
    },
    {
      only:
        'не соблюдена цветовая схема оклейки автомобиля (буква "Я" должна быть черного цвета). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
    },
    {
      only:
        'не соблюдена цветовая схема оклейки автомобиля (буква "Я" должна быть красного цвета). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
    },
    {
      only:
        'не соблюдена цветовая схема оклейки автомобиля (буква "Я" должна быть белого цвета). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
    },
    {
      only:
        'не соблюдена цветовая схема оклейки автомобиля (ливрея должна быть бело-черного цвета). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
    },
    {
      only:
        'не соблюдена цветовая схема оклейки автомобиля (ливрея должна быть желто-черного цвета). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
    },
    {
      only:
        'не соблюдена цветовая схема оклейки автомобиля (ливрея должна быть бело-желтого цвета). Для подробной информации перейдите по [ссылке](https://driver.yandex/branding_rules_2/)',
    },
  ],
  lostElement = [
    { label: 'ОТСУТСТВУЮТ ЭЛЕМЕНТЫ', th: true },
    {
      text:
        'отсутствует ___. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)',
      am:
        'բացակայում է՝ ___։ Բրենդավորման մասին ավելի մանրամասն կարող եք իմանալ կայքում՝ https://driver.yandex/branding_rules_2/)',
      az:
        '___ yoxdur. Brendləmə haqqında daha ətraflı öyrənmək üçün aşağıdakı keçiddən yararlanın: (https://driver.support-uber.com)',
      est: 'puudub ___. Täpsemalt saab brändimisest teada veebilehel: (https://driver.yandex/branding_rules_2/)',
      geo:
        'არ არის ___. ბრენდირების შესახებ დაწვრილებით შეგიძლიათ გაიგოთ ვებსაიტზე: (https://driver.yandex/branding_rules_2/)',
      kaz: '___ жоқ. Брендинг туралы толығырақ мына сайттан білуге болады: (https://driver.yandex/branding_rules_2/)',
      kgz: '___ жок. Брендинг тууралуу сайттан кеңири билүүгө болот: (https://driver.yandex/branding_rules_2/)',
      lat: 'nav ___. Vairāk informācijas par brendingu var iegūt vietnē: (https://driver.yandex/branding_rules_2/)',
      ltu:
        'nėra ___. Išsamią informaciją apie prekės ženklų naudojimą galite rasti šiuo adresu: (https://driver.yandex/branding_rules_2/)',
      mda:
        'lipsește ___. Mai multe detalii despre branding pot fi găsite pe site-ul: (https://driver.yandex/branding_rules_2/)',
      cro: 'nedostaje ___. Detaljnije o brendiranju možete saznati na sajtu: (https://driver.yandex/branding_rules_2/)',
      uzb:
        '___ mavjud emas. Brending toʻgʻrisidagi batafsil maʼlumotlarni saytdan bilib olishingiz mumkin: (https://driver.yandex/branding_rules_2/)',
    },
    {
      only:
        'отсутствует оклейка заднего стекла и номер телефона на бортах. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)',
    },
    {
      only:
        'отсутствует номер телефона на бортах. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)',
    },
    {
      only:
        'отсутствует оклейка заднего стекла. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)',
    },
    {
      only:
        'отсутствуют шашки на переднем/заднем правом/левом крыле. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)',
    },
    {
      only:
        'отсутствуют шашки на переднем/заднем крыле. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)',
    },
    {
      only:
        'отсутствует шашечный пояс. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)',
    },
    {
      only:
        'отсутствует бортовой номер. Подробнее о брендировании можно узнать на [сайте](https://driver.yandex/branding_rules_2/)',
    },
  ];

const remarks = [{ label: 'НЕ ИСПОЛЬЗУЕМ', th: true }],
  countryTranslate = {
    rus: 'РФ',
    am: 'Армения',
    az: 'Азербайджан',
    est: 'Эстония',
    geo: 'Грузия',
    kaz: 'Казахстан',
    kgz: 'Киргизия',
    lat: 'Латвия',
    ltu: 'Литва',
    cro: 'Хорватия',
    uzb: 'Узбекистан',
    fin: 'Финляндия',
    mda: 'Молдавия-Румыния',
    srb: 'Сербия',
    gana: 'Гана',
    isr: 'Израиль',
    kot: 'Кот-д’Ивуар',
  },
  cities = {
    am: [
      'Араратская область',
      'Ванадзор',
      'Горис',
      'Гюмри',
      'Ереван',
      'Капан',
      'Котайкская область',
      'Армавирская область',
    ],
    az: ['Баку'],
    est: ['Таллин', 'Тарту'],
    geo: ['Батуми', 'Кутаиси', 'Рустави', 'Тбилиси'],
    kaz: [
      'Актау',
      'Актобе',
      'Алматы',
      'Астана',
      'Атырау',
      'Караганда',
      'Кокшетау',
      'Костанай',
      'Кызылорда',
      'Павлодар',
      'Петропавловск',
      'Семей',
      'Темиртау',
      'Тараз',
      'Туркестан',
      'Уральск',
      'Усть-Каменогорск',
      'Шымкент',
      'Экибастуз',
      'Жезказган',
      'Талдыкорган',
    ],
    kgz: ['Бишкек', 'Ош'],
    lat: ['Рига', 'Даугавпилс', 'Лиепая', 'Валмиера', 'Вентспился', 'Елгава'],
    ltu: ['Вильнюс'],
    cro: ['Загреб', 'Сплит', 'Риека', 'Осиек'],
    uzb: ['Ташкент', 'Наманган', 'Фергана'],
    fin: ['Хельсинки', 'Вантаа', 'Эспоо'],
    mda: ['Кишинёв','Бухарест'],
    srb: ['Белград'],
    gana: ['Аккра'],
    isr: ['Тель-Авив', 'Яффо', 'Раана', 'Герцлия', 'Нетания', 'Хайфа', 'Ашкелон', 'Ашдод'],
    kot: ['Абиджан', 'Сан-Педро', 'Ман', 'Далоа'],
  };

document.querySelector('.modal-dialog').style.width = '50%';

const commentList = document.getElementById('comment-list'),
  btnBlock = document.getElementById('btn-block'),
  btnRemarks = document.getElementById('btn-dkb-minor-remarks'),
  head = document.querySelector('head'),
  style = document.createElement('style'),
  divTranslate = document.createElement('div'),
  select = document.createElement('select'),
  templateList = document.createElement('ul');

function createBtn(bgColor, color, name, fn) {
  const btn = document.createElement('button');
  btn.textContent = name;
  btn.className = 'btn';
  btn.style.backgroundColor = bgColor;
  btn.style.color = color;
  btn.style.marginTop = '6px';
  btn.style.marginRight = '5px';
  btn.addEventListener('click', fn);

  return btn;
}

function createCtxMenu() {
  const ctxMenu = document.createElement('div'),
    ul = document.createElement('ul');
  ctxMenu.classList.add('context-menu');
  ctxMenu.append(ul);
  ctxMenu.style = `position: absolute; background-color: #fff; border: 1px solid #000`;
  ul.style = 'list-style: none; margin: 0; padding: 0;';

  return ctxMenu;
}

//inline style
head.append(style);
style.innerHTML =
  '.templates-item{border-bottom: 1px solid #cacaca; padding: 2px 8px;}.template-head{background-color:#d8e6ea;font-weight:bold;padding:3px 10px}.templates-item:hover{background-color: #f3f3f3; cursor: pointer}';
//вставка селекта перевод
commentList.style.width = '100%';
commentList.style.position = 'relative';
commentList.before(divTranslate);
//adding btns
const ctxMenu = createCtxMenu();
const fnBranding = fnTranslate.bind(null, branding),
  fnLightbox = fnTranslate.bind(null, lightbox);
const btnBranding = createBtn('#1dacd6', '#fff', 'Стикеры', () => fnBranding(select.value)),
  btnUber = createBtn('#000', '#fff', 'UBER', fnUber),
  btnLightbox = createBtn('#f0ad4e', '#fff', 'Лайтбоксы', () => fnLightbox(select.value));

divTranslate.append(btnBranding);
divTranslate.append(btnUber);
divTranslate.append(btnLightbox);
//adding select
divTranslate.append(select);
//стили селекта
select.style = 'float: right; margin: 5px';

function fnUber() {
  resetList();
  templateList.innerHTML = toHTML(filteredArray(uber, select.value));
}

function filteredArray(arr, trs) {
  // console.log('trs', trs);
  if (trs === 'rus' || trs === undefined) {
    trs = 'text';
  }
  let array;
  trs === 'text'
    ? (array = arr.filter((item) => item.label || item.text || item.only))
    : (array = arr.filter((item) => item.label || item.text));
  return array.map((i) => {
    return i.th
      ? { label: i.label, th: i.th }
      : i.menu
      ? { text: i.text, menu: i.menu }
      : { text: i.text || i.only, translate: i[trs] || i.only };
  });
}

function toHTML(arr) {
  return arr
    .map((i) => {
      if (i.th) {
        return `<li class='template-head'>${i.label}</li>`;
      } else {
        if (i.menu) {
          return `<li itemvalue='${i.translate}' class='templates-item' style="background-color: #8affbd;">${i.text}</li>`;
        } else {
          return `<li itemvalue='${i.translate}' class='templates-item'>${i.text}</li>`;
        }
      }
    })
    .join(' ');
}

//функция выбора перевода и загрузки списка
function fnTranslate(arr, key) {
  const menu = ctxMenu.querySelector('ul');
  templateList.innerHTML = '';
  menu.innerHTML = '';
  templateList.innerHTML = toHTML(filteredArray(arr, key));
}
//заполнение селекта
for (let key in countryTranslate) select.innerHTML += `<option value="${key}">${countryTranslate[key]}</option>`;

//функция автоматисекого выбора перевода от города и страны
let city;
$(document).bind('item_info', function (e, params) {
  city = params.city;
  console.log(city);
});

const selectCity = () => {
  for (let key in cities) {
    if (cities[key].indexOf(city) >= 0) {
      select.value = key;
      return key;
    }
  }
};

//функция вставки и очистки списка
const resetList = () => {
  //очистка списка
  commentList.innerHTML = '';
  //вставка списка
  commentList.append(templateList);
  templateList.classList.add('list-group');

  templateList.innerHTML = '';
  select.disabled = false;
  select.selectedIndex = 0;

  btnBranding.removeAttribute('disabled');
  btnUber.removeAttribute('disabled');
  btnLightbox.removeAttribute('disabled');

  templateList.style.pointerEvents = 'all';
  templateList.style.opacity = '1';
};

//функция фриза выбора перевода
const freeze = () => {
  select.disabled = true;
  btnBranding.setAttribute('disabled', true);
  btnUber.setAttribute('disabled', true);
  btnLightbox.setAttribute('disabled', true);
};

//события
btnBlock.addEventListener('click', () => {
  divTranslate.style.display = 'block';
  commentList.style.display = 'block';

  resetList();
  fnTranslate(branding, selectCity());
});

btnRemarks.addEventListener('click', () => {
  divTranslate.style.display = 'none';
  commentList.style.display = 'block';

  resetList();
  //remarks.map((item) => toHTML(templateList, item, item.text));
  fnTranslate(lightbox, selectCity());
});

select.addEventListener('change', function () {
  templateList.innerHTML = '';
  fnTranslate(branding, select.value);
});

function addMsg(target) {
  const msgOriginal = document.getElementById('msg');

  if (!msgOriginal.value) {
    freeze();
    msgOriginal.value = target.getAttribute('itemvalue');
  } else {
    freeze();
    msgOriginal.value = `${msgOriginal.value},\n${target.getAttribute('itemvalue')}`;
  }
}

function createMenuHTML(event, position, html) {
  commentList.append(ctxMenu);
  ctxMenu.querySelector('ul').innerHTML = html;
  ctxMenu.style.top = `50px`;
  ctxMenu.style.left = `50px`;
  // ctxMenu.style.top = `${event.clientY - position.y}px`;
  // ctxMenu.style.left = `${event.clientX - position.x}px`;
  templateList.style.pointerEvents = 'none';
  templateList.style.opacity = '.6';
}

commentList.addEventListener('click', (event) => {
  const target = event.target;
  let position = commentList.getBoundingClientRect();

  if (!event.target.classList.contains('template-head')) {
    switch (target.textContent) {
      case 'САМОДЕЛЫ': {
        createMenuHTML(event, position, toHTML(filteredArray(samodel, select.value)));
        break;
      }
      case 'АВТО': {
        createMenuHTML(event, position, toHTML(filteredArray(auto, select.value)));
        break;
      }
      case 'ЦВЕТОВАЯ СХЕМА': {
        createMenuHTML(event, position, toHTML(filteredArray(colorSchema, select.value)));
        break;
      }
      case 'ОТСУТСТВУЕТ ЭЛЕМЕНТ': {
        createMenuHTML(event, position, toHTML(filteredArray(lostElement, select.value)));
        break;
      }
      default: {
        if (target.closest('div').classList.contains('context-menu')) {
          addMsg(target);
        } else {
          if (!!commentList.querySelector('.context-menu')) {
            commentList.removeChild(commentList.querySelector('.context-menu'));
            templateList.style.pointerEvents = 'all';
            templateList.style.opacity = '1';
          } else {
            addMsg(target);
          }
        }
      }
    }
  }
});

//защита от мискликов
$(document).bind("select_item", function (e, params) {
    const btnOK = document.getElementById('btn-ok')
    setTimeout(() => {
        btnOK.disabled = true
    }, 10)
    setTimeout(() => {
        btnOK.disabled = false
    }, 500)
})