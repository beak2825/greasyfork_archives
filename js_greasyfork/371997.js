// ==UserScript==
// @name         Перевод шаблонов ДКК
// @version      2.45
// @description  ///+подстветка шаблонов
// @author       Gusev
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @include	 https://taximeter-admin.taxi.yandex-team.ru/dkk
// @grant        none
// @namespace    https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/371997/%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%BE%D0%B2%20%D0%94%D0%9A%D0%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/371997/%D0%9F%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4%20%D1%88%D0%B0%D0%B1%D0%BB%D0%BE%D0%BD%D0%BE%D0%B2%20%D0%94%D0%9A%D0%9A.meta.js
// ==/UserScript==
document.querySelector('.modal-dialog').style = 'width: 50%'
var scrollPanel = document.getElementById('comment-list');
var form = scrollPanel.parentNode;
var toolspanel = document.createElement('div');
var select = document.createElement('select');
var buttonDiv = document.querySelector('.modal-footer');
var ul = scrollPanel.firstChild;
var allList = document.createElement('div');
var allListCB = document.createElement('input');
var allListLabel = document.createElement('label');
var dictionary = {
     Russian: ["— грязь на кузове",
               "— грязь на кузове. Пожалуйста, протрите дверные ручки и зону на заднем крыле около двери, чтобы пассажир не испачкался при посадке",
               "— сиденья испачканы",
               "— нет фото передних пассажирских сидений",
               "— посторонние предметы или грязь на ковриках. Коврики должны быть чистыми, на них не должно быть газет и картонок",
               "— на сиденьях не должно быть ничего, кроме специальных автомобильных чехлов",
               "— сильное повреждение покрытия кузова или оклейки",
               "— есть повреждения ___",
               "— фотографии отправлены не по порядку. Правильная последовательность: 1) передняя часть 2) левый бок 3) задняя часть 4) правый бок 5) передний ряд сидений 6) задний ряд сидений 7) багажник",
               "— автомобильные чехлы в плохом состоянии",
               "— оклейка не соответствует стандартам сервиса",
               "— багажник переполнен. Пассажирам может понадобиться место для вещей",
               "— в салоне автомобиля не должно быть посторонних людей и животных",
               "— машина не полностью попал в кадр",
               "— в салоне слишком темно. Пользуйтесь вспышкой или выберите более освещённое место",
               "— пассажирские сиденья не полностью попали в кадр",
               "— грязь на кузове",
               "— нет одной или нескольких фотографий машины",
               "— изображение нечёткое",
               "— грязный кузов и дверные ручки — пассажиры могут испачкаться",
               "— фото слишком тёмное. Выберите более освещённое место",
               "— на фото не та машина, которая указана в профиле. Попросите ваш парк обновить данные",
               "— грязные сиденья",
               "— госномер получился нечётко или не попал в кадр",
               "— посторонние предметы в салоне",
               "— на сиденьях накидки, непохожие на автомобильные чехлы",
               "— сильные повреждения покрытия кузова или оклейки",
               "— нет фотографии ___ части машины",
               "— есть повреждения кузова",
               "— госномер указан неверно. Попросите ваш таксопарк обновить данные в профиле",
               "— багажник не полностью попал в кадр",
               "— багажник не полностью попал в кадр",
               "— марка, модель или год указаны неверно. Попросите ваш таксопарк обновить данные в профиле",
               "— нет фотографий задних пассажирских сидений",
               "— посторонние предметы или грязь на ковриках",
               "— автомобильные чехлы в плохом состоянии",
               "— оклейка не соответствует стандартам сервиса",
               "— в багажнике посторонние предметы, вещи пассажиров могут не поместиться",
               "— злоупотребление функциями сервиса на фотоконтроле",
               "— часть госномера скрыта",
               //"оклейка на заднем стекле не соответствует стандартам сервиса (_или_) невозможно оценить состояние заднего стекла автомобиля",
               "— оклейка на заднем стекле не соответствует стандартам сервиса (_или_) невозможно оценить состояние заднего стекла машины",
               "— на машине нет госномера",
               "— сильные повреждения на кузове",
               "— ваш автомобиль трёхдверный. Такие машины запрещены в сервисе",
               "— недопустимое содержание фотографий",
               "— внешний вид машины не соответствует стандартам сервиса (_или_)  пользователи жалуются на внешний вид машины (_или_) сложно оценить состояние лакокрасочного покрытия",
               "— госномер не соответствует требованиям сервиса",
               "— марка, модель или год указаны неверно. Попросите ваш таксопарк обновить данные в профиле",
               "— фотографирование ТС с экрана компьютера является грубым нарушением",
               "— Пожалуйста, устраните замечания. В случае повторных нарушений доступ к заказам может быть приостановлен",
               "— Пожалуйста, устраните замечания. За следующее аналогичное замечания мы вынуждены будем приостановить доступ к заказам",
               "— внешний вид машины не соответствует стандартам сервиса (_или_)  пользователи жалуются на внешний вид машины (_или_) сложно оценить состояние лакокрасочного покрытия",
               "— несоответствие внешнего вида автомобиля стандартам сервиса",
              "— установлено малоразмерное колесо-докатка вместо стандартного",
              "— кресло переднего пассажира недостаточно сдвинуто вперёд, либо спинка кресла откинута назад/не установлена вертикально",
              "— повреждены элементы брендирования",
              "— не видно ремни и/или замки безопасности на задних сиденьях",
              "— ваш автомобиль трёхдверный. Такие машины запрещены в сервисе"],
    Azerbian: ["kuzov çirklidir","kuzov çirklidir. Sərnişin qapılarında tutacaqları və arxa tərəfdə qapının yanındakı cinahlar zonasını silin ki, sərnişin avtomobildən düşəndə bulaşmasın","oturacaqlar bulaşıb. Xahiş olunur, onları təmizləyin","ön sərnişin oturacaqlarının fotosu yoxdur","həsirlərdə yad əşyalar və ya çirk var. Həsirlər təmiz olmalıdır, onların üzərində qəzet və ya şəkil olmamalıdır","oturacaqlarda xüsusi avtomobil çexollarından savayı heç nə olmamalıdır","salon örtüyü və ya firma yapışqanı ciddi zədələnib Yuxarı səthi bərpa etmək xahiş olunur","___ zədələnməsi müşahidə olunur. Onları aradan qaldırmağınız xahiş olunur","fotoşəkillər ardıcıllıqla göndərilməyib. Düzgün ardıcıllıq belədir: 1) ön hissə 2) sol yan tərəf 3) arxa hissə 4) sağ yan tərəf 5) oturacaqların ön sırası 6) oturacaqların arxa sırası 7) yük bölməsi","avtomobil çexolları ciddi şəkildə zədələnib. Çexolları bərpa etmək və ya dəyişdirmək xahiş olunur","yapışqan xidmət standartlarına uyğun gəlmir","yük bölməsi dolub. Sərnişinlərin yükü üçün yer boşaltmağınız xahiş olunur","avtomobilin salonunda yad şəxslər və ya heyvanlar olmamalıdır","avtomobil tam şəkildə kadra düşməyib","salon çox qaranlıqdır. Fotoşəkil çəkən zaman işartıdan istifadə etmək və ya daha işıqlı yer seçmək yaxşı olardı","sərnişin oturacağı tam şəkildə kadra düşməyib","çirkli kuzov, sərnişinlər bulaşa bilər","avtomobilin heç bir fotoşəkili yoxdur","təsvir aydın deyil","kuzov və qapı tutacaqları çirklidir, sərnişinlər bulaşa bilər","foto çox tünddür. Daha işıqlı yer seçmək yaxşı olardı","fotodakı avtomobil profildə göstərilənə uyğun gəlmir. Profildəki məlumatları taksi parkınız yeniləyə bilər","oturacaqlar bulaşıb","dövlət nömrəsi aydın görünmür","salonda yad əşyalar var","oturacaqlarda avtomobil çexollarına oxşamayan örtüklər var","salon örtüyü və ya firma yapışqanı ciddi zədələnib","avtomobilin ___ hissəsinin fotoşəkli yoxdur","___ zədələnməsi müşahidə olunur","dövlət nömrəsi __ aydın göstərilməyib. Profilinizdə məlumatları taksi parkı yeniləyə bilər","yük bölməsi tam şəkildə kadra düşməyib","yük bölməsi tam şəkildə kadra düşməyib","avtomobilin markası, modeli, ili və ya rəngi düzgün göstərilməyib. Profilinizdə məlumatları taksi parkı yeniləyə bilər","arxa sərnişin oturacaqlarının fotosu yoxdur","həsirlərdə yad əşyalar və ya çirk var","avtomobil çexolları ciddi şəkildə zədələnib","yapışqan xidmət standartlarına uyğun gəlmir","yük bölməsi dolub, sərnişinlərin yükləri yerləşməyə bilər","foto-yoxlanışdan keçən zaman xidmət funksiyalarından sui-istifadə","dövlət nömrəsinin bir hissəsi gizlədilib","arxa şüşədə olan yapışqan xidmət standartlarına uyğun gəlmir (_yaxud_) avtomobilin arxa şüşəsinin vəziyyətini qiymətləndirmək mümkün deyil","avtomobildə dövlət nömrəsi yoxdur","kuzov ciddi zədələnib","bizim xidmətdə üçqapılı avtomobillər qadağandır","fotoşəkillərin məzmunu yolverilməzdir","avtomobilin zahiri görünüşü xidmət standartlarına uyğun gəlmir (_yaxud_) avtomobilin zahiri görünüşü ilə bağlı istifadəçi şikayəti var (_yaxud_) lak və boya qatının vəziyyətini qiymətləndirmək çətindir","dövlət nömrəsi xidmət tələblərinə uyğun gəlmir","avtomobilin markası, modeli, ili və ya rəngi düzgün göstərilməyib. Profilinizdə məlumatları taksi parkı yeniləyə bilər","Xahiş edirik, iradları aradan qaldırın. Təkrar pozuntu hallarında sifarişlərə çıxış imkanı dayandırıla bilər","Xahiş edirik, iradları aradan qaldırın. Növbəti oxşar iradlara görə sifarişlərə çıxış imkanını dayandırmalı olacağıq"],
    Armenian: ["կեղտոտ թափք","կեղտոտ թափք: Խնդրում ենք սրբել ուղևորների դռների բռնակները և հետևի թևին, դռան կողքին գտնվող հատվածը, որպեսզի ուղևորը մեքենա նստելիս չկեղտոտվի","նստատեղերը կեղտոտված են: Խնդրում ենք մաքրել դրանք","բացակայում է ուղևորի առջևի շարք նստատեղերի լուսանկարը","կողմնակի առարկաներ կամ կեղտ կարպետների վրա: Կարպետները պետք է լինեն մաքուր, դրանց վրա թերթեր և ստվարաթղթի կտորներ չպետք է լինեն","նստարանների վրա ավտոմեքենաների համար նախատեսված հատուկ ծածկոցներից բացի ոչինչ չպետք է լինի","թափքի ծածկույթի կամ ֆիրմային ձևավորման խիստ վնասվածք: Խնդրում ենք վերականգնել ծածկույթը","կան վնասվածքներ ___: Խնդրում ենք վերացնել դրանք","լուսանկարներն ուղարկվել են հերթականության խախտմամբ: Ճիշտ հերթականությունը՝ 1) առջևի մաս 2) ձախ կողմնային մաս 3) հետևի մաս 4) աջ կողմնային մաս 5) առջևի նստատեղերի շարք 6) հետևի նստատեղերի շարք 7) բեռնախցիկ","ավտոմեքենաների ծածկոցների խիստ վնասվածք: Խնդրում ենք վերականգնել կամ փոխարինել ծածկոցները","բրենդային ձևավորումը չի համապատասխանում ծառայության ստանդարտներին","բեռնախցիկը լիքն է: Խնդրում ենք ազատել տեղ ուղևորների ուղեբեռի համար","ավտոմեքենայի սրահում չպետք է լինեն կողմնակի մարդիկ կամ կենդանիներ","ավտոմեքենան կադրի մեջ ամբողջությամբ չի տեղավորվել","սրահում չափազանց մութ է: Լուսանկարելիս խորհուրդ է տրվում օգտագործել լուսաբռնկումը կամ ընտրել ավելի լուսավորված վայր","ուղևորների նստատեղերը կադրի մեջ ամբողջությամբ չեն տեղավորվել","կեղտոտ թափք, ուղևորները կարող են կեղտոտվել","մեքենայի ոչ մի լուսանկար չկա","պատկերը պարզ չէ","կեղտոտ թափք և դռների բռնակներ, ուղևորները կարող են կեղտոտվել","լուսանկարի վրա շատ մութ է: Խորհուրդ է տրվում ընտրել ավելի լուսավորված վայր","լուսանկարի վրա պատկերված մեքենան չի համապատասխանում նկարագրում նշվածին: Պրոֆիլի տվյալները կարող է թարմացնել Ձեր տաքսոպարկը","նստատեղերը կեղտոտված են","պետհամարանիշը պարզ չի երևում","կողմնակի առարկաներ սրահում","նստատեղերի վրա կան ծածկոցներ, որոնք ավտոմեքենաների ծածկոցներին նման չեն","թափքի ծածկույթի կամ ֆիրմային ձևավորման խիստ վնասվածք","բացակայում է ավտոմեքենայի ___ մասի լուսանկարը","կան վնասվածքներ ___","պետհամարանիշը __ սխալ է նշված: Ձեր նկարագրի տվյալները կարող է թարմացնել տաքսոպարկը","բեռնախցիկը կադրի մեջ ամբողջությամբ չի տեղավորվել","բեռնախցիկը կադրի մեջ ամբողջությամբ չի տեղավորվել","մակնիշը, մոդելը, տարեթիվը կամ գույնը սխալ է նշված: Ձեր նկարագրի տվյալները կարող է թարմացնել տաքսոպարկը","բացակայում է ուղևորի հետևի նստատեղերի լուսանկարը","կողմնակի առարկաներ կամ կեղտ կարպետների վրա","ավտոմեքենաների ծածկոցների խիստ վնասվածք","բրենդային ձևավորումը չի համապատասխանում ծառայության ստանդարտներին","բեռնախցիկը լիքն է, հնարավոր է, որ ուղևորների իրերը չտեղավորվեն","ծառայության գործառույթների չարաշահում ֆոտովերահսկում անցնելու ժամանակ","պետհամարանիշի մի մասը ծածկված է","հետևի ապակու բրենդային ձևավորումը չի համապատասխանում ծառայության ստանդարտներին (_կամ_) հնարավոր չէ գնահատել ավտոմեքենայի հետևի ապակու վիճակը","ավտոմեքենայի վրա պետհամարանիշ չկա","թափքի վրա խիստ վնասվածքների","մեր ծառայությունում երեք դռնանի ավտոմեքենաների արգելքի","լուսանկարների անթույլատրելի բովանդակության","ծառայության ստանդարտներին ավտոմեքենայի արտաքին տեսքի անհամապատասխանության (_կամ_) ավտոմեքենայի արտաքին տեսքի վերաբերյալ օգտատերերի բողոքների (_կամ_) լաքաներկային ծածկույթի վիճակը գնահատելու բարդության","ծառայության պահանջներին պետհամարանիշի անհամապատասխանության","մակնիշը, մոդելը, տարեթիվը կամ գույնը սխալ է նշված: Ձեր նկարագրի տվյալները կարող է թարմացնել տաքսոպարկը","Ֆոտոնկարահանել ՏՄ ի նկարները համակարգիչի էկրանից համարվում է շատ կոպիտ խախտւմ","Խնդրում ենք հաշվի առնել դիտողությունները։ Խախտման կրկնության դեպքում պատվերների հասանելիությունը կարող է կասեցվել։","Խնդրում ենք հաշվի առնել դիտողությունները։ Հաջորդ նման դիտողության դեպքում ստիպված կլինենք կասեցվել պատվերների հասանելիությունը:"],
    Georgian: ["ბინძური მანქანა","ბინძური მანქანა. გთხოვთ, გაწმინდოთ სახელურები მგზავრების კარებზე და ზონა უკანა ფრთაზე კარის გვერდზე, რათა მგზავრი არ დაისვაროს ჩაჯდომისას","სავარძლები დასვრილია. გთხოვთ, გაწმინდოთ ისინი","არ არის წინა სამგზავრო სავარძლების ფოტო","ზედმეტი ნივთები ან ტალახი ნოხებზე. ნოხები უნდა იყოს სუფთა, მათზე არ უნდა იყოს რაიმე გაზეთი ან მუყაო","სავარძლებზე არ უნდა იყოს არაფერი, გარდა სპეციალური საავტომობილო შალითებისა","მანქანის ზედაპირის ან საფირმო სტიკერების სერიოზული დაზიანება. გთხოვთ, აღადგინოთ ზედაპირი","არის დაზიანებები ___. გთხოვთ, აღმოფხვრათ ისინი","ფოტოსურათები გაგზავნილია არათანმიმდევრულად. სწორი თანმიმდევრობა: 1) წინა ნაწილი 2) მარცხენა მხარე 3) უკანა ნაწილი 4) მარჯვენა მხარე 5) სავარძლების წინა რიგი 6) სავარძლების უკანა რიგი 7) საბარგული","საავტომობილო შალითების სერიოზული დაზიანება. გთხოვთ, აღადგინოთ ან გამოცვალოთ შალითები","სტიკერები არ შეესაბამება მომსახურების სტანდარტებს","საბარგული გადავსებულია. გთხოვთ, გაათავისუფლოთ ადგილი მგზავრების ბარგისთვის","ავტომობილის სალონში არ უნდა იყვნენ უცხო პირები ან ცხოველები","ავტომიბილი სრულად არ არის კადრში მოხვედრილი","სალონში ძალიან ბნელა. სურათის გადაღებისას, უმჯობესია გამოიყენოთ ელვა ან შეარჩოთ უფრო განათებული ადგილი","მგზავრთა სავარძლები სრულად არ მოხვდა კადრში","ბინძური მანქანა, მგზავრები შესაძლოა დაისვარონ","არ არის ავტომობილის არცერთი სურათი","გამოსახულება ბუნდოვანია","ბინძური მანქანა და სახელურები კარებზე, მგზავრები შესაძლოა დაისვარონ","ფოტოზე ძალიან ბნელა. უმჯობესია შეარჩიოთ უფრო განათებული ადგილი","ავტომანქანა ფოტოზე არ შეესაბამება იმას, რაც მითითებულია პროფილში. პროფილში მონაცემების განახლება შეუძლია თქვენს ტაქსოპარკს","სავარძლები დასვრილია","სახელმწიფო ნომერი ბუნდოვნად გამოვიდა","უცხო ნივთები სალონში","სავარძლებზე არის შალითები, რომლებიც არ ჰგავს ავტომობილის შალითებს","მანქანის ზედაპირის ან საფირმო სტიკერების სერიოზული დაზიანება","არ არის ავტომობილის ____ ნაწილის ფოტოსურათი","არის დაზიანებები___","სახელმწიფო ნომერი ___ --არასწორადაა მითითებული. თქვენს პროფილში მონაცემების განახლება შეუძლია ტაქსოპარკს","საბარგული სრულად არ არის კადრში მოხვედრილი","საბარგული სრულად არ არის კადრში მოხვედრილი","მარკა, მოდელი, წელი ან ფერი – არასწორადაა მითითებული. თქვენს პროფილში მონაცემების განახლება შეუძლია ტაქსოპარკს","არ არის უკანა სამგზავრო სავარძლების ფოტო","ზედმეტი ნივთები ან ტალახი ნოხებზე","საავტომობილო შალითების სერიოზული დაზიანება","სტიკერები არ შეესაბამება მომსახურების სტანდარტებს","საბარგული გადავსებულია, მგზავრების ბარგი შესაძლოა არ ჩაეტიოს","ფოტოკონტროლის გავლისას მომსახურების ფუნქციების ბოროტად გამოყენება","სახელმწიფო ნომრის ნაწილი დაფარულია","სტიკერები უკანა მინაზე არ შეესაბამება მომსახურების სტანდარტს (_ან_) შეუძლებელია ავტომობილის უკანა მინის მდგომარეობის შეფასება","ავტომობილზე არ არის სახელმწიფო ნომერი","მანქანაზე სერიოზული დაზიანებები","აკრძალვა სამკარიან ავტომობილებზე ჩვენს მომსახურებაში","ფოტოსურათების დაუშვებელი შინაარსი","ავტომობილის შესახედაობის შეუსაბამობა მომსახურების სტანდრტებთან (_ან_) მომხმარებელთა ჩივილები ავტომობილის შესახედაობასთან დაკავშირებით (_ან_) შეღებილი ზედაპირის მდგომარეობის შეფასების სირთულე","სახელმწიფო ნომერის შეუსაბამობა მომსახურების მოთხოვნებთან","მარკა, მოდელი, წელი ან ფერი – არასწორადაა მითითებული. თქვენს პროფილში მონაცემების განახლება შეუძლია ტაქსოპარკს","სატრანსპორტო საშუალების კომპიუტერის მონიტორიდან გადაღება არის უხეში დარღვევა","გთხოვთ, აღმოფხვრათ მითითებული ხარვეზები. განმეორებითი დარღვევის შემთხვევაში შეკვეთებზე წვდომა შეიძლება შეჩერდეს","გთხოვთ, აღმოფხვრათ მითითებული ხარვეზები. ანალოგიური ხარვეზების განმეორების შემთხვევაში, იძულებული ვიქნებით შეგიჩეროთ შეკვეთებზე წვდომა", "","ავტომობილის მდგომარეობა არ შეესაბამება სერვისის სტანდარტებს."],
    Kyrgyz: ["кир кузов","кир кузов. Жүргүнчү отурууда булганып калбашы үчүн, жүргүнчү эшигиндеги тутканы жана эшиктин жанындагы арткы канаттагы зонаны сүртүүнү кеңеш кылабыз","отургучтар кир. Аларды тазалаңыз","алдыңкы жүргүнчү отургучунун сүрөтү жок","килемчелерде башка нерселер бар же кир. Килемчелер таза болушу керек, аларда гезит жана картон болбошу керек","отургучтарда атайын автомобилдик каптоочтордон тышкары, башка эч нерсе болбошу керек","кузовдун каптамы же фирмалык чаптама катуу бузулган. Үстүн калыбына келтириңиз","бузулуулар бар____. Аларды оңдоңуз","фотосүрөттөр ирети менен жөнөтүлгөн эмес. Туура ирээт: 1) алдыңкы бөлүк 2) сол каптал 3) арткы бөлүк 4) оң каптал 5) отургучтардын алдыңкы катары 6) отургучтардын арткы катары 7) багажник","Автоунаа каптоочтору катуу бузулган. Каптоочторду калыбына келтирип же алмаштырышыңыз керек","чаптама кызматтын стандарттарына ылайык келбейт","багажник толтура. Сураныч, жүргүнчүлөрдүн багажы үчүн орун бошотуңуз","автоунаанын салонунда башка адамдар же жаныбарлар болбошу керек","автомобиль кадрга толук түшпөй калган","салон өтө караңгы. Сүрөткө тартып жатканда жарыкты колдонуп же жарыгыраак жерди тандаңыз","жүргүнчүлөр отургучтары кадрга толук түшпөй калган","кузов кир экен, жүргүнчүлөр булганып алышы мүмкүн","автомобилдин бир дагы фотосүрөтү жок","сүрөт даана эмес","кузов же эшиктердин кармагычтары кир, жүргүнчүлөр булганып алышы мүмкүн","фотодо өтө караңгы. Жарыгыраак жерди тандаганга аракет кылыңыз","фотодогу автомобиль профилде көрсөтулгөнгө ылайык эмес. Профилдеги маалыматтарды таксопаркыңыз жаңырта алат","отургучтар кир","мамномер даана эмес","салондо башка нерселер бар","отургучтардын каптары автоунаа каптарына окшобойт","кузовдун каптамы же фирмалык чаптама катуу бузулган","автомобилдин ___ бөлүгүнүн фотосу жок","бузулуулар бар_____","мамномер __ -туура эмес көрсөтүлгөн. Профилиңиздеги маалыматтарды таксопаркыңыз жаңырта алат","багажник кадрга толук түшпөй калган","багажник кадрга толук түшпөй калган","маркасы, үлгүсү, жылы же түсү – туура эмес көрсөтүлгөн. Профилиңиздеги маалыматтарды таксопаркыңыз жаңырта алат","арткы жүргүнчүлөр отургучунун фотосу жок","килемчелерде башка нерселер бар же кир","автомобиль каптоочтору катуу бузулган","чаптама кызматтын стандарттарына ылайык келбейт","багажникте орун жок, жүргүнчүлөрдүн оокаттары батпай калышы мүмкүн","фотоконтролдон өтүүдө сервистин функцияларын кыянаттык менен пайдалануу","мамномердин бир бөлүгү жабылган","арткы айнектеги чаптама кызматтын стандарттарына ылайык эмес (_же_) автомобилдин арткы айнегине баалоо мүмкүн эмес","аавтоунаада мамномер жок","кузовдо катуу бузулуулар бар","Сервистеги үч эшиктүү автомобилдерге тыюу салуу","фотосүрөттөрдүн жол берилгис мазмуну","Автоунаанын тышкы көрүнүшүнө арыз (_же_) сыр-боёк каптоо абалына баалоодогу оорчулугу (_же_)  кызматтын стандарттарына ылайык келбешине колдонуучулардын автомобилдин тышкы көрүнүшүнө болгон арыздануулары ","мамномердин кызмат талабына ылайык келбеши","маркасы, үлгүсү, жылы же түсү – туура эмес көрсөтүлгөн. Профилиңиздеги маалыматтарды таксопаркыңыз жаңырта алат","ТКны компьютер экранынан сүрөткө тартуу оолуттуу эреже бузуу болуп саналат.","Сураныч, эскертүүлөрдү жоюңуз. Эреже бузуу кайталана турган болсо, буйрутма берүү токтотулушу мүмкүн","Сураныч, эскертүүлөрдү жоюңуз. Дагы бир ушундай эскертүү болсо, буйрутмалардын жеткиликтүүлүгүн токтотууга аргасыз болобуз",  "", "", "","алдыңкы жүргүнчү орундугу алдыга жетишерлик жылдырылган эмес, же орундуктун жөлөнгүчү артка жаткырылган/тикелей орнотулган эмес", "брендинг элементтери зыян тарткан", "арткы орундуктардын коопсуздук курлары жана/же кулпулары көрүнбөй калган"],
    Uzbek: ["kuzov iflos","kuzov iflos. Iltimos, yo‘lovchi mashinaga o‘tirayotganda yo‘lovchilar chiqadigan eshiklar ushlagichini va orqa qanotlarning eshik yonidagi sohasini arting","o‘rindiqlar ifloslangan. Iltimos, ularni tozalang","yo‘lovchi o‘rindiqlarining old o‘rindiqlari fotosurati yo‘q","gilamchalardagi yot predmetlar yoki axlatlarni. Gilamchalar toza bo‘lishi va ularda gazeta va rasmlar bo‘lmasligi lozim","o‘rindiqlarda maxsus avtomobil g‘iloflaridan boshqa hech narsa bo‘lmasligi lozim","qattiq shikastlangan kuzov qoplamasi yoki firma yelimli etiketkasi. Iltimos, ustki qismini tiklang","shikast yetgan joylar bor ___. Iltimos, ularni bartaraf eting","fotosuratlar to‘g‘ri tartibda yuborilmagan. To‘g‘ri ketma-ketlik: 1) old tomon 2) chap yon 3) orqa tomon 4) o‘ng tomon 5) old o‘rindiqlar qatori 6) orqa o‘rindiqlar qatori 7) yukxona","avtomobil g‘ilovlarining qattiq shikastlanishi. Iltimos, g‘iloflarni ta’mirlang yoki almashtiring","yopishtirilgan material xizmat standartlariga mos kelmayapti","yukxona to‘la. Iltimos, yo‘lovchi yuki uchun yukxonani bo‘shating","avtomobil salonida begona kishi yoki hayvonlar bo‘lmasligi lozim","avtomobil kadrga to‘liq tushmadi","salon juda qorong‘i. Suratga olayotganda chaqnoqdan foydalanish yoki yaxshiroq yoritilgan joyni tanlash maqsadga muvofiq","yo‘lovchi o‘rindiqlari kadrga to‘liq tushmadi","kuzov iflos, yo‘lovchilar kiyimi kir bo‘lishi mumkin","birorta ham avtomobil rasmi yo‘q","tasvir tiniq emas","kuzov va eshik ushlagichlari iflos, yo‘lovchilar kiyimi kir bo‘lishi mumkin","surat juda qorong‘i joyda olingan. Yaxshiroq yoritilgan joyni tanlash maqsadga muvofiq","fotosuratdagi avtomobil profilda ko‘rsatilgandan farq qiladi. Faqat taksi saroyi profilingiz ma’lumotlarini yangilashi mumkin","o‘rindiqlar ifloslangan","davlat raqami aniq ko‘rinmayapti","salonda yot predmetlar mavjud","o‘rindiqda avtomobil o‘rindiqlari g‘iloflariga o‘xshamagan jildlar bor","qattiq shikastlangan kuzov qoplamasi yoki firma yelimli etiketkasi","avtomobil qismining ___ surati yo‘q","shikast yetgan joylar bor ___","davlat raqami __ noto‘g‘ri ko‘rsatilgan. Faqat taksi saroyi profilingizdagi ma’lumotlarni yangilashi mumkin","yukxona kadrga to‘liq tushmadi","yukxona kadrga to‘liq tushmadi","avtomobil markasi, modeli, ishlab chiqarilgan yili yoki rangi – noto‘g‘ri ko‘rsatilgan. Faqat taksi saroyi profilingizdagi ma’lumotlarni yangilashi mumkin","yo‘lovchi o‘rindiqlarining orqa o‘rindiqlari fotosurati yo‘q","gilamchalardagi yot predmetlar yoki axlatlarni","avtomobil g‘ilovlarining qattiq shikastlanishi","yopishtirilgan material xizmat standartlariga mos kelmayapti","yukxona to‘la, yo‘lovchilarning narsalari sig‘masligi mumkin","foto-nazoratdan o‘tayotganda xizmat funksiyalarini suiiste’mol qilish","davlat raqami qisman yashirilgan","orqa oynaga yopishtirilgan material xizmat standartlariga mos kelmaydi (_yoki_) avtomobilning orqa oynasi holatini baholab bo‘lmayapti","avtomobilda davlat raqami yo‘q","kuzovda qattiq shikast yetgan joylar yo‘q","xizmatimizda uch eshikli avtomobillarga taqiq","fotosuratlarda mumkin bo‘lgan narsalar mavjudligi","avtomobilning tashqi ko‘rinishi xizmat standartlariga mos kelmasligi (_yoki_) foydalanuvchilarning avtomobilning tashqi ko‘rinishi bo‘yicha shikoyatlari (_yoki_) lako-kraska qoplamasi holatini baholashdagi qiyinchiliklar","davlat raqamining xizmat talablariga mos kelmasligi","avtomobil markasi, modeli, ishlab chiqarilgan yili yoki rangi – noto‘g‘ri ko‘rsatilgan. Faqat taksi saroyi profilingizdagi ma’lumotlarni yangilashi mumkin","Transport vositasini kompyuter ekranidan suratga olish qo'pol qoidabuzarlik hisoblanadi","Iltimos, kamchiliklarni tuzating. Qayta buzishlar bo‘lgan holda, buyurtmalar olish imkoniyati to‘xtatib turilishi mumkin","Iltimos, kamchiliklarni tuzating. Keyingi marta o‘xshash kamchilik aniqlanganda biz buyurtmalar olish imkoniyatini to‘xtatib turishga majbur bo‘lamiz"],
    Estonian: ["sõiduk on määrdunud","sõiduk on määrdunud. Palun puhastage reisija uste käepidemed ja ukseraami sisepinna tagaosa, et reisija sisenemisel ei määrduks","istmed on määrdunud. Palun puhastage need","puudub eesmisi reisijaistme foto","võõrkehad või mustus põrandamattidel. Põrandamatid peavad olema puhtad, neil ei tohi olla ajalehti ega pappkarpe","istmetel ei tohi olla muud kui spetsiaalsed sõidukiistmete katted","sõidukikere pind või ettevõtte logo kleeps oluliselt kahjustatud. Palun taastage korralik välispind","on kahjustused ___. Palun kõrvaldage need","fotod ei saadetud õiges järjestuses. Õige järjestus: 1) eestvaade 2) vasak külg 3) tagantvaade 4) parem külg 5) esiistmete rida 6) tagaistmete rida 7) pagasiruum","istmekatted on oluliselt kahjustatud. Palun taastage või asendage istmekatted","kleebis ei vasta teenuse standarditele","pagasiruum on täis. Palun vabastage reisijate pagasi jaoks ruumi","sõiduki salongis ei tohi olla kõrvalisi isikuid ja loomi","sõiduki ei ole täielikult kaadris","salongis on liiga pime. Pildistamisel on parem kasutada välku või valida paremini valgustatud koht","reisijaistmed ei ole täielikult kaadris","sõiduk on määrdunud, reisijad võivad määrduda","sõidukist ei ole ühtki fotot","pilt ei ole terav","sõiduk ja käepidemed on määrdunud, reisijad võivad määrduda","foto on liiga tume. Valige paremini valgustatud koht","sõiduk fotol ei vasta sellele, mis on esitatud profiilis. Profiili andmeid saab uuendada teie taksofirma","istmed on määrdunud","sõiduki riiklik numbrimärk ei ole arusaadav","salongis on kõrvalisi esemeid","istmetel on katted, mis pole autokatted","sõidukikere pind või ettevõtte logo kleeps oluliselt kahjustatud","puudub foto ___ sõidukiosast","on kahjustused ___","riiklik numbrimärk __ ei ole arusaadav. Profiili andmeid saab uuendada teie taksofirma","pagasiruum ei ole täielikult kaadris","pagasiruum ei ole täielikult kaadris","sõiduki mark, mudel, aasta ja värv ei ole esitatud selgelt Profiili andmeid saab uuendada teie taksofirma","puudub tagumise reisijaistme foto","Võõrkehad või mustus põrandamattidel","istmekatted on oluliselt kahjustatud","kleebis ei vasta teenuse standarditele","pagasiruum on täis, reisijate esemed ei pruugi ära mahtuda","teenindusfunktsioonide kuritarvitamine fotokontrolli ajal","osa riiklikust numbrimärgist on peidetud","tagaklaasil olev kleebis ei vasta teenuse standarditele (_või_) sõiduki tagaklaasi seisukorda on võimatu hinnata","sõidukil puudub riiklik numbrimärk","sõiduki kerel on suured kahjustused","meie teeninduses on keeld kolmeukseliste sõidukite suhtes","fotode sisu on sobimatu","sõiduki väljanägemine ei vasta teenuse standarditele (_või_) kasutajatel on kaebus sõiduki väljanägemise suhtes (_või_) lakivärvi seisukorda on raske hinnata","numbrimärk ei vasta teenuse nõuetele","sõiduki mark, mudel, aasta ja värv ei ole esitatud selgelt Profiili andmeid saab uuendada teie taksofirma","Sõiduki pildistamine arvuti ekraanilt on jäme rikkumine","Palun eemaldage märkused. Korduvate rikkumiste juhul võidakse peatada juurdepääs teenusele","Palun eemaldage märkused. Järgmise samalaadse märkuse eest oleme sunnitud juurdepääsu tellimustele peatama"],
    Lithuanian: ["Purvinas kėbulas","Purvinas kėbulas. Nuvalykite keleivių durų rankenėles ir sparną šalia durų, kad keleivis neišsiteptų","Purvinos sėdynės. Nuvalykite","nėra priekinių keleivių sėdynių foto","Pašaliniai daiktai arba purvas ant kilimėlių. Kilimėliai turi būti švarūs, ant jų neturi būti laikraščių ir kartono","Ant sėdynių neturi būti jokių pašalinių daiktų, išskyrus specialius automobiliams skirtus užvalkalus","Per stipriai pažeista kėbulo danga arba firminiai lipdukai. Atnaujinkite dangą","Pažeistas (-a) ___. Pašalinkite pažeidimus","Nuotraukos išsiųstos ne eilės tvarka. Teisinga eilės tvarka: 1) priekinė dalis; 2) kairysis šonas; 3) galinė dalis; 4) dešinysis šonas; 5) priekinė sėdynių eilė; 6) galinė sėdynių eilė; 7) bagažinė","Per stipriai pažeisti automobilio sėdynių užvalkalai. Atnaujinkite arba pakeiskite užvalkalus","Apklijuota ne pagal paslaugos standartus","Bagažinė perpildyta. Atlaisvinkite vietos keleivių bagažui","Automobilio salone neturi būti pašalinių žmonių arba gyvūnų","Automobilis netilpo į kadrą","Salone per tamsu. Fotografuojant geriausia naudoti blykstę arba rinktis labiau apšviestą vietą","Keleivių sėdynės netilpo į kadrą","Purvinas kėbulas, keleiviai gali išsitepti","Nėra nė vienos automobilio nuotraukos","Vaizdas neryškus","Purvinas kėbulas ir durų rankenėlės, keleiviai gali išsitepti","Nuotrauka per tamsi. Geriau rinktis labiau apšviestą vietą","Automobilis nuotraukoje neatitinka nurodyto profilyje. Atnaujinti profilio duomenis gali jūsų automobilių parkas","Purvinos sėdynės","Valstybinis numeris neryškus","Salone yra pašalinių daiktų","Ant sėdynių yra užvalkalų, neprimenančių automobilių užvalkalų","Per stipriai pažeista kėbulo danga arba firminiai lipdukai","Nėra automobilio ___ dalies nuotraukos","pažeistas (-a) ___","Neteisingai nurodytas valstybinis numeris __. Atnaujinti jūsų profilio duomenis gali automobilių parkas","Visa bagažinė netilpo į kadrą","Visa bagažinė netilpo į kadrą","Markė, modelis arba spalva nurodytos neteisingai. Atnaujinti jūsų profilio duomenis gali automobilių parkas","Nėra galinių keleivių sėdynių nuotraukos","Pašaliniai daiktai arba purvas ant kilimėlių","Per stipriai pažeisti automobilio sėdynių užvalkalai","Apklijuota ne pagal paslaugos standartus","Bagažinė perpildyta, gali netilpti keleivių daiktai","Nustatyta, kad atliekant fotokontrolę buvo piktnaudžiauta paslaugos funkcijomis","Paslėpta valstybinio numerio dalis","Lipdukas ant galinio stiklo neatitinka paslaugos standarto (_arba_) nepavyksta įvertinti automobilio galinio stiklo būklės","Automobilis neturi valstybinio numerio","rimtų kėbulo pažeidimų","draudimo naudoti trijų durų automobilius teikiant mūsų paslaugą","neleistino nuotraukų turinio","automobilio išvaizdos neatitikties paslaugos standartams (_arba_) vartotojų skundų dėl automobilio išvaizdos (_arba_) keblumų įvertinant automobilio dažų būklę","valstybinio numerio neatitikties paslaugos reikalavimams","Markė, modelis arba spalva nurodytos neteisingai. Atnaujinti jūsų profilio duomenis gali automobilių parkas","Prašome pašalinti trūkumus. Jeigu pažeidimai kartosis, gali būti sustabdyta prieiga prie užsakymų","Prašome pašalinti trūkumus. Jei analogiška problema pasikartos, mes būsime priversti sustabdyti prieigą prie užsakymų"],
    Latvian: ["netīra virsbūve","netīra virsbūve. Lūdzu, noslaukiet rokturus uz pasažieru durvīm un zonu uz aizmugurējā spārna pie durvīm, lai pasažieris nenosmērētos iekāpšanas brīdī","sēdekļi ir notraipīti. Lūdzu, iztīriet tos","nav priekšējie pasažieru sēdekļu fotogrāfijas","nepiederīgi priekšmeti un netīrumi uz grīdas paklājiem. Grīdas paklājiem ir jābūt tīriem, uz tiem nav jābūt avīzēm un kartonam","uz sēdekļiem nav jābūt nekam citam, izņemot speciālos automobiļu pārvalkus","nopietns virsbūves virsmas un firmas aplīmējuma bojājums. Lūdzu, atjaunojiet virsmu","ir bojājumi ___. Lūdzu,novērsiet tos","fotogrāfijas nav nosūtītas pēc kārtas. Pareizā secība: 1) priekšpuse 2) kreisais sāns 3) aizmugurējā puse 4) labais sāns 5) priekšējā sēdekļu rinda 6) aizmugurējā sēdekļu rinda 7) bagāžnieks","nopietns automobiļa pārvalku bojājums. Lūdzu, atjaunojiet vai nomainiet pārvalkus","aplīmējums neatbilst servisa standartiem","bagāžnieks ir pārpildīts. Lūdzu, atbrīvojiet vietu pasažieru bagāžai","automobiļa salonā nedrīkst būt svešinieki vai dzīvnieki","automobilis nav pilnībā iekļuvis kadrā","salonā ir pārāk tumšs. Fotografējot ir labāk izmantot zibspuldzi vai izvēlēties apgaismotāku vietu","pasažieru sēdekļi nav pilnībā iekļuvuši kadrā","netīra virsbūve, pasažieri var nosmērēties","nav nevienas automobiļa fotogrāfijas","attēls ir neskaidrs","netīra virsbūve un rokturi uz durvīm, pasažieri var nosmērēties","fotogrāfijā ir pārāk tumšs. Labāk izvēlēties apgaismotāku vietu","automobilis fotogrāfijā neatbilst tam, kas norādīts profilā. Jūsu taksometru uzņēmums var atjaunināt datus profilā","sēdekļi ir notraipīti","valsts numurs ir sanācis neprecīzs","nepiederīgi priekšmeti salonā","uz sēdekļiem ir apmetņi, kas nav līdzīgi automobiļa pārvalkiem","nopietns virsbūves virsmas un firmas aplīmējuma bojājums","nav automašīnas ___ daļas","ir bojājumi ___","valsts numurs __ ir norādīts neprecīzi. Taksometru uzņēmums var atjaunināt datus jūsu profilā","bagāžnieks nav pilnībā iekļuvis kadrā","bagāžnieks nav pilnībā iekļuvis kadrā","zīmols, modelis, gads vai krāsa ir norādīti nepareizi. Taksometru uzņēmums var atjaunināt datus jūsu profilā","nav aizmugurējo pasažieru sēdekļu fotogrāfijas","nepiederīgi priekšmeti un netīrumi uz grīdas paklājiem","nopietns automobiļa pārvalku bojājums","aplīmējums neatbilst servisa standartiem","bagāžnieks ir pārpildīts, pasažieru mantām var nepietikt vietas","ļaunprātīga servisa funkciju izmantošana uzņemot kvalitātes pārbaudes fotoattēlu","valsts numura daļa ir noslēpta","aplīmējums uz aizmugurējā stikla neatbilst servisa standartiem (_vai_) nav iespējams novērtēt automobiļa aizmugurējā stikla stāvokli","automobilim nav valsts numurs","nopietnu virsbūves bojājumu","aizlieguma izmantot trīs durvju automobiļus mūsu servisā","nepieņemama fotogrāfiju satura","automobiļa ārējā izskata neatbilstības servisa standartiem (_vai_) lietotāju sūdzību par automobiļa ārējo izskatu (_vai_) sarežģītības novērtēt lakas un krāsu pārklājuma stāvokli","valsts numura neatbilstības servisa prasībām","zīmols, modelis, gads vai krāsa ir norādīti nepareizi. Taksometru uzņēmums var atjaunināt datus jūsu profilā","TL fotografēšana no datora ekrāna ir rupjš pārkāpums","Lūdzu, novērsiet aizrādījumus. Atkārtotu pārkāpumu gadījumā piekļuve pasūtījumiem var tik apturēta uz laiku","Lūdzu, novērsiet aizrādījumus. Par turpmākiem analoģiskiem aizrādījumiem mums nāksies uz laiku apturēt pieeju pasūtījumiem","", "Auto ārējais izskats neatbilst servisa standartiem"],
    Romanian: ["caroserie murdară","caroserie murdară. Vă rugăm să ștergeți mânerele portierelor pentru pasageri și zona aripilor spate de lângă portiere, astfel încât pasagerul să nu se murdărească atunci când urcă în mașină","scaunele sunt pătate. Vă rugăm să le curățați","nu există nicio fotografie cu bancheta din față pentru pasageri","obiecte străine sau murdărie pe huse. Husele trebuie să fie curate, iar pe ele nu trebuie să se afle ziare sau cartoane","pe scaune nu trebuie să fie nimic în afara huselor speciale de automobil","defecte serioase la vopseaua de pe caroseria mașinii sau la stickerele de firmă. Vă rugăm să reparați această zonă","există defecte la ___. Vă rugăm să le reparați","fotografiile nu sunt trimise în ordine. Ordinea corectă: 1) partea din față 2) partea stângă 3) partea din spate 4) partea dreaptă 5) rândul de scaune din față 6) rândul de scaune din spate 7) portbagaj","deteriorare serioasă a huselor automobilului. Vă rugăm să reparați sau înlocuiți husele","stickerul nu corespunde cu standardele serviciului","portbagajul este plin. Vă rugăm să eliberați spațiul pentru bagajele pasagerilor","în interiorul automobilului nu trebuie să se afle persoane străine sau animale","automobilul nu a intrat complet în cadru","în interiorul automobilului este prea întuneric. Când fotografiați, este preferabil să utilizați blițul sau să alegeți un loc cu mai multă lumină","scaunele pentru pasageri nu au intrat complet în cadru","caroserie murdară, pasagerii se pot murdări","nu există nicio fotografie a automobilului","imaginea nu este clară","caroseria este murdară pe mânerele portierelor, pasagerii se pot murdări","în fotografie sunt prea multe zone întunecoase. Este preferabil să găsiți un loc cu mai multă lumină","automobilul din fotografie nu se potrivește cu cel care apare la profilul dumneavoastră. Compania dumneavoastră de taxiuri poate să actualizeze datele profilului","scaunele sunt pătate","număr de înmatriculare neclar","obiecte străine în interiorul mașinii","scaunele sunt acoperite cu materiale care nu arată ca husele pentru automobile","defecte serioase la vopseaua de pe caroseria mașinii sau la stickerele de firmă","nu există nicio fotografie cu partea ___ a mașinii","există defecte la ___","numărul de înmatriculare __  este incorect. Compania de taxiuri poate să actualizeze datele profilului dumneavoastră","portbagajul nu a intrat complet în cadru","portbagajul nu a intrat complet în cadru","marca, modelul, vechimea sau culoarea automobilului este incorectă. Compania de taxiuri poate să actualizeze datele profilului dumneavoastră","nu există nicio fotografie cu bancheta din spate pentru pasageri","obiecte străine sau murdărie pe huse","deteriorare serioasă a huselor automobilului","stickerul nu corespunde cu standardele serviciului","portbagajul este aglomerat, este posibil ca obiectele pasagerilor să nu încapă","utilizare incorectă a funcțiilor serviciului la trecerea controlului foto","o parte a numărului de înmatriculare este ascunsă","stickerul de pe geamul din spate nu corespunde cu standardele serviciului (_sau_) nu se poate evalua starea lunetei automobilului","automobilul nu are numere de înmatriculare","defecțiuni grave pe caroserie","serviciul nostru nu acceptă automobilele cu două portiere (trei uși)","conținutul fotografiilor nu poate fi acceptat","aspectul exterior al automobilului nu corespunde cu standardele serviciului (_sau_) plângeri ale pasagerilor privind aspectul exterior al mașinii (_sau_) este dificil de apreciat starea vopselei","numărul de înmatriculare nu corespunde cu standardele serviciului","marca, modelul, vechimea sau culoarea automobilului este incorectă. Compania de taxiuri poate să actualizeze datele profilului dumneavoastră","fotografierea de pe ecran este o încălcare gravă", "Vă rugăm să remediați problemele identificate. În cazul unor încălcări repetate, accesul la comenzi poate fi suspendat","Vă rugăm să remediați problemele identificate. La următoarele observații similare vom fi nevoiți să vă suspendăm accesul la comenzi", "aspectul exterior al automobilului nu corespunde cu standardele serviciului (_sau_) plângeri ale pasagerilor privind aspectul exterior al mașinii (_sau_) este dificil de apreciat starea vopselei", "necorespunderea stării mașinii standardelor de serviciu"],
    Serbian: ["prljava karoserija","prljava karoserija. Obrišite ručice na putničkim vratima i deo na zadnjem krilu pored vrata, da se putnik ne bi isprljao prilikom ulaska","sedišta su isprljana. Očistite ih","nema fotografije prednjih putničkih sedišta","strani predmeti ili prljavština na patosnicama. Patosnice moraju biti čiste, na njima se ne smeju nalaziti novine i karton","na sedištima ne sme biti ništa osim specijalnih automobilskih navlaka","velika oštećenja farbe na karoseriji ili brendirane nalepnice. Popravite površinu","postoje oštećenja ___. Otklonite ih","fotografije nisu poslate po redu. Pravilan redosled: 1) prednji deo 2) leva bočna strana 3) zadnji deo 4) desna bočna strana 5) prednja sedišta 6) zadnja sedišta 7) prtljažnik","veliko oštećenje automobilskih navlaka. Popravite ih ili zamenite navlake","nalepnica ne odgovara standardima servisa","prtljažnik je prepunjen. Oslobodite mesto za prtljag putnika","u kabini vozila ne smeju se nalaziti strani ljudi ili životinje","automobil nije kompletno ušao u kadar","u kabini je previše mračno. Prilikom fotografisanja bolje je koristiti blic ili izabrati bolje osvetljeno mesto","putnička sedišta nisu potpuno ušla u kadar","prljava karoserija, putnici se mogu isprljati","nema nijedne fotografije automobila","slika je mutna","prljava karoserija i ručke na vratima, putnici se mogu isprljati","na fotografiji je previše mračno. Bolje je izabrati osvetljenije mesto","automobil na fotografiji ne odgovara vozilu koje je navedeno u profilu. Podatke može ažurirati vaš taksi park","sedišta su isprljana","broj tablica je mutan","strani predmeti u kabini","na sedištima postoje pokrivači koji ne liče na automobilske navlake","velika oštećenja farbe na karoseriji ili brendirane nalepnice","nema fotografije ___ dela vozila","postoje oštećenja ___","registarski broj __ naveden pogrešno. Podatke o vašem profilu može ažurirati taksi park","prtljažnik nije potpuno ušao u kadar","prtljažnik nije potpuno ušao u kadar","marka, model, godina ili boja vozila navedeni pogrešno. Podatke o vašem profilu može ažurirati taksi park","nema fotografije zadnjih putničkih sedišta","strani predmeti ili prljavština na patosnicama","veliko oštećenje automobilskih navlaka","nalepnica ne odgovara standardima servisa","prtljažnik je prepunjen, stvari putnika ne mogu da stanu","zloupotreba funkcija servisa tokom obavljanja fotokontrole","deo registarskog broja je skriven","nalepnica na zadnjem staklu ne odgovara standardima servisa (_ili_) nije moguće proceniti stanje zadnjeg stakla automobila","na vozilu nema registarskog broja","velikih oštećenja na karoseriji","zabrana za vozila sa troja vrata u našem servisu","nedozvoljenog sadržaja fotografija","neusklađenosti spoljašnjeg izgleda vozila sa standardima servisa (_ili_) žalbi korisnika na spoljašnji izgled automobila (_ili_) teškoće da se proceni stanje farbe","neusklađenost registarskog broja sa zahtevima servisa","marka, model, godina ili boja vozila navedeni pogrešno. Podatke o vašem profilu može ažurirati taksi park","Molimo vas da otklonite primedbe. U slučaju ponovnih prekršaja pristup narudžbinama može biti obustavljen","Molimo vas da otklonite primedbe. Za sledeće slične primedbe bićemo primorani da obustavimo pristup narudžbinama"],
    Slovenian: ["Karoserija avtomobila je umazana","Karoserija avtomobila je umazana. Priporočamo, da obrišete kljuke na potnikovih vratih in območje odbijača zadaj poleg vrat, da si potniki ne umažejo oblačil, ko vstopajo v vozilo.","Seats are dirty. Please clean them","ni fotografije prednjih sedežev","Clutter or dirt on the mats. Mats should be clean, with no newspapers or cardboard underfoot","Na sedežih ne smejo biti druga pregrinjala kot predvidene sedežne prevleke","Večja poškodba barve karoserije avtomobila ali premaza. Obnoviti morate zunanjost","Damage to ___. Please repair this.","Photographs sent out of order. Correct order: 1) front 2) left side 3) back 4) right side 5) front seats 6) back seats 7) trunk","Severe damage to seat covers. You must repair or replace the covers","The car coating doesn't meet Yandex.Taxi standards","Trunk is too full. It should be empty so that passengers can put their baggage there","The car should not contain other people or animals","The car was not completely captured in the shot.","V notranjosti je pretemno. Med preverjanjem uporabljajte baterijsko svetilko ali poiščite bolje osvetljeno mesto","The passenger seats were not completely captured in the shot","Karoserija avtomobila je umazana. Potniki se lahko umažejo.","There are no photos of the car.","Blurry image.","Karoserija avtomobila je umazana. Obleka potnikov se lahko umaže.","The photo is too dark. Try going to an area with better lighting","The photo shows a different car than in your profile. Your taxi company can update information about your car in your profile","Seats are dirty.","The license plate number is blurry.","Nered v avtomobilu.","Sedeži so prekriti z nečim, kar ni videti kot avtomobilska sedežna prevleka","Major damage to the car-body paint or branded coating","No photograph of the ___ of the car","___ is damaged","License plate number __ entered incorrectly. The taxi company can update your profile.","The trunk was not completely captured in the shot","The trunk was not completely captured in the shot","The make, model, model year, or color of the car was entered incorrectly. The taxi company can update your profile.","Ni fotografije zadnjih sedežev","Clutter or dirt on the mats.","Major damage to seat covers.","Branded coating doesn't meet our standards","Trunk is too full. Passengers' baggage might not fit.","Funkcije storitve so se med preverjanjem fotografije zlorabile","Part of the license plate was hidden","Premaz na zadnjem oknu ne ustreza našim standardom (_ali_) stanja zadnjega okna ni bilo mogoče ugotoviti","There is no license plate on the car","severe damage to the car body","restriction on the use of three-door cars within our service","unacceptable photo content","the exterior of the car failing to meet our service standards (_or_) user complaints about the car's appearance (_or_) difficulty in assessing the condition of the car's paint and protective coating","the license plate number not meeting our service standards","The make, model, model year, or color of the car was entered incorrectly. The taxi company can update your profile.","",""],
    English: ["Car body is dirty","Car body is dirty. We recommend wiping down the handles on passenger doors and the area of the rear fender next to the door so that passengers' clothing doesn't get dirty when they enter your vehicle.","Seats are dirty. Please clean them","no photo of front passenger seats","Clutter or dirt on the mats. Mats should be clean, with no newspapers or cardboard underfoot","There shouldn't be any coverings on the seats, other than designated seat covers","Severe damage to the car-body paint or branded coating. You must refurbish the exterior","Damage to ___. Please repair this.","Photographs sent out of order. Correct order: 1) front 2) left side 3) back 4) right side 5) front seats 6) back seats 7) trunk","Severe damage to seat covers. You must repair or replace the covers","The car coating doesn't meet Yandex.Taxi standards","Trunk is too full. It should be empty so that passengers can put their baggage there","The car should not contain other people or animals","The car was not completely captured in the shot.","The interior is too dark. During the check, use your flash or find an area with better lighting","The passenger seats were not completely captured in the shot","Dirty car body. Your passengers may get dirty.","There are no photos of the car.","Blurry image.","Car body is dirty. Passengers' clothing may get dirty.","The photo is too dark. Try going to an area with better lighting","The photo shows a different car than in your profile. Your taxi company can update information about your car in your profile","Seats are dirty.","The license plate number is blurry.","Clutter inside the car.","The seats are covered with something that does not look like car seat covers","Major damage to the car-body paint or branded coating","No photograph of the ___ of the car","___ is damaged","License plate number __ entered incorrectly. The taxi company can update your profile.","The trunk was not completely captured in the shot","The trunk was not completely captured in the shot","The make, model, model year, or color of the car was entered incorrectly. The taxi company can update your profile.","No photo of the backseat","Clutter or dirt on the mats.","Major damage to seat covers.","Branded coating doesn't meet our standards","Trunk is too full. Passengers' baggage might not fit.","Service functions misused during photo check","Part of the license plate was hidden","The rear window coating doesn't meet our standards (_or_) the condition of the rear window could not be determined","There is no license plate on the car","severe damage to the car body","restriction on the use of three-door cars within our service","unacceptable photo content","the exterior of the car failing to meet our service standards (_or_) user complaints about the car's appearance (_or_) difficulty in assessing the condition of the car's paint and protective coating","the license plate number not meeting our service standards","The make, model, model year, or color of the car was entered incorrectly. The taxi company can update your profile.","Taking a photo of a vehicle from your computer screen is considered a serious violation","",""],
    Israel: [
        "המונית מלוכלכת מבחוץ",//грязь на кузове
        "המונית מלוכלכת מבחוץ. צריך לנגב את הידיות בדלתות של הנוסעים ואת החלק של הכנף בסמוך לדלת, כדי שהנוסעים לא יתלכלכו כשהם נכנסים למונית.",//грязь на кузове. Пожалуйста, протрите дверные ручки и зону на заднем крыле около двери, чтобы пассажир не испачкался при посадке
        "המושבים מלוכלכים",//сиденья испачканы
        "нет фото передних пассажирских сидений",
        "השטיחונים מלוכלכים/יש עליהם דברים לא נחוצים. השטיחונים צריכים להיות נקיים ואסור להניח עליהם עיתון או קרטון",//посторонние предметы или грязь на ковриках. Коврики должны быть чистыми, на них не должно быть газет и картонок
        "יש על המושבים כיסוי שאינו כיסוי מושב רגיל",//на сиденьях не должно быть ничего, кроме специальных автомобильных чехлов
        "יש למונית נזקי פח חמורים או מדבקה. צריך לתקן את הנזק",//сильное повреждение покрытия кузова или оклейки
        "יש נזק ב___",//есть повреждения ___
        "התמונות נשלחו בסדר שגוי. זה הסדר הנכון: 1) המונית מלפנים. 2) המונית משמאל. 3) המונית מאחור. 4) המונית מימין. 5) המושבים הקדמיים. 6) המושבים האחוריים. 7) תא המטען",//фотографии отправлены не по порядку. Правильная последовательность: 1) передняя часть 2) левый бок 3) задняя часть 4) правый бок 5) передний ряд сидений 6) задний ряд сидений 7) багажник
        "יש נזק חמור לכיסויי המושבים. צריך לתקן אותו או להחליף את הכיסויים",//автомобильные чехлы в плохом состоянии || сильное повреждение автомобильных чехлов. Пожалуйста, восстановите или замените чехлы
        "המצב של המונית מבחוץ לא עומד בסטנדרטים של השירות שלנו",//оклейка не соответствует стандартам сервиса
        "תא המטען מלא. צריך לפנות מקום למטען של הנוסעים",//багажник переполнен. Пассажирам может понадобиться место для вещей
        "בתמונה של המונית מבפנים לא יכולים להיות אנשים אחרים או בעלי חיים",//в салоне автомобиля не должно быть посторонних людей и животных
        "לא רואים את כל המונית בתמונה",//автомобиль не полностью попал в кадр
        "תא המטען חשוך מדי. צריך להשתמש בפלאש או לצלם באזור מואר יותר",//в салоне слишком темно. При фотографировании лучше использовать вспышку или выбирать более освещённое место
        "לא רואים את כל מושבי הנוסעים בתמונה",//пассажирские сиденья не полностью попали в кадр
        "המונית מלוכלכת מבחוץ",//грязь на кузове
        "זו לא תמונה של מונית אחת",//нет одной или нескольких фотографий автомобиля
        "התמונה לא בפוקוס",//изображение нечёткое
        "המונית והידיות מלוכלכות מבחוץ, והנוסעים עלולים להתלכלך",//грязный кузов и дверные ручки — пассажиры могут испачкаться
        "התמונה חשוכה מדי. צריך לצלם באזור מואר יותר",//фото слишком тёмное. Выберите более освещённое место
        "המונית שבתמונה לא תואמת למונית שבפרופיל. נציג תחנת המוניות יכול לעדכן את הפרופיל שלך",//на фото не тот автомобиль, который указан в профиле. Попросите ваш таксопарк обновить данные
        "המושבים מלוכלכים",//грязные сиденья
        "התמונה של לוחית הרישוי לא בפוקוס",//госномер получился нечётко или не попал в кадр
        "יש דברים לא נחוצים בתא הנוסעים",//посторонние предметы в салоне
        "יש על המושבים כיסוי שאינו כיסוי מושב רגיל",//на сиденьях накидки, непохожие на автомобильные чехлы ????
        "יש למונית נזקי פח חמורים או מדבקה. צריך לתקן את הנזק",//сильные повреждения покрытия кузова или оклейки
        "אין תמונות של המונית בצד ______",//нет фотографии ___ части автомобиля
        "יש הרבה מכות או שריטות פח",//есть повреждения кузова
        "לוחית הרישוי ___ שצוינה לא נכונה. נציג תחנת המוניות יכול לעדכן את הפרופיל שלך",//госномер указан неверно. Попросите ваш таксопарк обновить данные в профиле ???
        "לא רואים את כל תא המטען בתמונה",//багажник не полностью попал в кадр
        "לא רואים את כל תא המטען בתמונה",//багажник не полностью попал в кадр
        "היצרן, הדגם, הצבע והשנה לא נכונים. נציג תחנת המוניות יכול לעדכן את הפרופיל שלך",//марка, модель или год указаны неверно. Попросите ваш таксопарк обновить данные в профиле
        "нет фотографий задних пассажирских сидений",//нет фотографий задних пассажирских сидений
        "השטיחונים מלוכלכים/יש עליהם דברים לא נחוצים. השטיחונים צריכים להיות נקיים ואסור להניח עליהם עיתון או קרטון",//посторонние предметы или грязь на ковриках
        "יש נזק חמור לכיסויי המושבים. צריך לתקן אותו או להחליף את הכיסויים",//автомобильные чехлы в плохом состоянии
        "המצב של המונית מבחוץ לא עומד בסטנדרטים של השירות שלנו",//оклейка не соответствует стандартам сервиса
        "תא המטען מלא. צריך לפנות מקום למטען של הנוסעים",//в багажнике посторонние предметы, вещи пассажиров могут не поместиться || багажник переполнен. Пожалуйста, освободите место для багажа пассажиров
        "שימוש יתר בפונקציות השירות לביצוע בדיקת איכות לפי תמונה",//злоупотребление функциями сервиса на фотоконтроле
        "לוחית הרישוי מוסתרת",//часть госномера скрыта
        "המדבקה על השמשה האחורית לא עומדת בסטנדרט השירות (או) לא הצלחנו לבדוק מה המצב של השמשה האחורית של המונית",//оклейка на заднем стекле не соответствует стандартам сервиса (_или_) невозможно оценить состояние заднего стекла автомобиля
        "למונית אין לוחית רישוי",//на автомобиле нет госномера
        "יש הרבה מכות או שריטות פח",//сильные повреждения на кузове
        "אנחנו לא מקבלים לשירות מוניות עם 3 דלתות",//ваш автомобиль трёхдверный. Такие машины запрещены в сервисе
        "недопустимое содержание фотографий",//недопустимое содержание фотографий
        "משתמשים התלוננו על המראה של המונית מבחוץ (או) קשה לנו לבדוק מה מצב הצבע (או) המצב של המונית מבחוץ לא עומד בסטנדרטים של השירות שלנו",//внешний вид автомобиля не соответствует стандартам сервиса (_или_)  пользователи жалуются на внешний вид автомобиля (_или_) сложно оценить состояние лакокрасочного покрытия
        "לוחית הרישוי לא עומדת בסטנדרט השירות",//госномер не соответствует требованиям сервиса
        "היצרן, הדגם, הצבע והשנה לא נכונים. נציג תחנת המוניות יכול לעדכן את הפרופיל שלך",//марка, модель или год указаны неверно. Попросите ваш таксопарк обновить данные в профиле
        "צילום של מסך הוא הפרה חמורה של התנאים",//фотографирование ТС с экрана компьютера является грубым нарушением
        "צריך לטפל בבעיה. אם יהיו הפרות נוספות של תנאי השירות, ייתכן שנשעה זמנית את הגישה שלך לשירות",//Пожалуйста, устраните замечания. В случае повторных нарушений доступ к заказам может быть приостановлен
        "צריך לטפל בבעיה. אם תהיה הפרה דומה של תנאי השירות, ניאלץ להשעות את הגישה שלך לשירות",//Пожалуйста, устраните замечания. За следующее аналогичное замечания мы вынуждены будем приостановить доступ к заказам
        "משתמשים התלוננו על המראה של המונית מבחוץ (או) קשה לנו לבדוק מה מצב הצבע (או) המצב של המונית מבחוץ לא עומד בסטנדרטים של השירות שלנו",//внешний вид автомобиля не соответствует стандартам сервиса (_или_)  пользователи жалуются на внешний вид автомобиля (_или_) сложно оценить состояние лакокрасочного покрытия
        "המצב של המונית מבחוץ לא עומד בסטנדרטים של השירות שלנו",//несоответствие внешнего вида автомобиля стандартам сервиса
        'השתמשת בצמיג הרזרבי במקום בצמיג רגיל'//установлено малоразмерное колесо-докатка вместо стандартного
    ],
    Kot: [
    "la carrosserie et les poignées de portières sont sales",
    "carrosserie sale",
    "carrosserie sale. Veuillez nettoyer les poignées des portières des passagers et l'aile arrière près de la portière afin que le passager ne se salisse pas lors de la montée",
    "aucune photo des sièges ___ passagers",
    "il y a des objets étrangers ou de la saleté sur les tapis. Les tapis doivent être propres, sans journaux ni cartons",
    "les housses des sièges ne ressemblent pas à celles de voiture",
    "revêtement de la carrosserie ou marquage de marque très abîmés. Veuillez refaire le revêtement",
    "il y a des dégradations ___.",
    "les photos ne sont pas envoyées dans l'ordre. Ordre correct : 1) partie avant 2) côté gauche 3) partie arrière 4) côté droit 5) sièges avant 6) banquette arrière 7) coffre",
    "housses de voiture très abîmées. Veuillez réparer ou remplacer les housses",
    "— оклейка не соответствует стандартам сервиса",
    "le coffre est plein. Veuillez libérer de l'espace pour les bagages des passagers",
    "dans l’habitacle, il ne doit y avoir aucun étranger ou animal",
    "le véhicule n’est pas entièrement dans le cadre",
    "Pas assez de lumière sur la photo - utilisez le flash ou faites la photo pendant la journée",
    "les sièges passagers ne sont pas complètement dans le cadre",
    "la carrosserie et les poignées de portières sont sales",
    "aucune photo de la partie _____ du véhicule",
    "la photo n'est pas claire",
    "la carrosserie et les poignées de portières sont sales, les passagers peuvent se salir",
    "la photo est trop sombre. Il est préférable de choisir un lieu plus lumineux",
    "le véhicule de la photo ne coïncide pas à celui indiqué dans le profil. Votre gestionnaire de taxi peut actualiser les données du profil",
    "carrosserie sale. Veuillez nettoyer les poignées des portières des passagers et l'aile arrière près de la portière afin que le passager ne se salisse pas lors de la montée",
    "la plaque d'immatriculation n’était pas claire",
    "objets étrangers dans l’habitacle",
    "— на сиденьях накидки, непохожие на автомобильные чехлы",
    "revêtement de la carrosserie ou marquage de marque très abîmés. Veuillez refaire le revêtement",
    "— нет фотографии ___ части машины",
    "la carrosserie est très abîmée",
    "la plaque d'immatriculation __ indiquée est incorrecte. Le gestionnaire de taxi peut actualiser les données dans votre profil",
    "le coffre ne rentre pas complètement dans le cadre",
    "le coffre ne rentre pas complètement dans le cadre",
    "la marque, le modèle, l’année ou la couleur indiqués sont incorrects. Le gestionnaire de taxi peut actualiser les données dans votre profil",
    "aucune photo des sièges ___ passagers",
    "il y a des objets étrangers ou de la saleté sur les tapis. Les tapis doivent être propres, sans journaux ni cartons",
    "housses de voiture très abîmées. Veuillez réparer ou remplacer les housses",
    "— оклейка не соответствует стандартам сервиса",
    "— в багажнике посторонние предметы, вещи пассажиров могут не поместиться",
    "— злоупотребление функциями сервиса на фотоконтроле",
    "une partie de la plaque d'immatriculation est cachée",
    //"le collage sur la lunette arrière n’est pas conforme aux normes de service ",
    "le collage sur la lunette arrière n’est pas conforme aux normes de service ",
    "le véhicule ne comporte pas de plaque d'immatriculation",
    "revêtement de la carrosserie ou marquage de marque très abîmés. Veuillez refaire le revêtement",
    "Les voitures à trois (3) portes sont interdites avec Yango",
    "autocollants inacceptables",
    "non-conformité de l'aspect du véhicule aux normes de service ",
    "non-conformité de la plaque d'immatriculation aux exigences du service",
    "la marque, le modèle, l’année ou la couleur indiqués sont incorrects. Le gestionnaire de taxi peut actualiser les données dans votre profil",
    "la capture d'écran est une violation flagrante",
    "— Пожалуйста, устраните замечания. В случае повторных нарушений доступ к заказам может быть приостановлен",
    "— Пожалуйста, устраните замечания. За следующее аналогичное замечания мы вынуждены будем приостановить доступ к заказам",
    "non-conformité de l'aspect du véhicule aux normes de service ",
    "Inadéquation externe des normes standards de la voiture.",
    "Une roue de secours de petite taille est installée au lieu de la roue standard",
    "— кресло переднего пассажира недостаточно сдвинуто вперёд, либо спинка кресла откинута назад/не установлена вертикально",
    "— повреждены элементы брендирования",
    "Ceinture de sécurité absente des photos de l’intérieur",
    "Les voitures à trois (3) portes sont interdites avec Yango",
    ]
};
window.dict = dictionary
var allTemplates = {
    items: [{
        "Text": "— грязь на кузове"
    }, {
        "Text": "— грязь на кузове. Пожалуйста, протрите дверные ручки и зону на заднем крыле около двери, чтобы пассажир не испачкался при посадке"
    }, {
        "Text": "— сиденья испачканы"
    },{
        "Text": "— нет фото передних пассажирских сидений"
    },{
        "Text": "— посторонние предметы или грязь на ковриках. Коврики должны быть чистыми, на них не должно быть газет и картонок"
    }, {
        "Text": "— на сиденьях не должно быть ничего, кроме специальных автомобильных чехлов"
    }, {
        "Text": "— не видно состояние кузова из-за снега"
    }, {
        "Text": "— сильное повреждение покрытия кузова или оклейки"
    }, {
        "Text": "— есть повреждения __"
    }, {
        "Text": "— фотографии отправлены не по порядку. Правильная последовательность: 1) передняя часть 2) левый бок 3) задняя часть 4) правый бок 5) передний ряд сидений 6) задний ряд сидений 7) багажник"
    }, {
        "Text": "— автомобильные чехлы в плохом состоянии"
    }, {
        "Text": "— не видно ремни и/или замки безопасности на задних сиденьях"
    }, {
        "Text": "— оклейка не соответствует стандартам сервиса"
    }, {
        "Text": "— багажник переполнен. Пассажирам может понадобиться место для вещей"
    }, {
        "Text": "— в салоне автомобиля не должно быть посторонних людей и животных"
    }, {
        "Text": "— машина не полностью попал в кадр"
    }, {
        "Text": "— в салоне слишком темно. Пользуйтесь вспышкой или выберите более освещённое место"
    }, {
        "Text": "— пассажирские сиденья не полностью попали в кадр"
    }, {
        "Text": "— грязь на кузове"
    }, {
        "Text": "— нет одной или нескольких фотографий машины"
    }, {
        "Text": "— изображение нечёткое"
    }, {
        "Text": "— грязный кузов и дверные ручки — пассажиры могут испачкаться"
    }, {
        "Text": "— фото слишком тёмное. Выберите более освещённое место"
    }, {
        "Text": "— на фото не та машина, которая указана в профиле. Попросите ваш парк обновить данные"
    }, {
        "Text": "— грязные сиденья"
    }, {
        "Text": "— госномер получился нечётко или не попал в кадр"
    }, {
        "Text": "— посторонние предметы в салоне"
    }, {
        "Text": "— на сиденьях накидки, непохожие на автомобильные чехлы"
    }, {
        "Text": "— сильные повреждения покрытия кузова или оклейки"
    }, {
        "Text": "— нет фотографии ___ части машины"
    }, {
        "Text": "— есть повреждения кузова"
    }, {
        "Text": "— госномер указан неверно. Попросите ваш таксопарк обновить данные в профиле"
    }, {
        "Text": "— багажник не полностью попал в кадр"
    }, {
        "Text": "— марка, модель или год указаны неверно. Попросите ваш таксопарк обновить данные в профиле"
    }, {
        "Text": "— нет фотографий задних пассажирских сидений"
    }, {
        "Text": "— посторонние предметы или грязь на ковриках"
    }, {
        "Text": "— сильное повреждение автомобильных чехлов"
    }, {
        "Text": "— оклейка не соответствует стандартам сервиса"
    }, {
        "Text": "— багажник переполнен, вещи пассажиров могут не поместиться"
    }, {
        "Text": "— злоупотребление функциями сервиса на фотоконтроле"
    }, {
        "Text": "— часть госномера скрыта"
    }, {
        "Text": "— оклейка на заднем стекле не соответствует стандартам сервиса (_или_) невозможно оценить состояние заднего стекла машины"
    }, {
        "Text": "— на машине нет госномера"
    }, {
        "Text": "— фотографирование ТС с экрана компьютера является грубым нарушением"
    }, {"Text": "— Пожалуйста, устраните замечания. В случае повторных нарушений доступ к заказам может быть приостановлен",
    }, {"Text": "— Пожалуйста, устраните замечания. За следующее аналогичное замечания мы вынуждены будем приостановить доступ к заказам",
    }, {"Text": "— внешний вид машины не соответствует стандартам сервиса (_или_) пользователи жалуются на внешний вид автомобиля (_или_) сложно оценить состояние лакокрасочного покрытия",
    }, {"Text": "— номер не попал в кадр. При фотографировании содержимого кузова госномер должен быть в кадре",
    }, {"Text": "— в кузове есть груз. Кузов должен быть пустым"
    }, {"Text": "— несоответствие внешнего вида автомобиля стандартам сервиса"
    }, {"Text": "— на этом автомобиле можно выполнять заказы только в тарифах «Курьер» и «Доставка»"
    }, {"Text": "— грязь или беспорядок в багажнике"},
       {"Text": "— кресло переднего пассажира недостаточно сдвинуто вперёд, либо спинка кресла откинута назад/не установлена вертикально"},
       {"Text": "— цвет указан неверно. Попросите ваш таксопарк обновить данные в профиле"},
       {"Text": "— повреждены элементы брендирования"},
       {"Text": "несоответствия госномера требованиям сервиса"},
       {"Text": "— посторонние предметы в системе ремней безопасности"},
       ]
};

