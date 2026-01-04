// ==UserScript==
// @name         Шаблоны СТС
// @version      0.72
// @description  ///+Сербия ///+Бухарест ///+Латвия ///+Израиль ///+Финляндия ///+Казахстан ///+Молдавия
// @author       QC
// @match        https://taximeter-admin.taxi.yandex-team.ru/qc?exam=sts
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/380368/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%20%D0%A1%D0%A2%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/380368/%D0%A8%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D1%8B%20%D0%A1%D0%A2%D0%A1.meta.js
// ==/UserScript==

const rouItems = [
  { "label": "Тех.паспорт", "th": true },
  { "rou": "datele din cartea de identitate a vehiculului nu coincid cu datele din fișa șoferului", "text": "данные в техпаспорте не совпадают с данными в карточке водителя" },
  { "rou": "cartea de identitate a vehiculului lipsește din cadrul fotografiei", "text": "техпаспорт просрочен" },
  { "rou": "cartea de identitate vehiculului  de înmatriculare lipsește din cadrul fotografiei", "text": "в кадре нет фотографии вашего техпаспорта" },
  { "rou": "fotografia cărții de identitate a vehiculului este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit", "text": "фотография техпаспорта нечёткая. Выберите хороший ракурс и освещение" },
  { "rou": "cartea de identitate a vehiculului nu a intrat complet în cadru sau fotografia ei a fost tăiată", "text": "техпаспорт не полностью попал в кадр или его фотография обрезана" },
  { "rou": "pe fotografie este o copie scanată sau xeroxată a cărții de identitate a vehiculului. Pentru verificare este necesară fotografia documentului original", "text": "на фотографии скан или копия техпаспорта. Для проверки нужно фото оригинала" },
  { "rou": "fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original", "text": "фотография сделана с экрана устройства. Для проверки нужно фото оригинала" },
  { "rou": "există suspiciuni cu privire la autenticitatea cărții de identitate a vehiculului", "text": "есть сомнения в подлинности техпаспорта" },
  { "label": "Страховка", "th": true },
  { "rou": "datele din polița de asigurare nu coincid cu datele din fișa șoferului", "text": "данные страховки не совпадают с данными в карточке водителя" },
  { "rou": "Polița de asigurare este expirată", "text": "страховка просрочена" },
  { "rou": "polița de asigurare lipsește din cadrul fotografiei", "text": "в кадре нет фотографии вашей страховки" },
  { "rou": "fotografia poliței de asigurare este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit", "text": "фотография страховки нечёткая. Выберите хороший ракурс и освещение" },
  { "rou": "polița de asigurare nu a intrat complet în cadru sau fotografia ei a fost tăiată", "text": "страховка не полностью попала в кадр или ее фотография обрезана" },
  { "rou": "pe fotografie este o copie scanată sau xeroxată a poliței de asigurare. Pentru verificare este necesară fotografia documentului original", "text": "на фотографии скан или копия страховки. Для проверки нужно фото оригинала" },
  { "rou": "fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original", "text": "фотография сделана с экрана устройства. Для проверки нужно фото оригинала" },
  { "rou": "există suspiciuni cu privire la autenticitatea poliței de asigurare", "text": "есть сомнения в подлинности страховки" },
  { "label": "Страховка грузов\\пассажиров", "th": true },
  { "rou": "datele din polița de asigurare  pentru persoane și bagaje nu coincid cu datele din profilul șoferului", "text": "данные страховки для грузов и пассажиров не совпадают с данными в карточке водителя" },
  { "rou": "polița de asigurare pentru persoane și bagaje este expirată", "text": "страховка для грузов и пассажиров просрочена" },
  { "rou": "polița de asigurare pentru persoane și bagaje lipsește din cadrul fotografiei", "text": "в кадре нет фотографии страховки для грузов и пассажиров" },
  { "rou": "fotografia poliței de asigurare pentru persoane și bagaje este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit", "text": "фотография страховки для грузов и пассажиров нечёткая. Выберите хороший ракурс и освещение" },
  { "rou": "polița de asigurare pentru persoane și bagaje nu a intrat complet în cadru sau fotografia ei a fost tăiată", "text": "страховка для грузов и пассажиров не полностью попала в кадр, либо фото обрезалось" },
  { "rou": "pe fotografie este o copie scanată sau xeroxată a poliței de asigurare pentru persoane și bagaje. Pentru verificare este necesară fotografia documentului original", "text": "на фотографии скан или копия страховки для грузов и пассажиров. Для проверки нужно фото оригинала" },
  { "rou": "fotografia conține o imagine afișată pe ecranul unui dispozitiv. Pentru verificare este necesară fotografia documentului original", "text": "фотография сделана с экрана устройства. Для проверки нужно фото оригинала" },
  { "rou": "există suspiciuni cu privire la autenticitatea poliței de asigurare pentru persoane și bagaje", "text": "есть сомнения в подлинности страховки для грузов и пассажиров" },
  { "label": "Доверенность", "th": true },
  { "rou": "datele din copia conforma nu coincide cu datele din profilul șoferului", "text": "данные доверенности не совпадают с данными в карточке водителя" },
  { "rou": "copia conforma este expirată", "text": "доверенность просрочена" },
  { "rou": "copia conforma lipsește din cadrul fotografiei", "text": "в кадре нет фотографии вашей  доверенности " },
  { "rou": "fotografia copiei conforme este neclară. Găsiți un loc bine iluminat și alegeți un unghi potrivit", "text": "фотография доверенности нечёткая. Выберите хороший ракурс и освещение" },
  { "rou": "copia conforma nu a intrat complet în cadru sau fotografia ei a fost tăiată", "text": "доверенность не полностью попала в кадр, или ее фотография обрезана" },
  { "rou": "pe fotografie este o copie scanată sau xeroxată a copiei conforme. Pentru verificare este necesară fotografia documentului original", "text": "на фотографии скан или копия доверенности. Для проверки нужно фото оригинала" },
  { "rou": "fotografia a fost efectuată unui ecran. Pentru a verifica documentul, efectuați poza documentului original", "text": "фотография сделана с экрана устройства. Для проверки нужно фото оригинала" },
  { "rou": "există suspiciuni cu privire la autenticitatea copiei conforme și/sau a ecusonului", "text": "есть сомнения в подлинности доверенности" },
  { "label": "Бейдж Yango", "th": true },
  { "rou": "datele din copia conformă și/sau ecuson nu coincid cu datele din profilul șoferului", "text": "данные бейджа не совпадают с данными в карточке водителя" },
  { "rou": "ecusonul nu indică platforma Yango", "text": "на бейдже не указано «Yango»" },
  { "rou": "copia conformă și/sau ecusonul sunt expirate", "text": "бейдж просрочен" },
  { "rou": "copia conformă și/sau ecusonul lipsesc din cadrul fotografiei", "text": "в кадре нет фотографии вашего бейджа" },
  { "rou": "copia conformă si ecusonul nu pot fi citite corect din cauza reflexiei luminii. Alege un unghi adecvat fotografierii", "text": "фотография бейджа нечёткая. Выберите хороший ракурс и освещение" },
  { "rou": "copia conforma și ecusonul nu au intrat complet în cadru, sau fotografia a fost tăiată", "text": "бейдж не полностью попал в кадр, или его фотография обрезана" },
  { "rou": "pe fotografie este o copie scanată sau xeroxată a copiei conforme și/sau a ecusonului. Pentru verificare este necesară fotografia documentului original", "text": "на фотографии скан или копия бейджа. Для проверки нужно фото оригинала" },
  { "rou": "fotografia a fost efectuată unui ecran. Pentru a verifica documentul, efectuați poza documentului original", "text": "фотография сделана с экрана устройства. Для проверки нужно фото оригинала" },
  { "rou": "este posibil ca ecusonul să nu fie autentic", "text": "есть сомнения в подлинности бейджа" },
],
  srbItem = [
    { "label": "Подтверждение о пригодности и классификации автомобиля", "th": true },
    { "srb": "tuđa potvrda, za proveru je potreban vaš dokument", "text": "чужая справка, для проверки нужен ваш документ" },
    { "srb": "u kadru ne postiji fotografija vašeg sertifikata", "text": "в кадре нет фотографии вашего сертификата" },
    { "srb": "fotografija sertifikata nije čitka. Izaberite dobar ugao i osvetljenje.", "text": "фотография сертификата нечёткая. Выберите хороший ракурс и освещение" },
    { "srb": "fotografija sertifikata nije stala u kadar u potpunosti ili je fotografija isečena", "text": "сертификат не полностью попал в кадр, или его фотография обрезана" },
    { "srb": "na fotografiji je skeniran ili kopiran sertifikat. Za proveru je potrebna fotografija originala", "text": "на фотографии скан или копия сертификата. Для проверки нужно фото оригинала" },
    { "srb": "rok važenja potvrde je istekao, za proveru je potreban validan dokument", "text": "истёк срок действия справки, для проверки нужен действующий документ" },
    { "srb": "broj tablice/model/marka vozila u dokumentu i na vašem profilu taksi udruženja se ne poklapaju. Taksi udruženje može da ažurira vaš profil", "text": "госномер/модель/марка ТС на документе и в вашем профиле в таксопарке не совпадают. Обновить профиль может ваш таксопарк" },
    { "srb": "fotografija je napravljena s ekrana uređaja. Za proveru je potrebna fotografija originala", "text": "фотография сделана с экрана устройства. Для проверки нужно фото оригинала" },
    { "srb": "ne postoji nijedna fotografija licence. Za rad u servisu pošaljite fotografiju licence", "text": "нет ни одной фотографии лицензии. Для работы в сервисе пришлите фото лицензии" },
    { "srb": "postoje sumnje u autentičnost sertifikata", "text": "есть сомнения в подлинности сертификата" },
    { "label": "Регистрационная карточка", "th": true },
    { "srb": "vaš sertifikat je istekao", "text": "ваш сертификат просрочен" },
    { "srb": "u kadru nema fotografije vašeg sertifikata", "text": "в кадре нет фотографии вашего сертификата" },
    { "srb": "fotografija sertifikata nije čitka. Izaberite dobar ugao i osvetljenje.", "text": "фотография сертификата нечёткая. Выберите хороший ракурс и освещение" },
    { "srb": "sertifikat nije stao u kadar u potpunosti ili je fotografija isečena", "text": "сертификат не полностью попал в кадр, или его фотография обрезана" },
    { "srb": "broj tablice vozila u dokumentu i na vašem profilu taksi udruženja se ne poklapaju. Taksi udruženje može da ažurira vaš profil", "text": "госномер ТС на документе и в вашем профиле в таксопарке не совпадают. Обновить профиль может ваш таксопарк" },
    { "srb": "na fotografiji je skeniran ili kopiran sertifikat. Za proveru je potrebna fotografija originala", "text": "на фотографии скан или копия сертификата. Для проверки нужно фото оригинала" },
    { "srb": "fotografija je napravljena s ekrana uređaja. Za proveru je potrebna fotografija originala ", "text": "фотография сделана с экрана устройства. Для проверки нужно фото оригинала" },
    { "srb": "postoje sumnje u autentičnost sertifikata", "text": "есть сомнения в подлинности сертификата" },
 
  ],
  rusItems = [
    { "rus": "нет фото автомобиля и СТС", "text": "нет фото автомобиля и СТС" },
    { "label": "Фото автомобиля", "th": true },
    { "rus": "нет фото автомобиля", "text": "нет фото АВТОМОБИЛЯ" },
    { "rus": "нет фотографии передней части ТС", "text": "нет фотографии ПЕРЕДНЕЙ части ТС" },
    { "rus": "автомобиль не полностью попал в кадр", "text": "автомобиль не полностью попал в кадр" },
    { "rus": "изображение нечёткое", "text": "изображение нечёткое" },
    { "rus": "госномер плохо видно, или он не попал в кадр", "text": "госномер плохо видно, или он не попал в кадр" },
    { "rus": "нечёткое изображение автомобиля", "text": "нечёткое изображение автомобиля" },
    { "rus": "часть госномера скрыта", "text": "часть госномера скрыта" },
    { "rus": "на автомобиле нет госномера", "text": "на автомобиле нет госномера" },
    { "label": "Фото СТС", "th": true },
    { "rus": "нет фото СТС", "text": "нет фото СТС" },
    { "rus": "нет фотографии одной из сторон СТС", "text": "нет фотографии одной из сторон СТС" },
    { "rus": "СТС не полностью попало в кадр", "text": "СТС не полностью попало в кадр" },
    { "rus": "изображение СТС нечёткое или сделано издалека", "text": "изображение СТС нечёткое или сделано издалека" },
    { "label": "Подозрение на фрод", "th": true },
    { "rus": "автомобиль на фото не соответствует тому, что указан в профиле. Обновить данные в профиле может ваш таксопарк", "text": "автомобиль на фото не соответствует тому, что указан в профиле" },
    { "rus": "марка/модель указана неверно. Обновить данные в вашем профиле может таксопарк", "text": "марка/модель указана неверно. Обновить данные в вашем профиле может таксопарк" },
    { "rus": "СТС принадлежит другому автомобилю", "text": "СТС принадлежит другому автомобилю" },
    { "rus": "мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства", "text": "мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства" },
    { "rus": "вы сфотографировали изображение СТС на экране компьютера. Для проверки сделайте фото самого документа", "text": "Фото с экрана СТС" },
    { "rus": "вы сфотографировали изображение СТС на экране компьютера. Для проверки сделайте фото самого документа", "text": "Ксерокопия СТС" },
    { "rus": "вы сфотографировали изображение автомобиля на экране компьютера. Это грубое нарушение", "text": "Фото с экрана ТС" },
    { "label": "Специальные", "th": true },
    { "rus": "необходимо заполнить данные свидетельства о регистрации транспортного средства. Пожалуйста, обратитесь в ваш Таксопарк", "text": "Недоступно заполнение данных [СОГЛАСОВАТЬ С ТЛ]" },
    { "rus": "цвет автомобиля в СТС и настоящий цвет машины различаются. Исправьте, как указано в СТС", "text": "Цвет автомобиля в СТС и настоящий цвет машины различаются. Исправьте, как указано в СТС [СПЕЦПРОЕКТ]" },
  ],
 
  ltaItems = [
    { "label": "Auto tehniskā pase(СТС)", "th": true },
    { "lta": "automašīnas modelis/ražotājs norādīts nepareizi. Atjaunot datus var tikai taksometru parks", "text": "марка/модель автомобиля указаны неверно. Обновить данные может таксопарк" },
    { "lta": "Transportlīdzekļa reģistrācijas apliecība izsniegta citai automašīnai", "text": "СТС принадлежит другому автомобилю" },
    { "lta": "kadrā nav redzama jūsu transportlīdzekļa reģistrācijas apliecība", "text": "в кадре нет фотографии вашего СТС" },
    { "lta": "transportlīdzekļa reģistrācijas apliecības attēls nav skaidrs vai ir uzņemts no liela attāluma", "text": "изображение СТС нечёткое или сделано издалека" },
    { "lta": "transportlīdzekļa reģistrācijas apliecība kadrā nav redzama pilnībā", "text": "СТС  не полностью попал в кадр или его фотография обрезана" },
    { "lta": "mēs nevaram pārliecināties par to, vai transportlīdzekļa reģistrācijas apliecība ir īsta", "text": "мы не можем подтвердить подлинность СТС" },
    { "label": "Госномер ТС", "th": true },
    { "lta": "nav automašīnas vai transportlīdzekļa reģistrācijas apliecības fotogrāfijas", "text": "нет фото автомобиля и СТС" },
    { "lta": "nav automašīnas fotogrāfijas", "text": "нет фото автомобиля" },
    { "lta": "automašīna kadrā nav redzama pilnībā", "text": "автомобиль не полностью попал в кадр" },
    { "lta": "attēls nav skaidri saskatāms", "text": "изображение нечёткое" },
    { "lta": "daļa automašīnas numura zīmes nav redzama", "text": "часть госномера скрыта" },
    { "lta": "automašīnas numura zīme ir slikti saskatāma vai nav redzama kadrā", "text": "госномер плохо видно, или он не попал в кадр" },
    { "lta": "automašīnai nav numura zīmes", "text": "на автомобиле нет госномера" },
    { "lta": "fotoattēlā redzamā automašīna atšķiras no profilā norādītās. Atjaunot datus var tikai taksometru parks", "text": "автомобиль на фото отличается от указанного в профиле. Обновить данные может ваш таксопарк" },
    { "label": "Разрешение ATD", "th": true },
    { "lta": "atļaujas derīguma termiņš ir beidzies", "text": "разрешение просрочено" },
    { "lta": "atļaujā norādītie dati nesakrīt ar vadītāja profilā noradīto informāciju", "text": "данные в разрешении не совпадают с данными в карточке водителя" },
    { "lta": "Lai strādātu servisā, automašīnai nepieciešama derīga atļauja", "text": "Для работы в сервисе необходимо  действующее  разрешение на автомобиль" },
  ],
 
  isrItems = [
    { "isr": "אין תמונה של המונית או של רישיון הרכב", "text": "нет фото автомобиля и СТС" },
    { "label": "Фото автомобиля", "th": true },
    { "isr": "אין תמונה של המונית", "text": "нет фото АВТОМОБИЛЯ" },
    { "isr": "אין תמונה של המונית או של תעודת הביטוח", "text": "нет фото автомобиля и страховки" },
    { "isr": "אין תמונה של המונית או של המסמכים", "text": "нет фото автомобиля и документов" },
    { "isr": "המונית שבתמונה שונה מהמונית שבפרופיל. נציג מרכז השירות יכול לעדכן את המידע.", "text": "автомобиль на фото отличается от указанного в профиле. Обновить данные может ваш таксопарк" },
    //{"isr":"","text":"нет фотографии ПЕРЕДНЕЙ части ТС"},
    { "isr": "אין תמונה של המונית מצד שמאל", "text": "нет фото ПРАВОЙ стороны автомобиля" },
    { "isr": "אין תמונה של המונית מצד ימין", "text": "нет фото ЛЕВОЙ стороны автомобиля" },
    { "isr": "לא רואים את כל המונית בתמונה", "text": "автомобиль не полностью попал в кадр" },
    { "isr": "התמונה לא בפוקוס", "text": "изображение нечёткое" },
    { "isr": "לא רואים טוב את לוחית הרישוי או שהיא לא בתמונה", "text": "госномер плохо видно, или он не попал в кадр" },
    //{"isr":"","text":"нечёткое изображение автомобиля"},
    { "isr": "לוחית הרישוי מוסתרת", "text": "часть госномера скрыта" },
    { "isr": "למונית אין לוחית רישוי", "text": "на автомобиле нет госномера" },
    { "label": "Фото СТС", "th": true },
    { "isr": "אין תמונה של רישיון הרכב עם הבעלות", "text": "нет фото СТС" },
    //{"isr":"","text":"нет фотографии одной из сторон СТС"},
    { "isr": "לא רואים את כל רישיון הרכב או שהתמונה חתוכה", "text": "СТС не полностью попало в кадр" },
    { "isr": "התמונה של רישיון הרכב לא בפוקוס או צולמה יותר מדי מרחוק", "text": "изображение СТС нечёткое или сделано издалека" },
    { "label": "Подозрение на фрод", "th": true },
    //{"isr":"","text":"автомобиль на фото не соответствует тому, что указан в профиле"},
    { "isr": "היצרן/הדגם של המונית שגוי. ניתן לעדכן את הפרטים במרכז הנהגים.", "text": "марка/модель указана неверно. Обновить данные в вашем профиле может таксопарк" },
    { "isr": "ברישיון הרכב רשומה בעלות אחרת על המונית", "text": "ПТС принадлежит другому автомобилю" },
    { "isr": "לא הצלחנו לבדוק אם רישיון הרכב מזויף או לא", "text": "мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства" },
    { "isr": "השם ברישיון הרכב שונה מהשם שברישיון הנהיגה", "text": "имя водителя, указанное в ПТС не совпадает с именем, указанным в в/у" },
    { "isr": "השם ברישיון הרכב שונה מהשם שבתעודת הביטוח", "text": "имя водителя, указанное в ПТС не совпадает с именем, указанным в страховке" },
    { "label": "Лицензия", "th": true },
    { "isr": "מספר הרישיון ברישיון הרכב שונה מהמספר שעל הדלתות האחוריות של המונית", "text": "номер лицензии в ПТС отличается от номера на задних дверях ТС" },
    { "isr": "פג התוקף של הרישיון", "text": "лицензия недействительна" },
    { "isr": "לא רואים רישיון הסעה בתמונה", "text": "на фото нет лицензии" },
  ],
 
  finItems = [
    { "label": "Автомобиль", "th": true },
    { "fin": "merkittävä ulkoinen vaurio", "text": "сильные повреждения на кузове" },
    { "fin": "ei kuvaa ajoneuvosi ___ puolesta (oikeasta/vasemmasta)", "text": "нет фото ___ стороны автомобиля (правая/левая)" },
    { "fin": "ei valokuvaa ajoneuvosta", "text": "нет фото автомобиля" },
    { "fin": "valokuvassa oleva ajoneuvo ei vastaa profiiliisi merkittyä ajoneuvoa. Voit päivittää profiilisi täällä", "text": "автомобиль на фото отличается от указанного в профиле. Обновить данные вы сможет по адресу:" },
    { "fin": "ajoneuvon rekisterikilpi ei ole näkyvissä", "text": "на автомобиле нет госномера" },
    { "fin": "ajoneuvon rekisterikilpi on osittain peitetty", "text": "часть госномера скрыта" },
    { "fin": "epätarkka valokuva", "text": "изображение нечёткое" },
    { "fin": "ajoneuvon rekisterikilpi ei näy kunnolla tai on rajattu kuvan ulkopuolelle", "text": "госномер плохо видно, или он не попал в кадр" },
    { "label": "Car registration | Регистрация а/м", "th": true },
    { "fin": "Rekisteriote ei näy kuvassa", "text": "Нет фото Car registration" },
    { "fin": "ajoneuvon merkki/malli ilmoitettu virheellisesti. Voit päivittää profiilisi täällä", "text": "марка/модель автомобиля указаны неверно. Обновить данные вы сможет по адресу:" },
    { "fin": "Taksivakuutus puuttuu", "text": "Отсутствует страховка такси" },
    { "fin": "Rekisteriote kuuluu toiselle ajoneuvolle", "text": "Регистрация принадлежит другому автомобилю" },
    { "fin": "rekisteriotekuva on epätarkka tai otettu liian kaukaa", "text": "изображение регистрации нечёткое или сделано издалека" },
    { "fin": "Rekisteriote ei näy kuvassa kokonaan tai kuva on rajattu", "text": "Регистрация не полностью попала в кадр или  фотография обрезана" },
    { "fin": "ajoneuvon rekisteriotteen aitoutta ei voitu vahvistaa", "text": "мы не можем подтвердить подлинность регистрации авто" },
    { "label": "Taxi permit | Разрешение на такси", "th": true },
    { "fin": "Taksiliikennelupa ei näy kuvassa", "text": "Нет фото Taxi permit" },
    { "fin": "lupakuva on epätarkka tai otettu liian kaukaa", "text": "изображение разрешения нечёткое или сделано издалека" },
    { "fin": "Taksiliikennelupa ei näy kuvassa kokonaan tai kuva on rajattu", "text": "Разрешение на такси  не полностью попало в кадр или  фотография обрезана" },
    { "fin": "taksiliikenneluvat aitoutta ei voitu vahvistaa", "text": "мы не можем подтвердить подлинность разрешения на такси" },
    { "fin": "Taksiliikennelupa on vanhentunut", "text": "Разрешение на такси просрочено" },
  ],
  
  kazItems = [
    { "label": "Автомобиль", "th": true },
    { "kaz": "нет фото автомобиля и техпаспорта", "text": "Нет ни одной фотографии ТС и техпаспорта" },
    { "kaz": "нет фото автомобиля", "text": "Нет ни одной фотографии ТС" },
    { "label": "Госномер", "th": true },
    { "kaz": "автомобиль не полностью попал в кадр", "text": "Госномер не полностью в кадре" },
    { "kaz": "изображение нечёткое", "text": "Нечеткий госномер" },
    { "kaz": "часть госномера скрыта", "text": "Госномер просматривается неполностью (залпелен грязью или снегом)" },
    { "kaz": "госномер плохо видно, или он не попал в кадр", "text": "Госномер сфотографирован слишком далеко" },
    { "kaz": "на автомобиле нет госномера", "text": "На автомобиле отсутствует госномер" },
    { "label": "Стс", "th": true },
    { "kaz": "нет фото техпаспорта", "text": "Нет фото техпаспорта" },
    { "kaz": "нет фотографии одной из сторон техпаспорта", "text": "Нет фото лицевой или оборотной стороны техпаспорта" },
    { "kaz": "техпаспорт не полностью попал в кадр", "text": "техпаспорт не полностью попало в кадр" },
    { "kaz": "изображение техпаспорта нечёткое или сделано издалека", "text": "Нечеткое изображение техпаспорта" },
    { "kaz": "автомобиль на фото не соответствует тому, что указан в профиле. Обновить данные в профиле может ваш таксопарк", "text": "На фото стороннее ТС" },
    { "kaz": "марка/модель указана неверно. Обновить данные в вашем профиле может таксопарк", "text": "Указаны другие марка и/или модель" },
    { "kaz": "техпаспорт принадлежит другому автомобилю", "text": "техпаспорт от стороннего ТС" },
    { "label": "Подлинность", "th": true },
    { "kaz": "мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства", "text": "Поддельный техпаспорт" },
    { "kaz": "мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства", "text": "Эмуляция" },
    { "kaz": "вы сфотографировали изображение техпаспорта на экране компьютера. Для проверки сделайте фото самого документа", "text": "Фото с экрана СТС" },
    { "kaz": "вы сфотографировали изображение автомобиля на экране компьютера. Это грубое нарушение", "text": "Фото с экрана ТС" },
    { "kaz": "вы сфотографировали изображение техпаспорта на экране компьютера. Для проверки сделайте фото самого документа", "text": "Ксерокопия СТС" },
    { "kaz": "несоответствие госномера требованиям сервиса", "text": "Любой техпаспорт, кроме Казахского (для города Шымкент)" },
  ],
  
  kgzItems = [
    { "label": "Автомобиль", "th": true },
    { "kgz": "нет фото автомобиля и техпаспорта", "text": "Нет ни одной фотографии ТС и техпаспорта" },
    { "kgz": "нет фото автомобиля", "text": "Нет ни одной фотографии ТС" },
    { "label": "Госномер", "th": true },
    { "kgz": "автомобиль не полностью попал в кадр", "text": "Госномер не полностью в кадре" },
    { "kgz": "изображение нечёткое", "text": "Нечеткий госномер" },
    { "kgz": "часть госномера скрыта", "text": "Госномер просматривается неполностью (залпелен грязью или снегом)" },
    { "kgz": "госномер плохо видно, или он не попал в кадр", "text": "Госномер сфотографирован слишком далеко" },
    { "kgz": "на автомобиле нет госномера", "text": "На автомобиле отсутствует госномер" },
    { "label": "Стс", "th": true },
    { "kgz": "нет фото техпаспорта", "text": "Нет фото техпаспорта" },
    { "kgz": "нет фотографии одной из сторон техпаспорта", "text": "Нет фото лицевой или оборотной стороны техпаспорта" },
    { "kgz": "техпаспорт не полностью попал в кадр", "text": "техпаспорт не полностью попало в кадр" },
    { "kgz": "изображение техпаспорта нечёткое или сделано издалека", "text": "Нечеткое изображение техпаспорта" },
    { "kgz": "автомобиль на фото не соответствует тому, что указан в профиле. Обновить данные в профиле может ваш таксопарк", "text": "На фото стороннее ТС" },
    { "kgz": "марка/модель указана неверно. Обновить данные в вашем профиле может таксопарк", "text": "Указаны другие марка и/или модель" },
    { "kgz": "техпаспорт принадлежит другому автомобилю", "text": "техпаспорт от стороннего ТС" },
    { "label": "Подлинность", "th": true },
    { "kgz": "мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства", "text": "Поддельный техпаспорт" },
    { "kgz": "мы не можем подтвердить подлинность свидетельства о регистрации транспортного средства", "text": "Эмуляция" },
    { "kgz": "вы сфотографировали изображение техпаспорта на экране компьютера. Для проверки сделайте фото самого документа", "text": "Фото с экрана СТС" },
    { "kgz": "вы сфотографировали изображение автомобиля на экране компьютера. Это грубое нарушение", "text": "Фото с экрана ТС" },
    { "kgz": "вы сфотографировали изображение техпаспорта на экране компьютера. Для проверки сделайте фото самого документа", "text": "Ксерокопия СТС" },
  ],
  
  mdaItems = [
      { "label": "Автомобиль", "th": true },
      { "mda": "fotografia automobilului lipsește", "text": "нет фото ТС" },
      { "mda": "automobilul din fotografie nu coincide cu cel menționat în profil. Datele de profil pot fi actualizate de compania ta de taximetrie", "text": "На фото стороннее ТС" },
      { "mda": "automobilul nu are număr de înmatriculare", "text": "На автомобиле отсутствует госномер" },
      { "mda": "o parte din numărul de înmatriculare nu este vizibilă", "text": "Госномер просматривается неполностью" },
      { "mda": "numărul de înmatriculare nu se vede bine sau nu a intrat complet în cadru", "text": "Госномер нечеткий или сфотографирован слишком далеко" },
      { "mda": "ai fotografiat imaginea automobilului pe ecranul computerului. Aceasta este o încălcare gravă", "text": "Фото с экрана/с фото" },
      { "label": "Техпаспорт", "th": true },
      { "mda": "fotografia certificatului de înmatriculare lipsește", "text": "Нет фото техпаспорта" },
      { "mda": "certificatul de înmatriculare este al altui automobil", "text": "Техпаспорт от стороннего ТС" },
      { "mda": "marca sau modelul sunt indicate greșit. Datele tale de profil pot fi actualizate de compania de taximetrie", "text": "Указаны другие марка и/или модель" },
      { "mda": "lipsește fotografia unei părți a certificatului de înmatriculare", "text": "Нет фото лицевой или оборотной стороны техпаспорта" },
      { "mda": "certificatul de înmatriculare nu a intrat complet în cadru", "text": "техпаспорт не полностью попало в кадр" },
      { "mda": "fotografia certificatului de înmatriculare este neclară sau a fost făcută de la o distanță prea mare", "text": "Нечеткое изображение техпаспорта" },
      { "mda": "nu putem confirma autenticitatea certificatului de înmatriculare", "text": "Поддельный техпаспорт" },
      { "mda": "ai fotografiat imaginea certificatului de înmatriculare pe ecranul computerului. Pentru verificare fotografiază documentul propriu-zis", "text": "Фото техпаспорта с экрана/с фото/ксерокопия" },
      { "mda": "Automobilul tău nu a fost găsit în baza de date", "text": "Автомобиля нет в базе ANTA" },
      { "label": 'Extras din "Registrul operatorilor de transport rutier"', "th": true },
      { "mda": 'Este necesar să transmiteți o poza a Extrasului din "Registrul operatorilor de transport rutier"', "text": "База не работает" },
      { "mda": 'Lipseste fotografia a extrasului din "Registrul operatorilor de transport rutier"', "text": "Нет фото документа" },
      { "mda": 'Extras din "Registrul operatorilor de transport rutier" apartine altui automobil', "text": "Документ от другого ТС" },
      { "mda": "Pe documentul dat lipsește ștampila", "text": "На документе нет печати" },
      { "mda": 'In documentul dat nu este indicat "Transport rutier contra cost"', "text": "Не указано Transport rutier contra cost" },
  ],
  
  zamItems = [
      { type: 'label', label: 'Автомобиль', th: true },
      { type: 'item', zam: 'no photo of the vehicle', text: 'нет фото автомобиля' },
      {
        type: 'item',
        zam: 'We couldn’t verify your vehicle registration certificate. The vehicle in the photo is different from the vehicle in your profile. You can update your profile with YOUR YANGO PARTNER COMPANY. Please resolve the issue and request a new photo check by tapping on the button in Yango Pro home.',
        text: 'автомобиль на фото не соответствует тому, что указан в профиле. Обновить данные в профиле может ваш таксопарк'
      },
      {
        type: 'item',
        zam: 'no license plate number on the vehicle',
        text: 'на автомобиле нет госномера'
      },
      {
        type: 'item',
        zam: 'license plate number partially covered',
        text: 'часть госномера скрыта'
      },
      {
        type: 'item',
        zam: 'license plate number poorly visible or not in frame',
        text: 'госномер плохо видно, или он не попал в кадр'
      },
      {
        type: 'item',
        zam: 'you took a picture of the vehicle displayed on a computer screen. This is a serious violation',
        text: 'вы сфотографировали изображение автомобиля на экране компьютера. Это грубое нарушение'
      },
      { type: 'label', label: 'Страховка', th: true },
      { type: 'item', zam: 'your insurance is expired', text: 'ваша страховка просрочена' },
      {
        type: 'item',
        zam: "your insurance isn’t visible in the photo",
        text: 'в кадре нет фотографии вашей страховки'
      },
      {
        type: 'item',
        zam: 'blurry picture of insurance. Please take the picture with a clear angle in a well-lit area',
        text: 'фотография страховки нечёткая. Выберите хороший ракурс и освещение'
      },
      {
        type: 'item',
        zam: 'insurance not fully in frame, or the photo is cropped',
        text: 'страховка не полностью попала в кадр, или ее фотография обрезана'
      },
      {
        type: 'item',
        zam: 'the license plate of the vehicle on your insurance and in your taxi company profile are different. Only your taxi company can update your profile',
        text: 'госномер ТС на страховке и в вашем профиле в таксопарке не совпадают. Обновить профиль может ваш таксопарк'
      },
      {
        type: 'item',
        zam: '"the photo is of a scan or copy of your insurance A photo of the original document is required for verification',
        text: 'на фотографии скан или копия страховки. Для проверки нужно фото оригинала'
      },
      {
        type: 'item',
        zam: '"the photo is of a screen. A photo of the original insurance document is required for verification',
        text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала страховки'
      },
      {
        type: 'item',
        zam: 'questionable authenticity of insurance',
        text: 'есть сомнения в подлинности страховки'
      }
      ],

  uaeItems = [
      { type: 'label', label: 'Автомобиль', th: true },
      { type: 'item', uae: 'No photo of vehicle', text: 'нет фото автомобиля' },
      {
        type: 'item',
        uae: 'The vehicle in the photo does not match the one indicated in the account. Your taxi company can update the information in the account.',
        text: 'автомобиль на фото не соответствует тому, что указан в профиле. Обновить данные в профиле может ваш таксопарк'
      },
      { type: 'item', uae: 'No license plate on the vehicle', text: 'на автомобиле нет госномера' },
      { type: 'item', uae: 'License plate partially obscured', text: 'часть госномера скрыта' },
      {
        type: 'item',
        uae: 'License plate poorly visible or not in frame',
        text: 'госномер плохо видно, или он не попал в кадр'
      },
      {
        type: 'item',
        uae: 'You took a photograph of a vehicle on a computer screen. This is a serious violation',
        text: 'вы сфотографировали изображение автомобиля на экране компьютера. Это грубое нарушение'
      },
      { type: 'label', label: 'Лицензия автомобиля', th: true },
      { type: 'item', uae: 'Your license is expired', text: 'ваша лицензия просрочена' },
      {
        type: 'item',
        uae: 'The photo of your license is not in the frame',
        text: 'в кадре нет фотографии вашей лицензии'
      },
      {
        type: 'item',
        uae: 'The photo of the license is poorly visible. Select a better angle and lighting',
        text: 'фотография лицензии нечёткая. Выберите хороший ракурс и освещение'
      },
      {
        type: 'item',
        uae: 'The license is not fully in frame, or the photo of it is cropped',
        text: 'лицензия не полностью попала в кадр, или ее фотография обрезана'
      },
      {
        type: 'item',
        uae: 'The license plate number on your license and in your taxi company profile do not match. Your taxi company can update the information in the account.',
        text: 'госномер ТС в лицензии и в вашем профиле в таксопарке не совпадают. Обновить профиль может ваш таксопарк'
      },
      {
        type: 'item',
        uae: 'The vehicle’s make/model is/are incorrect. Your taxi company can update the information',
        text: 'марка/модель автомобиля указаны неверно. Обновить данные может таксопарк'
      },
      {
        type: 'item',
        uae: 'The photo is of a scan or copy of the license. A photo of the original license is needed for verification',
        text: 'на фотографии скан или копия лицензии. Для проверки нужно фото оригинала'
      },
      {
        type: 'item',
        uae: 'The photo was taken from a screenshot. A photo of the original license is needed for verification',
        text: 'фотография сделана с экрана устройства. Для проверки нужно фото оригинала лицензии'
      },
      {
        type: 'item',
        uae: 'The license’s authenticity is in doubt',
        text: 'есть сомнения в подлинности лицензии'
      }
    ],
 
