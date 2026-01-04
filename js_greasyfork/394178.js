// ==UserScript==
// @name         Шаблоны ДКВУ
// @version      0.2
// @description  ...
// @author       yandex
// @include      https://taximeter-admin.taxi.yandex-team.ru/qc?exam=dkvu
// @grant        none
// @namespace https://greasyfork.org/users/395826
// @downloadURL https://update.greasyfork.org/scripts/394178/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%20%D0%94%D0%9A%D0%92%D0%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/394178/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%20%D0%94%D0%9A%D0%92%D0%A3.meta.js
// ==/UserScript==

document.querySelector('.modal-dialog').style = 'width: 50%'

const btnBlock = document.getElementById('btn-block'),
      btnBlacklist = document.getElementById('btn-blacklist'),
      commentList = document.getElementById('comment-list'),
      divTranslateInModalDialog = document.createElement('div'),
      //btnBlackListInModalDialog = document.createElement('button'),
      btnBlockListInModalDialog = document.createElement('button'),
      selectCountryTranslate = document.createElement('select'),
      head = document.querySelector('head'),
      style = document.createElement('style')

const arrDictionaryBlock = [
        {label:"ВУ",
        th: true},

        {text: "фото размыто или сделано издалека. ФИО и номер должны чётко читаться",
        az: 'foto ya yuyulub, ya da uzaqdan çəkilib. SAA və nömrə oxunmalıdır',
        geo: 'ფოტო ბუნდოვანია ან შორიდანაა გადაღებული. სახელი, გვარი და ნომერი უნდა იკითხებოდეს',
        kgz: 'фото так эмес же алыстан тартылган. ФАА жана номер окулушу керек',
        uzb: 'surat chaplangan yoki uzoqdan olingan. FISH va raqam o‘qilishi kerak',
        lva: 'fotogrāfija ir izplūdusi vai uzņemta no tālienes. vārdam, uzvārdam un numuram ir jābūt salasāmiem',
        ltu: 'Nuotrauka neryški arba padaryta iš toli. Vardas, pavardė ir numeris turi būti įskaitomi',
        est: 'foto on udune või pildistatud kaugelt perekonna-, ees- ja isanimi ja number peavad olema loetavad',
        mda: 'fotografia este neclară sau făcută de la distanță. Numele complet și numărul trebuie să fie lizibile',
        srb: 'fotografija je zamućena ili napravljena iz daljine. Prezime, ime, ime po ocu i broj moraju biti čitki',
        slo: 'Photos are blurry or taken from far away. Full name and number must be visible and distinct',
        eng: 'Photos are blurry or taken from far away. Full name and number must be visible and distinct',
        arm: 'լուսանկարը լղոզված է կամ հեռվից է արվել: ԱԱՀ-ն և համարը պետք է ընթեռնելի լինեն'},

        {text:"нет фотографий водительского удостоверения",
        az: 'heç bir vəsiqə fotoşəkili yoxdur',
        geo: 'არ არის მოწმობის არცერთი სურათი',
        kgz: 'күбөлүктүн бир дагы фотосүрөтү жок',
        uzb: 'birorta ham haydovchilik guvohnomasi rasmi yo‘q',
        lva: 'nav nevienas apliecības fotogrāfijas',
        ltu: 'Nėra nė vienos pažymėjimo nuotraukos',
        est: 'juhiloast ei ole ühtki fotot',
        mda: 'nu există nicio fotografie a permisului',
        srb: 'nema nijedne fotografije dozvole',
        slo: 'Brez fotografij vozniškega dovoljenja',
        eng: "No photos of driver's license",
        arm: 'վկայականի ոչ մի լուսանկար չկա'},

        {text: 'на фотографиях нет одной из сторон водительского удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
        az: 'fotoda vəsiqənin bir hissəsi yoxdur. Yoxlamaq üçün hər iki - üz və arxa tərəf lazımdır',
        geo: 'ფოტოზე არ არის მოწმობის ერთ-ერთი მხარე. შემოწმებისთვის საჭიროა ორივე მხარე: წინა და უკანა',
        kgz: 'фотодо күбөлүктүн бир тарабы жок. Текшерүү үчүн эки тарабы тең керек: алдыңкы жана арткы',
        uzb: 'fotosuratda haydovchilik guvohnomasining birorta ham tomoni yo‘q. Tekshiruv uchun har ikkala tarafi kerak: old va orqa tomoni',
        lva: 'fotogrāfijā nav vienas no apliecības pusēm. Pārbaudei ir nepieciešamas abas puses: priekšējā un aizmugurējā puse',
        ltu: 'Nuotraukoje nėra vienos iš pažymėjimo pusių. Patikrai atlikti reikia abiejų pusių: priekinės ir galinės',
        est: 'juhiloa ühe poole foto puudub Kontrollimiseks on vajalikud mõlemad pooled: esi- ja tagapool',
        mda: 'pe fotografie nu există una din fețele permisului. Pentru verificare sunt necesare ambele fețe: cea din față și cea din spate',
        srb: 'na fotografiji nema jedne od strana dozvole. Za proveru su potrebne obe strane: prednja i poleđina',
        slo: 'The photo does not contain either side of the license. Both sides need to be checked: front and back',
        eng: 'The photo does not contain either side of the license. Both sides need to be checked: front and back',
        arm: 'լուսանկարի վրա բացակայում է վկայականի կողմերից մեկը: Ստուգման համար անհրաժեշտ են երկու կողմերը՝ առջևի և հետևի'},

        {text: 'водительское удостоверение не полностью попало в кадр',
        az: 'vəsiqə tam şəkildə kadra düşməyib',
        geo: 'მოწმობა სრულად არ არის კადრში მოხვედრილი',
        kgz: 'күбөлүк кадрга толук түшпөй калган',
        uzb: 'haydovchilik guvohnomasi kadrga to‘liq tushmagan',
        lva: 'apliecība nav pilnībā iekļuvusi kadrā',
        ltu: 'Visas pažymėjimas netilpo į kadrą',
        est: 'juhiluba ei ole täielikult kaadris',
        mda: 'permisul nu a intrat complet în cadru',
        srb: 'sedište nije potpuno u kadru',
        slo: 'The license must be fully in the shot',
        eng: 'The license must be fully in the shot',
        arm: 'վկայականը կադրի մեջ ամբողջությամբ չի տեղավորվել'},

        {label:"НЕСОВПАДЕНИЕ",
        th: true},

        {text: 'номер на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите таксопарк обновить данные.',
        az: 'vəsiqə və taksi parkı üzrə profilinizdəki nömrə üst-üstə düşmür. Profili taksi parkı yeniləyə bilər',
        geo: 'ნომრები მოწმობასა და თქვენს ტაქსოპარკის პროფილში განსხვავებულია. პროფილის განახლებას შეძლებს ტაქსოპარკი',
        kgz: 'күбөлүктөгү жана таксопарктагы сиздин профилдеги номер дал келбейт. Профилди таскопарк жаңырта алат',
        uzb: 'haydovchilik guvohnomangizdagi raqam taksi saroyidagi profilingizda berilgan raqamdan farq qilmoqda. Profilni taksi saroyi yangilashi mumkin',
        lva: 'numurs apliecībā un jūsu profilā taksometru uzņēmumā nesakrīt. Taksometru uzņēmums varēs atjaunināt profilu',
        ltu: 'Numeris pažymėjime ir jūsų profilis automobilių parke nesutampa. Atnaujinti profilį galės automobilių parkas',
        est: 'juhiloal esitatud number ja Teie taksofirma profiili number on erinevad. Profiili saab uuendada taksofirma',
        mda: 'numărul de pe permis și din profilul dumneavoastră de la compania de taxiuri nu se potrivesc. Compania de taxiuri poate actualiza profilul',
        srb: 'broj na dozvoli i u vašem profilu kod taksi parka se ne poklapaju. Taksi park može da ažurira stari profil',
        slo: 'The number of your license and the one entered in your profile are not the same. The taxi company can edit your profile',
        eng: "your driver's license number doesn't match the one in your taxi company profile. The taxi company can update your profile",
        arm: 'վկայականի վրա և տաքսոպարկի Ձեր նկարագրում նշված համարները չեն համընկնում: Պրոֆիլը կկարողանա թարմացնել տաքսոպարկը'},

        {text: 'ФИО на водительском удостоверении и в вашем профиле в таксопарке не совпадают. Попросите ваш таксопарк обновить данные в профиле',
        az: 'Vəsiqədəki SAA və taksi parkı üzrə profilinizdəki nömrə üst-üstə düşmür. Profili taksi parkı yeniləyə bilər',
        geo: 'სახელი და გვარი მოწმობასა და თქვენს ტაქსოპარკის პროფილში განსხვავებულია. პროფილის განახლებას შეძლებს ტაქსოპარკი',
        kgz: 'Күбөлүктөгү жана таксопарктагы сиздин профилдеги ФАА дал келбейт. Профилди таскопарк жаңырта алат',
        uzb: 'haydovchilik guvohnomangizdagi FISH taksi saroyidagi profilingizda berilgan raqamdan farq qilmoqda. Profilni taksi saroyi yangilashi mumkin',
        lva: 'Vārds, uzvārds apliecībā un jūsu profilā taksometru uzņēmumā nesakrīt. Taksometru uzņēmums varēs atjaunināt profilu',
        ltu: 'Vardas ir pavardė pažymėjime ir jūsų automobilių parko profilyje nesutampa. Atnaujinti profilį galės automobilių parkas',
        est: 'juhiloal esitatud perekonna-, ees- ja isanimi ja Teie taksofirma profiili andmed on erinevad. Profiili saab uuendada taksofirma',
        mda: 'Numele complet de pe permis și din profilul dumneavoastră de la compania de taxiuri nu se potrivesc. Compania de taxiuri poate actualiza profilul',
        srb: 'Prezime, ime, ime po ocu na dozvoli i u vašem profilu kod taksi parka se ne poklapaju. Taksi park može da ažurira stari profil',
        slo: 'Name on the license and in your taxi company profile are not the same. The taxi company can edit your profile',
        eng: "Your full name on your driver's license doesn't match the one in your taxi company profile. The taxi company can update your profile",
        arm: 'վկայականի վրա և տաքսոպարկի Ձեր նկարագրում նշված ԱԱՀ-ները չեն համընկնում: Պրոֆիլը կկարողանա թարմացնել տաքսոպարկը'},

        {label:"СЕЛФИ",
        th: true},

        {text: 'нет вашей фотографии с водительским удостоверением',
        az: 'vəsiqə ilə fotonuz yoxdur',
        geo: 'არ არის თქვენი ფოტო მოწმობით',
        kgz: 'күбөлүк менен сиздин фото жок',
        uzb: 'guvohnoma bilan birga tushgan suratingiz yo‘q',
        lva: 'nav jūsu fotogrāfijas ar apliecību',
        ltu: 'Nėra jūsų nuotraukos su pažymėjimu',
        est: 'juhiloal puudub Teie foto',
        mda: 'pe permis nu este fotografia dumneavoastră',
        srb: 'nema vaše fotografije sa dozvolom',
        slo: 'Missing your photo with license',
        eng: 'no photo of yourself with license',
        arm: 'վկայականով Ձեր լուսանկարը բացակայում է'},

        {text: 'фотография с водительским удостоверением получилась нечёткой',
        az: 'vəsiqədəki foto ilə sizin onunla fotonuz aydın deyil',
        geo: 'მოწმობის ფოტო და თქვენი ფოტო მასთან ერთად გამოვიდა ბუნდოვანი',
        kgz: 'күбөлүктүн фотосу жана аны менен сиздин фото даана эмес',
        uzb: 'guvohnoma surativa u bilan birga tushgan suratingiz tiniq chiqmadi',
        lva: 'apliecības fotogrāfija un jūsu fotogrāfija ar apliecību ir sanākušas neskaidras',
        ltu: 'Pažymėjimo nuotrauka ir jūsų nuotrauka su pažymėjimu yra neryškios',
        est: 'juhiloa foto ja Teie foto juhiloal ei ole terav',
        mda: 'fotografia permisului și fotografia dumneavoastră cu permisul nu sunt clare',
        srb: 'fotografija dozvole i vaša fotografija sa dozvolom su mutne',
        slo: 'Photo of your license and your photo with the license are blurry',
        eng: 'your license photo and photo of yourself holding it are blurry',
        arm: 'վկայականի լուսանկարը և դրա հետ Ձեր լուսանկարը պարզ չեն ստացվել'},

        {text: 'ваша фотография с водительским удостоверением обрезана. Для проверки нужно, чтобы лицо и удостоверение полностью попали в кадр',
        az: 'vəsiqə ilə fotonuz kəsilib. Yoxlanış üçün sifət və vəsiqə kadra tam düşməlidir',
        geo: 'თქვენი მოწმის ფოტო მოჭრილია. შემოწმებისთვის საჭიროა, რომ სახე და მოწმობა სრულად მოხვდეს კადრში',
        kgz: 'күбөлүк менен сиздин фото кесилген. Жүзүңүз жана күбөлүк толук кадрга түшкөндөй сүрөткө тартыңыз',
        uzb: 'guvohnoma bilan tushgan suratingiz qirqilgan. Tekshiruv uchun shunday suratga olingki, yuzingiz va guvohnomangiz kadrga to‘liq tushsin',
        lva: 'jūsu fotogrāfija ar apliecību ir apgriezta. Pārbaudei ir nepieciešams, lai seja un apliecība pilnībā iekļūtu kadrā',
        ltu: 'Jūsų nuotrauka su pažymėjimu yra apkirpta. Patikrai atlikti būtina, kad į kadrą tilptų visas veidas ir visas pažymėjimas',
        est: 'Teie fotot koos juhiloaga on kärbitud. Kinnituseks on vajalik, et nägu ja juhiluba on tervenisti kaadris',
        mda: 'fotografia dumneavoastră cu permisul este trunchiată. Pentru verificare este necesar ca persoana și permisul să intre complet în cadru',
        srb: 'vaša fotografija sa dozvolom je odsečena. Za proveru je potrebo da lice i dozvola budu u potpunosti u kadru',
        slo: 'Your photo with your license is cut off. Photograph yourself so that your face and license are both completely in the frame.',
        eng: 'Your photo with your license is cut off. Photograph yourself so that your face and license are both completely in the frame.',
        arm: 'վկայականի հետ Ձեր լուսանկարը եզրատված է: Ստուգման համար անհրաժեշտ է, որ դեմքը և վկայականը ամբողջությամբ տեղավորվեն կադրի մեջ'},

        {text: 'ваша фотография с водительским удостоверением получилась нечёткой',
        az: 'vəsiqə ilə fotonuz aydın alınmadı',
        geo: 'თქვენი ფოტო მოწმობასთან ბუნდოვანი გამოვიდა',
        kgz: 'күбөлүк менен сиздин фото даана болбой калган',
        uzb: 'guvohnoma bilan tushgan suratingiz tiniq chiqmadi',
        lva: 'jūsu fotogrāfija ar apliecību ir sanākusi neskaidra',
        ltu: 'Jūsų nuotrauka su pažymėjimu yra neryški',
        est: 'Teie foto juhiloal ei ole terav',
        mda: 'fotografia dumneavoastră cu permisul nu este clară',
        srb: 'vaša fotografija sa dozvolom je mutna',
        slo: 'Your photo with your license is blurry',
        eng: 'your photo with your license is blurry',
        arm: 'վկայականի հետ Ձեր լուսանկարը պարզ չի ստացվել'},

        {label:"РАЗНОЕ",
        th: true},

        {text: 'данные на фотографии нечитаемы. Для проверки нужна фотография распечатки официального перевода вместе с водительским удостоверением',
        az: 'fotodakı məlumatları oxumaq olmur. Yoxlanış üçün vəsiqə ilə birgə rəsmi şəkildə tərcümənin çap fotoşəkli lazımdır',
        geo: 'მონაცემები ფოტოზე არ იკითხება. შემოწმებისთვის მოწმობასთან ერთად საჭიროა ამობეჭდილი ოფიციალური თარგმანის ფოტოსურათი',
        kgz: 'фотодогу дайындар окулбайт. Текшерүү үчүн күбөлүк менен кошо анын расмий котормосунун басып чыгарылган сүрөтү керек',
        uzb: 'fotosuratdagi ma’lumotlarni o‘qib bo‘lmayapti. Tekshiruv uchun guvohnoma birga bilan rasmiy tasdiqlangan tarjima surati taqdim etilishi lozim',
        lva: 'dati fotogrāfijā nav salasāmi. Pārbaudei ir nepieciešama oficiāla tulkojuma izdrukas un apliecības fotogrāfija',
        ltu: 'Nuotraukoje negalima įskaityti duomenų. Patikrai atlikti būtina pateikti oficialaus vertimo ir pažymėjimo kopijos nuotrauką',
        est: 'foto andmed ei ole loetavad Kinnituseks on teil vaja fotot ametlikust tõlkest koos juhiloaga',
        mda: 'datele de pe fotografie nu sunt lizibile. Pentru verificare este necesară o fotografie a traducerii oficiale imprimate împreună cu permisul',
        srb: 'podaci na fotografiji su nečitljivi. Za proveru je potrebna fotografija odštampanog zvaničnog prevoda zajedno sa dozvolom',
        slo: 'Podatki na fotografiji niso čitljivi. Pridobiti morate uradni prevod, ga natisniti ter fotografirati skupaj z licenco',
        eng: "information in the photo is illegible. We need a photo of the official printed translation along with your driver's license",
        arm: 'լուսանկարի տվյալները ընթեռնելի չեն: Ստուգման համար անհրաժեշտ է պաշտոնական թարգմանության տպագիր օրինակի լուսանկարը՝ վկայականի հետ մեկտեղ'},

        {text: 'водительское удостоверение сфотографировано в обложке, его сложно проверить',
        az: 'vəsiqənin şəkli üzlükdə çəkilib, bu isə yoxlanışı çətinləşdirir',
        geo: 'მოწმობის სურათი გადაღებულია ყდაში, რაც ართულებს შემოწმებას',
        kgz: 'күбөлүк кабы менен сүрөткө тартылгандыгынан, текшерүү татал болуп жатат',
        uzb: 'guvohnoma g‘ilofda suratga olingan, bu esa tekshiruvni qiyinlashtiradi',
        lva: 'apliecība ir nofotografēta vāciņā, kas apgrūtina pārbaudi',
        ltu: 'Pažymėjimas nufotografuotas aplanke, todėl jį sudėtinga patikrinti',
        est: 'juhiluba on pildistatud varjus, mis raskendab kinnitamist',
        mda: 'permisul este fotografiat în copertă, iar verificarea este dificilă din acest motiv',
        srb: 'dozvola je fotografisana u koricama što otežava proveru',
        slo: 'License photographed inside protective cover. We need to check a photo taken without the cover',
        eng: "driver's license photographed without removing cover (making it difficult to verify).",
        arm: 'վկայականը լուսանկարվել է կազմի մեջ, ինչը դժվարացնում է ստուգումը'},

        {label:"ОБЩЕЕ",
        th: true},

        {text: 'нет фотографии одной из сторон водительского удостоверения и вашего фото с ним',
        az: 'vəsiqənin tərəflərindən biri və sizin onunla fotonuz yoxdur',
        geo: 'არ არის მოწმობის ერთ-ერთი მხარე და თქვენი ფოტო მასთან ერთად',
        kgz: 'күбөлүктүн бир тарабы жана аны менен фотоңуз жок',
        uzb: 'guvohnomaning bir tomoni suratga olinmagan va u bilan tushgan suratingiz yo‘q',
        lva: 'nav vienas no apliecības pusēm un jūsu fotogrāfijas ar to',
        ltu: 'Nėra vienos iš pažymėjimo pusių ir jūsų nuotraukos su juo',
        est: 'juhiloal ei ole ühtegi külge ja puudub Teie foto juhiloal',
        mda: 'nu există una din fețele permisului și fotografia dumneavoastră cu permisul',
        srb: 'nema jedne od strana dozvole i vaše fotografije sa njom',
        slo: 'Missing one of the sides of your license, as well as your photo with the license',
        eng: 'no photos of either side of license or photo with it',
        arm: 'բացակայում է վկայականի կողմերից մեկը և դրա հետ Ձեր լուսանկարը'},

        {text: 'фотография водительского удостоверения и ваша фотография с ним обрезаны. Для проверки нужно, чтобы всё полностью попало в кадр',
        az: 'vəsiqənin fotosu ilə sizin fotonuz kəsilib. Yoxlanış üçün hər şey tam şəkildə kadra düşməlidir',
        geo: 'მოწმობის ფოტო და თქვენი ფოტო მასთან ერთად მოჭრილია. შემოწმებისთვის საჭიროა, რომ ყველაფერი სრულად მოხვდეს კადრში',
        kgz: 'күбөлүктүн фотосу жана аны кармаган сиздин фото кесилген. Текшерүү үчүн, баары толук кадрга түшкөндөй сүрөткө тартыңыз',
        uzb: 'guvohnoma surativa u bilan birga tushgan suratingiz qirqib olingan. Tekshiruv uchun shunday suratga olingki, hammasi kadrga to‘liq tushsin',
        lva: 'apliecības fotogrāfija un jūsu fotogrāfija ar apliecību ir apgrieztas. Pārbaudei ir nepieciešams, lai viss pilnībā iekļūtu kadrā',
        ltu: 'Pažymėjimo nuotrauka ir jūsų nuotrauka su juo yra apkirptos. Patikrai atlikti būtina, kad viskas tilptų į kadrą',
        est: 'juhiloa fotot ja Teie poolt esitatud fotot juhiloal on kärbitud. Kinnituseks on vajalik, et kõik jääb tervikuna kaadrisse',
        mda: 'fotografia de pe permis și fotografia dumneavoastră cu permisul sunt trunchiate. Pentru verificare este necesar ca totul să intre complet în cadru',
        srb: 'fotografija dozvole i vaša fotografija sa dozvolom su odsečene. Za proveru je potrebno da se fotografišete tako da sve bude u potpunosti u kadru',
        slo: 'The license photo and your picture with it are cut off. Take new photos, with everything completely in the frame.',
        eng: 'license photo and your picture with it are cut off. Everything must be completely captured in the frame so we can check them',
        arm: 'վկայականի լուսանկարը և դրա հետ Ձեր լուսանկարը եզրատված են: Ստուգման համար անհրաժեշտ է, որ ամենը ամբողջությամբ տեղավորվի կադրի մեջ'},

        {text: 'кроме фотографии себя с водительским удостоверением, нужно сфотографировать удостоверение отдельно (лицевую и обратную сторону)',
        az: 'vəsiqə ilə fotonuzdan savayı vəsiqənin şəklini ayrıca (üz və arxa tərəfini) çəkmək lazımdır',
        geo: 'გარდა თქვენი ფოტოსი მოწმობასთან ერთად, საჭიროა ცალკე მოწმობისთვის სურათის გადაღება (წინა და უკანა მხარეების)',
        kgz: 'күбөлүк кармаган өзүңүздүн фотодон тышкары күбөлүктү өзүнчө сүрөткө тартуу керек (алдыңкы жана арткы тарабын)',
        uzb: 'o‘zingizni guvohnoma bilan suratga olish bilan birga guvohnomani alohida ham suratga olishingiz zarur (old va orqa tomonini)',
        lva: 'neskaitot jūsu fotogrāfiju ar apliecību, ir nepieciešams atsevišķi nofotografēt apliecību (priekšpusi un mugurpusi)',
        ltu: 'Be savo nuotraukos su pažymėjimu turite atskirai nufotografuoti pažymėjimą (priekinę ir galinę puses)',
        est: 'Lisaks oma fotole juhiloal peate pildistama ka juhiluba tervikuna (eestpoolt ja tagantpoolt)',
        mda: 'în afara de fotografia dumneavoastră cu permisul; trebuie să fotografiați și permisul separat (față și spate)',
        srb: 'osim vaše lične fotografije sa dozvolom potrebno je posebno fotografisati dozvolu (prednju stranu i poleđinu)',
        slo: 'In addition to your photo with the license, you must photograph the license separately (both sides).',
        eng: 'in addition to your photo with the license, you must photograph the license separately (both sides)',
        arm: 'վկայականի հետ ձեր լուսանկարից բացի, անհրաժեշտ է լուսանկարել վկայականն առանձին (առջևի և հետևի կողմերը)'},
    ],

    arrDictionaryBlacklist = [
        {label:"СТАРЫЕ ЧС",
        th: true},

        {text: "маленький водительский стаж. Для выполнения заказов общий стаж должен быть не менее трёх лет",
        az: 'sürücülük stajınız kifayət qədər deyil. Sifarişlərin həyata keçirilməsi üçün ümumi staj üç ildən az olmamalıdır',
        geo: 'თქვენი მართვის გამოცდილება არ არის საკმარისი. შეკვეთების შესასრულებლად ჯამური გამოცდილება უნდა იყოს არანეკლებ სამი წლის',
        kgz: 'айдоочулук стажыңыз жетпейт. Буйрутмаларды аткаруу үчүн жалпы стаж үч жылдан кем болбошу керек',
        uzb: 'sizning haydovchilik stajingiz yetarli emas. Buyurtmalarni bajarish uchun staj uch yildan kam bo‘lmasligi lozim',
        lva: 'jums nav pietiekams vadītāja braukšanas stāžs. Pasūtījumu izpildei kopējam stāžam ir jābūt ne mazākam par trīs gadiem',
        ltu: 'Jūsų vairuotojo stažas yra nepakankamas. Užsakymams vykdyti bendras stažas turi būti ne mažesnis nei treji metai',
        est: 'teie juhistaaž ei ole piisav. Tellimuste täitmiseks peab kogustaaž olema vähemalt kolm aastat',
        mda: 'nu aveți suficientă experiență ca șofer. Pentru a primi comenzi, experiența totală trebuie să fie mai mare de trei ani',
        srb: 'nemate dovoljno vozačkog staža. Za izvršavanje narudžbina ukupni staž ne sme biti manji od tri godine',
        slo: "Not enough driving experience. You must have at least three years' experience to receive taxi orders",
        eng: "you don't have enough driving experience. You must have at least three years' experience to accept orders",
        arm: 'Ձեր վարորդական ստաժը բավարար չէ: Պատվերներ կատարելու համար ընդհանուր ստաժը պետք է լինի առնվազն երեք տարի'},

        {text: "есть сомнения в подлинности удостоверения",
        az: 'vəsiqənin orijinallığı ilə bağlı şübhə var',
        geo: 'მოწმობის ნამდვილობა საეჭვოა',
        kgz: 'күбөлүктүн дааналыгында шек бар',
        uzb: 'guvohnomaning qalbaki ekanligiga shubha bor',
        lva: 'ir šaubas par apliecības autentiskumu',
        ltu: 'Yra abejonių dėl pažymėjimo tikrumų',
        est: 'juhiloa ehtsuse suhtes on kahtlusi',
        mda: 'există îndoieli cu privire la autenticitatea permisului',
        srb: 'postoje sumnje u autentičnost dozvole',
        slo: "There are doubts about the authenticity of this driver's license",
        eng: 'doubt authenticity of license',
        arm: 'կան կասկածներ վկայականի իսկության վերաբերյալ'},

        {text: "в России действует ограничение на работу в такси с иностранными водительскими удостоверениями (национальными или международными)",
        az: 'Rusiyada xarici sürücülük vəsiqələri (milli və ya beynəlxalq) ilə taksidə işləmək üçün məhdudiyyətlər var',
        geo: 'რუსეთში მოქმედებს შეზღუდვა უცხოური მართვის მოწმობებით ტაქსიში მუშაობაზე (ეროვნული თუ საერთაშორისო)',
        kgz: 'Россияда айдоочу күбөлүгү (улуттук же эл аралык) чет өлкөдө берилген айдоочулар таксидеги жумушка чектелип кабыл алынат',
        uzb: 'Rossiya davlatida chet el haydovcihlik guvohnomasi (milliy yoki xalqaro) bilan taksi xizmatida ishlashga cheklovlar mavjud',
        lva: 'Krievijā ir spēkā ierobežojums darbam taksometros ar ārzemju vadītāja apliecībām (nacionālām vai starptautiskām)',
        ltu: 'Rusijoje draudžiama teikti taksi paslaugas, jei vairuotojo pažymėjimas (nacionalinis ar tarptautinis) išduotas užsienyje',
        est: 'Venemaal kehtib taksos töötamisele välismaise (riikliku või rahvusvahelise) juhiloa piirang',
        mda: 'în Rusia există o restricție privind lucrul pe taxi cu un permis de conducere străin (național sau internațional)',
        srb: 'u Rusiji postoji ograničenje rada u taksiju sa stranim vozačkim dozvolama (nacionalnim ili međunarodnim)',
        slo: 'In Russia, there are restrictions on working as a taxi driver using a foreign license (either national or international).',
        eng: 'In Russia, there are restrictions on working as a taxi driver using a foreign license (either national or international).',
        arm: 'Ռուսաստանում գործում է օտարերկրյա վարորդական իրավունքի վկայականներով (ազգային կամ միջազգային) տաքսի վարելու սահմանափակում'},

        {text: "есть сомнения в вашем праве водить автомобиль по этому водительскому удостоверению",
        az: 'bu vəsiqə ilə sizin avtomobili idarə etmək hüququnuzda şübhə var',
        geo: 'თქვენი უფლება ატაროთ ავტომანქანა ამ მოწმობით საეჭვოა',
        kgz: 'бул күбөлүк менен автомобилди айдоо укугуңуздун болгону шектүү',
        uzb: 'bu guvohnoma bilan avtomobilni boshqarish huquqiga ega ekanligingiz bo‘yicha shubha mavjud',
        lva: 'ir šaubas par jūsu tiesībām vadīt automobili, spriežot pēc šīs apliecības',
        ltu: 'Abejojama jūsų teise vairuoti automobilį pagal šį pažymėjimą',
        est: 'teie õiguse suhtes autot juhtida selle juhiloaga on kahtlusi',
        mda: 'există îndoieli privind dreptul dumneavoastră de a conduce automobilul cu acest permis',
        srb: 'postoje sumnje u vaše pravo da vozite automobil sa ovom dozvolom',
        slo: 'There are doubts about whether this license gives you the right to drive a car',
        eng: 'doubts concerning your right to drive a car using this license',
        arm: 'կան կասկածներ այս վկայականով մեքենա վարելու Ձեր իրավունքի վերաբերյալ'},

        {text: "нет отметки о категории Б в вашем водительском удостоверении",
        az: 'vəsiqənizdə B kateqoriyası ilə bağlı qeyd yoxdur',
        geo: 'თქვენს მოწმობაში არ არის მონიშვნა ბ კატეგორიის შესახებ',
        kgz: 'күбөлүгүңүздөгү Б категориясынын белгиси жок',
        uzb: 'guvohnomangizda B toifasi belgilanmagan',
        lva: 'jūsu apliecībā trūkst atzīmes par “B” kategoriju',
        ltu: 'Jūsų pažymėjime nėra žymos apie „B“ kategoriją',
        est: 'teie juhiloal pole märget B-kategooria kohta',
        mda: 'în permisul dumneavoastră de conducere nu există categoria B',
        srb: 'ne postoji oznaka kategorije B u vašoj dozvoli',
        slo: 'Your license does not have a Category B mark',
        eng: 'no category B indication on your license',
        arm: 'Ձեր վկայականում բացակայում է B կարգի վերաբերյալ նշումը'},

        {text: "недопустимое содержание фотографий",
        az: 'fotoşəklin məzmunu yolverilməzdir',
        geo: 'ფოტოსურათების დაუშვებელი შინაარსი',
        kgz: 'фотосүрөттөрдүн жол берилгис мазмуну',
        uzb: 'fotosuratlarda berilishi mumkin bo‘lgan narsalar',
        lva: 'nepieņemams fotogrāfiju saturs',
        ltu: 'Neleistinas nuotraukų turinys',
        est: 'fotode sisu on sobimatu',
        mda: "conținutul fotografiilor este nevalid'",
        srb: 'nedozvoljeni sadržaj fotografija',
        slo: 'Unacceptable photo content',
        eng: 'unacceptable photo content',
        arm: 'լուսանկարների անթույլատրելի բովանդակություն'},

        {label:"НОВОЕ ЧС",
        th: true},

        {text: 'срок действия водительского удостоверения истёк',
        az: 'vəsiqənin etibarlılıq müddəti bitib',
        geo: 'მოწმობის მოქმედების ვადა ამოიწურა',
        kgz: 'күбөлүктүн колдонуу мөөнөтү аяктаган',
        uzb: 'guvohnomaning amal qilish muddati tugagan',
        lva: 'apliecības derīguma termiņš ir beidzies',
        ltu: 'Jūsų pažymėjimo galiojimo terminas baigėsi',
        est: 'juhiloa kehtivusaeg on lõppenud',
        mda: 'termenul de valabilitate al permisului este depășit',
        srb: 'rok važenja dozvole je istekao',
        slo: 'Your license is expired',
        eng: 'Your license is expired',
        arm: 'վկայականի վավերականության ժամկետը սպառվել է'},

        {text: 'на фотографиях копия водительского удостоверения, для проверки нужны фотографии оригинала',
        az: 'fotoda vəsiqənin surəti verilib, yoxlanış üçün isə orijinal lazımdır',
        geo: 'ფოტოზე მოწმობის ასლია, შემოწმებისთვის კი საჭიროა დედანი',
        kgz: 'фотого күбөлүктүн көчүрмөсү тартылган, бирок текшерүүгө түп нускасы керек',
        uzb: 'fotosuratda guvohnoma nusxasi berilgan, tekshiruv uchun uning asl nusxasi zarur',
        lva: 'fotogrāfijā ir apliecības kopija, bet pārbaudei ir nepieciešams oriģināls',
        ltu: 'Nuotraukoje – pažymėjimo kopija, o patikrai atlikti būtinas originalas',
        est: 'fotol on juhiloa koopia, aga kinnitamiseks on nõutav originaal',
        mda: 'în fotografie este o copie a permisului, iar pentru verificare este nevoie de original',
        srb: 'na fotografiji je kopija dozvole, a za proveru je potreban original',
        slo: 'Photo taken of a copy of the license. We need to check the original',
        eng: 'photo taken of license copy; we need to check the original license',
        arm: 'լուսանկարի վրա վկայականի պատճենն է, իսկ ստուգման համար անհրաժեշտ է բնօրինակը'},

        {text: 'данные на фотографии сложно прочитать, так как водительское удостоверение в плохом состоянии',
        az: 'fotodakı məlumatları oxumaq çətindir, çünki vəsiqə yararsız hala düşüb',
        geo: 'ფოტოზე მონაცემების წაკითხვა რთულია, რადგან მოწმობა უვარგის მდგომარეობაშია',
        kgz: 'күбөлүк жарабай калгандыктан, фотодогу маалыматтарды окуу татаал',
        uzb: 'fotosuratdagi ma’lumotlarni o‘qish qiyin bo‘lyapti, chunki guvohnoma yaroqsiz holatga kelib qolgan',
        lva: 'dati fotogrāfijā ir grūti salasāmi, jo apliecība ir kļuvusi nederīga',
        ltu: 'Duomenys nuotraukoje sunkiai įskaitomi, nes pažymėjimas yra netinkamas naudoti',
        est: 'fotol olevaid andmeid on raske lugeda, kuna juhiluba on kulunud',
        mda: 'datele fotografiei sunt greu de citit, deoarece permisul a devenit inutilizabil',
        srb: 'podatke na fotografiji je teško pročitati pošto je dozvola postala neupotrebljiva',
        slo: "Your driver's license is in poor condition; information is illegible. Please replace your license",
        eng: 'difficult to read info in photo because license is worn out',
        arm: 'լուսանկարի վրա պատկերված տվյալները դժվար է կարդալ, քանի որ վկայականը վնասվել է'},

        {text: 'фотография в водительском удостоверении не соответствует вашей реальной фотографии',
        az: 'vəsiqədəki foto sizin öz fotonuza uyğun gəlmir',
        geo: 'ფოტო მოწმობაზე არ შეესაბამება თქვენს მიერ გადაღებულ ფოტოსურათს',
        kgz: 'күбөлүктөгү түшкөн фотоңузга өзүңүздүн сүрөтүңүз дал келбейт',
        uzb: 'guvohnomadagi surat bilan sizning fotosuratingiz mos kelmayapti',
        lva: 'fotogrāfija apliecībā neatbilst jūsu fotogrāfijai',
        ltu: 'Nuotrauka pažymėjime neatitinka jūsų asmeninės nuotraukos',
        est: 'juhiloal olev foto ei vasta teist tehtud fotole',
        mda: 'fotografia din permis nu se potrivește cu fotografia dumneavoastră',
        srb: 'fotografija u dozvoli ne odgovara vašoj ličnoj fotografiji',
        slo: 'The photo on the license does not match your photo',
        eng: "photo in license doesn't match your photo of yourself",
        arm: 'վկայականի լուսանկարը չի համապատասխանում Ձեր լուսանկարին'},

        {text: 'фотографии сделаны с экрана компьютера. Для проверки нужны фотографии оригинала водительского удостоверения',
        az: 'foto kompüter ekranından edilib. Yoxlamaq üçün orijinal vəsiqə lazımdır',
        geo: 'ფოტო გადაღებულია კომპიუტერის ეკრანიდან. შემოწმებისთვის საჭიროა მოწმობის დედანი',
        kgz: 'фото компьютердин экранынан жасалган. Текшерүү үчүн күбөлүктүн түп нускасы керек',
        uzb: 'fotosurat ekran kompyuteridan qilingan. Tekshirish uchun guvohnomaning asl nusxasi kerak',
        lva: 'fotogrāfija ir uzņemta no datora ekrāna. Pārbaudei ir nepieciešams apliecības oriģināls',
        ltu: 'Nuotrauka padaryta iš kompiuterio ekrano. Patikrai atlikti būtinas pažymėjimo originalas',
        est: 'foto on kopeeritud arvutiekraanilt. Kinnitamiseks on nõutav juhiloa originaal',
        mda: 'fotografie realizată de pe ecranul computerului. Pentru verificare este nevoie de permisul original',
        srb: 'fotografija je napravljena sa ekrana kompjutera. Za proveru je potreban original dozvole',
        slo: 'Photo taken from computer screen. We need to check the original',
        eng: "photo taken from computer screen. We need to check the original driver's license",
        arm: 'լուսանկարը ստացվել է համակարգչի էկրանից: Ստուգման համար անհրաժեշտ է վկայականի բնօրինակը'},
        ],

      arrRomanianBlock = [
        {label:"Айди Карта",
        th: true},

        {text: 'данные айди-карты не совпадают с данными в карточке водителя',
         rou: 'datele din cartea de identitate nu coincid cu datele din fișa șoferului'},

        {text: 'истёк срок действия вашей айди-карты',
         rou: 'termenul de valabilitate al cărții dvs. de identitate a expirat'},

        {text: 'в кадре нет фотографии вашей айди-карты',
         rou: 'cartea dvs. de identitate lipsește din cadrul fotografiei'},

        {text: 'фотография айди-карты нечёткая. Выберите хороший раскурс и освещение',
         rou: 'fotografia cărții dvs. de identitate este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit'},

        {text: 'айди-карта не полностью попала в кадр или её фотография обрезана',
         rou: 'cartea de identitate nu a intrat complet în cadru sau fotografia ei a fost tăiată'},

        {text: 'на фотографии скан или ксерокс айди-карты. Для проверки нужно фото оригинала',
         rou: 'pe fotografie este o copie scanată sau xeroxată a cărții de identitate. Pentru verificare este necesară fotografia documentului original'},

        {text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала',
         rou: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original'},

        {label:"Водительское удостоверение",
        th: true},

        {text: 'фото размыто или сделано издалека. ФИО и номер должны читаться',
         rou: 'fotografia este neclară sau a fost făcută de la o distanță prea mare. Numele deplin și numărul trebuie să fie lizibile'},

        {text: 'нет ни одной фотографии удостоверения',
         rou: 'lipsește fotografia permisului de conducere'},

        {text: 'на фото нет одной из сторон удостоверения. Для проверки нужны обе стороны: лицевая и обратная',
         rou: 'pe fotografie lipsește una din părțile permisului de conducere. Pentru verificare sunt necesare ambele părți: față și verso'},

        {text: 'удостоверение не полностью попало в кадр',
         rou: 'permisul de conducere nu a intrat complet în cadru'},

        {text: 'номер на удостоверении и в вашем профиле в таксопарке не совпадают. Попросите поддержку обновить ваш профиль',
         rou: 'numărul indicat în permisul de conducere nu coincide cu cel din profilul dvs. înregistrat la partener. Rugați serviciul de asistență să vă actualizeze profilul'},

        {text: 'фото сделано с экрана компьютера. Для проверки нужен оригинал удостоверения',
         rou: 'fotografia conține o imagine afișată pe ecranul calculatorului. Pentru verificare este nevoie de permisul de conducere original'},

        {text: 'на фото копия удостоверения, а для проверки нужен оригинал',
         rou: 'în fotografie este o copie a permisului de conducere, iar pentru verificare este nevoie de fotografia documentului original'},

        {text: 'нет вашего фото с удостоверением',
         rou: 'lipsește fotografia dvs. împreună cu permisul dvs. de conducere'},

        {text: 'ваше фото с удостоверением получилось нечётким',
         rou: 'fotografia dvs. împreună cu permisul de conducere este neclară'},

        {text: 'отсутствует отметка о категории Б в вашем удостоверении',
         rou: 'în permisul dvs. de conducere nu este bifată categoria B'},

        {text: 'срок действия удостоверения истёк',
         rou: 'termenul de valabilitate al permisului dvs. de conducere a expirat'},

        {text: 'фото в удостоверении не соответствует вашей фотографии себя',
         rou: 'între fotografia din permisul de conducere și fotografia dvs. există o diferență prea mare'},

        {label:"Справка о судимости",
        th: true},

        {text: 'чужая справка, для проверки нужен ваш документ',
         rou: 'a fost prezentat un certificat de cazier judiciar străin; pentru verificare este necesar să prezentați propriul dvs. certificat'},

        {text: 'истёк срок действия справки, для проверки нужен действующий документ',
         rou: 'termenul de valabilitate al certificatului de cazier judiciar a expirat; pentru verificare este necesar un certificat valid'},

        {text: 'в справке нет информации об отстутвии судимости. Пришлите справку, которая это подтверждает.',
         rou: 'în certificat nu se confirmă faptul că solicitantul nu este înscris în cazierul judiciar. Vă rugăm să trimiteți un certificat de cazier judiciar în care se confirmă acest fapt.'},

        {text: 'в кадре нет фотографии справки',
         rou: 'certificatul de cazier judiciar lipsește din cadrul fotografiei'},

        {text: 'фотография справки нечёткая. Выберите хороший ракурс и освещение',
         rou: 'fotografia certificatului de cazier este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit'},

        {text: 'справка не полностью попала в кадр или её фотография обрезана ',
         rou: 'certificatul de cazier judiciar nu a intrat complet în cadru sau fotografia lui a fost tăiată'},

        {text: 'на фотографии скан или ксерокс справки. Для проверки нужна фотография оригинала',
         rou: 'pe fotografie este o copie scanată sau xeroxată a certificatului de cazier judiciar. Pentru verificare este necesară fotografia documentului original'},

        {text: 'фотография сделана с экрана устройства. Для проверки нужна фотография оригинала справки',
         rou: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia certificatului original'},

        {label:"Профессиональный сертификат водителя",
        th: true},

        {text: 'данные в сертификате не совпадают с данными в карточке водителя',
         rou: 'datele din certificatul de înmatriculare nu coincid cu datele din fișa șoferului'},

        {text: 'в кадре нет фотографии вашего сертификата',
         rou: 'certificatul de înmatriculare lipsește din cadrul fotografiei'},

        {text: 'фотография сертификата нечёткая. Выберите хороший ракурс и освещение',
         rou: 'fotografia certificatului de înmatriculare este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit'},

        {text: 'сертификат не полностью попал в кадр или его фотография обрезана',
         rou: 'certificatul de înmatriculare nu a intrat complet în cadru sau fotografia lui a fost tăiată'},

        {text: 'на фотографии скан или копия сертификата. Для проверки нужно фото оригинала',
         rou: 'pe fotografie este o copie scanată sau xeroxată a certificatului de înmatriculare. Pentru verificare este necesară fotografia documentului original'},

        {text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала',
         rou: 'fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original'},
      ],

      arrRomanianBlacklist = [
        {label:"Айди Карта",
        th: true},

        {text: 'есть сомнения в подлинности айди-карты',
         rou: 'există suspiciuni cu privire la autenticitatea cărții de identitate'},

        {label:"Водительское удостоверение",
        th: true},

        {text: 'у вас не хватает водительского стажа. Для выполнения заказов общий стаж должен быть не менее года',
         rou: 'nu aveți suficientă experiență de condus. Pentru a efectua comenzi, trebuie să aveți o experiență totală de condus de cel puțin un an'},

        {text: 'есть сомнения в подлинности удостоверения',
         rou: 'există suspiciuni cu privire la autenticitatea permisului de conducere'},

        {text: 'есть сомнения в вашем праве водить автомобиль по этому удостоверению',
         rou: 'există suspiciuni cu privire la dreptul dvs. de a conduce un automobil în baza acestui permis de conducere'},

        {text: 'недопустимое содержание фотографий',
         rou: 'conținutul fotografiilor este inacceptabil'},

        {label:"Справка о судимости",
        th: true},

        {text: 'есть сомнения в подлинности справки',
         rou: 'există suspiciuni cu privire la autenticitatea certificatului de cazier judiciar'},

        {label:"Профессиональный сертификат водителя",
        th: true},

        {text: 'есть сомнения в подлинности сертификата',
         rou: 'există suspiciuni cu privire la autenticitatea certificatului de înmatriculare'},
      ],

        countryTranslate = {
            Russian: 'РФ',
            Azerbian: 'Азербайджан',
            Georgian: 'Грузия',
            Kyrgyz: 'Киргизия',
            Uzbek: 'Узбекистан',
            Latvian: 'Латвия',
            Lithuanian: 'Литва',
            Estonian: 'Эстония',
            Moldova: 'Румыния/Молдова',
            Serbian: 'Сербия',
            Slovenian: 'Словения',
            English: 'Англия',
            Armenian: 'Армения',
            Romanian: 'Бухарест'
        },

      cities = {
          Azerbian: ["Баку"],
          Kyrgyz: ["Бишкек","Ош"],
          Georgian: ["Батуми","Кутаиси","Рустави","Тбилиси"],
          Uzbek: ["Ташкент"],
          Latvian: ["Рига"],
          Lithuanian: ["Вильнюс"],
          Estonian: ["Таллин","Тарту"],
          Moldova: ["Кишинёв"],
          Serbian: ["Белград"],
          Armenian: ["Араратская область","Ванадзор","Горис","Гюмри","Ереван","Капан","Котайкская область", "Армавирская область"],
          Romanian: ["Бухарест"]
      }

commentList.before(divTranslateInModalDialog)
divTranslateInModalDialog.style = 'margin: 5px'
//divTranslateInModalDialog.append(btnBlackListInModalDialog)
//btnBlackListInModalDialog.classList.add('btn-danger')
//btnBlackListInModalDialog.style = 'margin-right: 10px'
//btnBlackListInModalDialog.style = 'color: #fff; background-color: #d9534f; border-color: #d43f3a; margin-right: 10px'
//btnBlackListInModalDialog.textContent = 'ЧС'
divTranslateInModalDialog.append(btnBlockListInModalDialog)
btnBlockListInModalDialog.classList.add('btn-warning')
//btnBlockListInModalDialog.style = 'color: #fff; background-color: #f0ad4e; border-color: #eea236;'
btnBlockListInModalDialog.textContent = 'Замечания'
//btnBlockListInModalDialog.setAttribute('disabled', 'disabled')
divTranslateInModalDialog.append(selectCountryTranslate)
selectCountryTranslate.style = 'float: right'
head.append(style)
style.innerHTML = '.templates-item{border-bottom: 1px solid #cacaca; padding: 2px 4px;}.template-head{background-color:#d8e6ea;font-weight:bold;padding:2px 10px}.templates-item:hover{background-color: #f3f3f3; cursor: pointer}'

for (let key in countryTranslate) selectCountryTranslate.innerHTML += `<option value="${key}">${countryTranslate[key]}</option>`

let arrRenderDictionary = []

const renderArr = (itemArr, translate) => {
    let obj = {}
    if (itemArr.th) {
        obj.label = itemArr.label
        obj.th = true
        } else {
            obj.value = translate
            obj.text = itemArr.text
        }
    arrRenderDictionary.push(obj)
}

const ifRenderArr = (itemArr) => {
    switch (selectCountryTranslate.value) {
        case 'Russian': renderArr(itemArr, itemArr.text)
            break
        case 'Azerbian': renderArr(itemArr, itemArr.az)
            break
        case 'Georgian': renderArr(itemArr, itemArr.geo)
            break
        case 'Kyrgyz': renderArr(itemArr, itemArr.kgz)
            break
        case 'Uzbek': renderArr(itemArr, itemArr.uzb)
            break
        case 'Latvian': renderArr(itemArr, itemArr.lva)
            break
        case 'Lithuanian': renderArr(itemArr, itemArr.ltu)
            break
        case 'Estonian': renderArr(itemArr, itemArr.est)
            break
        case 'Moldova': renderArr(itemArr, itemArr.mda)
            break
        case 'Serbian': renderArr(itemArr, itemArr.srb)
            break
        case 'Slovenian': renderArr(itemArr, itemArr.slo)
            break
        case 'English': renderArr(itemArr, itemArr.eng)
            break
        case 'Armenian': renderArr(itemArr, itemArr.arm)
            break
        case 'Romanian': renderArr(itemArr, itemArr.rou)
            break
    }
}

arrDictionaryBlock.forEach(item => ifRenderArr(item))

const convertArrToList = itemArr => {
    const ulList = commentList.querySelector('.list-group')
    if (itemArr.th) {
        ulList.innerHTML += `<li class='template-head'>${itemArr.label}</li>`
        } else {
            ulList.innerHTML += `<li itemvalue='${itemArr.value}' class='templates-item'>${itemArr.text}</li>`
        }
}

let ifClick
const refreshArrAndUl = () => {
    const ulList = commentList.querySelector('.list-group')
    arrRenderDictionary = []
    ulList.innerHTML = ''
    btnBlockListInModalDialog.removeAttribute('disabled')
    //btnBlackListInModalDialog.removeAttribute('disabled')
    selectCountryTranslate.removeAttribute('disabled')
    ifClick = false
}

function runTemplate (arr) {
    refreshArrAndUl()
    arr.forEach(item => ifRenderArr(item))
    console.log(arrRenderDictionary)
    arrRenderDictionary.forEach(item => convertArrToList(item))
}

const ifRomanian = (arr, arrRomanian) => {
    if (selectCountryTranslate.value === 'Romanian') {
        runTemplate(arrRomanian)
    } else {
        runTemplate(arr)
    }
}

const freeze = () => {
    selectCountryTranslate.setAttribute('disabled', 'disabled')
    btnBlockListInModalDialog.setAttribute('disabled', 'disabled')
    //btnBlackListInModalDialog.setAttribute('disabled', 'disabled')
}

let city

/*let itemInfo = new Event ('item_info')

document.dispatchEvent(itemInfo)*/


$(document).bind('item_info', function (e, params) {
    city = params.city;
    //console.log(city)
});

function cityOf (a) {
    switch (a) {
        case 'Azerbian' : selectCountryTranslate.selectedIndex = 1
            break
        case 'Kyrgyz' : selectCountryTranslate.selectedIndex = 3
            break
        case 'Georgian' : selectCountryTranslate.selectedIndex = 2
            break
        case 'Uzbek' : selectCountryTranslate.selectedIndex = 4
            break
        case 'Latvian' : selectCountryTranslate.selectedIndex = 5
            break
        case 'Lithuanian' : selectCountryTranslate.selectedIndex = 6
            break
        case 'Estonian' : selectCountryTranslate.selectedIndex = 7
            break
        case 'Moldova' : selectCountryTranslate.selectedIndex = 8
            break
        case 'Serbian' : selectCountryTranslate.selectedIndex = 9
            break
        case 'Armenian' : selectCountryTranslate.selectedIndex = 12
            break
        case 'Romanian' : selectCountryTranslate.selectedIndex = 13
            break
    }
}

const ifCity = () => {
    for (let key in cities) {
        if (cities[key].indexOf(city) >=0) {
            console.log(key)
            cityOf(key)
            return
        }
    }
}

btnBlacklist.addEventListener('click', () => {
    //document.addEventListener('item_info', (e, params) => city = params.city)
    console.log(city)
    selectCountryTranslate.selectedIndex = 0
    ifCity()
    runTemplate(arrDictionaryBlacklist)
    ifClick = true
})

btnBlock.addEventListener('click', () => {
    selectCountryTranslate.selectedIndex = 0
    ifCity()
    runTemplate(arrDictionaryBlock)
    btnBlockListInModalDialog.setAttribute('disabled', 'disabled')
})

/*btnBlackListInModalDialog.addEventListener('click', () => {
    ifRomanian(arrDictionaryBlacklist, arrRomanianBlacklist)
    ifClick = true
})*/

btnBlockListInModalDialog.addEventListener('click', () => ifRomanian(arrDictionaryBlock, arrRomanianBlock))

selectCountryTranslate.addEventListener('change', () => {
    if (ifClick) {
        ifRomanian(arrDictionaryBlacklist, arrRomanianBlacklist)
        ifClick = true
    } else {
        ifRomanian(arrDictionaryBlock, arrRomanianBlock)
    }
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