function refreshSelect() {
    select.removeAttribute('disabled');
    select.style.backgroundColor = '#ffffff';
    select.value = 'Russian';
    allListCB.checked = false;
    allList.style.opacity = '1';
};

function disableSelect() {
    select.setAttribute('disabled', '');
    select.style.backgroundColor = '#808080';
};

function translate() {
    var list = scrollPanel.firstChild.children;
    for (var i = 0; i < list.length; i++) {
        var index = dictionary['Russian'].indexOf(list[i].innerText);
        if (index >= 0) {
            if (list[i].dataset.value == dictionary[select.value][index]) return;
            list[i].dataset.value = dictionary[select.value][index];
            list[i].removeAttribute('data-key')
        };
    };
    //selectPart.style.display = 'block'
};

//своя модалка
const modal = `<div class="modal" id="MyModalInQuest" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" id="closeModal" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Поставить метку Эмулятор или Гос.Номер?</h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" id="btnEmul">Эмулятор</button>
        <button type="button" class="btn btn-primary" id="btnNumberFrod">Гос.Номер</button>
      </div>
    </div>
  </div>
</div>`

document.querySelector('.container-app').insertAdjacentHTML('beforebegin', modal)
document.getElementById('MyModalInQuest').style.margin = '80px auto'

const closeModal = () => {
    document.getElementById('MyModalInQuest').style.display = 'none'
}