countryTranslate = {
  Russian: 'РФ',
  Romanian: 'Румыния',
  Serbian: 'Сербия',
  Latvian: 'Латвия',
  Israel: 'Израиль',
  Finland: 'Финляндия',
  Kazahstan: 'Казахстан/РБ',
  Kyrgyz: 'Киргизия',
  Moldova: 'Молдавия',
  Zambia: 'Замбия',
  UAE: 'ОАЭ'
},
 
  cities = {
    Romanian: ["Бухарест"],
    Serbian: ["Белград"],
    Latvian: ["Рига", "Даугавпилс", "Лиепая", "Валмиера", "Вентспился", "Елгава"],
    Israel: ["Тель-Авив", "Яффо", "Раана", "Герцлия", "Нетания", "Хайфа", "Ашкелон", "Ашдод"],
    Finland: ["Хельсинки", "Турку", "Тампере"],
    Kazahstan: ["Актау", "Актобе", "Алматы", "Астана", "Атырау", "Караганда", "Кокшетау", "Костанай", "Кызылорда", "Павлодар", "Петропавловск", "Семей", "Темиртау", "Тараз", "Туркестан", "Уральск", "Усть-Каменогорск", "Шымкент", "Экибастуз", "Жезказган", "Талдыкорган", 'Барановичи','Береза','Бобруйск','Борисов','Брест','Вилейка','Витебск','Волковыск','Гомель','Гродно','Дзержинск','Жлобин','Жодино','Ивацевичи','Кобрин','Лепель','Лида','Малорита','Минск','Могилев','Мозырь','Молодечно','Мосты','Несвиж','Новогрудок','Орша','Пинск','Полоцк','Пружаны','Речица','Светлогорск','Слуцк','Слоним','Солигорск','Столбцы'],
    Kyrgyz: ["Бишкек", "Ош", "Абад"],
    Moldova: ["Кишинёв"],
    Zambia: ['Лусака'],
    UAE: ['Дубай']
  }
 
