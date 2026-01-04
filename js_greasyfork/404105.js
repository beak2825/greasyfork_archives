// ==UserScript==
// @name         Обратный перевод для шаблонов
// @version      0.5.4
// @description  ///+ДКВУ ///+СТС ///+История
// @author       ya
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=sts
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc/history?exam=sts*
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/404105/%D0%9E%D0%B1%D1%80%D0%B0%D1%82%D0%BD%D1%8B%D0%B9%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%20%D0%B4%D0%BB%D1%8F%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/404105/%D0%9E%D0%B1%D1%80%D0%B0%D1%82%D0%BD%D1%8B%D0%B9%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%20%D0%B4%D0%BB%D1%8F%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%BE%D0%B2.meta.js
// ==/UserScript==

const dictionary = [
  {
    rus: "фото размыто или сделано издалека. ФИО и номер должны чётко читаться",
    az: 'foto ya yuyulub, ya da uzaqdan çəkilib. SAA və nömrə oxunmalıdır',
    geo: 'ფოტო ბუნდოვანია ან შორიდანაა გადაღებული. სახელი, გვარი და ნომერი უნდა იკითხებოდეს',
    kgz: 'фото так эмес же алыстан тартылган. ФАА жана номер окулушу керек',
    uzb: 'surat chaplangan yoki uzoqdan olingan. FISH va raqam o‘qilishi kerak',
    est: 'foto on udune või pildistatud kaugelt perekonna-, ees- ja isanimi ja number peavad olema loetavad',
    mda: 'fotografia este neclară sau făcută de la distanță. Numele complet și numărul trebuie să fie lizibile',
    slo: 'Photos are blurry or taken from far away. Full name and number must be visible and distinct',
    eng: 'Photos are blurry or taken from far away. Full name and number must be visible and distinct',
    arm: 'լուսանկարը լղոզված է կամ հեռվից է արվել: ԱԱՀ-ն և համարը պետք է ընթեռնելի լինեն',
    fin: 'valokuva on epätarkka tai otettu liian kaukaa. Koko nimen ja numeron tulee olla luettavissa'
  },

  {
    rus: "нет фотографий водительского удостоверения",
    az: 'heç bir vəsiqə fotoşəkili yoxdur',
    geo: 'არ არის მოწმობის არცერთი სურათი',
    kgz: 'күбөлүктүн бир дагы фотосүрөтү жок',
    uzb: 'birorta ham haydovchilik guvohnomasi rasmi yo‘q',
    est: 'juhiloast ei ole ühtki fotot',
    mda: 'nu există nicio fotografie a permisului',
    slo: 'Brez fotografij vozniškega dovoljenja',
    eng: 'No photos of driver`s license',
    arm: 'վկայականի ոչ մի լուսանկար չկա',
    fin: 'valokuvassa tulee olla pelkkä ajokortti'
  },

  {
    rus: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
    az: 'fotoda vəsiqənin bir hissəsi yoxdur. Yoxlamaq üçün hər iki - üz və arxa tərəf lazımdır',
    geo: 'ფოტოზე არ არის მოწმობის ერთ-ერთი მხარე. შემოწმებისთვის საჭიროა ორივე მხარე: წინა და უკანა',
    kgz: 'фотодо күбөлүктүн бир тарабы жок. Текшерүү үчүн эки тарабы тең керек: алдыңкы жана арткы',
    uzb: 'fotosuratda haydovchilik guvohnomasining birorta ham tomoni yo‘q. Tekshiruv uchun har ikkala tarafi kerak: old va orqa tomoni',
    est: 'juhiloa ühe poole foto puudub Kontrollimiseks on vajalikud mõlemad pooled: esi- ja tagapool',
    mda: 'pe fotografie nu există una din fețele permisului. Pentru verificare sunt necesare ambele fețe: cea din față și cea din spate',
    slo: 'The photo does not contain either side of the license. Both sides need to be checked: front and back',
    eng: 'The photo does not contain either side of the license. Both sides need to be checked: front and back',
    arm: 'լուսանկարի վրա բացակայում է վկայականի կողմերից մեկը: Ստուգման համար անհրաժեշտ են երկու կողմերը՝ առջևի և հետևի',
    fin: 'valokuvassa ei näy ajokortti edestä tai takaa. Vahvistuksen suorittamiseksi tarvitsemme kuvan ajokortista sekä edestä että takaa'
  },

  {
    rus: 'водительское удостоверение не полностью попало в кадр',
    az: 'vəsiqə tam şəkildə kadra düşməyib',
    geo: 'მოწმობა სრულად არ არის კადრში მოხვედრილი',
    kgz: 'күбөлүк кадрга толук түшпөй калган',
    uzb: 'haydovchilik guvohnomasi kadrga to‘liq tushmagan',
    est: 'juhiluba ei ole täielikult kaadris',
    mda: 'permisul nu a intrat complet în cadru',
    slo: 'The license must be fully in the shot',
    eng: 'The license must be fully in the shot',
    arm: 'վկայականը կադրի մեջ ամբողջությամբ չի տեղավորվել',
    fin: 'ajokortti ei ole kuvassa täysin'
  },

  {
    rus: 'номер на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите таксопарк обновить данные.',
    az: 'vəsiqə və taksi parkı üzrə profilinizdəki nömrə üst-üstə düşmür. Profili taksi parkı yeniləyə bilər',
    geo: 'ნომრები მოწმობასა და თქვენს ტაქსოპარკის პროფილში განსხვავებულია. პროფილის განახლებას შეძლებს ტაქსოპარკი',
    kgz: 'күбөлүктөгү жана таксопарктагы сиздин профилдеги номер дал келбейт. Профилди таскопарк жаңырта алат',
    uzb: 'haydovchilik guvohnomangizdagi raqam taksi saroyidagi profilingizda berilgan raqamdan farq qilmoqda. Profilni taksi saroyi yangilashi mumkin',
    est: 'juhiloal esitatud number ja Teie taksofirma profiili number on erinevad. Profiili saab uuendada taksofirma',
    mda: 'numărul de pe permis și din profilul dumneavoastră de la compania de taxiuri nu se potrivesc. Compania de taxiuri poate actualiza profilul',
    slo: 'The number of your license and the one entered in your profile are not the same. The taxi company can edit your profile',
    eng: 'your driver`s license number doesn`t match the one in your taxi company profile. The taxi company can update your profile',
    arm: 'վկայականի վրա և տաքսոպարկի Ձեր նկարագրում նշված համարները չեն համընկնում: Պրոֆիլը կկարողանա թարմացնել տաքսոպարկը',
    fin: 'ajokortin numero ja profiilissasi ilmoitettu numero eivät vastaa toisiaan. Voit päivittää profiilisi täällä:Gyldenintie 9, 00200 Helsinki'
  },

  {
    rus: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
    az: 'Vəsiqədəki SAA və taksi parkı üzrə profilinizdəki nömrə üst-üstə düşmür. Profili taksi parkı yeniləyə bilər',
    geo: 'სახელი და გვარი მოწმობასა და თქვენს ტაქსოპარკის პროფილში განსხვავებულია. პროფილის განახლებას შეძლებს ტაქსოპარკი',
    kgz: 'Күбөлүктөгү жана таксопарктагы сиздин профилдеги ФАА дал келбейт. Профилди таскопарк жаңырта алат',
    uzb: 'haydovchilik guvohnomangizdagi FISH taksi saroyidagi profilingizda berilgan raqamdan farq qilmoqda. Profilni taksi saroyi yangilashi mumkin',
    est: 'juhiloal esitatud perekonna-, ees- ja isanimi ja Teie taksofirma profiili andmed on erinevad. Profiili saab uuendada taksofirma',
    mda: 'Numele complet de pe permis și din profilul dumneavoastră de la compania de taxiuri nu se potrivesc. Compania de taxiuri poate actualiza profilul',
    slo: 'Name on the license and in your taxi company profile are not the same. The taxi company can edit your profile',
    eng: 'Your full name on your driver`s license doesn`t match the one in your taxi company profile. The taxi company can update your profile',
    arm: 'վկայականի վրա և տաքսոպարկի Ձեր նկարագրում նշված ԱԱՀ-ները չեն համընկնում: Պրոֆիլը կկարողանա թարմացնել տաքսոպարկը',
    fin: 'Ajokortissa ilmoitettu nimi ja profiilissasi ilmoitettu nimi eivät vastaa toisiaan. Voit päivittää profiilisi täällä:Gyldenintie 9, 00200 Helsinki'
  },

  {
    rus: 'нет вашей фотографии с водительским удостоверением',
    az: 'sürücülük vəsiqəsi ilə fotonuz yoxdur',
    geo: 'არ არის თქვენი ფოტო მოწმობით',
    kgz: 'күбөлүк менен сиздин фото жок',
    uzb: 'guvohnoma bilan birga tushgan suratingiz yo‘q',
    est: 'juhiloal puudub Teie foto',
    mda: 'pe permis nu este fotografia dumneavoastră',
    slo: 'Missing your photo with license',
    eng: 'no photo of yourself with license',
    arm: 'վկայականով Ձեր լուսանկարը բացակայում է',
    fin: 'et ole lähettänyt selfietä ajokortin kanssa'
  },

  {
    rus: 'фотография с водительским удостоверением получилась нечёткой',
    az: 'vəsiqədəki foto ilə sizin onunla fotonuz aydın deyil',
    geo: 'მოწმობის ფოტო და თქვენი ფოტო მასთან ერთად გამოვიდა ბუნდოვანი',
    kgz: 'күбөлүктүн фотосу жана аны менен сиздин фото даана эмес',
    uzb: 'guvohnoma surativa u bilan birga tushgan suratingiz tiniq chiqmadi',
    est: 'juhiloa foto ja Teie foto juhiloal ei ole terav',
    mda: 'fotografia permisului și fotografia dumneavoastră cu permisul nu sunt clare',
    slo: 'Photo of your license and your photo with the license are blurry',
    eng: 'your license photo and photo of yourself holding it are blurry',
    arm: 'վկայականի լուսանկարը և դրա հետ Ձեր լուսանկարը պարզ չեն ստացվել',
    fin: 'ajokortillinen selfiesi on epätarkka'
  },

  {
    rus: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
    az: 'vəsiqə ilə fotonuz kəsilib. Yoxlanış üçün sifət və vəsiqə kadra tam düşməlidir',
    geo: 'თქვენი მოწმის ფოტო მოჭრილია. შემოწმებისთვის საჭიროა, რომ სახე და მოწმობა სრულად მოხვდეს კადრში',
    kgz: 'күбөлүк менен сиздин фото кесилген. Жүзүңүз жана күбөлүк толук кадрга түшкөндөй сүрөткө тартыңыз',
    uzb: 'guvohnoma bilan tushgan suratingiz qirqilgan. Tekshiruv uchun shunday suratga olingki, yuzingiz va guvohnomangiz kadrga to‘liq tushsin',
    est: 'Teie fotot koos juhiloaga on kärbitud. Kinnituseks on vajalik, et nägu ja juhiluba on tervenisti kaadris',
    mda: 'fotografia dumneavoastră cu permisul este trunchiată. Pentru verificare este necesar ca persoana și permisul să intre complet în cadru',
    slo: 'Your photo with your license is cut off. Photograph yourself so that your face and license are both completely in the frame.',
    eng: 'Your photo with your license is cut off. Photograph yourself so that your face and license are both completely in the frame.',
    arm: 'վկայականի հետ Ձեր լուսանկարը եզրատված է: Ստուգման համար անհրաժեշտ է, որ դեմքը և վկայականը ամբողջությամբ տեղավորվեն կադրի մեջ',
    fin: 'ajokortillinen selfiesi ei näy kuvassa kokonaan. Vahvistuksen suorittamiseksi sekä kasvojesi että ajokorttisi tulee näkyä kuvassa kokonaan'
  },

  {
    rus: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
    az: 'vəsiqənin şəkli üzlükdə çəkilib, bu isə yoxlanışı çətinləşdirir',
    geo: 'მოწმობის სურათი გადაღებულია ყდაში, რაც ართულებს შემოწმებას',
    kgz: 'күбөлүк кабы менен сүрөткө тартылгандыгынан, текшерүү татал болуп жатат',
    uzb: 'guvohnoma g‘ilofda suratga olingan, bu esa tekshiruvni qiyinlashtiradi',
    est: 'juhiluba on pildistatud varjus, mis raskendab kinnitamist',
    mda: 'permisul este fotografiat în copertă, iar verificarea este dificilă din acest motiv',
    slo: 'License photographed inside protective cover. We need to check a photo taken without the cover',
    eng: 'driver`s license photographed without removing cover (making it difficult to verify).',
    arm: 'վկայականը լուսանկարվել է կազմի մեջ, ինչը դժվարացնում է ստուգումը',
    fin: 'vahvistuksen suorittaminen ei onnistu, sillä ajokortti ei näy kuvassa kokonaan'
  },

  {
    rus: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
    az: 'vəsiqənin tərəflərindən biri və sizin onunla fotonuz yoxdur',
    geo: 'არ არის მოწმობის ერთ-ერთი მხარე და თქვენი ფოტო მასთან ერთად',
    kgz: 'күбөлүктүн бир тарабы жана аны менен фотоңуз жок',
    uzb: 'guvohnomaning bir tomoni suratga olinmagan va u bilan tushgan suratingiz yo‘q',
    est: 'juhiloal ei ole ühtegi külge ja puudub Teie foto juhiloal',
    mda: 'nu există una din fețele permisului și fotografia dumneavoastră cu permisul',
    slo: 'Missing one of the sides of your license, as well as your photo with the license',
    eng: 'no photos of either side of license or photo with it',
    arm: 'բացակայում է վկայականի կողմերից մեկը և դրա հետ Ձեր լուսանկարը',
    fin: 'yksi ajokortin puolista ja selfie ajokortin kanssa puuttuvat'
  },

  {
    rus: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
    az: 'vəsiqənin fotosu ilə sizin fotonuz kəsilib. Yoxlanış üçün hər şey tam şəkildə kadra düşməlidir',
    geo: 'მოწმობის ფოტო და თქვენი ფოტო მასთან ერთად მოჭრილია. შემოწმებისთვის საჭიროა, რომ ყველაფერი სრულად მოხვდეს კადრში',
    kgz: 'күбөлүктүн фотосу жана аны кармаган сиздин фото кесилген. Текшерүү үчүн, баары толук кадрга түшкөндөй сүрөткө тартыңыз',
    uzb: 'guvohnoma surativa u bilan birga tushgan suratingiz qirqib olingan. Tekshiruv uchun shunday suratga olingki, hammasi kadrga to‘liq tushsin',
    est: 'juhiloa fotot ja Teie poolt esitatud fotot juhiloal on kärbitud. Kinnituseks on vajalik, et kõik jääb tervikuna kaadrisse',
    mda: 'fotografia de pe permis și fotografia dumneavoastră cu permisul sunt trunchiate. Pentru verificare este necesar ca totul să intre complet în cadru',
    slo: 'The license photo and your picture with it are cut off. Take new photos, with everything completely in the frame.',
    eng: 'license photo and your picture with it are cut off. Everything must be completely captured in the frame so we can check them',
    arm: 'վկայականի լուսանկարը և դրա հետ Ձեր լուսանկարը եզրատված են: Ստուգման համար անհրաժեշտ է, որ ամենը ամբողջությամբ տեղավորվի կադրի մեջ',
    fin: 'ajokortillinen selfiesi ja kuvat ajokortistasi on rajattu huonosti. Vahvistuksen suorittamiseksi kaiken tulee näkyä kuvassa kokonaan'
  },

  {
    rus: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
    az: 'vəsiqə ilə fotonuzdan savayı vəsiqənin şəklini ayrıca (üz və arxa tərəfini) çəkmək lazımdır',
    geo: 'გარდა თქვენი ფოტოსი მოწმობასთან ერთად, საჭიროა ცალკე მოწმობისთვის სურათის გადაღება (წინა და უკანა მხარეების)',
    kgz: 'күбөлүк кармаган өзүңүздүн фотодон тышкары күбөлүктү өзүнчө сүрөткө тартуу керек (алдыңкы жана арткы тарабын)',
    uzb: 'o‘zingizni guvohnoma bilan suratga olish bilan birga guvohnomani alohida ham suratga olishingiz zarur (old va orqa tomonini)',
    est: 'Lisaks oma fotole juhiloal peate pildistama ka juhiluba tervikuna (eestpoolt ja tagantpoolt)',
    mda: 'în afara de fotografia dumneavoastră cu permisul; trebuie să fotografiați și permisul separat (față și spate)',
    slo: 'In addition to your photo with the license, you must photograph the license separately (both sides).',
    eng: 'in addition to your photo with the license, you must photograph the license separately (both sides)',
    arm: 'վկայականի հետ ձեր լուսանկարից բացի, անհրաժեշտ է լուսանկարել վկայականն առանձին (առջևի և հետևի կողմերը)',
    fin: 'ajokortillisen selfien lisäksi sinun tulee myös kuvata ajokorttisi erillään (sekä edestä että takaa)'
  },
  {
    rus: "есть сомнения в подлинности удостоверения",
    az: 'vəsiqənin orijinallığı ilə bağlı şübhə var',
    geo: 'მოწმობის ნამდვილობა საეჭვოა',
    kgz: 'күбөлүктүн дааналыгында шек бар',
    uzb: 'guvohnomaning qalbaki ekanligiga shubha bor',
    est: 'juhiloa ehtsuse suhtes on kahtlusi',
    mda: 'există îndoieli cu privire la autenticitatea permisului',
    slo: 'There are doubts about the authenticity of this driver`s license',
    eng: 'doubt authenticity of license',
    arm: 'կան կասկածներ վկայականի իսկության վերաբերյալ',
    fin: 'ajokorttia epäillään väärennökseksi'
  },

  {
    rus: "есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению",
    az: 'bu vəsiqə ilə sizin avtomobili idarə etmək hüququnuzda şübhə var',
    geo: 'თქვენი უფლება ატაროთ ავტომანქანა ამ მოწმობით საეჭვოა',
    kgz: 'бул күбөлүк менен автомобилди айдоо укугуңуздун болгону шектүү',
    uzb: 'bu guvohnoma bilan avtomobilni boshqarish huquqiga ega ekanligingiz bo‘yicha shubha mavjud',
    est: 'teie õiguse suhtes autot juhtida selle juhiloaga on kahtlusi',
    mda: 'există îndoieli privind dreptul dumneavoastră de a conduce automobilul cu acest permis',
    slo: 'There are doubts about whether this license gives you the right to drive a car',
    eng: 'doubts concerning your right to drive a car using this license',
    arm: 'կան կասկածներ այս վկայականով մեքենա վարելու Ձեր իրավունքի վերաբերյալ'
  },

  {
    rus: "нет отметки о категории Б в вашем водительском удостоверении",
    az: 'vəsiqənizdə B kateqoriyası ilə bağlı qeyd yoxdur',
    geo: 'თქვენს მოწმობაში არ არის მონიშვნა ბ კატეგორიის შესახებ',
    kgz: 'күбөлүгүңүздөгү Б категориясынын белгиси жок',
    uzb: 'guvohnomangizda B toifasi belgilanmagan',
    est: 'teie juhiloal pole märget B-kategooria kohta',
    mda: 'în permisul dumneavoastră de conducere nu există categoria B',
    slo: 'Your license does not have a Category B mark',
    eng: 'no category B indication on your license',
    arm: 'Ձեր վկայականում բացակայում է B կարգի վերաբերյալ նշումը',
    fin: 'ajokortistasi puuttuu B-ajoneuvoluokan kuljettamisoikeus'
  },

  {
    rus: "недопустимое содержание фотографий",
    az: 'fotoşəklin məzmunu yolverilməzdir',
    geo: 'ფოტოსურათების დაუშვებელი შინაარსი',
    kgz: 'фотосүрөттөрдүн жол берилгис мазмуну',
    uzb: 'fotosuratlarda berilishi mumkin bo‘lgan narsalar',
    est: 'fotode sisu on sobimatu',
    mda: "conținutul fotografiilor este nevalid'",
    slo: 'Unacceptable photo content',
    eng: 'unacceptable photo content',
    arm: 'լուսանկարների անթույլատրելի բովանդակություն',
    fin: 'virheellinen kuvasisältö'
  },

  {
    rus: 'срок действия водительского удостоверения истёк',
    az: 'vəsiqənin etibarlılıq müddəti bitib',
    geo: 'მოწმობის მოქმედების ვადა ამოიწურა',
    kgz: 'күбөлүктүн колдонуу мөөнөтү аяктаган',
    uzb: 'guvohnomaning amal qilish muddati tugagan',
    est: 'juhiloa kehtivusaeg on lõppenud',
    mda: 'termenul de valabilitate al permisului este depășit',
    slo: 'Your license is expired',
    eng: 'Your license is expired',
    arm: 'վկայականի վավերականության ժամկետը սպառվել է',
    fin: 'ajokortti vanhentunut'
  },

  {
    rus: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
    az: 'fotoda vəsiqənin surəti verilib, yoxlanış üçün isə orijinal lazımdır',
    geo: 'ფოტოზე მოწმობის ასლია, შემოწმებისთვის კი საჭიროა დედანი',
    kgz: 'фотого күбөлүктүн көчүрмөсү тартылган, бирок текшерүүгө түп нускасы керек',
    uzb: 'fotosuratda guvohnoma nusxasi berilgan, tekshiruv uchun uning asl nusxasi zarur',
    est: 'fotol on juhiloa koopia, aga kinnitamiseks on nõutav originaal',
    mda: 'în fotografie este o copie a permisului, iar pentru verificare este nevoie de original',
    slo: 'Photo taken of a copy of the license. We need to check the original',
    eng: 'photo taken of license copy; we need to check the original license',
    arm: 'լուսանկարի վրա վկայականի պատճենն է, իսկ ստուգման համար անհրաժեշտ է բնօրինակը',
    fin: 'valokuvassa näkyy kopio ajokortista, mutta vahvistuksen suorittamiseksi kuvassa tulee näkyä alkuperäinen ajokortti'
  },

  {
    rus: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
    az: 'fotodakı məlumatları oxumaq çətindir, çünki vəsiqə yararsız hala düşüb',
    geo: 'ფოტოზე მონაცემების წაკითხვა რთულია, რადგან მოწმობა უვარგის მდგომარეობაშია',
    kgz: 'күбөлүк жарабай калгандыктан, фотодогу маалыматтарды окуу татаал',
    uzb: 'fotosuratdagi ma’lumotlarni o‘qish qiyin bo‘lyapti, chunki guvohnoma yaroqsiz holatga kelib qolgan',
    est: 'fotol olevaid andmeid on raske lugeda, kuna juhiluba on kulunud',
    mda: 'datele fotografiei sunt greu de citit, deoarece permisul a devenit inutilizabil',
    slo: 'Your driver`s license is in poor condition; information is illegible. Please replace your license',
    eng: 'difficult to read info in photo because license is worn out',
    arm: 'լուսանկարի վրա պատկերված տվյալները դժվար է կարդալ, քանի որ վկայականը վնասվել է',
    fin: 'tietojen lukeminen ajokortista on hankalaa sen vaurioitumisen takia'
  },

  {
    rus: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
    az: 'vəsiqədəki foto sizin öz fotonuza uyğun gəlmir',
    geo: 'ფოტო მოწმობაზე არ შეესაბამება თქვენს მიერ გადაღებულ ფოტოსურათს',
    kgz: 'күбөлүктөгү түшкөн фотоңузга өзүңүздүн сүрөтүңүз дал келбейт',
    uzb: 'guvohnomadagi surat bilan sizning fotosuratingiz mos kelmayapti',
    est: 'juhiloal olev foto ei vasta teist tehtud fotole',
    mda: 'fotografia din permis nu se potrivește cu fotografia dumneavoastră',
    slo: 'The photo on the license does not match your photo',
    eng: 'photo in license doesn`t match your photo of yourself',
    arm: 'վկայականի լուսանկարը չի համապատասխանում Ձեր լուսանկարին',
    fin: 'ajokortissasi oleva valokuva ei vastaa omaa valokuvaasi'
  },

  {
    rus: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
    az: 'foto kompüter ekranından edilib. Yoxlamaq üçün orijinal vəsiqə lazımdır',
    geo: 'ფოტო გადაღებულია კომპიუტერის ეკრანიდან. შემოწმებისთვის საჭიროა მოწმობის დედანი',
    kgz: 'фото компьютердин экранынан жасалган. Текшерүү үчүн күбөлүктүн түп нускасы керек',
    uzb: 'fotosurat ekran kompyuteridan qilingan. Tekshirish uchun guvohnomaning asl nusxasi kerak',
    est: 'foto on kopeeritud arvutiekraanilt. Kinnitamiseks on nõutav juhiloa originaal',
    mda: 'fotografie realizată de pe ecranul computerului. Pentru verificare este nevoie de permisul original',
    slo: 'Photo taken from computer screen. We need to check the original',
    eng: 'photo taken from computer screen. We need to check the original driver`s license',
    arm: 'լուսանկարը ստացվել է համակարգչի էկրանից: Ստուգման համար անհրաժեշտ է վկայականի բնօրինակը',
    fin: 'valokuva on otettu tietokoneen näytöstä. Vahvistuksen suorittamiseksi kuva tulee ottaa suoraan ajokortista'
  },

  //румыния блок
  { rus: 'данные айди-карты не совпадают с данными в карточке водителя', rou: 'datele din cartea de identitate nu coincid cu datele din fișa șoferului' },
  { rus: 'истёк срок действия вашей айди-карты', rou: 'termenul de valabilitate al cărții dvs. de identitate a expirat' },
  { rus: 'в кадре нет фотографии вашей айди-карты', rou: 'cartea dvs. de identitate lipsește din cadrul fotografiei' },
  { rus: 'фотография айди-карты нечёткая. Выберите хороший раскурс и освещение', rou: 'fotografia cărții dvs. de identitate este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit' },
  { rus: 'айди-карта не полностью попала в кадр или её фотография обрезана', rou: 'cartea de identitate nu a intrat complet în cadru sau fotografia ei a fost tăiată' },
  { rus: 'на фотографии скан или ксерокс айди-карты. Для проверки нужно фото оригинала', rou: 'pe fotografie este o copie scanată sau xeroxată a cărții de identitate. Pentru verificare este necesară fotografia documentului original' },
  { rus: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала', rou: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original' },

  { rus: 'фото размыто или сделано издалека. ФИО и номер должны читаться', rou: 'fotografia este neclară sau a fost făcută de la o distanță prea mare. Numele deplin și numărul trebuie să fie lizibile' },
  { rus: 'нет ни одной фотографии удостоверения', rou: 'lipsește fotografia permisului de conducere' },
  { rus: 'на фото нет одной из сторон удостоверения. Для проверки нужны обе стороны: лицевая и обратная', rou: 'pe fotografie lipsește una din părțile permisului de conducere. Pentru verificare sunt necesare ambele părți: față și verso' },
  { rus: 'удостоверение не полностью попало в кадр', rou: 'permisul de conducere nu a intrat complet în cadru' },
  { rus: 'номер на удостоверении и в вашем профиле в таксопарке не совпадают. Попросите поддержку обновить ваш профиль', rou: 'numărul indicat în permisul de conducere nu coincide cu cel din profilul dvs. înregistrat la partener. Rugați serviciul de asistență să vă actualizeze profilul' },
  { rus: 'фото сделано с экрана компьютера. Для проверки нужен оригинал удостоверения', rou: 'fotografia conține o imagine afișată pe ecranul calculatorului. Pentru verificare este nevoie de permisul de conducere original' },
  { rus: 'на фото копия удостоверения, а для проверки нужен оригинал', rou: 'în fotografie este o copie a permisului de conducere, iar pentru verificare este nevoie de fotografia documentului original' },
  { rus: 'нет вашего фото с удостоверением', rou: 'lipsește fotografia dvs. împreună cu permisul dvs. de conducere' },
  { rus: 'ваше фото с удостоверением получилось нечётким', rou: 'fotografia dvs. împreună cu permisul de conducere este neclară' },
  { rus: 'отсутствует отметка о категории Б в вашем удостоверении', rou: 'în permisul dvs. de conducere nu este bifată categoria B' },
  { rus: 'срок действия удостоверения истёк', rou: 'termenul de valabilitate al permisului dvs. de conducere a expirat' },
  { rus: 'фото в удостоверении не соответствует вашей фотографии себя', rou: 'între fotografia din permisul de conducere și fotografia dvs. există o diferență prea mare' },
  { rus: 'данные на фото сложно прочитать, так как удостоверение пришло в негодность', rou: 'datele din fotografie sunt practic ilizibile, deoarece permisul de conducere este prea uzat' },

  { rus: 'чужая справка, для проверки нужен ваш документ', rou: 'a fost prezentat un certificat de cazier judiciar străin; pentru verificare este necesar să prezentați propriul dvs. certificat' },
  { rus: 'истёк срок действия справки, для проверки нужен действующий документ', rou: 'termenul de valabilitate al certificatului de cazier judiciar a expirat; pentru verificare este necesar un certificat valid' },
  { rus: 'в справке нет информации об отстутвии судимости. Пришлите справку, которая это подтверждает.', rou: 'în certificat nu se confirmă faptul că solicitantul nu este înscris în cazierul judiciar. Vă rugăm să trimiteți un certificat de cazier judiciar în care se confirmă acest fapt.' },
  { rus: 'в кадре нет фотографии справки', rou: 'certificatul de cazier judiciar lipsește din cadrul fotografiei' },
  { rus: 'фотография справки нечёткая. Выберите хороший ракурс и освещение', rou: 'fotografia certificatului de cazier este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit' },
  { rus: 'справка не полностью попала в кадр или её фотография обрезана ', rou: 'certificatul de cazier judiciar nu a intrat complet în cadru sau fotografia lui a fost tăiată' },
  { rus: 'на фотографии скан или ксерокс справки. Для проверки нужна фотография оригинала', rou: 'pe fotografie este o copie scanată sau xeroxată a certificatului de cazier judiciar. Pentru verificare este necesară fotografia documentului original' },
  { rus: 'фотография сделана с экрана устройства. Для проверки нужна фотография оригинала справки', rou: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia certificatului original' },

  { rus: 'справка принадлежит другому водителю, данные не совпали', rou: 'a fost prezentat istoricul de sanctiuni al altui sofer; pentru verificare este necesar să prezentați propriul dvs. certificat' },
  { rus: 'история штрафов должна содержать информацию за 5 лет', rou: 'Istoricul sancțiunilor ar trebui să conțină informații pe parcursul ultimilor 5 ani' },
  { rus: 'документ должден быть не старше 6 месяцев', rou: 'istoricul sancțiunilor trebuie să fi fost emis în ultimele 6 luni' },
  { rus: 'в документе не должно быть записей о influența băuturilor alcoolice', rou: 'istoricul nu trebuie să conțină sancțiuni de natură penală' },
  { rus: 'в кадре нет фотографии истории штрафов', rou: 'istoricul de sancțiuni nu a fost fotografiat' },
  { rus: 'фотография истории штрафов нечёткая. Выберите хороший ракурс и освещение', rou: 'fotografia istoricului de sancțiuni este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit' },
  { rus: 'история штрафов не полностью попала в кадр, или её фотография обрезана ', rou: 'istoricul de sancțiuni nu a intrat complet în cadru sau fotografia lui a fost tăiată' },
  { rus: 'на фотографии скан или ксерокс истории штрафов. Для проверки нужна фотография оригинала', rou: 'pe fotografie este o copie scanată sau xeroxată a istoricului de sancțiuni. Pentru verificare este necesară fotografia documentului original' },
  { rus: 'фотография сделана с экрана устройства. Для проверки нужна фотография оригинала истории штрафов', rou: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia originală a istoricului de sancțiuni' },

  { rus: 'данные в сертификате не совпадают с данными в карточке водителя', rou: 'datele din certificatul de înmatriculare nu coincid cu datele din fișa șoferului' },
  { rus: 'в кадре нет фотографии вашего сертификата', rou: 'certificatul de înmatriculare lipsește din cadrul fotografiei' },
  { rus: 'фотография сертификата нечёткая. Выберите хороший ракурс и освещение', rou: 'fotografia certificatului de înmatriculare este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit' },
  { rus: 'сертификат не полностью попал в кадр или его фотография обрезана', rou: 'certificatul de înmatriculare nu a intrat complet în cadru sau fotografia lui a fost tăiată' },
  { rus: 'на фотографии скан или копия сертификата. Для проверки нужно фото оригинала', rou: 'pe fotografie este o copie scanată sau xeroxată a certificatului de înmatriculare. Pentru verificare este necesară fotografia documentului original' },
  { rus: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала', rou: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original' },
  { rus: 'ваш сертификат просрочен', rou: 'certificatul dvs. de înmatriculare este expirat' },
  //румыния чс
  { rus: 'есть сомнения в подлинности айди-карты', rou: 'există suspiciuni cu privire la autenticitatea cărții de identitate' },

  { rus: 'у вас не хватает водительского стажа. Для выполнения заказов общий стаж должен быть не менее двух лет', rou: 'nu aveți suficientă experiență de condus. Pentru a efectua comenzi, trebuie să aveți o experiență totală de condus de cel puțin doi ani' },
  { rus: 'есть сомнения в подлинности удостоверения', rou: 'există suspiciuni cu privire la autenticitatea permisului de conducere' },
  { rus: 'есть сомнения в вашем праве водить автомобиль по этому удостоверению', rou: 'există suspiciuni cu privire la dreptul dvs. de a conduce un automobil în baza acestui permis de conducere' },
  { rus: 'недопустимое содержание фотографий', rou: 'conținutul fotografiilor este inacceptabil' },

  { rus: 'есть сомнения в подлинности справки', rou: 'există suspiciuni cu privire la autenticitatea certificatului de cazier judiciar' },

  { rus: 'есть сомнения в подлинности истории штрафов', rou: 'există suspiciuni cu privire la autenticitatea istoricului de sancțiuni' },

  { rus: 'есть сомнения в подлинности сертификата', rou: 'există suspiciuni cu privire la autenticitatea certificatului de înmatriculare' },

  //сербия блок
  { rus: "фото размыто или сделано издалека. ФИО и номер должны чётко читаться", srb: 'fotografija je mutna ili napravljena izdaleka. Prezime, ime i broj moraju biti čitki' },
  { rus: "нет фотографий водительского удостоверения", srb: 'nema nijedne fotografije vozačke dozvole' },
  { rus: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная', srb: 'na fotografiji nema jedne od strana vozačke dozvole. Za proveru su potrebne obe strane: prednja i poleđina' },
  { rus: 'водительское удостоверение не полностью попало в кадр', srb: 'vozačka dozvola se ne nalazi u kadru u potpunosti' },

  { rus: 'любые из данных на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите таксопарк обновить данные.', srb: 'broj na vozačkoj dozvoli i na vašem profilu taksi udruženja se ne poklapaju. Zamolite podršku da ažurira vaš profil' },

  { rus: 'нет вашей фотографии с водительским удостоверением', srb: 'nedostaje vaša fotografija sa vozačkom dozvolom' },
  { rus: 'фотография с водительским удостоверением получилась нечёткой', srb: 'vaša fotografija sa vozačkom dozvolom nije čitka' },

  { rus: 'фото сделано с экрана компьютера. Для проверки нужен оригинал удостоверения', srb: 'fotografija je napravljena s ekrana kompjutera. Za proveru je potreban original vozačke dozvole' },
  { rus: 'на фото копия удостоверения, а для проверки нужен оригинал', srb: 'na fotografiji je kopija vozačke dozvole, a za proveru je potreban original' },
  { rus: 'отсутствует отметка о категории Б в вашем удостоверении', srb: 'ne postoji oznaka kategorije B u vašoj dozvoli' },
  { rus: 'срок действия удостоверения истёк', srb: 'rok važenja dozvole je istekao' },
  { rus: 'фото в удостоверении не соответствует вашей фотографии себя', srb: 'fotografija u vozačkoj dozvoli ne odgovara vašoj fotografiji' },
  { rus: 'данные на фото сложно прочитать, так как удостоверение пришло в негодность', srb: 'podatke sa fotografije je teško pročitati, jer je dozvola u lošem stanju' },

  { rus: 'чужая справка, для проверки нужен ваш документ', srb: 'tuđa dozvola, za proveru je potreban vaš dokument' },
  { rus: 'фотография справки нечёткая. Выберите хороший ракурс и освещение', srb: 'fotografija dozvole nije čitka. Izaberite dobar ugao i osvetljenje' },
  { rus: 'справка не полностью попала в кадр или её фотография обрезана ', srb: 'dozvola nije stala u kadar u potpunosti ili je fotografija isečena' },
  { rus: 'фотография сделана с экрана устройства. Для проверки нужна фотография оригинала справки', srb: 'fotografija je napravljena s ekrana uređaja. Za proveru je potrebna fotografija originala dozvole' },
  //сербия чс
  { rus: 'у вас не хватает водительского стажа. Для выполнения заказов общий стаж должен быть не менее двух лет', srb: 'nedostaje vam vozački staž. Za izvršavanje narudžbina potreban je vozački staž od minimum 2 godine' },
  { rus: "есть сомнения в подлинности удостоверения", srb: 'postoje sumnje u autentičnost vozačke dozvole' },
  { rus: "недопустимое содержание фотографий", srb: 'neprihvatljiv sadržaj fotografije' },

  { rus: 'нет ни одной фотографии лицензии. Для работы в сервисе пришлите фото лицензии', srb: 'nema nijedne fotografije taksi dozvole. Za rad u servisu pošaljite fotografiju taksi dozvole' },
  { rus: 'есть сомнения в подлинности справки', srb: 'postoje sumnje u autentičnost dozvole' },

  //латвия блок
  { rus: "фото размыто или сделано издалека. ФИО и номер должны чётко читаться", lta: 'fotogrāfija ir izplūdusi vai uzņemta no tālienes. vārdam, uzvārdam un numuram ir jābūt salasāmiem' },
  { rus: "нет фотографий водительского удостоверения", lta: 'nav nevienas apliecības fotogrāfijas' },
  { rus: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная', lta: 'fotogrāfijā nav vienas no apliecības pusēm. Pārbaudei ir nepieciešamas abas puses: priekšējā un aizmugurējā puse' },
  { rus: 'водительское удостоверение не полностью попало в кадр', lta: 'apliecība nav pilnībā iekļuvusi kadrā' },

  { rus: 'номер на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите таксопарк обновить данные.', lta: 'numurs apliecībā un jūsu profilā taksometru uzņēmumā nesakrīt. Taksometru uzņēmums varēs atjaunināt profilu' },
  { rus: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле', lta: 'Vārds, uzvārds apliecībā un jūsu profilā taksometru uzņēmumā nesakrīt. Taksometru uzņēmums varēs atjaunināt profilu' },

  { rus: 'нет вашей фотографии с водительским удостоверением', lta: 'nav jūsu fotogrāfijas ar apliecību' },
  { rus: 'фотография с водительским удостоверением получилась нечёткой', lta: 'apliecības fotogrāfija un jūsu fotogrāfija ar apliecību ir sanākušas neskaidras' },
  { rus: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр', lta: 'jūsu fotogrāfija ar apliecību ir apgriezta. Pārbaudei ir nepieciešams, lai seja un apliecība pilnībā iekļūtu kadrā' },

  { rus: 'водительское удостоверение сфотографировано в обложке, его сложно проверить', lta: 'apliecība ir nofotografēta vāciņā, kas apgrūtina pārbaudi' },

  { rus: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним', lta: 'nav vienas no apliecības pusēm un jūsu fotogrāfijas ar to' },
  { rus: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр', lta: 'apliecības fotogrāfija un jūsu fotogrāfija ar apliecību ir apgrieztas. Pārbaudei ir nepieciešams, lai viss pilnībā iekļūtu kadrā' },
  { rus: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)', lta: 'neskaitot jūsu fotogrāfiju ar apliecību, ir nepieciešams atsevišķi nofotografēt apliecību (priekšpusi un mugurpusi)' },

  { rus: 'номер на водительком удостоверении и в вашем разрешения ATD не совпадают', lta: 'jūsu norādītais vadītāja apliecības numurs nesakrīt ar to, kas norādīts ATD atļaujā' },
  { rus: 'ФИО на водительском удостоверении и в вашем разрешении ATD не совпадают', lta: 'dati, kas norādīti jūsu vadītāja apliecībā un ATD atļaujā, nesakrīt' },
  { rus: 'нет ни одной фотографии разрешения ATD', lta: 'nav pievienotas ATD atļaujas fotogrāfijas' },
  { rus: 'нет фотографии одной из сторон разрешения ATD', lta: 'nav pievienota fotogrāfija, kurā redzama viena no abām ATD atļaujas pusēm' },
  { rus: 'необходимо сфотографировать лицевую сторону разрешения ATD', lta: 'nepieciešama ATD atļaujas priekšpuses fotogrāfija' },
  { rus: 'фото размыто или сделано издалека. ФИО и номер должны читаться', lta: 'fotogrāfija ir izplūdusi vai uzņemta no pārāk liela attāluma. Datiem un numuram ir jābūt labi salasāmam' },
  { rus: 'разрешение ATD не полностью попало в кадр', lta: 'ATD atļauja kadrā nav redzama pilnībā' },
  { rus: 'фото сделано с экрана компьютера. Для проверки нужен оригинал разрешения ATD', lta: 'fotogrāfija uzņemta no datora ekrāna. Lai veiktu pārbaudi, nepieciešama ATD atļaujas oriģināla fotogrāfija' },
  { rus: 'на фото копия разрешения ATD, а для проверки нужен оригинал', lta: 'attēlā redzama ATD atļaujas kopija; lai veiktu pārbaudi, jāiesniedz oriģināla fotogrāfija' },
  //латвия чс
  { rus: "есть сомнения в подлинности удостоверения", lta: 'ir šaubas par apliecības autentiskumu' },
  { rus: "есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению", lta: 'ir šaubas par jūsu tiesībām vadīt automobili, spriežot pēc šīs apliecības' },
  { rus: "нет отметки о категории Б в вашем водительском удостоверении", lta: 'jūsu apliecībā trūkst atzīmes par “B” kategoriju' },
  { rus: "недопустимое содержание фотографий", lta: 'nepieņemams fotogrāfiju saturs' },

  { rus: 'срок действия водительского удостоверения истёк', lta: 'apliecības derīguma termiņš ir beidzies' },
  { rus: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала', lta: 'fotogrāfijā ir apliecības kopija, bet pārbaudei ir nepieciešams oriģināls' },
  { rus: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии', lta: 'dati fotogrāfijā ir grūti salasāmi, jo apliecība ir kļuvusi nederīga' },
  { rus: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии', lta: 'fotogrāfija apliecībā neatbilst jūsu fotogrāfijai' },
  { rus: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения', lta: 'fotogrāfija ir uzņemta no datora ekrāna. Pārbaudei ir nepieciešams apliecības oriģināls' },

  { rus: 'срок действия разрешения ATD истек', lta: 'ATD atļaujas derīguma termiņš ir beidzies' },
  { rus: 'разрешение ATD недействительно или отсутствует на сайте проверки', lta: 'ATD atļauja nav derīga' },
  { rus: 'данные на разрешении ATD должны соответствовать данным, указанным на ВУ', lta: 'datiem, kas norādīti ATD atļaujā, jāsakrīt ar vadītāja apliecībā norādītajiem' },
  { rus: 'есть сомнения в подлинности разрешения ATD', lta: 'ir aizdomas par to, ka ATD atļauja varētu būt viltota' },

  //израиль блок
  {
    rus: 'фото размыто или сделано издалека. ФИО и номер должны чётко читаться',
    isr: 'התמונה מטושטשת או צולמה יותר מדי מרחוק. השם המלא והמספר צריכים להיות קריאים'
  },
  {
    rus: 'нет фотографий водительского удостоверения',
    isr: 'חסרה תמונה של רישיון נהיגה'
  },
  {
    rus: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
    isr: 'בתמונה לא מופיע הצד הקדמי או האחורי של רישיון הנהיגה. צריך לאמת את שני הצדדים: מלפנים ומאחור'
  },
  {
    rus: 'водительское удостоверение не полностью попало в кадр',
    isr: 'לא רואים את כל רישיון הנהיגה בתמונה'
  },

  {
    rus: 'номер на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите таксопарк обновить данные.',
    isr: 'המהמספר ברישיון הנהיגה שונה מהמספר שבפרופיל בתחנת המוניות. עליך ליצור קשר עם מרכז הנהגים על מנת לעדכן את הפרופיל שלך.'
  },
  {
    rus: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
    isr: 'השם המלא ברישיון הנהיגה שונה מהשם שבפרופיל בתחנת המוניות. נציג של מרכז הנהגים יכול לעדכן את הפרופיל שלך.'
  },

  {
    rus: 'нет вашей фотографии с водительским удостоверением',
    isr: 'אין תמונה שלך יחד עם רישיון הנהיגה'
  },
  {
    rus: 'фотография с водительским удостоверением получилась нечёткой',
    isr: 'התמונות של רישיון הנהיגה ושלך יחד עם הרישיון מטושטשות'
  },
  {
    rus: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
    isr: 'התמונה שלך יחד עם רישיון הנהיגה חתוכה. כדי לאמת את הרישיון צריך לראות את הפנים שלך ואת רישיון הנהיגה במלואו'
  },

  {
    rus: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
    isr: 'האימות הושהה כי רישיון הנהיגה צולם בתוך כיסוי'
  },
  {
    rus: 'фото удостоверения и ваше фото с ним получились нечёткими',
    isr: 'התמונה שלך עם רישיון הנהיגה יצאה מטושטשת. עליך לוודא שפרטי הרישיון שבתמונה ברורים וקריאים.'
  },
  {
    rus: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
    isr: 'לא קיבלנו תמונה של אחד מהצדדים של רישיון הנהיגה ותמונה שלך יחד עם הרישיון'
  },
  {
    rus: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
    isr: 'התמונות של רישיון הנהיגה ושלך יחד עם הרישיון חתוכות. כדי לאמת את הרישיון צריך לראות את כל הרישיון ואותך'
  },
  {
    rus: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
    isr: 'מלבד התמונה שלך עם רישיון הנהיגה, צריך לצלם גם תמונה נפרדת של רישיון הנהיגה משני הצדדים'
  },

  {
    rus: 'фото сделано с экрана компьютера. Для проверки нужен оригинал удостоверения',
    isr: 'זו תמונה של מסך מחשב. כדי לאמת את הרישיון צריך תמונה של רישיון הנהיגה המקורי'
  },
  {
    rus: 'на фото копия удостоверения, а для проверки нужен оригинал',
    isr: 'בתמונה רואים עותק של רישיון הנהיגה. אנחנו צריכים את הרישיון המקורי'
  },
  {
    rus: 'фото в удостоверении не соответствует вашей фотографии себя',
    isr: 'התמונה ברישיון הנהיגה שונה מהתמונה שלך'
  },

  {
    rus: 'отсутствует отметка о категории В в вашем удостоверении',
    isr: 'ברישיון הנהיגה שלך חסרה דרגה B'
  },
  {
    rus: 'данные на фото нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с удостоверением',
    isr: 'הפרטים האישיים בתמונה לא קריאים. כדי לאמת את הרישיון צריך את רישיון הנהיגה המקורי יחד עם גרסה מודפסת, רשמית ומתורגמת'
  },
  {
    rus: 'срок действия удостоверения истёк',
    isr: 'פג התוקף של רישיון הנהיגה'
  },
  {
    rus: 'данные на фото сложно прочитать, так как удостоверение пришло в негодность',
    isr: 'קשה לקרוא את הפרטים בתמונה כי רישיון הנהיגה פגום'
  },

  {
    rus: 'нет ни одной фотографии страховки',
    isr: 'חסרה תמונה של מסמך הביטוח'
  },
  {
    rus: 'необходимо сфотографировать лицевую сторону страховки',
    isr: 'צריך לצלם את הצד הקדמי של הביטוח'
  },
  {
    rus: 'фото размыто или сделано издалека. ИФ и номер должны читаться',
    isr: 'התמונה מטושטשת או צולמה יותר מדי מרחוק. השם הפרטי ושם המשפחה צריכים להיות קריאים'
  },
  {
    rus: 'страховка не полностью попала в кадр',
    isr: 'לא רואים את כל הביטוח בתמונה'
  },
  {
    rus: 'фото сделано с экрана компьютера. Для проверки нужен оригинал страховки',
    isr: 'זו תמונה של מסך מחשב. כדי לאמת את הביטוח צריך תמונה של התעודה המקורית'
  },
  {
    rus: 'на фото копия страховки, а для проверки нужен оригинал',
    isr: 'בתמונה רואים עותק של תעודת הביטוח. אנחנו צריכים את התעודה המקורית'
  },
  //израиль чс
  {
    rus: 'у вас не хватает водительского стажа. Для выполнения заказов общий стаж должен быть не менее трёх лет',
    isr: 'אין לך מספיק שנות ניסיון בנהיגה. כדי לעבוד איתנו צריך לפחות 3 שנות ניסיון.'
  },
  {
    rus: 'есть сомнения в подлинности удостоверения',
    isr: 'לא הצלחנו לבדוק אם רישיון הנהיגה מזויף או לא'
  },
  {
    rus: 'есть сомнения в вашем праве водить автомобиль по этому удостоверению',
    isr: 'אנחנו לא בטוחים אם מותר לך לנהוג במונית עם רישיון הנהיגה הזה'
  },
  {
    rus: 'недопустимое содержание фотографий',
    isr: 'מה שמופיע בתמונה לא תקין'
  },

  {
    rus: 'данные, указанные в страховке, должны соответствовать данным, указанным на ВУ',
    isr: 'הפרטים בביטוח צריכים להתאים לפרטים ברישיון הנהיגה'
  },
  {
    rus: 'срок действия страховки истек',
    isr: 'פג התוקף של הביטוח'
  },
  {
    rus: 'есть сомнения в подлинности страховки',
    isr: 'לא הצלחנו לבדוק אם הביטוח מזויף או לא'
  },
  //литва блок
  {
    rus: "фото размыто или сделано издалека. ФИО и номер должны чётко читаться",
    ltu: 'Nuotrauka neryški arba padaryta iš toli. Vardas, pavardė ir numeris turi būti įskaitomi',
  },

  {
    rus: "нет фотографий водительского удостоверения",
    ltu: 'Nėra nė vienos pažymėjimo nuotraukos',
  },

  {
    rus: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
    ltu: 'Nuotraukoje nėra vienos iš pažymėjimo pusių. Patikrai atlikti reikia abiejų pusių: priekinės ir galinės',
  },

  {
    rus: 'водительское удостоверение не полностью попало в кадр',
    ltu: 'Visas pažymėjimas netilpo į kadrą',
  },

  {
    rus: 'номер на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите таксопарк обновить данные.',
    ltu: 'Numeris pažymėjime ir jūsų profilis automobilių parke nesutampa. Atnaujinti profilį galės automobilių parkas',
  },

  {
    rus: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
    ltu: 'Vardas ir pavardė pažymėjime ir jūsų automobilių parko profilyje nesutampa. Atnaujinti profilį galės automobilių parkas',
  },

  {
    rus: 'нет вашей фотографии с водительским удостоверением',
    ltu: 'Nėra jūsų nuotraukos su pažymėjimu',
  },

  {
    rus: 'фотография с водительским удостоверением получилась нечёткой',
    ltu: 'Pažymėjimo nuotrauka ir jūsų nuotrauka su pažymėjimu yra neryškios',
  },

  {
    rus: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
    ltu: 'Jūsų nuotrauka su pažymėjimu yra apkirpta. Patikrai atlikti būtina, kad į kadrą tilptų visas veidas ir visas pažymėjimas',
  },

  {
    rus: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
    ltu: 'Pažymėjimas nufotografuotas aplanke, todėl jį sudėtinga patikrinti',
  },

  {
    rus: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
    ltu: 'Nėra vienos iš pažymėjimo pusių ir jūsų nuotraukos su juo'
  },

  {
    rus: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
    ltu: 'Pažymėjimo nuotrauka ir jūsų nuotrauka su juo yra apkirptos. Patikrai atlikti būtina, kad viskas tilptų į kadrą',
  },

  {
    rus: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
    ltu: 'Be savo nuotraukos su pažymėjimu turite atskirai nufotografuoti pažymėjimą (priekinę ir galinę puses)',
  },
  {
    rus: 'ФИО на водительском удостоверении и в вашем сертификате не совпадают',
    ltu: 'Nesutampa vairuotojo pažymėjime ir jūsų individualios veiklos pažymoje nurodyti vardas ir pavardė',
  },

  {
    rus: 'нет данных вашего сертификата',
    ltu: 'nėra jūsų individualios veiklos pažymos duomenų',
  },

  {
    rus: 'фото размыто или сделано издалека. ФИО и номер должны читаться',
    ltu: 'nuotrauka neryški arba padaryta iš toli. vardas, pavardė ir numeris turi būti įskaitomi',
  },

  {
    rus: 'сертификат не полностью попал в кадр',
    ltu: 'nuotraukoje yra ne visa individualios veiklos pažyma',
  },

  {
    rus: 'сертификат недействителен',
    ltu: 'individualios veiklos pažyma negalioja',
  },
  //литва чс
  {
    rus: "есть сомнения в подлинности удостоверения",
    ltu: 'Yra abejonių dėl pažymėjimo tikrumų',
  },

  {
    rus: "есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению",
    ltu: 'Abejojama jūsų teise vairuoti automobilį pagal šį pažymėjimą',
  },

  {
    rus: "нет отметки о категории Б в вашем водительском удостоверении",
    ltu: 'Jūsų pažymėjime nėra žymos apie „B“ kategoriją',
  },

  {
    rus: "недопустимое содержание фотографий",
    ltu: 'Neleistinas nuotraukų turinys',
  },

  {
    rus: 'срок действия водительского удостоверения истёк',
    ltu: 'Jūsų pažymėjimo galiojimo terminas baigėsi',
  },

  {
    rus: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
    ltu: 'Nuotraukoje – pažymėjimo kopija, o patikrai atlikti būtinas originalas',
  },

  {
    rus: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
    ltu: 'Duomenys nuotraukoje sunkiai įskaitomi, nes pažymėjimas yra netinkamas naudoti',
  },

  {
    rus: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
    ltu: 'Nuotrauka pažymėjime neatitinka jūsų asmeninės nuotraukos',
  },

  {
    rus: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
    ltu: 'Nuotrauka padaryta iš kompiuterio ekrano. Patikrai atlikti būtinas pažymėjimo originalas',
  },

  {
    rus: 'срок действия сертификата истек',
    ltu: 'baigėsi individualios veiklos pažymos galiojimo terminas',
  },

  {
    rus: 'данные на сертификате должны соответствовать данным, указанным на ВУ',
    ltu: 'individualios veiklos pažymoje pateikti duomenys turi sutapti su duomenimis vairuotojo pažymėjime',
  },

  {
    rus: 'есть сомнения в подлинности сертификата',
    ltu: 'yra abejonių dėl individualios veiklos pažymos tikrumo',
  },

  {
    rus: 'данные сертификата невозможно проверить',
    ltu: 'Neįmanoma patikrinti individualios veiklos pažymoje pateiktų duomenų',
  },

  //СТС
  { "rou": "datele din cartea de identitate a vehiculului nu coincid cu datele din fișa șoferului", "rus": "данные в техпаспорте не совпадают с данными в карточке водителя" },
  { "rou": "cartea de identitate a vehiculului lipsește din cadrul fotografiei", "rus": "техпаспорт просрочен" },
  { "rou": "cartea de identitate vehiculului  de înmatriculare lipsește din cadrul fotografiei", "rus": "в кадре нет фотографии вашего техпаспорта" },
  { "rou": "fotografia cărții de identitate a vehiculului este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit", "rus": "фотография техпаспорта нечёткая. Выберите хороший ракурс и освещение" },
  { "rou": "cartea de identitate a vehiculului nu a intrat complet în cadru sau fotografia ei a fost tăiată", "rus": "техпаспорт не полностью попал в кадр или его фотография обрезана" },
  { "rou": "pe fotografie este o copie scanată sau xeroxată a cărții de identitate a vehiculului. Pentru verificare este necesară fotografia documentului original", "rus": "на фотографии скан или копия техпаспорта. Для проверки нужно фото оригинала" },
  { "rou": "fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original", "rus": "фотография сделана с экрана устройства. Для проверки нужно фото оригинала" },
  { "rou": "există suspiciuni cu privire la autenticitatea cărții de identitate a vehiculului", "rus": "есть сомнения в подлинности техпаспорта" },

  { "rou": "datele din polița de asigurare nu coincid cu datele din fișa șoferului", "rus": "данные страховки не совпадают с данными в карточке водителя" },
  { "rou": "Polița de asigurare este expirată", "rus": "страховка просрочена" },
  { "rou": "polița de asigurare lipsește din cadrul fotografiei", "rus": "в кадре нет фотографии вашей страховки" },
  { "rou": "fotografia poliței de asigurare este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit", "rus": "фотография страховки нечёткая. Выберите хороший ракурс и освещение" },
  { "rou": "polița de asigurare nu a intrat complet în cadru sau fotografia ei a fost tăiată", "rus": "страховка не полностью попала в кадр или ее фотография обрезана" },
  { "rou": "pe fotografie este o copie scanată sau xeroxată a poliței de asigurare. Pentru verificare este necesară fotografia documentului original", "rus": "на фотографии скан или копия страховки. Для проверки нужно фото оригинала" },
  { "rou": "fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original", "rus": "фотография сделана с экрана устройства. Для проверки нужно фото оригинала" },
  { "rou": "există suspiciuni cu privire la autenticitatea poliței de asigurare", "rus": "есть сомнения в подлинности страховки" },

  { "rou": "datele din polița de asigurare  pentru persoane și bagaje nu coincid cu datele din profilul șoferului", "rus": "данные страховки для грузов и пассажиров не совпадают с данными в карточке водителя" },
  { "rou": "polița de asigurare pentru persoane și bagaje este expirată", "rus": "страховка для грузов и пассажиров просрочена" },
  { "rou": "polița de asigurare pentru persoane și bagaje lipsește din cadrul fotografiei", "rus": "в кадре нет фотографии страховки для грузов и пассажиров" },
  { "rou": "fotografia poliței de asigurare pentru persoane și bagaje este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit", "rus": "фотография страховки для грузов и пассажиров нечёткая. Выберите хороший ракурс и освещение" },
  { "rou": "polița de asigurare pentru persoane și bagaje nu a intrat complet în cadru sau fotografia ei a fost tăiată", "rus": "страховка для грузов и пассажиров не полностью попала в кадр, либо фото обрезалось" },
  { "rou": "pe fotografie este o copie scanată sau xeroxată a poliței de asigurare pentru persoane și bagaje. Pentru verificare este necesară fotografia documentului original", "rus": "на фотографии скан или копия страховки для грузов и пассажиров. Для проверки нужно фото оригинала" },
  { "rou": "fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original", "rus": "фотография сделана с экрана устройства. Для проверки нужно фото оригинала" },
  { "rou": "există suspiciuni cu privire la autenticitatea poliței de asigurare pentru persoane și bagaje", "rus": "есть сомнения в подлинности страховки для грузов и пассажиров" },

  { "rou": "datele din copia conforma nu coincide cu datele din profilul șoferului", "rus": "данные доверенности не совпадают с данными в карточке водителя" },
  { "rou": "copia conforma este expirată", "rus": "доверенность просрочена" },
  { "rou": "copia conforma lipsește din cadrul fotografiei", "rus": "в кадре нет фотографии вашей  доверенности " },
  { "rou": "fotografia copiei conforme este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit", "rus": "фотография доверенности нечёткая. Выберите хороший ракурс и освещение" },
  { "rou": "copia conforma nu a intrat complet în cadru sau fotografia ei a fost tăiată", "rus": "доверенность не полностью попала в кадр, или ее фотография обрезана" },
  { "rou": "pe fotografie este o copie scanată sau xeroxată a copiei conforme. Pentru verificare este necesară fotografia documentului original", "rus": "на фотографии скан или копия доверенности. Для проверки нужно фото оригинала" },
  { "rou": "fotografia a fost efectuată unui ecran. Pentru a verifica documentul, efectuați poza documentului original", "rus": "фотография сделана с экрана устройства. Для проверки нужно фото оригинала" },
  { "rou": "există suspiciuni cu privire la autenticitatea copiei conforme și/sau a ecusonului", "rus": "есть сомнения в подлинности доверенности" },

  { "rou": "datele din copia conformă și/sau ecuson nu coincid cu datele din profilul șoferului", "rus": "данные бейджа не совпадают с данными в карточке водителя" },
  { "rou": "ecusonul nu indică platforma Yango", "rus": "на бейдже не указано «Yango»" },
  { "rou": "copia conformă și/sau ecusonul sunt expirate", "rus": "бейдж просрочен" },
  { "rou": "copia conformă și/sau ecusonul lipsesc din cadrul fotografiei", "rus": "в кадре нет фотографии вашего бейджа" },
  { "rou": "copia conformă si ecusonul nu pot fi citite corect din cauza reflexiei luminii. Alege un unghi adecvat fotografierii", "rus": "фотография бейджа нечёткая. Выберите хороший ракурс и освещение" },
  { "rou": "copia conforma și ecusonul nu au intrat complet în cadru, sau fotografia a fost tăiată", "rus": "бейдж не полностью попал в кадр, или его фотография обрезана" },
  { "rou": "pe fotografie este o copie scanată sau xeroxată a copiei conforme și/sau a ecusonului. Pentru verificare este necesară fotografia documentului original", "rus": "на фотографии скан или копия бейджа. Для проверки нужно фото оригинала" },
  { "rou": "fotografia a fost efectuată unui ecran. Pentru a verifica documentul, efectuați poza documentului original", "rus": "фотография сделана с экрана устройства. Для проверки нужно фото оригинала" },
  { "rou": "este posibil ca ecusonul să nu fie autentic", "rus": "есть сомнения в подлинности бейджа" },
  //сербия
  { "srb": "tuđa potvrda, za proveru je potreban vaš dokument", "rus": "чужая справка, для проверки нужен ваш документ" },
  { "srb": "u kadru ne postiji fotografija vašeg sertifikata", "rus": "в кадре нет фотографии вашего сертификата" },
  { "srb": "fotografija sertifikata nije čitka. Izaberite dobar ugao i osvetljenje.", "rus": "фотография сертификата нечёткая. Выберите хороший ракурс и освещение" },
  { "srb": "fotografija sertifikata nije stala u kadar u potpunosti ili je fotografija isečena", "rus": "сертификат не полностью попал в кадр, или его фотография обрезана" },
  { "srb": "na fotografiji je skeniran ili kopiran sertifikat. Za proveru je potrebna fotografija originala", "rus": "на фотографии скан или копия сертификата. Для проверки нужно фото оригинала" },
  { "srb": "rok važenja potvrde je istekao, za proveru je potreban validan dokument", "rus": "истёк срок действия справки, для проверки нужен действующий документ" },
  { "srb": "broj tablice/model/marka vozila u dokumentu i na vašem profilu taksi udruženja se ne poklapaju. Taksi udruženje može da ažurira vaš profil", "rus": "госномер/модель/марка ТС на документе и в вашем профиле в таксопарке не совпадают. Обновить профиль может ваш таксопарк" },
  { "srb": "fotografija je napravljena s ekrana uređaja. Za proveru je potrebna fotografija originala", "rus": "фотография сделана с экрана устройства. Для проверки нужно фото оригинала" },
  { "srb": "ne postoji nijedna fotografija licence. Za rad u servisu pošaljite fotografiju licence", "rus": "нет ни одной фотографии лицензии. Для работы в сервисе пришлите фото лицензии" },
  { "srb": "postoje sumnje u autentičnost sertifikata", "rus": "есть сомнения в подлинности сертификата" },

  { "srb": "vaš sertifikat je istekao", "rus": "ваш сертификат просрочен" },
  { "srb": "u kadru nema fotografije vašeg sertifikata", "rus": "в кадре нет фотографии вашего сертификата" },
  { "srb": "fotografija sertifikata nije čitka. Izaberite dobar ugao i osvetljenje.", "rus": "фотография сертификата нечёткая. Выберите хороший ракурс и освещение" },
  { "srb": "sertifikat nije stao u kadar u potpunosti ili je fotografija isečena", "rus": "сертификат не полностью попал в кадр, или его фотография обрезана" },
  { "srb": "broj tablice vozila u dokumentu i na vašem profilu taksi udruženja se ne poklapaju. Taksi udruženje može da ažurira vaš profil", "rus": "госномер ТС на документе и в вашем профиле в таксопарке не совпадают. Обновить профиль может ваш таксопарк" },
  { "srb": "na fotografiji je skeniran ili kopiran sertifikat. Za proveru je potrebna fotografija originala", "rus": "на фотографии скан или копия сертификата. Для проверки нужно фото оригинала" },
  { "srb": "fotografija je napravljena s ekrana uređaja. Za proveru je potrebna fotografija originala ", "rus": "фотография сделана с экрана устройства. Для проверки нужно фото оригинала" },
  { "srb": "postoje sumnje u autentičnost sertifikata", "rus": "есть сомнения в подлинности сертификата" },
  //латвия
  { "lta": "automašīnas modelis/ražotājs norādīts nepareizi. Atjaunot datus var tikai taksometru parks", "rus": "марка/модель автомобиля указаны неверно. Обновить данные может таксопарк" },
  { "lta": "Transportlīdzekļa reģistrācijas apliecība izsniegta citai automašīnai", "rus": "СТС принадлежит другому автомобилю" },
  { "lta": "kadrā nav redzama jūsu transportlīdzekļa reģistrācijas apliecība", "rus": "в кадре нет фотографии вашего СТС" },
  { "lta": "transportlīdzekļa reģistrācijas apliecības attēls nav skaidrs vai ir uzņemts no liela attāluma", "rus": "изображение СТС нечёткое или сделано издалека" },
  { "lta": "transportlīdzekļa reģistrācijas apliecība kadrā nav redzama pilnībā", "rus": "СТС  не полностью попал в кадр или его фотография обрезана" },
  { "lta": "mēs nevaram pārliecināties par to, vai transportlīdzekļa reģistrācijas apliecība ir īsta", "rus": "мы не можем подтвердить подлинность СТС" },

  { "lta": "nav automašīnas vai transportlīdzekļa reģistrācijas apliecības fotogrāfijas", "rus": "нет фото автомобиля и СТС" },
  { "lta": "nav automašīnas fotogrāfijas", "rus": "нет фото автомобиля" },
  { "lta": "automašīna kadrā nav redzama pilnībā", "rus": "автомобиль не полностью попал в кадр" },
  { "lta": "attēls nav skaidri saskatāms", "rus": "изображение нечёткое" },
  { "lta": "daļa automašīnas numura zīmes nav redzama", "rus": "часть госномера скрыта" },
  { "lta": "automašīnas numura zīme ir slikti saskatāma vai nav redzama kadrā", "rus": "госномер плохо видно, или он не попал в кадр" },
  { "lta": "automašīnai nav numura zīmes", "rus": "на автомобиле нет госномера" },
  { "lta": "fotoattēlā redzamā automašīna atšķiras no profilā norādītās. Atjaunot datus var tikai taksometru parks", "rus": "автомобиль на фото отличается от указанного в профиле. Обновить данные может ваш таксопарк" },

  { "lta": "atļaujas derīguma termiņš ir beidzies", "rus": "разрешение просрочено" },
  { "lta": "atļaujā norādītie dati nesakrīt ar vadītāja profilā noradīto informāciju", "rus": "данные в разрешении не совпадают с данными в карточке водителя" },
  { "lta": "Lai strādātu servisā, automašīnai nepieciešama derīga atļauja", "rus": "Для работы в сервисе необходимо  действующее  разрешение на автомобиль" },
  //израиль
  { "isr": "אין תמונה של המונית או של רישיון הרכב", "rus": "нет фото автомобиля и СТС" },

  { "isr": "אין תמונה של המונית", "rus": "нет фото АВТОМОБИЛЯ" },
  { "isr": "אין תמונה של המונית או של תעודת הביטוח", "rus": "нет фото автомобиля и страховки" },
  { "isr": "אין תמונה של המונית או של המסמכים", "rus": "нет фото автомобиля и документов" },
  { "isr": "המונית שבתמונה שונה מהמונית שבפרופיל. נציג מרכז השירות יכול לעדכן את המידע.", "rus": "автомобиль на фото отличается от указанного в профиле. Обновить данные может ваш таксопарк" },
  //{"isr":"","rus":"нет фотографии ПЕРЕДНЕЙ части ТС"},
  { "isr": "אין תמונה של המונית מצד שמאל", "rus": "нет фото ПРАВОЙ стороны автомобиля" },
  { "isr": "אין תמונה של המונית מצד ימין", "rus": "нет фото ЛЕВОЙ стороны автомобиля" },
  { "isr": "לא רואים את כל המונית בתמונה", "rus": "автомобиль не полностью попал в кадр" },
  { "isr": "התמונה לא בפוקוס", "rus": "изображение нечёткое" },
  { "isr": "לא רואים טוב את לוחית הרישוי או שהיא לא בתמונה", "rus": "госномер плохо видно, или он не попал в кадр" },
  //{"isr":"","rus":"нечёткое изображение автомобиля"},
  { "isr": "לוחית הרישוי מוסתרת", "rus": "часть госномера скрыта" },
  { "isr": "למונית אין לוחית רישוי", "rus": "на автомобиле нет госномера" },

  { "isr": "אין תמונה של רישיון הרכב עם הבעלות", "rus": "нет фото СТС" },
  //{"isr":"","rus":"нет фотографии одной из сторон СТС"},
  { "isr": "לא רואים את כל רישיון הרכב או שהתמונה חתוכה", "rus": "СТС не полностью попало в кадр" },
  { "isr": "התמונה של רישיון הרכב לא בפוקוס או צולמה יותר מדי מרחוק", "rus": "изображение СТС нечёткое или сделано издалека" },

  //{"isr":"","rus":"автомобиль на фото не соответствует тому, что указан в профиле"},
  { "isr": "היצרן/הדגם של המונית שגוי. ניתן לעדכן את הפרטים במרכז הנהגים.", "rus": "марка/модель указана неверно. Обновить данные в вашем профиле может таксопарк" },
  { "isr": "ברישיון הרכב רשומה בעלות אחרת על המונית", "rus": "ПТС принадлежит другому автомобилю" },
  { "isr": "לא הצלחנו לבדוק אם רישיון הרכב מזויף או לא", "rus": "мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства" },
  { "isr": "השם ברישיון הרכב שונה מהשם שברישיון הנהיגה", "rus": "имя водителя, указанное в ПТС не совпадает с именем, указанным в в/у" },
  { "isr": "השם ברישיון הרכב שונה מהשם שבתעודת הביטוח", "rus": "имя водителя, указанное в ПТС не совпадает с именем, указанным в страховке" },

  { "isr": "לא רואים רישיון הסעה בתמונה", "rus": "на фото нет лицензии" },
  { "isr": "מספר הרישיון ברישיון הרכב שונה מהמספר שעל הדלתות האחוריות של המונית", "rus": "номер лицензии в ПТС отличается от номера на задних дверях ТС" },
  { "isr": "פג התוקף של הרישיון", "rus": "лицензия недействительна" },
  //Финляндия
    { "fin": "merkittävä ulkoinen vaurio", "rus": "сильные повреждения на кузове" },
    { "fin": "ei kuvaa ajoneuvosi ___ puolesta (oikeasta/vasemmasta)", "rus": "нет фото ___ стороны автомобиля (правая/левая)" },
    { "fin": "ei valokuvaa ajoneuvosta", "rus": "нет фото автомобиля" },
    { "fin": "valokuvassa oleva ajoneuvo ei vastaa profiiliisi merkittyä ajoneuvoa. Voit päivittää profiilisi täällä", "rus": "автомобиль на фото отличается от указанного в профиле. Обновить данные вы сможет по адресу:" },
    { "fin": "ajoneuvon rekisterikilpi ei ole näkyvissä", "rus": "на автомобиле нет госномера" },
    { "fin": "ajoneuvon rekisterikilpi on osittain peitetty", "rus": "часть госномера скрыта" },
    { "fin": "epätarkka valokuva", "rus": "изображение нечёткое" },
    { "fin": "ajoneuvon rekisterikilpi ei näy kunnolla tai on rajattu kuvan ulkopuolelle", "rus": "госномер плохо видно, или он не попал в кадр" },
    { "fin": "Rekisteriote ei näy kuvassa", "rus": "Нет фото Car registration" },
    { "fin": "ajoneuvon merkki/malli ilmoitettu virheellisesti. Voit päivittää profiilisi täällä", "rus": "марка/модель автомобиля указаны неверно. Обновить данные вы сможет по адресу:" },
    { "fin": "Taksivakuutus puuttuu", "rus": "Отсутствует страховка такси" },
    { "fin": "Rekisteriote kuuluu toiselle ajoneuvolle", "rus": "Регистрация принадлежит другому автомобилю" },
    { "fin": "rekisteriotekuva on epätarkka tai otettu liian kaukaa", "rus": "изображение регистрации нечёткое или сделано издалека" },
    { "fin": "Rekisteriote ei näy kuvassa kokonaan tai kuva on rajattu", "rus": "Регистрация не полностью попала в кадр или  фотография обрезана" },
    { "fin": "ajoneuvon rekisteriotteen aitoutta ei voitu vahvistaa", "rus": "мы не можем подтвердить подлинность регистрации авто" },
    { "fin": "Taksiliikennelupa ei näy kuvassa", "rus": "Нет фото Taxi permit" },
    { "fin": "lupakuva on epätarkka tai otettu liian kaukaa", "rus": "изображение разрешения нечёткое или сделано издалека" },
    { "fin": "Taksiliikennelupa ei näy kuvassa kokonaan tai kuva on rajattu", "rus": "Разрешение на такси  не полностью попало в кадр или  фотография обрезана" },
    { "fin": "taksiliikenneluvat aitoutta ei voitu vahvistaa", "rus": "мы не можем подтвердить подлинность разрешения на такси" },
    { "fin": "Taksiliikennelupa on vanhentunut", "rus": "Разрешение на такси просрочено" },
]

let url = document.location.href

//общие функции
function colorTree() {
  const table = url.includes('qc?exam=') ? document.querySelector('#table-mkk-driver>.datagrid-body>.datagrid-content>table>tbody') : document.querySelector('#table>.datagrid-body>.datagrid-content>table>tbody')
  const tableIcon = table !== null ? table.querySelectorAll('tr>td>.clearfix>.contanier-status-icon>div') : []

  if (tableIcon.length <= 0) {
    return
  } else {
    tableIcon.forEach((item) => {
      switch (item.className) {
        case 'status-icon status-icon-cancel': {
          item.closest('.padding-s').style.backgroundColor = '#d9534f'
          break
        }
        case 'status-icon status-icon-fake': {
          item.closest('.padding-s').style.backgroundColor = '#f0ad4e'
          break
        }
        case 'status-icon status-icon-ok': {
          item.closest('.padding-s').style.backgroundColor = '#5cb85c'
          break
        }
      }
    })
  }
}

function translateResolution(trans) {

  let arrTranslate = []

  trans.forEach(tranItem => {
    if (tranItem === 'не указано') {
      return
    } else {
      dictionary.forEach(item => {
        for (let i in item) {
          if (item.rus.includes(tranItem)) {
            return
          } else {
            item[i].includes(tranItem) ? arrTranslate.push(item.rus) : ''
          }
        }
      })
    }
  })

  return arrTranslate
}
//

url.includes('history?exam=') ? setTimeout(() => colorTree(), 500) : ''

if (url.includes('qc?exam=dkvu')) {
  document.querySelector('li[data-mode="license_number"]>a').addEventListener('click', () => start())
  document.querySelector('li[data-mode="driver"]>a').addEventListener('click', () => start())
}

if (url.includes('qc?exam=sts')) {
  document.querySelector('li[data-mode="car"]>a').addEventListener('click', () => start())
  document.querySelector('li[data-mode="car_number"]>a').addEventListener('click', () => start())
}

function htmlHistory() {
  const tableResolution = document.querySelector('#info>small')

  if (tableResolution === null) {
    finish = false
    return
  } else {
    let resolution = document.querySelector('tr.selected').dataset.title.split('\n').map(item => item.replace(/\,$/, ''))
    translateResolution(resolution) >= 0 ? tableResolution.style.color = 'white' : tableResolution.style.color = 'rgb(162, 162, 162)'
    tableResolution.innerHTML += translateResolution(resolution).map(item => `<br><span style="background-color: black; color: white;"> перевод: <b>${item}</b></span>`).join('')
  }
  finish = false
}

function htmlTree() {
  const table = document.querySelector('#table-mkk-driver>.datagrid-body>.datagrid-content>table>tbody'),
    tableResolution = table !== null ? table.querySelectorAll('tr>td>.clearfix>.padding-s-bottom>.gray.clearfix') : []

  if (tableResolution.length <= 0) {
    finish = false
    return
  } else if (!!table.querySelector('tr>td>.clearfix>.padding-s-bottom>.gray.clearfix>span')) {
    finish = false
    return
  } else {
    tableResolution.forEach(res => {
      let resolution = res.textContent.split('\n').map(item => item.replace(/\,$/, ''))
      translateResolution(resolution) >= 0 ? res.style.color = 'black' : res.style.color = 'rgb(162, 162, 162)'
      res.innerHTML += translateResolution(resolution).map(item => `<br><span style="background-color: black; color: white;"> перевод: <b>${item}</b></span>`).join('')
    })
  }
  finish = false
}

let finish = false
const start = () => {
  if (finish) {
    return
  }
  finish = true
  setTimeout(() => {
    url.includes('qc?exam=') ? colorTree() : ''
    url.includes('qc?exam=') ? htmlTree() : htmlHistory()
  }, 500)
}

$(document).bind('item_info', start)