document.getElementById('btnEmul').addEventListener('click', () => {
    closeModal()
    let val = 'emulator'
    $(`input[value=${val}]`).parent().click();
})

document.getElementById('closeModal').addEventListener('click', () => {
    closeModal()
})

document.getElementById('btnNumberFrod').addEventListener('click', () => {
    closeModal()
    let val = 'fake_car_number'
    $(`input[value=${val}]`).parent().click();

})

function openModalQuestion(val) {
    if (val.textContent === 'злоупотребление функциями сервиса на фотоконтроле') {
        document.getElementById('MyModalInQuest').style.display = 'block'
    }
}

function WriteAllList() {
    if (allListCB.checked) {
       $('#comment-list>ul>li').detach();
        allTemplates.items.forEach(function(val){
            $('#comment-list>ul').append($('<li/>',{
                class:'list-group-item',
                'data-value':val['Text'],
                text:val['Text']
            }))
        });
        $(".list-group-item").click(function() {
            var value = $(this).data("value");
            if ($("#msg").val() === "") {
                $("#msg").val(value);
                openModalQuestion(this)
            }
            else {
                $("#msg").val($("#msg").val() + ",\n" + value);
                openModalQuestion(this)
            }
        });
        translate();
        allList.style.opacity = '0.5';
    }
};