document.querySelector('.modal-dialog').style.width = '800px'
 
const commentList = document.getElementById('comment-list'),
  btnBlock = document.getElementById('btn-block'),
  modalFooter = document.querySelector('.modal-footer'),
 
  head = document.querySelector('head'),
  style = document.createElement('style'),
 
  divTranslate = document.createElement('div'),
  select = document.createElement('select'),
  templateList = document.createElement('ul')
 
//inline style
head.append(style)
style.innerHTML = '.templates-item{border-bottom: 1px solid #cacaca; padding: 1px 5px;}.template-head{background-color:#d8e6ea;font-weight:bold;padding:1px 8px}.templates-item:hover{background-color: #f3f3f3; cursor: pointer}'
//вставка селекта перевод
document.getElementById('alert').style.display = 'none'
commentList.style.height = '370px'
commentList.style.width = '100%'
modalFooter.before(divTranslate)
divTranslate.append(select)
divTranslate.style.position = 'absolute'
divTranslate.style.bottom = '20px'
divTranslate.style.left = '15px'
//вставка списка
commentList.append(templateList)
templateList.classList.add('list-group')
//стили селекта
//select.style = 'float: right; margin: 5px'
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
    if (cities[key].indexOf(city) >= 0) {
      console.log(key)
      //cityOf(key)
      select.value = key
      return
    }
  }
}
 