document.getElementById('btn-block').addEventListener('click', () => {
    const li = document.querySelector('li[data-value="злоупотребление функциями сервиса на фотоконтроле"]')
    li.addEventListener('click', function() {
        openModalQuestion(this)
    })
})

select.style = 'float:right; margin: 5px 0';
select.innerHTML = '<option value="Russian">РФ</option><option value="Azerbian">Азербайджан</option><option value="Georgian">Грузия</option><option value="Kyrgyz">Киргизия</option><option value="Uzbek">Узбекистан</option><option value="Latvian">Латвия</option><option value="Lithuanian">Литва</option><option value="Estonian">Эстония</option><option value="Romanian">Румыния/Молдова</option><option value="Serbian">Сербия</option><option value="Slovenian">Словения</option><option value="English">Англия</option><option value="Armenian">Армения</option><option value="Israel">Израиль</option><option value="Kot">Кот-д’Ивуар</option>'
toolspanel.style = 'display: block; width: 100%; height: 30px; padding: 2px 0px';
allList.style = 'float:right; margin-right: 10px'
allListCB.type = 'checkbox';
allListCB.value = 'Полный список';
allListCB.style = 'margin: 5px 2px 0 0; height:15px; width:15px;cursor: pointer';
allListLabel.style = 'vertical-align: middle;cursor: pointer';
allListLabel.innerText = 'Полный список';
select.onchange = translate;
buttonDiv.children[0].onclick = refreshSelect;
buttonDiv.children[1].onclick = refreshSelect;
scrollPanel.onclick = disableSelect;
allList.onclick = function() {
    allListCB.checked = true;
    WriteAllList();
    markTemplates()
};
allList.appendChild(allListCB);
allList.appendChild(allListLabel);
toolspanel.appendChild(select);
toolspanel.appendChild(allList);
form.insertBefore(toolspanel, scrollPanel);
document.getElementById('btn-block').after(document.getElementById('btn-ok-remarks'))
document.getElementById('btn-ok-remarks').style.marginLeft = '5px'

//++автоматическое открытие стран перевода
const cities = {
    Azerbian: ["Баку"],
    Kyrgyz: ["Бишкек","Ош"],
    Georgian: ["Батуми","Кутаиси","Рустави","Тбилиси"],
    Uzbek: ["Ташкент", "Наманган", "Фергана"],
    Latvian: ["Рига", "Даугавпилс", "Лиепая", "Валмиера", "Вентспился", "Елгава"],
    Lithuanian: ["Вильнюс"],
    Estonian: ["Таллин","Тарту"],
    Moldova: ["Кишинёв"],
    Serbian: ["Белград", "Нови-Сад"],
    Armenian: ["Араратская область","Ванадзор","Горис","Гюмри","Ереван","Капан","Котайкская область", "Армавирская область"],
    Romanian: ["Бухарест"],
    Findland: ["Хельсинки"],
    Israel: ["Тель-Авив", "Яффо", "Раана", "Герцлия", "Нетания", "Хайфа", "Ашкелон", "Ашдод"],
    Kot: ["Абиджан"]
}

let city

$(document).bind('item_info', function (e, params) {
    city = params.city;
    //console.log(city)
});

function cityOf (a) {
    switch (a) {
        case 'Azerbian' : {
            select.selectedIndex = 1
            nullString()
            selectPart.style.display = 'block'
            part.forEach(item => {
                if (item.section === 'левой фары' || item.section === 'правой фары') {
                    return
                } else {
                    convertPart(item, item.az)
                }
            })
            break
        }
        case 'Kyrgyz' : {
            select.selectedIndex = 3
            nullString()
            selectPart.style.display = 'block'
            part.forEach(item => {
                if (item.section === 'левой фары' || item.section === 'правой фары') {
                    return
                } else {
                    convertPart(item, item.kgz)
                }
            })
            break
        }
        case 'Georgian' : {
            select.selectedIndex = 2
            nullString()
            selectPart.style.display = 'block'
            part.forEach(item => {
                if (item.section === 'левой фары' || item.section === 'правой фары') {
                    return
                } else {
                    convertPart(item, item.geo)
                }
            })
            break
        }
        case 'Uzbek' : {
            select.selectedIndex = 4
            nullString()
            selectPart.style.display = 'block'
            part.forEach(item => {
                if (item.section === 'левой фары' || item.section === 'правой фары') {
                    return
                } else {
                    convertPart(item, item.uzb)
                }
            })
            break
        }
        case 'Latvian' : {
            selectPart.style.display = 'none'
            select.selectedIndex = 5
            nullString()
            break
        }
        case 'Lithuanian' : {
            nullString()
            select.selectedIndex = 6
            selectPart.style.display = 'none'
            break
        }
        case 'Estonian' : {
            nullString()
            select.selectedIndex = 7
            selectPart.style.display = 'block'
            part.forEach(item => {
                if (item.section === 'левой фары' || item.section === 'правой фары') {
                    return
                } else {
                    convertPart(item, item.est)
                }
            })
            break
        }
        case 'Moldova' : {
            nullString()
            select.selectedIndex = 8
            selectPart.style.display = 'none'
            break
        }
        case 'Serbian' : {
            nullString()
            select.selectedIndex = 9
            selectPart.style.display = 'none'
            break
        }
        case 'Armenian' : {
            nullString()
            select.selectedIndex = 12
            selectPart.style.display = 'block'
            part.forEach(item => {
                if (item.section === 'фары') {
                    return
                } else {
                    convertPart(item, item.am)
                }
            })
            break
        }
        case 'Romanian' : {
            nullString()
            select.selectedIndex = 8
            selectPart.style.display = 'none'
            break
        }
        case 'Israel': {
            nullString()
            select.selectedIndex = 13
            selectPart.style.display = 'block'
            part.forEach(item => {
                if (item.section === 'фары') {
                    return
                } else {
                    convertPart(item, item.isr)
                }
            })
            break
        }
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

const nullString = () => {
    selectPart.innerHTML = `<option>Выберите часть</option>`
}
const openCity = () => {
    console.log(city)
    selectPart.style.display = 'block'
    selectPart.innerHTML = ''
    ifCity()
    translate()
    nullString()
    selectPart.style.background = '#808080'
    part.forEach(item => {
        if (item.section === 'левой фары' || item.section === 'правой фары') {
            return
        } else {
            convertPart(item, item.section)
        }
    })
    selectPart.disabled = true
}

//++автоматическое подставление
const selectPart = document.createElement('select'),
      part = [
          {section: 'передних',
          az: 'ön',
          geo: 'წინა',
          kgz: 'алдыңкылар',
          uzb: 'old',
          est: 'eesmisi',
          am: 'առջևի շարք',
          //isr: ''
          },

          {section: 'задних',
          az: 'arxa',
          geo: 'უკანა',
          kgz: 'арткылар',
          uzb: 'orqa',
          est: 'tagumisi',
          am: 'հետևի շարք',
          //isr: ''
          },

          {section: 'Передней',
          az: 'ön',
          geo: 'წინა',
          kgz: 'Алдыңкы',
          uzb: 'oldingi',
          est: 'Eesmist',
          am: 'Առջև',
          isr: 'קדמי'},

          {section: 'Левой',
          az: 'sol',
          geo: 'მარცხენა',
          kgz: 'Сол',
          uzb: 'chap',
          est: 'Vasakpoolset',
          am: 'ձախ',
          isr: 'שמאלי'},

          {section: 'Задней',
          az: 'arxa',
          geo: 'უკანა',
          kgz: 'Арткы',
          uzb: 'orqa',
          est: 'Tagumist',
          am: 'հետև',
          isr: 'אחורי'},

          {section: 'Правой',
          az: 'sağ',
          geo: 'მარჯვენა',
          kgz: 'Оң',
          uzb: 'o‘ng',
          est: 'Parempoolset',
          am: 'աջ',
          isr: 'ימני'},

          {section: 'багажника',
          az: 'gövdə',
          geo: 'საბარგული',
          kgz: 'багажник',
          uzb: 'yukxonasi',
          est: 'pakiruumi',
          am: 'բեռնախցիկի',
          isr: 'תא המטען'},

          {section: 'фары',
          az: 'faraların',
          geo: 'ფარები',
          kgz: 'фаралар',
          uzb: 'yoritish chiroqlari',
          est: 'tuled',
          //am: 'НАДО СКОПИРОВАТЬ!'
          },

          {section: 'переднего бампера',
          az: 'ön bamperı',
          geo: 'წინა ბამპერი',
          kgz: 'алдыңкы бампер',
          uzb: 'old bamperi',
          est: 'esipõrkeraual',
          am: 'առջեւի բամպերի',
          isr: 'פגוש קדמי'},

          {section: 'заднего бампера',
          az: 'arxa bamperı',
          geo: 'უკანა ბამპერი',
          kgz: 'арткы бампер',
          uzb: 'orqa bamperi',
          est: 'tagapõrkeraual',
          am: 'հետեւի բամպերի',
          isr: 'פגוש אחורי'},

          {section: 'двери',
          az: 'qapının',
          geo: 'კარები',
          kgz: 'эшиктер',
          uzb: 'eshigi',
          est: 'ukse',
          am: 'դռան',
          isr: 'דלת'},

          {section: 'радиаторной решётки',
          az: 'radiator reşotkasının',
          geo: 'ცხაური',
          kgz: 'радиатор тору',
          uzb: 'ningradiator panjarasi',
          est: 'radiaatorivõre',
          am: 'Ռադիատոր վանդակի',
          isr: 'גריל הרדיאטור'},

          {section: 'крышки багажника',
          az: 'baqajnik qapısının',
          geo: 'მაგისტრალური სახურავი',
          kgz: 'багажниктин жапкычы',
          uzb: 'yukxona qopqog‘i',
          est: 'pakiruumi kaane',
          am: 'միջքաղաքային կափարիչի',
          isr: 'מכסה תא המטען'},

          {section: 'крышки капота',
          az: 'başlığ qapağında',
          geo: 'სარქველი',
          kgz: 'капоттун жапкычы',
          uzb: 'kapot qopqog‘i',
          est: 'kapotikaane',
          am: 'կապոտի',
          isr: 'מכסה המנוע'},

          {section: 'фонаря',
          az: 'fənərin',
          geo: 'განათებები',
          kgz: 'фонарь',
          uzb: 'chirog‘i',
          est: 'laterna',
          am: 'լուսարձակների',
          isr: 'האור בתא הנוסעים'},

          {section: 'зеркала заднего вида',
          az: 'arxa görünüş güzgüsünün',
          geo: 'სარკი',
          kgz: 'артты көрсөтүүчү күзгү',
          uzb: 'orqani ko‘rish ko‘zgusi',
          est: 'tahavaatepeegel',
          am: 'հետեւի հայելիի',
          isr: 'מראה אחורית'},

          {section: 'крыла',
          az: 'qanadın',
          geo: 'ფრთი',
          kgz: 'крылосу',
          uzb: 'qanoti',
          est: 'tiiva',
          am: 'թեւի',
          isr: 'כנף'},

          {section: 'левой фары',
           am: 'ձախ լուսարձակողի',
           isr: 'פנס ראשי/אחורי משמאל'
          },

          {section: 'правой фары',
           am: 'աջ լուսարձակողի',
           isr: 'פנס ראשי/אחורי מימין'
          }
      ]

toolspanel.append(selectPart)
selectPart.style.margin = '5px'

const convertPart = (item, translate) => {
    selectPart.innerHTML += `<option class="option-part" value='${translate}'>${item.section}</option>`
}

document.getElementById('btn-block').addEventListener('click', () => openCity())
document.getElementById('btn-ok-remarks').addEventListener('click', () => openCity())
document.getElementById('btn-blacklist').addEventListener('click', () => openCity())

select.addEventListener('change', () => {
    selectPart.innerHTML = ''
    cityOf(select.value)
})

let message = document.getElementById('msg').value

const convertMessage = (option) => {
    let message = document.getElementById('msg').value
    let stringIndexStart,
        stringIndexEnd
    if (message.includes('(_')) {
            stringIndexStart = message.indexOf('(_')
            document.getElementById('msg').value = message.slice(0, stringIndexStart) + '(' + option.value + ' ' + message.slice(stringIndexStart+2)
            //console.log(message.slice(0, stringIndexStart)+target.value+' '+message.slice(stringIndexStart+1))
        } else if (message.includes('_)')) {
            stringIndexStart = message.indexOf('_)')
            document.getElementById('msg').value = message.slice(0, stringIndexStart)+' ' +option.value+message.slice(stringIndexStart+1)
            //console.log(message.slice(0, stringIndexStart)+' ' +target.value+message.slice(stringIndexStart+1))

        } else if (message.includes('_')) {
            let stringIndexStart = message.indexOf('_'),
                stringIndexEnd = message.lastIndexOf('_')
            document.getElementById('msg').value = message.slice(0, stringIndexStart)+option.value+message.slice(stringIndexEnd+1)
            //console.log(message.slice(0, stringIndexStart)+target.value+message.slice(stringIndexEnd+1))
        }
}


scrollPanel.addEventListener('click', (event) => {
    let target = event.target
    if (target.dataset.value.includes('_')) {
        selectPart.disabled = false
        selectPart.style.background = '#fff'
        cityOf(select.value)
    }
})

selectPart.addEventListener('change', (event) => {
  let target = event.target,
      selectedIndexPart = target.selectedIndex
  for (let i = 0; i < selectPart.options.length; i++) {
      if (selectedIndexPart > 0) {
          convertMessage(target)
          selectPart.options.selectedIndex = 0
          break
      }
  }
})

//подстветка шаблонов
let div = document.createElement('div')
div.style = 'float: left; max-width: 690px;'
document.querySelector('.modal-footer').append(div)
function markTemplates() {
    div.innerHTML = ''
    let history = document.querySelectorAll('#history table tr')
    let result = []
    if (history.length > 0) {
        history.forEach(i => {
            let obj = {
                asessor: i.querySelector('span.gray').textContent.replace(/— /, ''),
                status: !!i.querySelector('.status-icon-ok') ? 'ok' : !!i.querySelector('.status-icon-fake') ? 'block': 'blacklist',
                resolution: !!i.querySelector('.gray.clearfix') ? i.querySelector('.gray.clearfix').textContent.trim().replace(/,\n/g, '\n').split('\n').map(i => i.replace(/\s?—\s?/,'')) : ''
            }
            result.push(obj)
        })
        let arrList = Array.from(document.querySelectorAll('li.list-group-item'))
        for(let i = 0; i < result.length; i++){
            let {asessor, resolution, status} = result[i]
            if( asessor=== 'Toloka' || asessor === 'ml_Calvin') {
                continue
            } else {
                div.innerHTML = `asessor: <span style="font-size: 11px;">${asessor}</span> status: <span style="font-size: 11px; ">${status}</span> resolution: <span style="font-size: 11px;">${resolution === '' ? '' : resolution.join('; ')}</span>`
                arrList.forEach(li => {
                    let str = li.textContent.replace(/\n— /,'').replace(/— /,'')
                    if (resolution.includes(str)) {
                        li.style.backgroundColor = status === 'ok' ? '#4cae4c' : status === 'block' ? '#eea236' : '#d43f3a'
                    }
                })
                break
            }
        }
    }
}

document.getElementById('btn-blacklist').addEventListener('click', markTemplates)
document.getElementById('btn-block').addEventListener('click', markTemplates)
document.getElementById('btn-ok-remarks').addEventListener('click', markTemplates)
//
const tree = document.getElementById('category')
function blockTree() {
    setTimeout(() => {
        const treeValue = tree.selectedOptions[0].value
        document.getElementById('pool-order').disabled = false
        if (treeValue === 'DkkCommonBlock' || treeValue === 'DkkTariffsBlock' || treeValue === 'DkkPriorityTariffsBlock' || treeValue === 'DkkPriorityBlock'){

            localStorage.setItem('pool-order', 'ascending')
            document.getElementById('pool-order').value = 'ascending'
            window.update();
            document.getElementById('pool-order').disabled = true
        }
    }, 500)
}
blockTree()
tree.addEventListener('change', blockTree)