//функция очистки списка
const resetList = () => {
  templateList.innerHTML = ''
  select.disabled = false
  select.selectedIndex = 0
}
let renderItems
//функция выбора перевода и загрузки списка
function selectTranslate() {
  switch (select.value) {
    case 'Russian': rusItems.map((item) => renderArr(item, item.rus, item.text))
      break
    case 'Romanian': {
      //renderItems = items.filter((item) => item.label || item.rou || item.text)
      rouItems.map((item) => renderArr(item, item.rou, item.text))
      break
    }
    case 'Serbian': {
      //renderItems = items.filter((item) => item.label || item.rou || item.text)
      srbItem.map((item) => renderArr(item, item.srb, item.text))
      break
    }
    case 'Latvian': {
      ltaItems.map((item) => renderArr(item, item.lta, item.text))
      break
    }
    case 'Israel': {
      isrItems.map((item) => renderArr(item, item.isr, item.text))
      break
    }
    case 'Finland': {
      finItems.map((item) => renderArr(item, item.fin, item.text))
      break
    }
    case 'Kazahstan': {
      kazItems.map((item) => renderArr(item, item.kaz, item.text))
      break
    }
    case 'Kyrgyz': {
        kgzItems.map((item) => renderArr(item, item.kgz, item.text))
        break
    }
    case 'Moldova': {
        mdaItems.map((item) => renderArr(item, item.mda, item.text))
        break
    }
    case 'Zambia': {
        zamItems.map((item) => renderArr(item, item.zam, item.text))
        break
    }
    case 'UAE': {
        uaeItems.map((item) => renderArr(item, item.uae, item.text))
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
 
select.addEventListener('change', () => {
 
  templateList.innerHTML = ''
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