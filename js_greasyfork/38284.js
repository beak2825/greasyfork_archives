// ==UserScript==
// @author         IIIeka, pitr, Specious, donotdisturb
// @name           Wikimapia UserScript
// @version        5.0.0
// @date           2012-05-22
// @description    Advanced place and polygon edit functions, user interface optimization for quick access and many more... // Дополнительные функции для редактирования объектов и их контуров, оптимизация интерфейса для быстрого доступа к функциям и многое другое
// @include        http://wikimapia.org/*
// @include        http://*wikimapia.org/*
// @include        http://wikimapia.org:81/*
// @include        http://*wikimapia.org:81/*
// @namespace https://greasyfork.org/users/169947
// @downloadURL https://update.greasyfork.org/scripts/38284/Wikimapia%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/38284/Wikimapia%20UserScript.meta.js
// ==/UserScript==

if ((window.location.href.indexOf('wikimapia.org')>-1)&&(window.location.href.indexOf('ifr=1')==-1)&&(window.location.href.indexOf('/forum/')==-1))
{
WUS=[];
WUS.v='5.0.0'; WUS.d='2012.05.22';

function WUSgetLng(){
	var c=" "+document.cookie; var s=" lng=", r='', o=0, e=0;
	if (c.length>0){
		o=c.indexOf(s);
		if (o!=-1){ o+=s.length; e=c.indexOf(";",o); e=(e==-1)?c.length:e; r=unescape(c.substring(o,e)); }
	}
	return(r);
}
WUS.l = (navigator.language||navigator.systemLanguage||navigator.userLanguage||'en').substr(0,2).toLowerCase();
WUS.l = (WUS.l=='ru')?'1':(WUS.l=='uk')?'37':'0';
WUS.lwm = WUSgetLng();
WUS.ls = (typeof localStorage == "undefined")?-1:localStorage.getItem('WMUS_lang');
WUS.ls =(WUS.ls=='null')?-1:WUS.ls;
WUS.l = (WUS.ls&&WUS.ls!='-1')?WUS.ls:WUS.lwm?WUS.lwm:WUS.l;
//##########   Default language variables   ############################
WUS.T={ 
LastTag:'Open the last viewed tag',
Max:	'Maximize/restore window size',
NewTab:	'Open in new browser tab',
gt:		'GO TO',
i:		'Show script information',
mes:	'New messages',
c:		'Copy',
p:		'Paste',
lay:	'Map layer; Satellite; Wikimapia hybrid; Wikimapia map; Places layer; All places; Polygons; Rectangles; Deleted places; Special layers; Historical places; Status grid',
srch:	'Address; Google; Yandex; Yahoo!; Bing; Wikipedia',
Rsegsel:'Return to segment selection',
LTa:	'Apply',
LTc:	'Cancel',
LTp:	'Transform parameters',
home:	'www.webmap-en.clan.su/forum/2',
homeT:	'Go to UserScript homepage',
about:	'Advanced place and polygon editing functions, user interface optimization for quick access, and many more... <br><br>Thanks:<br>Idea and original development by <b>pitr</b><br>Certain fragments of source code have been adapted from WikiMapper Plus add-on by <b>Specious</b><br>Consultations and translation into English by <b>donotdisturb</b>',
inLP:	'Open in side panel',
updOK:	'updated successfully. Current version',
updI:	''
};
//#####   Переменные для русского языка интерфейса   #################
if(WUS.l=='1')WUS.T={
LastTag:'Открыть последний просмотренный объект',
Max:	'Развернуть окно / восстановить размер',
NewTab:	'Открыть в новой вкладке браузера',
gt:		'ПЕРЕЙТИ',
i:		'Показать информацию о скрипте',
mes:	'Новые сообщения',
c:		'копировать',
p:		'вставить',
lay:	'Слой карты; Вид со спутника; Гибрид Wikimapia; Карта Wikimapia; Слой объектов; Контуры и рамки; Контуры; Рамки; Удалённые объекты; Специальные слои; Исторический слой; Статусная сетка',
srch:	'Адрес; Google; Яндекс; Yahoo!; Bing; Википедия',
Rsegsel:'Вернуться к выбору сегмента',
LTa:	'Преобразовать',
LTc:	'Отменить преобразование',
LTp:	'Параметры преобразования',
home:	'www.webmap.clan.su/forum/18',
homeT:	'Перейти на страницу скрипта',
about:	'Дополнительные функции для редактирования объектов и их контуров, оптимизация интерфейса для быстрого доступа к функциям и многое другое<br><br>Благодарности:<br>Автор идеи и первых версий скрипта <b>pitr</b><br>Часть функций взята из Wikimapper Plus, автор <b>Specious</b><br>Перевод и консультации <b>donotdisturb</b>',
inLP:	'Открыть в боковой панели',
updOK:	'успешно обновлён. Текущая версия',
updI:	''
};
//#####    Змінні для української мови інтерфейсу    #############
else if(WUS.l=='37')WUS.T={
LastTag:'Відкрити вікно попереднього об\'єкту',
Max:	'Развернути вікно / відновити розмір',
NewTab:	'Відкрити у новій вкладці браузеру',
gt:		'ПЕРЕЙТИ',
i:		'Відобразити інформацію про скрипт',
mes:	'Нові повідомлення',
c:		'копіювати',
p:		'вставити',
lay:	'Шар карти; Вид з супутника; Гібрид Wikimapia; Карта Wikimapia; Шар об\'єктів; Контури та рамки; Контури; Рамки; Видалені об\'єкти; Спеціальні шари; Історичні об\'єкти; Статусна сітка',
srch:	'Адреса; Google; Яндекс; Yahoo!; Bing; Вікіпедія',
Rsegsel:'Задати кількість точок для малювання правильного багатокутника',
LTa:	'Перетворити',
LTc:	'Відмінити перетворення',
LTp:	'Параметри перетворення',
home:	'www.webmap.clan.su/forum/18',
homeT:	'Перейти на сторінку скрипта',
about:	'Додаткові функції для редагування об\'єктів та їх контурів, оптимізація інтерфейсу для швидкого доступу до функцій та багато іншого<br><br>Подяки:<br>Автор ідеї та перших версій скрипта <b>pitr</b><br>Частина функцій взята з Wikimapper Plus, автор <b>Specious</b><br>Переклад та консультації <b>donotdisturb</b>',
inLP:	'Відкрити в боковій панелі',
updOK:	'успішно оновлено. Поточна версія',
updI:	''
};

window.WUSfn=function(){
if (typeof WUS == "undefined") WUS=[];
WUS.l = (navigator.language||navigator.systemLanguage||navigator.userLanguage||'en').substr(0,2).toLowerCase();
WUS.l = (WUS.l=='ru')?'1':(WUS.l=='uk')?'37':'0';
WUS.ls= (typeof localStorage == "undefined")?-1:localStorage.getItem('WMUS_lang');
WUS.ls=(WUS.ls=='null')?-1:WUS.ls;
WUS.l = (WUS.ls&&WUS.ls!='-1')?WUS.ls:(config&&config.l)?config.l:WUS.l;

//#######################   Default language variables   ###################
WUS.t={
cOK:	'Place description copied',
pcOK:	'Polygon copied',
dotsN:	'Number of dots',
dotsD:	'Duplicate',
dotsDx:	'Remove duplicate dots',
dotsX:	'Deleted',
dotsM:	'Moved',
dotsS:	'Selected',
rotI:	'Drag marker to rotate polygon',
gtDescr:'Back to place description',
gtEdit:	'Edit this place',
CEPt:	'Paste last polygon; Copy polygon; Paste copied polygon; Load polygon from file; Flip polygon horyzontally; Flip polygon vertically; Rotate polygon; Fit polygon to window; Redraw polygon; Hide/show polygon vertices (right click: transparency); Select dots for batch moving (rectangular selection); Select dots for batch moving (partial selection of polygon); Transform polygon segments; Transform polygon into rectangle; Draw circle (right click: transform to circle); Draw square; Draw equilateral polygon',
CEPnod:	'Select number of dots',
LTc:	'Cancel',
LTr:	'Repeat last transformation',
LTi:	'Select polygon segment and then transformation method',
LTe:	'Must be more then 2 dots for trasform',
rectI:	'Transform polygon into rectangle: \n\nMethod 1. Point out all four vertices of a rectangular object as accurate as possible and click Rectangle to align polygon sides.\n\nMethod 2. Point out three vertices of a rectangular object. Click Rectangle to align polygon sides and complete the rectangle.',
Addr:	'Address found',
AddrE:	'No matches found at the address "%"!',
dSelM:	'Drag rectangle with dots inside to a new location',
dSelX:	'Delete selected dots',
dSelS:	'Drag to select dots',
SGsT:	'Status Grid settings',
SGsF:	'Cells fill',
SGsB:	'settings',
SGsS:   'No fill; ; Quality value; Number of places; Roads length, km; Road segments per km; ; Number of places without polygon; Number of places with 3-dot polygon; Number of places without category; Number of buildings without address; Number of places without description; Number of places without photos; Number of unapproved revisions; Number of places with unapproved revisions; ; Percent of places without polygon; Percent of places with 3-dot polygon; Percent of places without category; Percent of buildings without address; Percent of places without description; Percent of places without photos; Percent of places with unapproved revisions',
area:	'Area; m²; ar; ha; km²; yd²; ft²; ac; mi²',
Rot:	'Rotate angle',
Map:	'Map resources; Google Maps; Panoramio; mail.ru maps; Bing Maps; Yandex Maps; Yandex Popular Map; Yandex.Planes; Yandex.Trains; GdeEtotDom.ru; WWII aerial maps; maps.vlasenko.net; eAtlas; CloudMade Maps; OpenStreetMap; WikiMiniAtlas; Nokia Maps; Yahoo Maps; MapQuest; Meta Maps; Bigmir)net maps; GlobalGuide; Double GIS; Visicom; Maplink Apontador; Streetmaps.co.za; Point.md; Marine Traffic; Webcams.travel; Maps Ask.com; TerraServer; DayLightMap; Tagzania; Flickr; ViaMichelin; ACME Mapper; Mapy.cz; Flight Radar; Blue Marble Navigator; Flash Earth; GeoNames; Maps For Free; Rosreestr Portal; Shaded Relief; Rambler; Emapa; Kosmosnimki.ru; TomTom; 45F.ru; LatLon.org; New Wikimapia; GeoHack; Google Earth (kml)',
Opt:	'Hide site menu; Hide buttons and zoom control; Hide UserScript Buttons; Double click for zoom in; Highlight headers in watchlists; Highlight my nick and guests; Decrease font size in watchlists',
save:	'Save settings',
LoadI:	'Open KML file with Notepad, copy all it content and paste here',
LoadE:	'Coordinates not found',
Wmove:	'Move window',
Wresz:	'Resize window',
RBP:	'Watchlists; Nearest places; Nearest streets; Contacts; UserScript settings',
LBP:	'Refresh map; Previous view; Layers; Map resources; Map manager',
S_t:	'Polygon; Map resources; Layers; Options; Save',
S_0g:	'Default; Edit mode; Showing category; Nearest places',
S_0t:	'Fill color; Fill opacity; Line color; Line width',
S_1: 	'Apply for all / set default',
WP:		'en.wikipedia.org',
Ya:		'www.yandex.com'
};
//###################   Переменные для русского языка интерфейса   ###################
if(WUS.l=='1')WUS.t={
cOK:	'Описание объекта скопировано',
pcOK:	'Контур скопирован',
dotsN:	'Количество точек',
dotsD:	'Дублирующих',
dotsDx:	'Удалить дублирующие точки',
dotsX:	'Удалено',
dotsM:	'Перемещено',
dotsS:	'Выделено',
rotI:	'Для вращения контура переместите маркер',
gtDescr:'Вернуться к описанию объекта',
gtEdit:	'Перейти к редактированию объекта',
CEPt:	'Дублировать последний редактированный контур; Копировать контур; Вставить скопированный контур; Загрузить контур из файла; Отразить контур горизонтально; Отразить контур вертикально; Вращение контура; Вписать в размер окна; Удалить все точки контура; Скрыть/отобразить маркеры вершин контура (правый клик: прозрачность); Переместить или удалить группу точек (прямоугольное выделение); Переместить или удалить группу точек (выделение части контура); Преобразовать сегменты контура; Преобразовать контур в прямоугольник; Нарисовать окружность (правый клик: преобразовать в окружность); Нарисовать квадрат; Нарисовать правильный многоугольник',
CEPnod:	'Выбирите количество точек',
LTc:	'Отменить преобразование',
LTr:	'Повторить последнее преобразование',
LTi:	'Выберите сегмент контура, а затем способ преобразования',
LTe:	'Для преобразования количество точек должно быть больше двух',
rectI:	'Преобразование контура в прямоугольник: \n\nСпособ 1. Укажите как можно точнее все четыре вершины прямоугольного объекта и нажмите «Прямоугольник» для выравнивания сторон контура.\n\nСпособ 2. Укажите три вершины прямоугольного объекта. Нажмите «Прямоугольник» для выравнивания сторон и дополнения контура до прямоугольника.',
Addr:	'Найденный адрес',
AddrE:	'Адрес "%" не найден!',
dSelM:	'Перетащить для перемещения рамки и точек внутри неё',
dSelX:	'Удалить выбранные точки',
dSelS:	'Перетащить для выделения группы точек',
SGsT:	'Настройки статусной сетки',
SGsF:	'Заливка ячеек',
SGsB:	'настройка',
SGsS:   'Нет заливки; ; Показатель качества; Количество объектов; Длина дорог, км; Участков на 1 км дорог; ; Количество объектов без контура; Количество объектов с контуром из 3 точек; Количество объектов без категорий; Количество зданий без адреса; Количество объектов без описания; Количество объектов без фотографий; Количество неподтверждённых правок; Кол-во объектов с неподтверждёнными правками; ; Процент объектов без контура; Процент объектов с контуром из 3 точек; Процент объектов без категорий; Процент зданий без адреса; Процент объектов без описания; Процент объектов без фотографий; Процент объектов с неподтверждёнными правками',
area:	'Площадь; м²; ар (соток); га; км²; ярдов²; футов²; акров; миль²',
Rot:	'Угол поворота',
Map:	'Ресурсы; Карты Google; Panoramio; Карты mail.ru; Карты Bing; Яндекс.карты; Народная карта; Яндекс.самолёты; Яндекс.поезда; ГдеЭтотДом.ru; Военное аэрофото; maps.vlasenko.net; eAtlas Единая карта; CloudMade Maps; OpenStreetMap; WikiMiniAtlas; Nokia Maps; Yahoo Maps; MapQuest; Мета Карты; Карты Bigmir)net; GlobalGuide; Дубль ГИС; Визиком; Maplink Apontador; Streetmaps.co.za; Point.md; Marine Traffic; Webcams.travel; Maps Ask.com; TerraServer; DayLightMap; Tagzania; Flickr; ViaMichelin; ACME Mapper; Mapy.cz; Flight Radar; Blue Marble Navigator; Flash Earth; GeoNames; Maps For Free; Портал Росреестра; Shaded Relief; Рамблер карты; Emapa; Космоснимки; TomTom; 45F.ru; LatLon.org; New Wikimapia; GeoHack; Google Earth (kml)',
Opt:	'Скрывать меню сайта; Скрывать кнопки и линейку масштаба; Скрывать кнопки UserScript; Увеличивать масштаб двойным кликом; Выделять заголовки в списке наблюдений; Выделять собственный ник и гостей; Уменьшить шрифт в списке наблюдений',
save:	'Сохранить настройки',
LoadI:	'Откройте KML файл с помощью текстового редактора, скопируйте всё его содержимое и вставьте сюда',
LoadI:	'Координаты не обнаружены',
Wmove:	'Переместить окно',
Wresz:	'Изменить размер окна',
RBP:	'Списки наблюдений; Список ближайших объектов; Список ближайших улиц; Список контактов; Настройки UserScript',
LBP:	'Обновить карту; Предыдущий вид; Слои; Картографические ресурсы; Диспетчер карт',
S_t:	'Контур; Ресурсы; Слои; Опции; Сохранение',
S_0g:	'Рабочий режим; Редактирование; Просмотр категорий; Ближайшие объекты',
S_0t:	'Цвет заливки; Прозрачность заливки; Цвет контура; Толщина линии',
S_1:	'Применить ко всем / выбрать стандартные',
WP:		'ru.wikipedia.org',
Ya:		'www.yandex.ru'
};
//############    Змінні для української мови інтерфейсу    ##################
else if(WUS.l=='37')WUS.t={
cOK:	'Опис об\'єкту скопійовано',
pcOK:	'Контур скопійовано',
dotsN:	'Кількість точок',
dotsD:	'Дублюючих',
dotsDx:	'Видалити дублюючі точки',
dotsX:	'Видалено',
dotsM:	'Переміщено',
dotsS:	'Виділено',
rotI:	'Для обертання контуру перетягніть маркер',
gtDescr:'Повернутися до вікна опису об\'єкту',
gtEdit:	'Перейти до редагування об\'єкта',
CEPt:	'Дублювати попередній контур; Копіювити контур; Вставити скопійований контур; Завантажити контур з файлу; Відобразити контур горизонтально; Відобразити контур вертикально; Обертання контуру; Вписати у размір вікна; Видалити усі точки контуру; Приховати/відобразити маркери вершин контуру (правий клік: прозорість); Перемістити або видалити групу точок (прямокутне виділення); Перемістити або видалити групу точок (виділення частини контура); Перетворення сегментів контуру; Перетворити контур у прямокутник; Намалювати коло (правий клік: перетворити у коло); Намалювати квадрат; Намалювати правильний багатокутник',
CEPnod:	'Виберіть кількість точок',
LTc:	'Відмінити перетворення',
LTr:	'Повторити останнє перетворення',
LTi:	'Виберіть відрізок контура а потім спосіб перетворення',
LTe:	'Для перетворення необхідно більше ніж дві точки',
rectI:	'Перетворення контуру у прямокутник: \n\nСпосіб 1. Укажіть якомога точніше усі чотири вершини прямокутного об\'єкту та натисніть «Прямокутник» для вірівнювання сторін контуру.\n\nСпосіб 2. Укажіть три вершини прямокутного об\'єкту. Натисніть «Прямокутник» для вирівнювання сторін та доповнення контуру до прямокутника.',
Addr:	'Знайдена адреса',
AddrE:	'Адресу "%" не знайдено!',
dSelM:	'Перетягніть для переміщення точок',
dSelX:	'Видалити вибрані точки',
dSelS:	'Перетягніть для виділення точок',
SGsT:	'Налаштування статусної сітки',
SGsF:	'Заливка клітинок',
SGsB:	'налаштування',
SGsS:   'Без заливки; ; Показник якості; Кількість об\'єктів; Довжина доріг, км; Сегментів на 1 км доріг; ; Кількість об\'єктів без контуру; Кількість об\'єктів із контуром з 3 точок; Кількість об\'єктів без категорій; Кількість будівель без адреси; Кількість об\'єктів без опису; Кількість об\'єктів без фотографій; Кількість непідтверджених правок; Кількість об\'єктів з непідтвердженими правками; ; Відсоток об\'єктів без контуру; Відсоток об\'єктів із контуром з 3 точок; Відсоток об\'єктів без категорій; Відсоток будівель без адреси; Відсоток об\'єктів без опису; Відсоток об\'єктів без фотографій; Відсоток об\'єктів з непідтвердженими правками',
area:	'Площа; м²; ар (соток); га; км²; ярдів²; футів²; акрів; миль²',
Rot:	'Кут повороту',
Map:	'Ресурси; Карти Google; Panoramio; Карти mail.ru; Карти Bing; Яндекс.карти; Народна карта; Яндекс.Літаки; Яндекс.Поїзди; ГдеЭтотДом.ru; Аерофото ВВВ; maps.vlasenko.net; eAtlas Едина карта; CloudMade Maps; OpenStreetMap; WikiMiniAtlas; Nokia Maps; Yahoo Maps; MapQuest; Мета Карти; Карти Bigmir)net; GlobalGuide; Дубль ГІС; Візіком; Maplink Apontador; Streetmaps.co.za; Point.md; Marine Traffic; Webcams.travel; Maps Ask.com; TerraServer; DayLightMap; Tagzania; Flickr; ViaMichelin; ACME Mapper; Mapy.cz; Flight Radar; Blue Marble Navigator; Flash Earth; GeoNames; Maps For Free; Росреєстр; Shaded Relief; Рамблер карти; Emapa; Космознімки; TomTom; 45F.ru; LatLon.org; New Wikimapia; GeoHack; Google Earth (kml)',
Opt:	'Приховувати меню сайту; Приховувати кнопки та лінійку масштабу; Приховувати кнопки UserScript; Збільшувати масштаб подвійним кліком; Виділяти заголовки у списку спостережень; Виділяти власний нік та гостей; Зменшити шрифт у списку спостережень',
save:	'Зберегти налаштування',
LoadI:	'Відкрийте KML файл за допомогою текстового редактора, скопіюйте все, що в ньому міститься, і вставте сюди.',
LoadE:	'Координати не знайдено',
Wmove:	'Перемістити вікно',
Wresz:	'Змінити розмір вікна',
RBP:	'Списки спостережень; Список найближчих об\'єктів; Список найближчих вулиць; Список контактів; Налаштування UserScript',
LBP:	'Оновити карту; Попереднє розташування; Шари; Картографічні ресурси; Диспетчер карт',
S_t:	'Контур; Ресурси; Шари; Опції; Збереження',
S_0g:	'Робочий режим; Редагування; Перегляд категорій; Найближчі об\'єкти',
S_0t:	'Колір заливки; Прозорість заливки; Колір контуру; Товщина лінії',
S_1:	'Застосувати до усіх / вибрати стандартні',
WP:		'uk.wikipedia.org',
Ya:		'www.yandex.ua'
};
WUS.N='Wikimapia UserScript',
WUS.w='jwindow',
WUS.m='movejwindow',
WUS.r='resizejwindow',
WUS.b='jwindow_body',
WUS.B='jwindow3_body';

function    _ge(obj){return document.getElementById(obj);}
function   _gtn(obj){return document.getElementsByTagName(obj)}
function   _gcn(obj){return document.getElementsByClassName(obj)}
function  _chck(obj){return _ge(obj).checked;}
function _gdisp(obj){return _ge(obj).style.display;}
function _sdisp(obj,val){_ge(obj).style.display = (val==1)?'':(val==0)?'none':val;}
function _j3HTML(p){_ge(WUS.B).innerHTML=p;};
function _dfcen(y,x){return bounds.getCenter().distanceFrom(_createLL(y,x))};
function _rlst(p){google.maps.event.removeListener(p)};
function  _getC(){return ceniconpol?ceniconpol.position:bounds.getCenter();};
function _createLL(y,x){return new google.maps.LatLng(y,x)}
function _MPpos(pos){markerz.push(new google.maps.Marker({position:pos,icon:iconr,draggable:true}));};
function  _MPxy(y,x){_MPpos(_createLL(y,x))};
function _Mupd(i){markerz[i].setMap(map); marker_pref(i);};
function _MPposUpd(pos,i){_MPpos(pos);_Mupd(i);};
function  _MPxyUpd(y,x,i){_MPxy(y,x); _Mupd(i);};
function  _Mremove(i){ markerz[i].setMap(null);	markerz.splice(i,1); remakeid();};
function _dist0(p1,p2){return Math.sqrt(p1*p1 + p2*p2)}
function getBody() {return (window.opera?document.documentElement:document.body);};
function clHeight(){return parseInt(getBody().clientHeight);};
function clWidth() {return parseInt(getBody().clientWidth);};
function jwWidth() {return parseInt(_ge(WUS.w).style.width);};
function jwHeight(){return parseInt(_ge(WUS.w).style.height);};
function retLft(id){return parseInt(_ge(id).style.left);};
function retTop(id){return parseInt(_ge(id).style.top);};
function setHgt(id,v){_ge(id).style.height=v;};
function setWdt(id,v){_ge(id).style.width=v;};
function setLft(id,v){_ge(id).style.left=v;};
function setTop(id,v){_ge(id).style.top=v;};
function iconURL(n){return 'http://www.webmap.clan.su/file/wmus/'+n+'.png'}
function  _chset(n){var i = (typeof localStorage == "undefined")?'':localStorage.getItem('WUS_S_o'); return i?i.split(',')[n]=='1':0}

(function(){

	var s={
		"RL":'overflow-y:auto; width:99%',
		"RL div":'font-Size:14px; line-height:17px; color:#000; background:#fff; padding:2px 7px; position:relative;',
		"RL div:hover":'background:#eee;',
		"RL div:hover > div":'display:block;',
		"RL div span":'cursor:pointer;',
		"RL div div":'display:none; position:absolute; right:0; top:-2; background:rgba(0,0,0,0);',
		"RL div div:hover":'background:rgba(0,0,0,0);',
		"RL div img":'padding:2px 5px; background:#eee; cursor:pointer;',
		"RL div img:hover":'background:#bbb;',
		"RLT":'position:relative; padding: 5px 10px; font-weight:bold; font-Size:18px; line-height:20px; color:#d71a1a; cursor:pointer;',
		"RLT img":'display:none;',
		"RLT:hover > img":'display:inline;',
		"RLL":'font-Size:11px; line-height:16px; margin:7px; text-align:center; width:77px; height:18px; border: 1px solid #aaa; float:left; cursor:default;',
		"RLI":'float:left; padding:7px; position:relative;',
		"RLI input":'width:187px; font-Size:12px; height:20px;',
		"RLI img":'width:16px; height:16px; margin-bottom:-3px; cursor:pointer; opacity:0.7;',
		"RLI img:hover":'opacity:1;',
		"RLKW":'overflow-y:auto; overflow-x:hidden; width:172px; position:absolute; right:35px; top:26px; z-index:99999; background:white; font-size:12px; border: 1px solid #aaaaaa; cursor:pointer;',
		"RLKW div":'background:#fff; padding: 2px 7px;',
		"RLKW div:hover":'background:#eee;',
		"RLKW div span":'color:#777; font-size:10px;',
		"RLKW div span:hover":'color:#777; font-size:10px;',

		"Sg":'color:#d71a1a; font-Size:14px; line-height:34px; width:92%; padding:7px; font-weight:bold; float:left',
		"Sg div":'padding:7px; background: url('+iconURL('st/op')+') repeat; float:right;',
		"SM":'border-bottom:1px solid #777; width:93%; padding:0px 12px',
		"SM div":'background: url('+iconURL('st/b')+') center; opacity:0.5; width:24px; height:24px; padding:6px; margin-bottom:-1px; cursor:pointer',
		"SM div:hover":'background: url('+iconURL('st/h')+') center; opacity:1',
		"St":'color:#777; font-Size:12px; padding:0 5px;',
		"Sc label":'font-Size:14px; line-height:24px; cursor:pointer',
		"Sc img":'height:16px; width:16px; border:0; margin: 0px 5px -2px 5px;',
		"Sl":'padding:14px 5px; font-Size:10px; float:right;',
		"Sl div":'margin:1px; padding:1px 3px; cursor:pointer; float:right; -webkit-border-radius:3px; -moz-border-radius:3px; border-radius:3px;',
		"Sl div:hover":'background:#eee',
		"Ss":'padding:4px; font-Size:16px; line-height:20px; float:left; border:1px solid #aaa; background:#eee; cursor:pointer; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px;',
		"Ss:hover":'background:#ccc',
		"Ss img":'margin-bottom:-4px',

		"slider":'background: url('+iconURL('sldr/s')+') repeat-x; cursor:pointer; opacity:0.8',
		"slider:hover":'opacity:1',
		"knob":'position: relative; background: url('+iconURL('sldr/k')+');',

		"panel":'position: absolute; padding: 10px; background:rgba(0,0,0,0.72); -webkit-border-radius:7px; -moz-border-radius:7px; border-radius:7px; border:1px solid #777; z-index:10;',
		"panel:hover":'z-index:99999;',
		"list div":'color:#ccc; text-shadow:0 0 3px #000, 0 0 3px #000; font-weight:bold; font-Size:12px; cursor:pointer; float:left; width:160px; height:20px;',
		"list div:hover":'text-shadow:0 0 5px #00f, 0 0 4px #00f; color:#fff;',
		"list img":'width:16px; height:16px; margin-bottom:-3px; padding-right:7px;',
		"list span":'font-Size:16px; font-weight:normal;',
		"l":'float:left; font-Size:8px; color:#888; cursor:default; text-shadow:0 0 2px #000, 0 0 2px #000; height:7px;',

		"CEbtn div":'width:32px; height:32px; position:relative; float:left; cursor:pointer; margin:1px;',
		"CEbtn div:hover":'margin-top:0; margin-bottom:2px;',
		"CEbtn div div":'position:relative; width:28px; height:28px; top:2px; left:2px; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px; text-align:center; color:#aaa; font-Size:17px; line-height:28px; font-weight:700;',
		"statline br":'clear:both; font-Size:10px; line-height:14px;',
		"statline div":'font-Weight:550; font-family: \'Verdana\', \'Arial\', \'Helvetica\', sans-serif; font-Size:10px; text-shadow:0 0 2px #000, 0 0 2px #000, 0 0 2px #000; padding:0 3px; position:relative; cursor:default; float:left;'
	};
	var H='';
	for (var n in s) H+= '.WUS_'+n+' {'+s[n]+'} ';
	var st=document.createElement('style');
	st.type='text/css';
	st.innerText=H;
	st.innerHTML=H;
	document.getElementsByTagName('head')[0].appendChild(st)

	WUS_S_defR=[1,1,0,0,1,1,0,0,0,1,1,0,0,1,0,0,0,0,1,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,1,0,1];
	p=[255,223,23,72,255,0,63,1,0,0,199,87,255,0,0,1,151,248,0,60,0,176,255,3,255,199,0,80,199,0,0,6];
	WUS_S_p=[]; WUS_S_r=[]; WUS_S_o=[1,1,1,1,1,1,1,1];
	var r=WUS_S_defR, o=WUS_S_o, S='WUS_S_';
	if (typeof localStorage != "undefined") var s=localStorage,
		p=s.getItem(S+'p')?s.getItem(S+'p').split(','):p,
		r=s.getItem(S+'r')?s.getItem(S+'r').split(','):r,
		o=s.getItem(S+'o')?s.getItem(S+'o').split(','):o;
	for (var i=0; i<4; i++){ WUS_S_p[i]=[]; for (var j=0; j<8; j++) WUS_S_p[i][j]=eval(p[i*8+j]);}
	for (var i=0; i<r.length; i++) WUS_S_r[i]=eval(r[i]);
	for (var i=0; i<o.length; i++) WUS_S_o[i]=eval(o[i]);
	WUS_save_set();
	setTimeout(function(){
		make_resources_panel();
		var rpl = 'wus_left_1'
		if (_ge(rpl).innerHTML != '') _ge(rpl).innerHTML = _ge('resources_panel_pre').value;
		start_change_interface();
	},500);
})();

setTimeout(function(){_ge('uid_input').innerHTML = uid;},2000);

function make_resources_panel(){

var i=[], l=[], n=0, fi='/favicon.ico', wm='www.webmap.clan.su/file/wm', ya='yandex.st/lego/_/', L=WUS.l;

l[0]='webmap.clan.su/index/map/0-4#\'+l+m+\'&from=wikimapia\'';
l[++n]='maps.google.com/maps?f=q&source=s_q&hq=1&ll=\'+yx+\'&t=h\'+m'; i[n]=wm+'us/Google.png';
l[++n]='panoramio.com/map/#lt=\'+y+\'&ln=\'+x+\'&z=\'+(17-z)+\'&k=2\''; i[n]='www.panoramio.com/img'+fi;
l[++n]='maps.mail.ru/#x=\'+x+\'&y=\'+y+\'&zoneid=0\'+m+\'&mode=satellite&fullscreen=true\''; i[n]='maps.mail.ru'+fi+'?v2';
l[++n]='bing.com/maps/?cp=\'+y+\'~\'+x+\'&lvl=\'+z+\'&sty=h\''; i[n]='www.bing.com/s/wlflag.ico';
l[++n]='maps.yandex.ru/?ll=\'+xy+\'&l=sat,skl\'+m'; i[n]=ya+'qFyz_p77Mklm6G-g9tbfmp6arrk.ico';
l[++n]='n.maps.yandex.ru/?ll=\'+xy+\'&l=wskl\'+m'; i[n]=ya+'kjAFVzHC8Eouy2RyvyyrlzF48Bc.ico';
l[++n]='rasp.yandex.ru/map#center=\'+xy+\',\'+o'; i[n]=ya+'b3mm_03fNTOjOBpXspBpQgG9a-w.ico';
l[++n]='rasp.yandex.ru/trains#center=\'+xy+\',\'+o'; i[n]=ya+'b3mm_03fNTOjOBpXspBpQgG9a-w.ico';
l[++n]='www.gdeetotdom.ru/map/#\'+g+\'&m=google&t=2\'+m+\'&l=7-8\''; i[n]='www.gdeetotdom.ru'+fi;
l[++n]='wwii.sasgis.ru/fullmap/?\'+l+m'; i[n]='wwii.sasgis.ru/wp/wp-content/themes/black-lucas/images'+fi;
l[++n]='maps.vlasenko.net/?\'+l'; i[n]=wm+'us/Vlasenko.png';
l[++n]='www.eatlas.ru/#z=\'+(18-z)+l'; i[n]='old.eatlas.ru'+fi;
l[++n]='maps.cloudmade.com/?\'+g+\'&\'+o+\'&styleId=999\''; i[n]='cloudmade.com/images/layout/cloudmade-logo.png';
l[++n]='openstreetmap.org/?mlat=\'+y+\'&mlon=\'+x+\'&\'+o'; i[n]='openstreetmap.org'+fi;
l[++n]='toolserver.org/~dschwen/wma/iframe.html?\'+y+\'_\'+x+\'_\'+((self.innerWidth||(de&&de.clientWidth)|| document.body.clientWidth)-20)+\'_\'+((self.innerHeight||(de&&de.clientHeight)||document.body.clientHeight)-20)+\'_commons_\'+(z-2)'; i[n]='meta.wikimedia.org'+fi;
l[++n]='maps.nokia.com/#|\'+y+\'|\'+x+\'|\'+z+\'|0|0\''; i[n]='static.maps.ovi.com/17517/core/img'+fi;
l[++n]='maps.yahoo.com/#mvt=h&\'+l+\'&zoom=\'+(1+~~z)'; i[n]='l.yimg.com/a/i/nt/ic/ut/bsc/ybangp16_1.gif';
l[++n]='www.mapquest.com/maps?l=\'+y+\'&g=\'+x'; i[n]='www.mapquest.com'+fi;
l[++n]='map.meta.ua/#\'+o+\'&\'+l+\'&base=0BB&sl=wthr%7Cpnrm%7Cmtpt%7Cpm_castles%7Cod-1\''; i[n]='map.meta.ua'+fi;
l[++n]='map.bigmir.net/?\'+l+\'&\'+o'; i[n]='bm.img.com.ua'+fi;
l[++n]='www.globalguide.org/index.html?lat=\'+y+\'&long=\'+x+\'&\'+o'; i[n]='www.globalguide.org'+fi;
l[++n]='maps.2gis.ru/#center/\'+xy+\'/zoom/\'+(z-7)'; i[n]='maps.2gis.ru'+fi;
l[++n]='maps.visicom.ua?c/\'+x+\':\'+y+\':\'+z+\'/\''; i[n]='maps.visicom.ua/common'+fi;
l[++n]='maplink.apontador.com.br/?ctz=\'+xy+\',\'+z'; i[n]='maplink.apontador.com.br/assets/image/favicon_16x16.ico';
l[++n]='www.streetmaps.co.za/?x=\'+x+\'&y=\'+y+\'&z=\'+ ((z>17)?0.0007:(z==17)?0.0014:(z==16)?0.0028:(z==15)?0.006:(z==14)?0.01:(z==13)?0.02:(z==12)?0.05:(z==11)?0.08:(z==10)?0.17:(z==9)?0.35:(z==8)?0.7:(z==7)?1.4:(z==6)?2.8:(z==5)?6:12)+\'&s=s&p=0\''; i[n]='www.streetmaps.co.za'+fi;
l[++n]='point.md/Map#x=\'+x+\'&y=\'+y+m'; i[n]=wm+'m/pointmd.png';
l[++n]='www.marinetraffic.com/ais'+((L=='1')?'/ru':'')+'/default.aspx?centerx=\'+x+\'&centery=\'+ y+\'&level1=140&\'+o'; i[n]='www.marinetraffic.com/ais/ru/icons/shipping_small.gif';
l[++n]=((L=='1')?'ru':'www')+'.webcams.travel/map/#\'+g+\'&t=h\'+m'; i[n]='www.webcams.travel/icons'+fi;
l[++n]='www.ask.com/maps?ltp=1&ms=street&dt=driving&zm=\'+z+\'&cx=\'+y+\'&cy=\'+x'; i[n]='sp.ask.com/sh/i/a14/favicon'+fi;
l[++n]='www.terraserver.com/view.asp?cx=\'+x+\'&cy=\'+y+\'&proj=4326&mpp=\'+ ((z>19)?0.15:(z==19)?0.25:(z==18)?0.5:(z==17)?0.75:(z==16)?1.5:(z==15)?2.5:(z==14)?5:(z==13)?10:(z==12)?20:(z==11)?50:(z==10)?100:(z==9)?300:(z>5)?900:(z>3)?3000:11000)+\'&pic=img&prov=dg19&stac=411&ovrl=-1&drwl=-1\''; i[n]='www.terraserver.com'+fi;
l[++n]='www.daylightmap.com/?\'+g+\'&t=s&c=1&m=a\'+m'; i[n]='www.daylightmap.com'+fi;
l[++n]='www.tagzania.com/near/\'+y+\'/\'+x'; i[n]='www.tagzania.com'+fi;
l[++n]='www.flickr.com/map?&fLat=\'+y+\'&fLon=\'+x+\'&zl=\'+((z>17)?1:(18-z))'; i[n]='l.yimg.com/g'+fi;
l[++n]='www.viamichelin.com/web/Cartes/\'+x+\'*\'+y+\'?zoomLevel=\'+z'; i[n]='www.viamichelin.com'+fi;
l[++n]='mapper.acme.com/?ll=\'+yx+\'&t=M\'+m'; i[n]='mapper.acme.com'+fi;
l[++n]='www.mapy.cz/#mm=ZPfTrWtTtTcP@sa=s@st=s@ssq=loc%3A\'+ y+\'%C2%B00%270%22N%20\'+x+\'%C2%B00%E2%80%B20%22E@sss=1@z=\'+(z-2)'; i[n]='www.mapy.cz'+fi;
l[++n]='www.flightradar24.com/?\'+l+m'; i[n]='static.flight24.com/_fr24/images/favicon.png';
l[++n]='www.blue-marble.de/?lon=\'+x+\'&lat=\'+(0-y) +\'&nostretch&borders&towns&geonames&townnames&zoom&tiles=63&overlay=0&base=0\''; i[n]='www.blue-marble.de'+fi;
l[++n]='www.flashearth.com/?\'+l+\'&r=0&src=msl\'+m'; i[n]='www.flashearth.com'+fi;
l[++n]='www.geonames.org/maps/google_\'+y+\'_\'+x+\'.html\''; i[n]='www.geonames.org/geonames.ico';
l[++n]='www.maps-for-free.com/?val=\'+yx+\',\'+z'; i[n]='www.maps-for-free.com/iconies'+fi;
l[++n]='maps.rosreestr.ru/Portal/?l=\'+z+\'&x=\'+r*x/180*p+\'&y=\'+r*Math.log(Math.tan(y/360*p+p/4))'; i[n]='maps.rosreestr.ru/portal/i'+fi;
l[++n]='www.shaded-relief.com/?gt=\'+y+\'&gl=\'+x+\'&t=4\'+m'; i[n]='wikimapia.org'+fi;
l[++n]='maps.rambler.ru/?\'+l+m'; i[n]='maps.rambler.ru'+fi;
l[++n]='emapi.pl/?long=\'+x+\'&lat=\'+y+\'&\'+o'; i[n]='emapi.pl/favicon.png';
l[++n]='kosmosnimki.ru/index.html#mode=satellite&x=\'+x+\'&y=\'+y+m'; i[n]='www.kosmosnimki.ru'+fi;
l[++n]='routes.tomtom.com/#/map/?center=\'+y+\'%2C\'+x+\'&map=basic&zoom=\'+((z>17)?15:(z-2))'; i[n]='static.routes.tomtom.com'+fi;
l[++n]='45f.ru/v/atlogis/duo/?\'+o+\'&\'+l+\'&layers=0000000B0000000FF\''; i[n]='45f.ru'+fi;
l[++n]='latlon.org/maxi?\'+o+\'&\'+l+\'&layers=000000B0000000TT\''; i[n]='latlon.org'+fi;
l[++n]='new.wikimapia.org/#lng='+((L=='1')?'ru':(L=='2')?'uk':'en')+'&\'+l+m'; i[n]='new.wikimapia.org'+fi;
l[++n]='toolserver.org/~geohack/geohack.php?params=\'+y+\'_0_0_N_\'+(0-x)+\'_0_0_W\''; i[n]='toolserver.org/~geohack/siteicon.png';
l[++n]='maps.google.com/maps?&q=\'+yx+\'&spn=0.3,0.3&output=kml\''; i[n]='www.google.com/images/icons/product/earth_client-32.png';

	WUS_map_icons=i;
	WUS_map_N=n+1;
	MapLink=l;
	var m=WUS.t.Map.split('; ');
	mapsHTML = '<div style="color:#f51a1a; font-Size:14px; cursor:default;">'+m[0]+'</div>';	

	for (var n=1; n<WUS_map_N; n++) mapsHTML+='<div id="MapResource'+n+'" '+(WUS_S_r[n-1]?'':'style="display:none;" ')+'onclick="open_resource('+n+');"><img src="http://'+i[n]+'" alt="" border="0"/>'+m[n]+'</div>';

	mapsHTML+='<div id="MapResourcesMore" style="font-Size:14px; text-align:right; float:right; color:#777777;" onclick="show_all_links(this.innerHTML);">►►►&nbsp;&nbsp;</div>';

	_ge('resources_panel_pre').value=mapsHTML;
}

function open_resource(n){
	var c = map.getCenter(), y = c.lat(), x = c.lng(),
		xy = x+','+y, yx = y+','+x,
		z = map.getZoom(), m = '&z='+z, o = 'zoom='+z,
		l = 'lat='+y+'&lon='+x, g = 'lat='+y+'&lng='+x,
		r = 6378100, p = Math.PI;
	window.open(eval('\'http://'+MapLink[n]));
}

function show_all_links(s){
	var d=(s=='►►►&nbsp;&nbsp;')?1:0, ms=0, i;
	for (var m = 1; m<WUS_map_N; m++) { i=d|WUS_S_r[m-1]; _sdisp('MapResource'+m,i); ms+=i;}
	setWdt('wus_left_1', (ms>36?3:ms>18?2:1)*160);
	_ge('MapResourcesMore').innerHTML = d?'◄◄◄&nbsp;&nbsp;':'►►►&nbsp;&nbsp;';
}

// Предыдущий вид карты
back_pos=0; after_back=0; last_saved=0;
Saved_MPos=[]; Saved_MPos[0]={c:0,z:0};

function back_map(){
	if (last_saved>1){
		last_saved--;
		if (after_back&&(!back_pos)&&(last_saved>1)) last_saved--;
		back_pos=1;
		var p = Saved_MPos[last_saved];
		map.setZoom(p.z); map.panTo(p.c);
		after_back=1;
	}
}

function map_hist_save(){
	var c=map.getCenter(), z=map.getZoom();
	if (Saved_MPos[last_saved].c!=c){
		Saved_MPos[++last_saved]={c:c,z:z};
		if (after_back&&(!back_pos)) after_back=0;
		back_pos=0;
	}
	if (_ge('flomenubcanc')) reFillStatusCells(0);
}

function onFilterInput(){
	var rl = 'wus_rlist_',
		kw = 'wus_rlistKW_',
		i = 'WUSrlinpf'
		f = _ge(i).value.toLowerCase().replace(/ё/g,'е'),
		l = wus_rlist_items.length-1,
		w = wus_rlist_keywords.length;
	if(f != Fstring){
		var h=0;
		if(f){
			var sst=_ge(i).selectionStart,
				sen=_ge(i).selectionEnd,
				s = f.replace(/ *, */g,',').split(',');
			_ge(i).value=f;
			_ge(i).selectionStart=sst;
			_ge(i).selectionEnd=sen;
			for (var i=0;i<l;i++){
				var c=0, t = wus_rlist_items[i].t.toLowerCase();
				for (var j=0;j<s.length;j++) if (t.indexOf(s[j])>-1) c++;
				if (c == s.length) _sdisp(rl+i,1);
				else { _sdisp(rl+i,0); h++; }
			}
			for (var i=0;i<w;i++){
				var c=0, t = wus_rlist_keywords[i].t;
				for (var j=0;j<s.length;j++) if (t.indexOf(s[j])>-1) c++;
				_sdisp(kw+i,c>0?1:0);
			}
		}else{
			for (var i=0;i<l;i++) _sdisp(rl+i,1);
			for (var i=0;i<w;i++) _sdisp(kw+i,1);
		}
		_ge('S_list_buf').value = _ge(WUS.B).innerHTML;
	}
	_sdisp('WUSrlinpKW',f?'block':0);
	Fstring = f;
	_ge('list_length').innerHTML = h?((l-h)+' / '+l):l;
}

function Get_Selection(){
	var s, D=document;
	if (window.getSelection) s = window.getSelection();
	else if (D.getSelection) s = D.getSelection();
	else s = D.selection.createRange().text;
	return s;
}

function FilterSelection(){
	var f='WUSrlinpf', s=Get_Selection();
	if(s!=''){ _ge(f).value = s; _ge(f).select(); onFilterInput(_ge(f)); }
}

function FilterKW(p){
	_ge('WUSrlinpf').value = wus_rlist_keywords[p].t;
	onFilterInput();
}
function m_sort(i,ii){return (i['r']>ii['r'])?1:(i['r']<ii['r'])?-1:0;}

Sel_timeout=0;
function streets_list(){

	var Get_list = function(data){
		var streets_list='';
		if (data) WikimapiaDropdownList.getItemsCallback(data);
		var n=0, m=[];
		WikimapiaDropdownList.currentItem=0;
		var slng = l_id[config.l];

		var i = WikimapiaDropdownList.items;
		for(var j=0;j<i.length;j++){
			var d = i[j];
			if(d[1]) m[n++]={
				l:'/street/'+d[0]+'/'+slng+'/', o:'', u:'',
				t:d[1],
				b:'▬', c:'ccbb00',
				k:'<img src="'+iconURL('rp/l')+'" onclick="jwindow3(\'/street/'+d[0]+'/'+slng+'/\',1);"/><img src="'+iconURL('rp/e')+'" onclick="jwindow(\'/object/edit/?object_type=2&amp;id='+d[0]+'&lng='+lng+'\',0);"/>'
			}
		}
		if (n) show_wus_rlist(m, WUS.t.RBP.split('; ')[2], 'streets_list');
		_ge('S_list_buf').value = _ge(WUS.B).innerHTML;
	}
	Fstring='';
	jwindow3('javascript:',0,0,'',1);
	_j3HTML('<br/>&nbsp;LOADING...');
	var c=map.getCenter();
	WikimapiaDropdownList.items = [];
	GDownloadUrl('/ajax/getNearestLinear/?action=near_streets&x='+c.lng()+'&y='+c.lat()+'&lng='+lng+'&ltype=0',Get_list);
}

function create_places_list(){
	setTimeout(function(){
		var slng = l_id[config.l],
			m=[], n=0, g=1e7,
			c=bounds.getCenter(),
			SW=bounds_sw, S=SW.y*g, W=SW.x*g,
			NE=bounds_ne, N=NE.y*g, E=NE.x*g;		
		var vs=function(e){return ((e.y1>S)||(e.y2>S))&&((e.x1>W)||(e.x2>W))&&((e.y1<N)||(e.y2<N))&&((e.x1<E)||(e.x2<E))};
		var re=function(e){return c.distanceFrom(_createLL((e.y1+e.y2)/g/2,(e.x1+e.x2)/g/2))};		
		var bt=function(i,e){return '<img src="'+iconURL('rp/z')+'" onclick="test_zoom('+e.x1/g+','+e.y1/g+','+e.x2/g+','+e.y2/g+','+map.getZoom()+');"/>'+((v!=4)?'<img src="'+iconURL('rp/e')+'" onclick="GDownloadUrl(\'/ajax/check/?function=place_can_edit_protected&obj_id='+i+'\', function (response) {if (response == \'true\') {jwindow(\'/object/edit/?id='+i+'&lng='+lng+'\');} else {eval(response)}});jwindow3_menu(1);"/>':'')};		
		for (var p in massid_poly){
			var e = massid_poly[p];
			if (vs(e)) m[n++]={
				l:'/'+parseInt(p)+'/'+slng+'/',
				o:'WUS_p_mode3=1; prepolyone(massid_poly[\''+p+'\'].po,\''+p+'\',4);', u:'',
				t:e.t, b:'●', c:'ccbb00', k:bt(parseInt(p),e), r:re(e)
			}
		}
		var v=vtype, tr=(v==4||v==9)?5:12;
		if ((!n)&&(try_CPL++<tr)) create_places_list(); 
		else setTimeout(function(){
			var col = (v==4)?'bb5555':'aaaaaa';
			for (var p=1;p<200;p++) if (_ge(''+p+'kvc')&&(_gdisp(''+p+'kvc')!='none')){
				var i = parseInt(_ge(''+p+'kvc').rid);
				var e = massid[_ge(''+p+'kvc').rid];
				if (vs(e)) m[n++]={
					l:'/'+i+'/'+slng+'/',
					o:'WUS_p_mode3=1; _ge(\''+p+'kvc\').onmouseover();',
					u:'_ge(\''+p+'kvc\').onmouseout();',
					t:e.t, b:'■', c:col, k:bt(i,e), r:re(e)
				}
			}
			if (n){
				m.sort(m_sort);
				show_wus_rlist(m, WUS.t.RBP.split('; ')[1], 'places_list');
			}
			else {_j3HTML('<br/>&nbsp;NO DATA'); _sdisp('li3',0);}
		},1000);
	},1000);
}

function places_list(){
	//clear_cache();
	jwindow3('javascript:',0,0,'',1);
	_j3HTML('<br/>&nbsp;LOADING...');
	try_CPL=0; Fstring='';
	create_places_list();
}
wus_rlist_items=[];

function wus_rlist_open(p){
	if(Sel_timeout) clearTimeout(Sel_timeout);
	Sel_timeout=setTimeout(function(){ if (Get_Selection()=='') jwindow(wus_rlist_items[p].l,1);},400);
}

function show_wus_rlist(m,t,r){
	var h=s='', l = m.length-1;
	for (var p=0;p<l;p++){
		h += '<div id="wus_rlist_'+p+'" onmouseover="_sdisp(\'WUSrlinpKW\',0); '+m[p].o+'" onmouseout="'+m[p].u+'"><span onclick= "wus_rlist_open('+p+')">&nbsp;<font color="#'+m[p].c+'">'+m[p].b+'</font>&nbsp;'+m[p].t+'</span><div id="wus_rlistK_'+p+'">'+m[p].k+'</div></div>';
		s += m[p].t+' ';
	}
	h='<div style="font-size:11px; line-height:12px; font-weight:bold; color:#777; text-align:right; padding-right: 10px;">'+WUS.N+'</div>\
	<div class="WUS_RLT" onclick="'+r+'();">'+t+'&nbsp;<img src="'+iconURL('Reload')+'" style="width:16px;"/></div>\
	<div style="border-bottom:1px solid #bbb; height:37px; width:99%">\
		<div id="list_length" class="WUS_RLL">'+l+'</div>\
		<div class="WUS_RLI">\
			<img src="'+iconURL('filter')+'" onclick="FilterSelection();"/>\
			<input id="WUSrlinpf" type="text" oninput="onFilterInput()" onchange="onFilterInput()"  onmouseover="_sdisp(\'WUSrlinpKW\',\'block\');" value="'+Fstring+'"/>&nbsp;\
			<img src="'+iconURL('rp/d')+'" onclick="_ge(\'WUSrlinpf\').value=\'\'; onFilterInput();"/>\
			<div id="WUSrlinpKW" class="WUS_RLKW" style="max-height:150px; display:none;"></div>\
		</div>\
	</div>\
	<div id="wus_rlist" class="WUS_RL" ondblclick="if(Sel_timeout) clearTimeout(Sel_timeout); FilterSelection();">'+h+'</div>';
	
	s=s.toLowerCase().replace(/[\\\.,-\/#!$%\^&№\*\+;:{}=\-_~()<>"«»±°®©§—“”… ]/g, ' ').replace(/́/g,'').replace(/ё/g,'е');
	var sa=s.split(' '), sm=[], sr=[], mt=[], ss='', a=0, b;
	for (var i=0; i<sa.length; i++)	if(sa[i].length>2) for (var j=sa[i].length; j>2; j--) sm[sa[i].substr(0,j)]=0;
	sa=[];
	for (var p=0;p<l;p++)mt[p]=m[p].t.toLowerCase();
	for (var i in sm){
		var n=0;
		for (var p=0;p<l;p++) if (mt[p].indexOf(i)>-1) n++;
		sm[i]={n:n, h:1};
		if (a%100==0)_j3HTML('<br/>&nbsp;LOADING: '+parseInt(a/100));
		a++;
	}
	a=0;
	_j3HTML('<br/>&nbsp;LOADING: OK');
	for (var i in sm){ b=i.substr(0,i.length-1); if(sm[b]&&(sm[b].n==sm[i].n)) sm[b].h=0;}
	for (var i in sm) if((sm[i].n>1)&&sm[i].h) { sr[a]={r:sm[i].n, t:i}; a++ }
	sm=[];
	sr.sort(m_sort);
	for (var p=sr.length-1; p>=0; p--) ss += '<div id="wus_rlistKW_'+p+'" onclick="FilterKW('+p+');">'+sr[p].t+'&nbsp;<span>('+sr[p].r+')</span></div>';
	_j3HTML(h);
	_ge('WUSrlinpKW').innerHTML=ss;
	_sdisp('li3',0);
	wus_rlist_items=m;
	wus_rlist_keywords=sr;
}

// Поиск по адресу
function pitCheckGoToAddr(fV){
	fV=fV.replace(/^\s+|\s+$/g,'');
	if(fV=='')return;
	var aC= new google.maps.Geocoder(),
		i = new google.maps.InfoWindow(),
		b = '<br/>';
	aC.geocode({ 'address': fV },function(results, status){
		if(results[0].geometry.location){
			map.setCenter(results[0].geometry.location,18);
			i.setContent(WUS.N+b+'<div style="font-weight:bolder; font-size:14px;">'+Addr+':'+b+b+fV+'</div>');
			i.setPosition(results[0].geometry.location);
			i.open(map);
		}
		else alert(WUS.t.AddrE.replace(/%/,fV));
	});
}

function defPosition(e){
    var x = y = 0, D=document;
    if (D.attachEvent != null){
        var d = D.documentElement, b = D.body;
		x = window.event.clientX + d.scrollLeft + b.scrollLeft;
        y = window.event.clientY + d.scrollTop + b.scrollTop;
    }
    if (!D.attachEvent && D.addEventListener) {
        x = e.clientX + window.scrollX;
        y = e.clientY + window.scrollY;
    }
    return {x:x,y:y};
}

moveState = resized_mjw = false;

function initMove(d, e){
    e = e || window.event;
    x0 = defPosition(e).x;
    y0 = defPosition(e).y;
    divX0 = parseInt(d.style.left);
    divY0 = parseInt(d.style.top);
    moveState = true;
}

function moveHandler(d, e){
    e = e || window.event;
    if (moveState) {
        d.style.left = divX0 + defPosition(e).x - x0;
		d.style.top  = divY0 + defPosition(e).y - y0;
    }
}

function move_bound(d){
	if (d.offsetTop!=1) d.style.top=1;
	if (d.offsetLeft<1) d.style.left=1;
	if (d.offsetLeft>201) d.style.left=201;
}

overmenu=0; current_op=1;

function start_change_interface(){
	if(_chset(0)){
		timer01 = window.setInterval( change_interface, 1e3 );
		var p=document.createElement('div');
		document.body.insertBefore(p,document.body.firstChild);
		p.innerHTML='<div id="pre_wm00" onmouseover="set_menu_opacity(1); overmenu=1;" onmouseout="setTimeout(function(){overmenu=0;},1000);" style="top: 0px; left: 0px; width:90%; height: 30px; z-index: 3; position: absolute; display: block"> </div>';
		setTimeout(function(){setWdt('pre_wm00', 60+parseInt(retLft('wm7'))+'px');},3e3);
		setTimeout(function(){setWdt('pre_wm00', 60+parseInt(retLft('wm7'))+'px');},6e3);
	}
	if(_chset(1)) setTimeout(function(){
		var b = "wm-button add-place";
		if (_gcn(b)&&_gcn(b)[0]){
			var wmn = "wmNavigation";
			_gcn(b)[0].parentNode.id=wmn;
			_ge(wmn).style.opacity=1;
			if (_ge(wmn).attachEvent){
				_ge(wmn).attachEvent('mouseover', function(){wmn_opacity(1)});
				_ge(wmn).attachEvent('mouseout',  function(){wmn_opacity(0)});
			}else if(_ge(wmn).addEventListener){
				_ge(wmn).addEventListener('mouseover', function(){wmn_opacity(1)}, true);
				_ge(wmn).addEventListener('mouseout',  function(){wmn_opacity(0)}, true);
			}
			wmn_opacity(1); wmn_opacity(0);
		}
	},2000);
	if(_chset(3)) map.disableDoubleClickZoom=false;
}

wmn_op_to=0;
function wmn_opacity(op){
	if(wmn_op_to) clearTimeout(wmn_op_to);
	if (op){
		var n = "wmNavigation";
		setLft(n,0); setTop(n,0);
		set_opacity(n,1);
	}
	else wmn_hide(1700);
}
function wmn_hide(t){
	var n = "wmNavigation",
		o = eval(_ge(n).style.opacity),
		p = -25*(1-o);
	if (o>0) wmn_op_to = setTimeout(function(){
		set_opacity(n, o-0.04); 
		setLft(n,p); setTop(n,p); 
		wmn_hide(100);
	},t);
}

function change_interface(){
	var o = current_op==1;
	var d = _gdisp('jwindow3_menu')=='block';
	if(o&&!d&&(overmenu==0))   set_menu_opacity(0); else 
	if((!o)&&d&&(!_ge('jw3cm'))) set_menu_opacity(1);
}
function set_opacity(n,op){_ge(n).style.opacity = op}
function set_menu_opacity(op){
	for(var i=3;i<8;i++) set_opacity('wm'+i, op);
	set_opacity('wm'+1, op); set_opacity('wm00', op*0.7);
	current_op = op;
}

preRSPop=1; HRPto=0;
waitToHide='l'; CurrentHide='r';
function HideScriptPanel(time){	if(!HRPto){HRPto=setTimeout(StartHideScriptPanel,time?time:90);}}

function StartHideScriptPanel(){
	var p='ScriptPanel',
		c=CurrentHide,
		o=c?eval(_ge(c+p).style.opacity).toFixed(2):0;
	if((o>0.28)&&(~~preRSPop==~~o)){
		o -= 0.02;
		_ge(c+p).style.opacity=o;
		if(o<0.77){
			var x = '-'+((0.76-o)*50)+'px';
			if(c=='r') _ge('r'+p).style.marginRight=x;
			if(c=='l') _ge('l'+p).style.marginLeft=x;
		}
		preRSPop=o;
		HRPto=0;
		HideScriptPanel((o>0.94)?700:null);
	}else if(o==0.28){
		CurrentHide='';
		HRPto=0;
		if(waitToHide) {
			o=1;
			preRSPop=1;
			CurrentHide = waitToHide;
			HideScriptPanel();
			waitToHide='';
		}
	}
}

HideScriptPanel();

function ScriptPanelTT(s, b){
	var t='ScriptTT', p='ScriptPanel',
		m = '45px', z = '0px',
		r = s==1, l = s==2,
		h = CurrentHide;

	_ge((r?'r':'l')+p).style.opacity=1;
	if(r)      _ge('r'+p).style.marginRight=z;
	else if(l) _ge('l'+p).style.marginLeft =z;

	if(HRPto&&(((h=='r')&&r)||((h=='l')&&l))) {clearTimeout(HRPto); HRPto=0;}
	if(b!=null){
		setLft(t,r?'':z);
		_ge(t).style.marginRight=r?m:'';
		_ge(t).style.marginLeft =l?m:'';
		_ge(t).style.marginBottom=((5-b)*30-200)+'px';
		_ge(t).style.right=r?_ge('r'+p).style.right:'';
		_ge(t).innerHTML=(r?WUS.t.RBP:WUS.t.LBP).split('; ')[b];
	}else{
		s = r?'r':l?'l':'';
		if(h) {if(s!=h) waitToHide=s;} else CurrentHide = s;
		if(s==h) { preRSPop=1; StartHideScriptPanel(); }
	}
	_sdisp(t,(b!=null)?1:0);
}

function ScriptPanelClick(btn,l){
	var s = unescape(_ge('searchtest').value); var w='%20site:wikimapia.org';
	switch(btn){
		case  0: parent.jevals='loadjs(\'watchlist.js\', \'WatchList.viewMy();\');'; return false; break;
		case  1: places_list(); break;
		case  2: streets_list(); break;
		case  3: jwindow3('/user/messages/?uid='+uid,0,0,'',1); _sdisp('li3',0); break;
		case  4: WUS_settings(0); break;

		case 10: clear_cache(); break;
		case 11: back_map(); break;
		case 12: WUS_left_open(2); break;
		case 13: if (_ge('wus_left_1').innerHTML=='') _ge('wus_left_1').innerHTML = _ge('resources_panel_pre').value;
				 show_all_links(0); WUS_left_open(1); break;
		case 14: open_resource(0); break;

		case 100: mtype=jmtype1[l]; break;
		case 101: if(vtype!=6)vtype=l; break;
		case 102: WUS_hist_layer(); break;
		case 103: parent.jevals='loadAndTurnOnStatusgrid();'; break;

		case 500: pitCheckGoToAddr(s); break;
		case 501: s='www.google.com/search?q='+s+w; break;
		case 502: s=WUS.t.Ya+'/yandsearch?date=&text='+s+w; break;
		case 503: s='search.yahoo.com/search?p='+s+w; break;
		case 504: s='www.bing.com/search?q='+s+w; break;
		case 505: s=WUS.t.WP+'/w/index.php?search='+s; break;
	}
	if(btn>500) window.open('http://'+s);
	else if(btn>99){updmap();update_objects(1);}
}

Opened_panel=0;
function WUS_left_open(n){
	var s = (Opened_panel==n)
	if (n) for (var i=1; i<3; i++) _sdisp('wus_left_'+i,((n==i)&&!s)?1:0);
	_sdisp('wus_left',(n&&!s)?1:0);
	Opened_panel = s?0:n;
}

function CEbtn_onoff(i,o){
	_ge('WUSCEbtn'+i).style.opacity=o?0.5:1;
}

function WUS_gevel(ev){
	var e = window.event || ev, o = e.target || e.srcElement;
	return o;
}

function CEdit_pswitch(o){
	var p=['main','poly','line_1','line_2'], m='CEdit_';
	for (var i=0; i<4; i++) _sdisp(m+p[i], (i==o)?1:0);
	if(o==1)select_poly_N('WUSCEpoly'+WUS_poly_N);
}

function CEdit_mover(e){
	var o = WUS_gevel(e), t=WUS.t;
	if(o.id.indexOf('btn')>-1) Write_Status(0,t.CEPt.split('; ')[parseInt(o.id.split('btn')[1])],o.style.opacity!=1?'#777':'#fff');
	else if(o.id.indexOf('poly')>-1) Write_Status(0,t.CEPnod);
	else if(o.id=='Redo_LT') Write_Status(0,t.LTr);
	else if(o.id=='Cancel_LT') Write_Status(0,t.LTc, '#f44');
	else if(o.id=='CEditS2') Write_Status(0,t.dotsDx, '#f44');
	else if(o.id.indexOf('lnb')>-1) Write_Status(0,t.LTi);
	else Write_Status(0);
	window.event = null;
	return false;
}

function CEdit_Lclick(e){
	var o = WUS_gevel(e);
	if(o.id.indexOf('btn')>-1)
		switch(parseInt(o.id.split('btn')[1])){
			case  0: repeat_poly();	break;
			case  1: copy_poly();	break;
			case  2: paste_poly();	break;
			case  3: kml_load();	break;
			case  4: reflection(1);	break;
			case  5: reflection(2);	break;
			case  6: Write_Status(0, WUS.t.rotI, '#f44'); RotatePoly(); break;
			case  7: WUS_polyft();	break;
			case  8: shrinkPolyPit(2); break;
			case  9: toggle_expose_verts(0); break;
			case 10: moveDotsPolyPit(o,1); break;
			case 11: moveDotsPolyPit(o,2); break;
			case 12: CEdit_pswitch(2); Begin_line_selection(); break;
			case 13: make_rectangle(); break;
			case 14: add_poly(0); break;
			case 15: add_poly(4); break;
			case 16: CEdit_pswitch(1); add_poly(WUS_poly_N); break;
		}
	else if(o.id.indexOf('poly')>-1) select_poly_N(o.id);
	else if(o.id=='Redo_LT') Apply_line_transform();
	else if(o.id=='Cancel_LT') {CEdit_pswitch(0); End_line_selection();}
	else if(o.id=='CEditS2') clear_doubles();
	else if(o.id.indexOf('lnb')>-1) Line_transform(parseInt(o.id.split('lnb')[1]));

}

function CEdit_Rclick(e){
	var o = WUS_gevel(e);
	if(o.id.indexOf('btn')>-1)
		switch(parseInt(o.id.split('btn')[1])){
			case  9: toggle_expose_verts(1); break;
			case 14: transform_to_poly(0); break;
		}
}

function WUS_hist_layer(){
	if(tagfilter==45694){
		tagfilter=0;
		vtype=1;
		del_all_obj();
		update_objects();
		update_uri();
	} else {
		tagfilter=45694;
		vtype=0;
		update_objects(1);
	}
}

function slider(i,SW,R1,R2,s){
	var offsX, K, W = SW-16,
		p = W/(R2-R1),
		D = document,
		O = D.all||window.opera,
		S = D.createElement('DIV');

	S.id = i+'_slider';
	S.className = 'WUS_slider';
	D.getElementById(i).appendChild(S);
	K = D.createElement('DIV');
	K.id = i+'_knob';
	K.className = 'WUS_knob';
	S.appendChild(K);
	K.style.left = 0;
	K.style.width = '16px';
	K.style.height = '16px';
	S.style.width = SW+'px';
	S.style.height = '20px';

	var sOf=S.offsetLeft, o=S.offsetParent;
	while(o.tagName != 'BODY'){ sOf+=o.offsetLeft; o=o.offsetParent; }

	if(O){
		K.onmousedown = startCoord;
		S.onclick = sliderClick;
		K.onmouseup = endCoord;
		S.onmouseup = endCoord;
	}else{
		K.addEventListener("mousedown", startCoord, true);
		S.addEventListener("click", sliderClick, true);
		K.addEventListener("mouseup", endCoord, true);
		S.addEventListener("mouseup", endCoord, true);
	}

	function setVal(x){ K.style.left = (x<0?0:x>W?W:s?Math.round(x/s/p)*s*p:x)+'px'; }

	function setValue(x){setVal((x-R1)*p);}
	function getValue(){return Math.round(parseInt(K.style.left)/p)+R1;}

	function sliderClick(e){
		var x;
		if(O){
			if(event.srcElement != S) return;
			x = event.offsetX - Math.round(8);
		}else x = e.pageX-sOf-8;
		setVal(x);
	}
	function startCoord(e) {
		if(O) {
			offsX = event.clientX - parseInt(K.style.left);
			S.onmousemove = mov;
		}else S.addEventListener("mousemove", mov, true);
	}
	function mov(e){setVal(O?event.clientX-offsX:e.pageX-sOf-8);}
	function endCoord(){
		if(O) S.onmousemove = null;
		else S.removeEventListener("mousemove", mov, true);
	}
	this.setValue = setValue;
	this.getValue = getValue;
}

function WUS_poly_set(){
	var V=function(m){return WUS_S_0s[m].getValue()}
	for (var m=0; m<32; m+=8){
		var i='set_sl_pr'+m, p='px', c=',', w=-V(m+7)/2, a=1-V(m+3)/100, ph=9+w, pw=17+w;
		_ge(i).style.background='rgba('+V(m)+c+V(m+1)+c+V(m+2)+c+a+')';
		_ge(i).style.border=V(m+7)+'px solid rgb('+V(m+4)+c+V(m+5)+c+V(m+6)+')';
		_ge(i).style.margin=w+p;
		_ge(i).style.padding=ph+p+' '+pw+p;
		for (var n=0; n<8; n++)WUS_S_p[m/8][n]=V(m+n);
		var P =function(d,val){_gtn('polyline')[0].attributes[d].value = WUS_Pset_get(d-1)};
		if(_gtn('polyline')[0]){P(1);P(2);P(3);P(4);}
	}
}

WUS_S_0s=[]; WUS_S_s=[8,8,8,4,8,8,8,1]; WUS_langs=[0,1,37,-1];
function WUS_settings(p){
	jwindow3('javascript:',0,0,'',1);

	var t = WUS.t,
		H='<div style="height:77px; cursor:default;">\
		<div class="WUS_Sg" style="font-Size:17px; padding:7px; width:60%;">'+t.RBP.split('; ')[4]+'</div>\
		<div class="WUS_Sl">';
			for (var m=3; m>=0; m--) H+='<div id="WUS_S_lang'+m+'" onclick="WUS_sel_lang('+m+')">'+['EN','RU','UK','auto'][m]+'</div>';
		H+='</div>\
		<div class="WUS_SM WUS_Sg">';
			for (var m=4; m>=0; m--) if(m!=2) H+='<div onclick="WUS_settings('+m+')" '+((p==m)?'style="opacity:1; background: url('+iconURL('st/a')+') center;"':'')+'><img src="'+iconURL('st/'+m)+'"/></div>';
		H+=t.S_t.split('; ')[p]+'</div>\
	</div>\
	<div style="padding:3px 9px; cursor:default; overflow-y:auto; height:400px;" id="wus_rlist"></div>';
	_j3HTML(H); H='';

	if (p==0){
		var n = 'set_sl_p', K=k=0, M,
			b=255, r=[b,b,b,100,b,b,b,10],
			S = function(){H+='<div id="'+n+(k++)+'"></div>';},
			T = function(){H+='<div class="WUS_St">'+t.S_0t.split('; ')[K++]+'</div>';},
			C = function(){H+='<div style="width:162px; height:112px; float:left;">'; T();S();S();S();T();S(); H+='</div>';};

		for (var m=0; m<32; m+=8){
			H+='<div class="WUS_Sg"><div><div id="set_sl_pr'+m+'"></div></div>'+t.S_0g.split('; ')[m/8]+'</div>';
			K=0; C(); C();
		}

		_ge('wus_rlist').innerHTML='<div onmouseup="setTimeout(function(){WUS_poly_set()},200);">'+H+'</div>';

		for (var m=0; m<4; m++) for (var i=0; i<8; i++){
			M = m*8+i;
			WUS_S_0s[M] = new slider(n+M,155,0,r[i],WUS_S_s[i]);
			WUS_S_0s[M].setValue(WUS_S_p[m][i]);
		}
		WUS_poly_set();
	} else if (p==1){
		H='<input type="checkbox" id="set_res0" onchange="set_res0_state(this)"/><label for="set_res0" style="line-height:37px; font-Size:12px; font-weight:bold;">'+t.S_1+'</label><br/>';
		var s='set_res';
		for (var m=1; m<WUS_map_N; m++) 
			H+='<input type="checkbox" id="'+s+m+'"/><label for="'+s+m+'"><img src="http://'+WUS_map_icons[m]+'" alt=""/>'+t.Map.split('; ')[m]+'</label><br/>';
		_ge('wus_rlist').innerHTML='<div onmouseup="setTimeout(function(){get_res_state()},50);" class="WUS_Sc">'+H+'</div>';
		for (var m=1; m<WUS_map_N; m++) _ge(s+m).checked=WUS_S_r[m-1];
	} else if (p==3){
		var o=t.Opt.split('; '), s='set_opt';
		for (var m=0; m<o.length; m++) 
			H+='<input type="checkbox" id="'+s+m+'"/><label for="'+s+m+'">'+o[m]+'</label><br/>';
		_ge('wus_rlist').innerHTML='<div onmouseup="setTimeout(function(){get_opt_state()},50);" class="WUS_Sc">'+H+'</div>';
		for (var m=0; m<o.length; m++) _ge(s+m).checked=WUS_S_o[m];
	} else {
		_ge('wus_rlist').innerHTML='<br/><div class="WUS_Ss" onclick="WUS_save_set()"><img src="'+iconURL('st/4')+'"/>'+WUS.t.save+'</div>';
	}
	setHgt('wus_rlist',parseInt(_ge(WUS.B).style.height)-92+'px');
	WUS_sel_lang(-1);
	_sdisp('li3',0);
}

res0_state=0;
function set_res0_state(t){
	if(++res0_state==3)res0_state=0;
	var s=res0_state;
	t.checked=(s==1)?true:false; 
	t.indeterminate=(s==2)?true:false;
	for (var m=1; m<WUS_map_N; m++) _ge('set_res'+m).checked=(s==1)||((s==2)&&WUS_S_defR[m-1]);
}

function get_res_state(){for (var m=1; m<WUS_map_N; m++) WUS_S_r[m-1]=_chck('set_res'+m)?1:0;}
function get_opt_state(){for (var m=0; m<WUS.t.Opt.split('; ').length; m++) WUS_S_o[m]=_chck('set_opt'+m)?1:0;}

WUS_p_mode3=0;WUS_p_mode=0;

function WUS_Pset_get(l){
	var w = WUS_S_p[WUS_p_mode3?3:WUS_p_mode];
	var C = function(n){var c=w[n]; c=(c>255)?255:c; return c.toString(16).replace(/^(.)$/,'0$1')}
	switch(l){
		case 0: return '#'+C(0)+C(1)+C(2);
		case 1: return '#'+C(4)+C(5)+C(6);
		case 2: return w[7];
		case 3: return 1-w[3]/101;
	}
}

function WUS_sel_lang(l){
	l=(l!=-1)?WUS_langs[l]:WUS.ls;
	for (var i=0; i<4; i++) _ge('WUS_S_lang'+i).style.border = '2px solid #'+(WUS_langs[i]==l?'777':'ddd');
	WUS.ls=l;
}

function WUS_save_set(){
	if (typeof localStorage != "undefined"){
		localStorage.setItem('WMUS_lang', WUS.ls);
		localStorage.setItem('WUS_S_p', WUS_S_p);
		localStorage.setItem('WUS_S_r', WUS_S_r);
		localStorage.setItem('WUS_S_o', WUS_S_o);
	}
}

// Элементы перемещения и изменения размера окна jwindow

function set_jw_size(){
	var w=WUS.w;
	setWdt(w, retLft(WUS.r)-retLft(w)+60); 
	setHgt(w, retTop(WUS.r)-retTop(w)+60);
	setHgt(WUS.b, jwHeight()-20);
	setWdt(WUS.m, jwWidth()-350);
}

function  set_jw_pos(){ setLft(WUS.w, retLft(WUS.m)-250); setTop(WUS.w, retTop(WUS.m)+(resized_mjw?50:0)); set_rjw_pos(); }
function set_rjw_pos(){ setLft(WUS.r, retLft(WUS.w)+jwWidth()-60); setTop(WUS.r, retTop(WUS.w)+jwHeight()-60);}

function reset_jw_size(){
	var W=jwWidth(), H=jwHeight(), C=clWidth(), w=WUS.w;
	if ((H==clHeight())||(W==C)) {
		setWdt(w, jww);
		setHgt(w, jwh);
		setHgt(WUS.b,H-20);
		setLft(w, C-W/2);
		setWdt(WUS.m,W-350);
		setLft(WUS.m,retLft(w)+250);
	}
}

function set_mjw_size(w){
	setTop(WUS.m, retTop(WUS.w)-(w?50:0));
	setHgt(WUS.m, w?'120px':'20px');
	resized_mjw = (w?true:false);
}

function set_rjw_size(w){
	var val = w?'150px':'70px', r=WUS.r;
	setHgt(r,val); setWdt(r, val);
	_ge(r).style.zIndex = (w?2:1)*1e5;
}

var script_div=document.createElement('div');
document.body.insertBefore(script_div,document.body.firstChild);

script_div.innerHTML+="<div id='"+WUS.m+"' title='"+WUS.t.Wmove+" (UserScript)'\
        style='position:absolute; top:0; left:0; z-index:200000; display:none; cursor: move; draggable:true; width:200px; height:20px;' \
        onmousedown = 'set_mjw_size(1); reset_jw_size(); initMove(this,event); return false;' \
        onmouseout  = 'moveState=false; set_mjw_size(0);' \
        onmouseup   = 'moveState=false; set_mjw_size(0);' \
        onmousemove = 'moveHandler(this, event); set_jw_pos(); ' \
    ></div>";

script_div.innerHTML+="<div id='"+WUS.r+"'  title='"+WUS.t.Wresz+" (UserScript)'\
        style='position:absolute; top:0; left:0; z-index:100000; display:none; cursor: se-resize; draggable:true; width:70px; height:70px;' \
        onmousedown = 'initMove(this, event); set_rjw_size(1); return false;' \
        onmouseout  = 'moveState=false; set_rjw_size(0);' \
        onmouseup   = 'moveState=false; set_rjw_size(0);' \
        onmousemove = 'moveHandler(this, event); set_jw_size();' \
    ></div>";

if (_ge('searchtest')){ 
	var s='searchtest', k='keypress', m='mousemove', f='focus';
	if (_ge(s).attachEvent){
		_ge(s).attachEvent(k, ShowSearchPanel2);
		_ge(s).attachEvent(m, ShowSearchPanel1);
		_ge(s).attachEvent(f, ShowSearchPanel1);
	}else if(_ge(s).addEventListener){
		_ge(s).addEventListener(k, ShowSearchPanel2, true);
		_ge(s).addEventListener(m, ShowSearchPanel1, true);
		_ge(s).addEventListener(f, ShowSearchPanel1, true);
	}
}

sp_hide_timeout=0;
function ShowSearchPanel2(){setTimeout(function(){ShowSearchPanel()},500);}
function ShowSearchPanel1(){ShowSearchPanel();}
function ShowSearchPanel(t){
	var p = 'search_panel';
	if(_ge('searchtest').value){
		if(sp_hide_timeout) clearTimeout(sp_hide_timeout);
		sp_hide_timeout=setTimeout(function(){_sdisp(p,0)},t?t:7e3);
		_sdisp(p,1);
	} else _sdisp(p,0);
}

// Продвинутая статусная сетка
StGrFillOpt=0;
function StGrSettings(){
	jwindow3('javascript:',0,0,'',1);
	setTimeout(function(){StGrSettings2()},1e3);
}

function SelectFillOption(){
	var r = document.getElementsByName('StGrSettingsRadio');
	NofOptions = r.length;
	for (var i=0; i<NofOptions; i++){
		StGrSetR = r[i];
		if (StGrSetR.checked) StGrFillOpt = StGrSetR.value;
	}
	reFillStatusCells(1);
}

function StGrSettings2(){

	if (_ge('li3')) _sdisp('li3',0);
	var sr = 'StGrSettingsRadio';
	var H = '<div style="font-size:10px; line-height:12px; font-weight:bold; color:#777; text-align:right; padding-right: 10px;">'+WUS.N+'</div>';
	
	H+='<div style="position: relative; padding: 5px 10px; font-size: 18px; line-height:20px; font-weight:bold; color:#d71a1a;">'+WUS.t.SGsT+'</div><div style="position: relative; padding: 5px 10px; font-size: 15px; line-height:20px; font-weight:bold;">'+WUS.t.SGsF+'</div><div onClick="SelectFillOption()" style="font-size:12px; line-height:14px; padding-left: 10px;">';
	var S = WUS.t.SGsS.split('; '), a=b=0;
	
	for (var i=0;i<S.length;i++){
		if (S[i]){
			H += '<input type="radio" name="'+sr+'" id="'+sr+b+'_'+a+'" value="'+b+'_'+a+'"/><label for="'+sr+b+'_'+a+'">'+S[i]+'</label><br/>';
			a++;
		}else{
			H += '<br style="font-size:7px; line-height:7px;" />';
			a=0; b++;
		}
	}
	H += '</div><br/><div id="StGrS_info" style="position: relative; padding: 3px; font-size: 14px; line-height:18px; font-weight:bold; text-align:center; width:90%"></div>';
	_j3HTML(H);
	_ge(sr+StGrFillOpt).click();
}	
	
function reFillStatusCells(reset){
var o = StGrFillOpt;
if (o!='0_0'||reset){
	var cl = 'statusgridCell',
		c = _gcn(cl),
		Mx = 0, Mn = 9e9,
		cv, vc=[], val, Cells=0,
		NOP=[], lnk=[], sList=[],

		ifFO=function(v){return (o.split('_')[0]==v)},
		SH = function(n){return lnk[n].innerHTML},
		CN = function(i,n){return c[i].getElementsByClassName(n)};
	
	for (var i=0; i<c.length; i++) if(CN(i,'rounded_block')[0]&&CN(i,'statsList')[0]&&CN(i,'showstatlink')[0]){
		lnk = CN(i,'showstatlink');
		sList = CN(i,'statsList')[0].innerHTML.split('onclick="return false;">');
		NOP[i] = sList[2].split('<')[0];
		switch(o){
			case '1_0':	cv = CN(i,'rounded_block')[0].innerHTML; break;
			case '1_1':	cv = NOP[i]; break;	
			case '1_2':	cv = sList[4].split('<')[0];break;
			case '1_3':	cv = sList[6].split('<')[0];break;
			case '2_0': case '3_0': cv = SH(1); break;
			case '2_1': case '3_1': cv = SH(3); break;
			case '2_2': case '3_2': cv = SH(5); break;
			case '2_3': case '3_3': cv = SH(7); break;
			case '2_4': case '3_4': cv = SH(9); break;
			case '2_5': case '3_5': cv = SH(11);break;
			case '2_6':				cv = SH(13).split('(')[0]; break;
			case '2_7': case '3_6': cv = SH(13).split('(')[1]; break;
		}
		NOP[i]=parseFloat(NOP[i]);
		cv = parseFloat(cv);

		if (ifFO('3'))    vc[i] = (cv/NOP[i]*100).toFixed(2);
		else if (o=='1_3') vc[i] = cv.toFixed(1);
		else               vc[i] = cv.toFixed(0);
		if (parseFloat(vc[i])>parseFloat(Mx)) Mx=vc[i];
		if (parseFloat(vc[i])<parseFloat(Mn)) Mn=vc[i];
		Cells++;
	} else { NOP[i] = 0; vc[i] = 0;}
	
	for (var i=0; i<c.length; i++) {
		if ((o == '0_0')||((NOP[i]==0)&&((o!='1_2')||(o!='1_3'))))
			_gcn('statusgridCell')[i].style.background= 'rgba(50,50,50,0.4)';
		else {
			var v2 = (vc[i]-Mn)/(Mx-Mn);
			val = (o=='1_0')?(vc[i]/100):(ifFO('3')||ifFO('2'))?(1-v2):v2;
			var r = ((1-val)*511).toFixed(0), g = 511-r;
			r=r>255?255:r;
			g=g>255?255:g;
			_gcn('statusgridCell')[i].style.background= 'rgba('+r+','+g+',0,0.7)';
		}
	}
	if(_ge('StGrS_info')){
		if ((o == '0_0')||(Cells==0)) _ge('StGrS_info').innerHTML='';
		else {
			var FT =(ifFO('3')||ifFO('2'))?'2':'1';
			var Dim=(ifFO('3')||(o == '1_0'))?' %':'';
			_ge('StGrS_info').innerHTML=Mn+Dim+' <img style="margin-bottom:-4px;" src="'+iconURL('StGrFill'+FT)+'" /> '+Mx+Dim;
		}
	}
}
}

old_mtype = old_vtype = old_stgrd = old_tfltr = -1;
timer0 = window.setInterval( update_layers, 3000 );

function update_layers(){
	var isopt = function(e,f){ _ge(e).innerHTML=f?'●':'○'; _ge(e).style.color=f?'#fff':'#777'; }
	var v=vtype==1?0:vtype, m=mtype, s=statusgrid, t=tagfilter, vv=[8,0,9,4], tv=[3,6,5];
	if(old_vtype!=v){ for (var n=0; n<4; n++) isopt('wus_vt'+vv[n], v==vv[n]); old_vtype=v; }
	if(old_mtype!=m){ for (var n=0; n<3; n++) isopt('wus_mt'+tv[n], m==jmtype1[tv[n]]); old_mtype=m; }
	if(old_tfltr!=t){ isopt('wus_s1', t==45694); old_tfltr=t; }
	if(old_stgrd!=s){ isopt('wus_s2', s); old_stgrd=s; }
	map_hist_save();
}

last_s0_text='';
WriteStatus_Timeout=0;

function Write_Status(f,t,c){
	var s = 'CEditS'
	if(f||t){
		_ge(s+f).innerHTML = t?t:'&nbsp;';
		_ge(s+f).style.color = c?c:'#fff';	
	}else{
		_ge(s+0).innerHTML = WUS.N;	
		_ge(s+0).style.color = '#777';	
	}
	if(!f){
		last_s0_text=t; 
		if(WriteStatus_Timeout) clearTimeout(WriteStatus_Timeout);
		WriteStatus_Timeout=setTimeout(function(){
			if(_ge(s+0).innerHTML==last_s0_text) Write_Status(0);
		},4000);
	}
}

WUStimer0 = window.setInterval(WUS_timer_0, 500);
markerz_l_in_statusbar=-1;
doubles_in_statusbar=0;
sq_in_statusbar=0;
poly_saved=1;

function WUS_timer_0() {
	WUS_p_mode = tagfilter?2:_ge('CEditPanel')&&_gdisp('CEditPanel')!='none'?1:0;
	var m_l = 0;
	if ((typeof markerz!='undefined')&&(markerz.length>0)){
		var ms=[], x=[], y=[], sx=sy=0;
		m_l = markerz.length;
		ms = markerz.slice();

		for (var i=0; i<m_l; i++) {	var p = ms[i].position; x[i] = p.lng(); y[i] = p.lat(); sx+=x[i]; sy+=y[i];}

		var C=_getC(), y0 = C.lat(), x0 = C.lng();
		adj_x = _dfcen(y0, x0+1);
		adj_y = _dfcen(y0+1, x0);

		markerz_s=ms; polyc=C;

		var res = 0;
		for (var i = 0; i<m_l; i++) {
			if (i==0) s = (x[0] - x[m_l-1])*(y[m_l-1] - y[0]);
			else s = (x[i] - x[i-1])*(y[i] + y[i-1] - 2*y[0]);
			res += s;
		}
		var at = WUS.t.area.split('; ')[0],
			sq = Math.abs(res*adj_x*adj_y/2);

		if (sq!=sq_in_statusbar){
			sq_in_statusbar = sq;
			var a1 = a2 = '';
			var f1=function(p,c,i){return ((sq/p).toFixed(c))+' '+WUS.t.area.split('; ')[i]+', '},
				f2=function(a,b){b=b?(sq<b):1; return (sq>=a)&&b};

			if(f2(0,100))	a1+=f1(1,2,1);
			if(f2(100,1e4))	a1+=f1(1,0,1);
			if(f2(1e4,1e6)) a1+=f1(1e6,4,4);
			if(f2(1e6,1e8))	a1+=f1(1e6,2,4);
			if(f2(1e8))		a1+=f1(1e6,0,4);
			if(f2(10,1e4))	a1+=f1(100,2,2);
			if(f2(1e4,1e7))	a1+=f1(1e4,2,3);
			if(f2(1e7,1e9))	a1+=f1(1e4,0,3);

			if(f2(0,836.12736))			a2+=f1(0.83612736,2,5);
			if(f2(836.12736,836127.36))	a2+=f1(0.83612736,0,5);
			if(f2(0,92.90304))			a2+=f1(0.09290304,2,6);
			if(f2(92.90304,92903.04 ))	a2+=f1(0.09290304,0,6);
			if(f2(4.04685642,4046.85642)) a2+=f1(4046.85642,4,7);
			if(f2(4046.85642,404685.642)) a2+=f1(4046.85642,2,7);
			if(f2(404685.642,404685642)) a2+=f1(4046.85642,0,7);
			if(f2(92903.04,2589988.1))	a2+=f1(2589988.1,4,8);
			if(f2(2589988.1,2589988100)) a2+=f1(2589988.1,2,8);
			if(f2(2589988100))			a2+=f1(2589988.1,0,8);
			
			WUS_area = a1+a2;
			var sql=(100-(sq*1e-2/(lvl?((lvl>1)?99601:24414):3164))).toFixed(2);
			sql=(sql>=0)?'+'+sql:sql;
			var AT = at + ': ' + WUS_area;
			if (m_l>2) Write_Status(5, AT.slice(0, AT.length-2) + (sql<100?' ('+sql+'%)':''), sql<=0?'#f44':'');
			else Write_Status(5);
		}

		if (_ge(WUS.B)&&(_ge(WUS.B).innerHTML.indexOf('del_all_obj')>-1)){
			if (!_ge('area_meter')) 
				_ge(WUS.B).getElementsByTagName('div')[0].innerHTML += '<br style="font-size:12px;"/><div class="wikimapia">'+at+' <span style="font-size:10px;color:#777; cursor:default;">('+WUS.N+')</span></div><br style="font-size:6px;line-height:6px;"/><div class="smcl" id="area_meter"></div>';
			_ge('area_meter').innerHTML = WUS_area.replace(/, /g,'<br>');
		}


		poly_saved=0;

		var dbl=0;
		if (m_l>1){
			for (var i=1; i<m_l; i++) if ((x[i]==x[i-1])&&(y[i]==y[i-1])) dbl++;
			if ((x[0]==x[m_l-1])&&(y[0]==y[m_l-1])) dbl++;
		}

		if (dbl!=doubles_in_statusbar){
			Write_Status(2, WUS.t.dotsD+': '+dbl,'#f44');
			_sdisp('CEditS2',dbl?1:0);
			doubles_in_statusbar = dbl;
		}
	} else {
		if (WUS_p_mode==1) for (var i=2; i<6; i++) Write_Status(i);
		if (rotate_mode) rotate_mode_off();
		Remove_LT_ovrly(); Remove_LS_ovrly();
	}

	if ((WUS_p_mode==1)&&(m_l!=markerz_l_in_statusbar)){
		var lm=(lvl?((lvl>1)?2500:1000):300)-m_l, mc;
		if(lm>0){
			lm='+'+lm;
			mc='#fff';
		} else mc='#f44';
		Write_Status(1, WUS.t.dotsN + ': ' + m_l + ' ('+lm+')', mc);
		markerz_l_in_statusbar = m_l;
		var mask=[3,3,2,1,1,1,3,3,3];
		for (var i=4; i<13; i++) CEbtn_onoff(i,m_l<mask[i-4]);
		CEbtn_onoff(1,3>m_l);
		CEbtn_onoff(13,3>m_l||m_l>4);
	}

	if ((poly_saved==0)&&(!(_ge('showinf')&&_ge('showinf').clientHeight))) save_previous_poly(1);

	//Окно истории
	if (_ge('selected_rev')&&!_ge('back_to_pace_description_link')){	 
		var cpR =_ge(WUS.b).innerHTML.split('compareRevs(\'')[1],
			HPID=cpR.split('\'')[0],
			HPl =cpR.split('\',\'')[1].split('\'')[0],
			HPlt=l_id[HPl],
			s=(cpR.split('\',')[2].split('\'')[1].indexOf('street')>-1)

		_ge('selected_rev').parentNode.innerHTML='<div style="border:1px solid #aaa; background-color:#eee; margin:2px; width:95%; height:25px;"><span class="likelink" style="float:left; font-size:12px; font-weight:bolder; margin:5px 7px;" onclick="jevals=\'jwindow(\&quot;/'+(s?'street/':'')+HPID+'/'+HPlt+'/\&quot;,1);\';">'+WUS.t.gtDescr+'</span><span class="likelink" style="float:left; font-size:12px; font-weight:bolder; margin:5px 7px;" onclick="'+(s?'GDownloadUrl(\'/ajax/check/?function=place_can_edit_protected&obj_id='+HPID+'\', function (response) {if (response == \'true\') {jwindow(\'/object/edit/?id='+HPID+'&lng='+HPl+'\');} else {eval(response)}});jwindow3_menu(1);':'jwindow(\'/object/edit/?object_type=2&id='+HPID+'&lng='+HPl+'\');jwindow3_menu(1);')+'">'+WUS.t.gtEdit+'</span><span id="back_to_pace_description_link" style="font-size:10px; float:right; margin:2px 4px; color:#aaa;">'+WUS.N+'</span></div>'+_ge('selected_rev').parentNode.innerHTML;
	}
	
	var WRH = parseInt(_ge(WUS.B).style.height)-92+'px',
		WKH = parseInt(WRH)/2+'px',
		WR = 'wus_rlist',
		WK = 'WUSrlinpKW';
	if (_ge(WR)&&(_ge(WR).style.height!=WRH)) setHgt(WR,WRH);
	if (_ge(WK)&&(_ge(WK).style.maxHeight!=WKH)) _ge(WK).style.maxHeight=WKH;

	var fl='flomenubcanc', sg='StGrSettingsButton';
	if (_ge(fl)&&(_ge(fl).onclick.toString().indexOf('removeQualityTileOverlay')>-1)&&!_ge(sg)) 
		_ge(fl).parentNode.innerHTML+='&nbsp;<button id="'+sg+'" class="button" onclick="StGrSettings();">'+WUS.t.SGsB+' (WUS)</button>&nbsp;';
}

google.maps.LatLng.prototype.distanceFrom = function(newLL) {
	var P = Math.PI/180,
		y1 = this.lat()*P, y2 = newLL.lat()*P, sy = Math.sin((y1-y2)/2),
		x1 = this.lng()*P, x2 = newLL.lng()*P, sx = Math.sin((x1-x2)/2),
		a = Math.pow(sy, 2.0) + Math.cos(y1) * Math.cos(y2) * Math.pow(sx, 2.0),
		d = 12756200*Math.asin(Math.min(1, Math.sqrt(a)));
	return d;
}

function upd_markers(){ drawpoly(); showmark(); poly_ready_to_save(); }

function remove_ceniconpol(movemap){
	if(ceniconpol) {
		if (movemap) map.setCenter(ceniconpol.position);
		ceniconpol.setMap(null); ceniconpol = null;
	}
}

function clear_doubles(){
	var ml = markerz.length,
		x=[], y=[], xo=[], yo=[], n=0,
		m = markerz.slice();		
	for(var i=0; i<ml; i++){ x[i] = m[i].position.lng(); y[i] = m[i].position.lat(); }
	for(var i=0; i<ml; i++){
		if (!(((i>0)&&(x[i]==x[i-1])&&(y[i]==y[i-1]))||((i==0)&&(x[0]==x[ml-1])&&(y[0]==y[ml-1])))){
			xo[n] = x[i]; yo[n] = y[i];	n++;
		}
	}
	clear_markerz();
	for( var i = 0; i<n; i++ ) _MPxyUpd(yo[i],xo[i],i);
	upd_markers();
}

in_toggle=0;

function toggle_expose_verts(op) {
  var ml = markerz.length;
  if(( ml > 0 )&&!in_toggle) {
	in_toggle=1;
	var p="/img/pdo.png";
    if(op){
		if( iconr.url == p ) iconr.url = iconURL("pdo50");
		else if( iconr.url == iconURL("pdo50")) iconr.url = iconURL("pdo25");
		else iconr.url = p;
	}else iconr.url = (iconr.url!=p)?p:"";	
    for( var i = 0; i < ml; i++ ) {
		markerz[i].setMap(null);
		_Mupd(i);
	}
	drawpoly(); showmark();
	in_toggle = 0;
  }
}

function copy_poly() {
	if( markerz.length > 2 ) {
		g_polycopy = markerz.slice();
		g_polycopy_origin = _getC();
		var y = g_polycopy_origin.lat();
		var x = g_polycopy_origin.lng();
		copy_adj_Lat = _dfcen(y+1, x);
		copy_adj_Lng = _dfcen(y, x+1);
		Write_Status(0, WUS.t.pcOK, '#ff4');
		CEbtn_onoff(2);
	}
}

function paste_poly() {
	g_replace = g_polycopy;
	g_replace_origin = g_polycopy_origin;
	replace_adj_Lat = copy_adj_Lat;
	replace_adj_Lng = copy_adj_Lng;
	replace_poly();	
}

function repeat_poly() {
	g_replace = markerz_saved;
	g_replace_origin = c_saved;
	replace_adj_Lat = saved_adj_Lat;
	replace_adj_Lng = saved_adj_Lng;
	replace_poly();
	if (!rotate_after_paste) RotatePoly();
}

function clear_markerz(){
  if (markerz&&markerz.length){	
	for( var i = markerz.length-1; i>0; i-- ) _Mremove(i);
	drawpoly(); _Mremove(0); drawpoly(); 
	markerz=[];
  }
}

function kml_load() {
	var kml = prompt(WUS.t.LoadI,'');
	if (kml){
		if (kml.indexOf('<coordinates>')>-1){
			var coordinates_array = [];
			coordinates_array = kml.split('<coordinates>')[1].split('</coordinates>')[0].split(/\s\s*/);
			if (markerz.length) clear_markerz();
			var n=0;	
			for( var i = 0; i < coordinates_array.length; i++ ) {
				if (coordinates_array[i].indexOf(',')>-1){
					var ll = coordinates_array[i].split(',');
					_MPxyUpd(parseFloat(ll[1]),parseFloat(ll[0]),n++);
				}
			}
			upd_markers(); feetallpoly(0);
			setTimeout(function(){drawpoly(); showmark();},1e3);
			setTimeout(function(){drawpoly(); showmark();},3e3);
			
		} else alert(WUS.t.LoadE);
	}
}

function replace_poly() {
  var gl=g_replace.length;
  if( gl >= 3 ) {
    clear_markerz();
    var c = _getC(), y = c.lat(), x = c.lng(), p, r,
		py = replace_adj_Lat/_dfcen(y+1, x),
		px = replace_adj_Lng/_dfcen(y, x+1);
	for(var i=0; i<gl; i++){
		p = g_replace[i].position;
		r = g_replace_origin
		lt = (p.lat()-r.lat())*py + y;
		ln = (p.lng()-r.lng())*px + x;
		_MPxyUpd(lt, ln,i);
    }
	upd_markers();
	if( rotate_mode == 1) RotatePoly();
	RotatePoly();
  } 
}

rotate_after_paste=0;

function save_previous_poly(rot){
	markerz_saved = [];
	markerz_saved = markerz_s;
	c_saved = polyc;
	saved_adj_Lat = adj_y;
	saved_adj_Lng = adj_x;
	poly_saved=1;
	rotate_after_paste=rot;
	CEbtn_onoff(0);
}

// Преобразование контура в прямоугольник

function make_rectangle() {
	
  var ml = markerz.length
  if((ml==4)||(ml==3)){
	to_rect = markerz.slice();
	
	var Ry = function(p){return to_rect[p].position.lat()}
	var Rx = function(p){return to_rect[p].position.lng()}

	var Py=[], Px=[],
		c = _getC(), y = c.lat(), x = c.lng(),
		dy = _dfcen(y+10, x),
		dx = _dfcen(y, x+10);
	Py[0] = Ry(0); Px[0] = Rx(0);
	var dLat = function(p1,p2){return (Ry(p1)-Ry(p2))*dy}
	var dLng = function(p1,p2){return (Rx(p1)-Rx(p2))*dx}
	var dir  = function(p){return -Math.abs(p+1)/(p+1)}

	var y1 = dLat(0,1); var x1 = dLng(0,1); var side1 = _dist0(y1,x1);
	var y2 = dLat(1,2); var x2 = dLng(1,2); var side2 = _dist0(y2,x2);
	var y3; var x3; var y4; var x4;

	if (ml==4){ y3 = dLat(3,2); x3 = dLng(3,2); y4 = dLat(0,3); x4 = dLng(0,3); }
	else {
		y3 = dLat(0,2); x3 = dLng(0,2); side3 = _dist0(y3,x3);

		if ((side1>side2)&&(side1>side3)){
			y2 =-y2; x2 =-x2; y1 = y3; x1 = x3;
			side1 = side3;
		}
		else if ((side2>side1)&&(side2>side3)){
			y1 =-y1; x1 =-x1; y2 = y3; x2 = x3;
			side2 = side3;
			Py[0] = Ry(1); Px[0] = Rx(1);
		}
		y3=y1; x3=x1; y4=y2; x4=x2;
	}
	side3 = _dist0(y3,x3);
	side4 = _dist0(y4,x4);
	var A = (side1+side3)/2;
	var B = (side2+side4)/2;

	var dAy = dir(y1); var dAx = dir(x1);
	var dBy = dir(y2); var dBx = dir(x2);

	if ((side1 > side2)&&(side3 > side4)){
		s1=Math.abs(y1)/side1; s2=Math.abs(y3)/side3;
		c1=Math.abs(x1)/side1; c2=Math.abs(x3)/side3;
		if (Math.abs(y1)>Math.abs(x1))
			dBy = (dAy==dAx)?((dBx>0)?-1:1):((dBx>0)?1:-1);
		else
			dBx = (dAy==dAx)?((dBy>0)?-1:1):((dBy>0)?1:-1);
	}else{
		s1=Math.abs(x2)/side2; s2=Math.abs(x4)/side4;
		c1=Math.abs(y2)/side2; c2=Math.abs(y4)/side4;
		if (Math.abs(y2)>Math.abs(x2))
			dAy = (dBy==dBx)?((dAx>0)?-1:1):((dAx>0)?1:-1);
		else
			dAx = (dBy==dBx)?((dAy>0)?-1:1):((dAy>0)?1:-1);
	}
	var s = (s1+s2)/2; var c = (c1+c2)/2;

	Py[1] = Py[0] + A/dy*s*dAy; Px[1] = Px[0] + A/dx*c*dAx;
	Py[2] = Py[1] + B/dy*c*dBy; Px[2] = Px[1] + B/dx*s*dBx;
	Py[3] = Py[2] - A/dy*s*dAy; Px[3] = Px[2] - A/dx*c*dAx;

    clear_markerz();
    for(var i=0; i<4; i++) _MPxyUpd(Py[i], Px[i], i);
	upd_markers();
  } else alert (WUS.t.rectI);
}

// Отражение контура
function reflection(dir){
	var ml = markerz.length
	if(ml>2){
		showmark();
		var  cr = _getC();
		var mz = markerz.slice();
		clear_markerz();
		for( var i = 0; i<ml; i++ ) {
			var lt = mz[i].position.lat();
			var ln = mz[i].position.lng();
			if (dir==1) ln = cr.lng()*2 - ln;
			if (dir==2) lt = cr.lat()*2 - lt;
			_MPxyUpd(lt,ln,i);
		}
		upd_markers();
	}
}

function WUS_polyft(){
	if(markerz.length){
		feetallpoly(0); 
		setTimeout(function(){drawpoly(); showmark();},1000);
		setTimeout(function(){drawpoly(); showmark();},3000);
	}
}

rotate_mode=0; rotate_marker_drag=0;

function RotatePoly(){ // Вращение контура
	if( rotate_mode == 0) {
		rotate_mode = 1;
		var ml = markerz.length
		if( ml>1 ) {
			showmark();
			var cr = _getC();
			R_Lat = cr.lat();
			R_Lng = cr.lng();
			var markerzz = markerz.slice();

			var ml = markerz.length
			for (var i=0; i<ml; i++) if (markerzz[i].position.lng() > R_Lng) R_Lng = markerzz[i].position.lng();
			R_Lng = R_Lng + (R_Lng-cr.lng())*0.2;

			iconR = new google.maps.MarkerImage();
			iconR.url = iconURL('RotateBig');
			iconR.size = new google.maps.Size(32, 32);
			iconR.anchor = new google.maps.Point(16, 16);

			rotate_marker = new google.maps.Marker({position: _createLL(R_Lat, R_Lng), icon:iconR, draggable:true});
			rotate_marker.setMap(map);
			rotate_marker_drag = google.maps.event.addListener(rotate_marker,'drag',function(){redrawPolygon(0);});
			rotate_marker_dragend = google.maps.event.addListener(rotate_marker,'dragend',function(){redrawPolygon(1);});

			var redrawPolygon = function(end) {
				var c = _getC(), y = c.lat(), x = c.lng();

				dR_Lat1 = y - R_Lat; dR_Lng1 = x - R_Lng;
				dR_r1 = _dist0(dR_Lat1, dR_Lng1);

				R_Lat = rotate_marker.position.lat();
				R_Lng = rotate_marker.position.lng();

				dR_Lat2 = y - R_Lat; dR_Lng2 = x - R_Lng;
				dR_r2 = _dist0(dR_Lat2, dR_Lng2);

				r_cos1 = dR_Lng1/dR_r1; r_sin1 = dR_Lat1/dR_r1;
				r_cos2 = dR_Lng2/dR_r2; r_sin2 = dR_Lat2/dR_r2;

				r_cos = r_cos1*r_cos2 + r_sin1*r_sin2;
				r_sin = r_sin1*r_cos2 - r_cos1*r_sin2;

				var adj_Lat = _dfcen(y+10, x),
					adj_Lng = _dfcen(y, x+10),
					markerzz = markerz.slice(),
					markerzz_Lng=[],
					markerzz_Lat=[],
					old_Lng=[],
					old_Lat=[];
					
				var ml = markerz.length
				for (var i=0; i<ml; i++){
					var p = markerzz[i].position;
					old_Lat[i] = (p.lat()-y)*adj_Lat;
					old_Lng[i] = (p.lng()-x)*adj_Lng;
					markerzz_Lat[i] = old_Lat[i]*r_cos - old_Lng[i]*r_sin;
					markerzz_Lng[i] = old_Lat[i]*r_sin + old_Lng[i]*r_cos;
				}
				for( var i = ml-1; i >=0; i-- ) {
					markerz[i].setMap(null);
					if (end) { markerz.splice(i,1); remakeid(); }
				}
				markerz=[];

				for( var i = 0; i<ml; i++ ) {
					_MPxy( markerzz_Lat[i]/adj_Lat + y, markerzz_Lng[i]/adj_Lng + x);
					if (end) _Mupd(i);
				}
				upd_markers();
				var a = (((Math.asin(r_sin2)>0)?-1:1)*Math.abs(Math.acos(-r_cos2))*180/Math.PI).toFixed(1),
					R=WUS.t.Rot + ': ';
				if ((a==0)||(Math.abs(a)==45)||(Math.abs(a)==90)||(Math.abs(a)==135)||(a==180))
					Write_Status(4,R+'<b>'+a+'°</b>');
				else Write_Status(4,R+a+'°');
			}
			Write_Status(4,WUS.t.Rot + ': <b>0.0°</b>');
		}
	} else rotate_mode_off()
}

function rotate_mode_off(){
	Write_Status(0); Write_Status(4);
	if (rotate_marker_drag){
		_rlst(rotate_marker_drag);
		_rlst(rotate_marker_dragend);
		rotate_marker.setMap(null);
	}
	rotate_mode = 0;
}

// On-save event (Взято из Wikimapper+)
function poly_ready_to_save() {
  doafterxmlget = "setTimeout( 'clear_cache();', 5000 )";
  mapttip(); mapttipc();
  flphoar[31] = 0;
  lastxy = [];
  is_addfn = 0;
  is_changed = 1;
  pointlisten = 1;
  psavemenu();
}

g_add_poly_handle_mouse_click = '';
g_add_poly_handle_mouse_move  = '';
g_poly_preview = null;
mcircle = null;

function transform_to_poly(n) {
	var ml = markerz.length;
	if ((ml>1)&&!mcircle){
		mcircle = 1;

		var ln=0, lt=0, r=0;
		for (var i = 0; i < ml; i++) {
			ln += markerz[i].position.lng();
			lt += markerz[i].position.lat();
		}
		lt = lt / ml;
		ln = ln / ml;
		var center = _createLL(lt,ln);
		for (var i = 0; i < ml; i++) r += markerz[i].position.distanceFrom(center);
		r = r / ml / 10;
		clear_markerz();

		if (n==0) var count = circle_point_count(r)
		else if (n==4) var count = 4
		else count = ml;
		
		var ax = r / center.distanceFrom( _createLL( lt, ln + 0.1 ) ),
			ay = r / center.distanceFrom( _createLL( lt + 0.1, ln ) );

		for( var i = 0; i < count; i++ ) {
			var t = ( 2 * Math.PI * (i/count) );
			_MPxyUpd( lt + ay*Math.sin(t), ln + ax*Math.cos(t), i);
		}
		upd_markers();
		mcircle = null;
	}
}

function circle_point_count( r ) {
    var c = parseInt(r * Math.PI) * 6;
    return (c>120)?120:(c<24)?24:c;
}
WUS_poly_N=8;
function select_poly_N(o){
	var p='WUSCEpoly', b='2px solid #';
	for (var i=3; i<21; i++) {
		if(o==(p+i)) WUS_poly_N=i;
		_ge(p+i).style.border=b+(o==(p+i)?'aaa':'444');
	}
	if(!_gdisp('CEdit_poly')) add_poly(WUS_poly_N);
}

// Рисование многоугольника  (Взято из Wikimapper+)
function add_poly(n) {

	var compute_poly_vertices = function( first_vertex, make_gmarker ) {
		var vertices = [],
			radius = bounds.getCenter().distanceFrom(first_vertex)/10,
			count = n?n:circle_point_count(radius),
			c=bounds.getCenter(),	x=c.lng(), y=c.lat(),
			adj_x_r = radius/_dfcen(y, x+0.1),
			adj_y_r = radius/_dfcen(y+0.1, x),
			t0 = Math.atan2(adj_x_r*(first_vertex.lat()-y), adj_y_r*(first_vertex.lng()-x));

		if(make_gmarker==true){make_gmarker=function(v){return new google.maps.Marker({position:v,icon:iconr,draggable:true});};} 
		else{make_gmarker=function(v){return v;};}

		for( var i = 0; i < count; i++ ) {
			var t = t0 + ( 2 * Math.PI * (i/count) );
			vertices.push( make_gmarker( _createLL( y + adj_y_r*Math.sin(t), x + adj_x_r*Math.cos(t))));
		}
		return vertices;
	}

	function handle_poly_click( event ) {
		_rlst( g_add_poly_handle_mouse_move );
		_rlst( g_add_poly_handle_mouse_click );
		clear_markerz();
		markerz = compute_poly_vertices( event.latLng, true );
		for( var i = 0; i < markerz.length; i++ )_Mupd(i);
		upd_markers();
		CEdit_pswitch(0);
		if( g_poly_preview ){g_poly_preview.setMap(null); g_poly_preview = null;}
	}

	function handle_poly_mouse_move( event ) { 
		var poly = compute_poly_vertices( event.latLng, false );
		poly.push( poly[0] );
		if( g_poly_preview ){g_poly_preview.setMap(null);}
		g_poly_preview = new google.maps.Polyline({ path:poly,strokeColor:"#f33",strokeWeight:1,strokeOpacity:1,clickable:false});
		g_poly_preview.setMap(map);
	}

	if ( g_add_poly_handle_mouse_move ) {
		_rlst( g_add_poly_handle_mouse_move );
		g_add_poly_handle_mouse_move = null;
	}
	if ( g_add_poly_handle_mouse_click ) {
		_rlst( g_add_poly_handle_mouse_click );
		g_add_poly_handle_mouse_click = null;
	}
	if( g_poly_preview ) {
		g_poly_preview.setMap(null);
		g_poly_preview = null;
	}
	jwindow_close();
	remove_ceniconpol(1);

	if( edit_block_id == 0 ) { doafterxmlget = ""; fast( "/sys/save4/?freq=2&id=0" ); }

	var ml = markerz.length;
	if (ml>2) save_previous_poly(0);
	clear_markerz();

	if( pline ) { pline.setMap(null); pline = null; }
	if( plineprev ) { plineprev.setMap(null); plineprev = null; }
	if( showpolyl ) { showpolyl.setMap(null); showpolyl = null; }
	pointlisten = 1;
  
	g_add_poly_handle_mouse_click = google.maps.event.addListener( map, "click",     handle_poly_click );
	g_add_poly_handle_mouse_move  = google.maps.event.addListener( map, "mousemove", handle_poly_mouse_move );
}

// Перерисовать контур

function shrinkPolyPit(fC){
	if(typeof markerz=='undefined'||(typeof markerz!='undefined'&&!markerz.length)){return false;}
	setTimeout(function(){shrinkPolyPit2(fC);},50);
}
function shrinkPolyPit2(fC){
	if (markerz.length>2) save_previous_poly(0);
	var ml=markerz.length;
	clear_markerz();
	remove_ceniconpol(0);
	Write_Status(0, WUS.t.dotsX+': '+ml, '#f44');
	var newP;
	is_changed=0;
	if(!fC){
		is_changed=true;
		for(var i=0;i<3;i++){
			newP=new GPoint(ceniconpol.position.lng(),ceniconpol.position.lat());
			markerz[markerz.length]=new google.maps.Marker({position:newP,icon:iconr,draggable:true});
			markerz[markerz.length-1].setMap(map);
			is_changed++;
			marker_pref(markerz.length-1);
		}
		drawpoly();
		showmark();
	}
}

prev_mode=0;

function Remove_LS_ovrly(){
	if(moveDotsPolyPit.dragMarker){
		delDotsPolyPit.prev1.setMap(null); delDotsPolyPit.prev2.setMap(null);
		delDotsPolyPit.sdRP1.setMap(null); delDotsPolyPit.sdRP2.setMap(null);
		moveDotsPolyPit.delMarker.setMap(null);
		moveDotsPolyPit.dragMarker.setMap(null);
		delDotsPolyPit.sdRP1=delDotsPolyPit.sdRP2=moveDotsPolyPit.dragMarker=moveDotsPolyPit.delMarker=null;
	}
}

function moveDotsPolyPit(btn,mode){
	btn.blur();
	btn.clicked=!btn.clicked;
	rotate_mode_off();
	if (prev_mode==0) prev_mode = mode;
	if((!btn.clicked)||(mode!=prev_mode)){
		Remove_LS_ovrly();
		Write_Status(3);
		if(moveDotsPolyPit.dragMarker){
			is_changed=1;
			remakeid();
			showmark();
		}
		if (mode!=prev_mode) btn.clicked=!btn.clicked;
	}
	if(btn.clicked){
		if(typeof markerz=='undefined'||(markerz.length<3)){
			btn.clicked=false;
			return false;
		}
		if(!delDotsPolyPit.sdRP1){
			collectDotsPolyPit(1,mode);
		}
	}
	prev_mode = mode;
}

function makeMoveMarker(){
	var rPI=new google.maps.MarkerImage();
	rPI.url=iconURL('Move');
	rPI.size=new google.maps.Size(32,32);
	rPI.anchor=new google.maps.Point(-30,37);
	return rPI;
}

function makeDeleteMarker(){
	var rPI=new google.maps.MarkerImage();
	rPI.url=iconURL('DeleteDots');
	rPI.size=new google.maps.Size(32,32);
	rPI.anchor=new google.maps.Point(-30,-5);
	return rPI;
}
inshowprocess = 0;

function collectDotsPolyPit(moveD,mode){
	Smode = mode;
	delDotsPolyPit.redrawRect=function(){
		var d1=delDotsPolyPit.sdRP1.position, y1=d1.lat(), x1=d1.lng(),
			d2=delDotsPolyPit.sdRP2.position, y2=d2.lat(), x2=d2.lng();
		if(delDotsPolyPit.prev1) delDotsPolyPit.prev1.setMap(null);
		if(delDotsPolyPit.prev2) delDotsPolyPit.prev2.setMap(null);
		
		if (Smode==1){
			delDotsPolyPit.prev1= new google.maps.Polyline({path:[_createLL(y1,x1),_createLL(y2,x1),_createLL(y2,x2),_createLL(y1,x2),_createLL(y1,x1)],strokeColor:'#000',strokeWeight:4,strokeOpacity:1});
			if (window.opera)
				delDotsPolyPit.prev2= new google.maps.Polyline({path:[_createLL(y1,x1),_createLL(y2,x1),_createLL(y2,x2),_createLL(y1,x2),_createLL(y1,x1)],strokeColor:'#0ff',strokeWeight:2,strokeOpacity:1});
			else
				delDotsPolyPit.prev2= new google.maps.Polygon({path:[_createLL(y1,x1),_createLL(y2,x1),_createLL(y2,x2),_createLL(y1,x2),_createLL(y1,x1)],strokeColor:'#0ff',strokeWeight:2,strokeOpacity:1,fillColor:'#fff',fillOpacity:0.2});
		} else if (Smode==2){
			mark1min=1e6;
			mark2min=1e6;
			var pline=[];
			
			var c=_getC(), x=c.lng(), y=c.lat(),
				adj_x = c.distanceFrom(_createLL(y, x+0.1)),
				adj_y = c.distanceFrom(_createLL(y+0.1, x));
			
			for(var i=markerz.length-1;i>=0;i--){
				var p = markerz[i].position
				mark1R=_dist0((p.lng()-x1)*adj_x, (p.lat()-y1)*adj_y);
				mark2R=_dist0((p.lng()-x2)*adj_x, (p.lat()-y2)*adj_y);
				if(mark1R<mark1min){ mark1min=mark1R; mark1minN=i; }
				if(mark2R<mark2min){ mark2min=mark2R; mark2minN=i; }
			}
			if (mark1minN>=mark2minN) for(var i=mark2minN;i<mark1minN+1;i++) pline[i-mark2minN] = markerz[i].position;
			else {
				j=0;
				for(var i=mark2minN;i<markerz.length;i++) pline[j++] = markerz[i].position;
				for(var i=0;i<mark1minN+1;i++) pline[j++] = markerz[i].position;
			}
			var Pl = function(c,w){return new google.maps.Polyline({path:pline,strokeColor:c,strokeWeight:w,strokeOpacity:1})};
			delDotsPolyPit.prev1= Pl('#000',5); delDotsPolyPit.prev2= Pl('#fff',3);
		} 
		delDotsPolyPit.prev1.setMap(map);
		delDotsPolyPit.prev2.setMap(map);
		var markerPos =  _createLL(y1/2+y2/2,Math.max(x1,x2));
		if(moveDotsPolyPit.dragMarker)moveDotsPolyPit.dragMarker.setPosition(markerPos);
		if(moveDotsPolyPit.delMarker ) moveDotsPolyPit.delMarker.setPosition(markerPos);
	}

	var B=map.getBounds(),
		p1=B.getSouthWest(),
		p2=B.getNorthEast(),
		h=Math.abs(p2.lat()-p1.lat())/16,
		w=Math.abs(p2.lng()-p1.lng())/16,
		c=_getC(), cX=c.lng(), cY=c.lat(),
		rPI1=new google.maps.MarkerImage(),
		rPI2=new google.maps.MarkerImage();

	if (Smode==1){
		rPI1.url=iconURL("Edit-add");
		rPI1.size=new google.maps.Size(32,32);
		rPI1.anchor=new google.maps.Point(16,16);
		rPI2=rPI1; X1=cX+w; Y1=cY+h; X2=cX-w; Y2=cY-h;
	} else if (Smode==2){
		rPI1.url=iconURL("Arrow_top_left");
		rPI1.size=new google.maps.Size(32,32);
		rPI1.anchor=new google.maps.Point(0,-10);
		rPI2.url=iconURL("Arrow_top_right");
		rPI2.size=new google.maps.Size(32,32);
		rPI2.anchor=new google.maps.Point(32,-10);
		X1=cX+w; Y1=cY; X2=cX-w; Y2=cY;
	}

	delDotsPolyPit.sdRP1=new google.maps.Marker({position: _createLL(Y1,X1),icon:rPI1,draggable:true});
	delDotsPolyPit.sdRP2=new google.maps.Marker({position: _createLL(Y2,X2),icon:rPI2,draggable:true});
	delDotsPolyPit.sdRP1.setMap(map);
	delDotsPolyPit.sdRP2.setMap(map);
	delDotsPolyPit.redrawRect();
	google.maps.event.addListener(delDotsPolyPit.sdRP1,'drag',function(){delDotsPolyPit.redrawRect();});
	google.maps.event.addListener(delDotsPolyPit.sdRP2,'drag',function(){delDotsPolyPit.redrawRect();});
	google.maps.event.addListener(delDotsPolyPit.sdRP1,'dragend',function(){
		delDotsPolyPit.redrawRect(); Write_Status(3, WUS.t.dotsS+': '+collectDotsPolyPit2(2), '#ff0');
	});
	google.maps.event.addListener(delDotsPolyPit.sdRP2,'dragend',function(){
		delDotsPolyPit.redrawRect(); Write_Status(3, WUS.t.dotsS+': '+collectDotsPolyPit2(2), '#ff0');
	});

	google.maps.event.addListener(delDotsPolyPit.sdRP1,'mouseover',function(){
		Write_Status(0, WUS.t.dSelS, '#4f4');
		if(stoppprev==2)return;
		if(stoppprev==0)stoppprev=1;
		cancelprev();
	});

	google.maps.event.addListener(delDotsPolyPit.sdRP1,'mouseout',function(){
		Write_Status(0);
		if(stoppprev==1)stoppprev=0;
	});

	google.maps.event.addListener(delDotsPolyPit.sdRP2,'mouseover',function(){
		Write_Status(0, WUS.t.dSelS, '#4f4');
		if(stoppprev==2)return;
		if(stoppprev==0)stoppprev=1;
		cancelprev();
	});
		
	google.maps.event.addListener(delDotsPolyPit.sdRP2,'mouseout',function(){
		Write_Status(0);
		if(stoppprev==1)stoppprev=0;
	});

	var rPI=makeMoveMarker();
	var dragMarker=new google.maps.Marker({position: _createLL(cY,cX+w),icon:rPI,draggable:true});
	dragMarker.setMap(map);
	moveDotsPolyPit.dragMarker=dragMarker;
	
	var rPI=makeDeleteMarker();
	var delMarker=new google.maps.Marker({position: _createLL(cY,cX+w),icon:rPI,draggable:false,clickable:true});
	delMarker.setMap(map);
	moveDotsPolyPit.delMarker=delMarker;

	google.maps.event.addListener(dragMarker,'mouseover',function(){
		Write_Status(0, WUS.t.dSelM, '#79f');
		if(stoppprev==2)return;
		if(stoppprev==0)stoppprev=1;
		cancelprev();
	});
	google.maps.event.addListener(dragMarker,'mouseout',function(){
		Write_Status(0);
		if(stoppprev==1)stoppprev=0;
	});
	google.maps.event.addListener(dragMarker,'dragstart',function(){
		moveDotsPolyPit.arr=[];
		moveDotsPolyPit.xyp1=delDotsPolyPit.sdRP1.position;
		moveDotsPolyPit.xyp2=delDotsPolyPit.sdRP2.position;
		moveDotsPolyPit.xy=dragMarker.position;
		dotmenuoff();
		is_changed++;
		moveDotsPolyPit.markers=collectDotsPolyPit2(1);
		Write_Status(3, WUS.t.dotsM+': '+moveDotsPolyPit.markers.length, '#79f');
		for(var i=0;i<moveDotsPolyPit.markers.length;i++)moveDotsPolyPit.arr[i]=moveDotsPolyPit.markers[i].position;
		stoppprev=2;
		cancelprev();
	});
	google.maps.event.addListener(dragMarker,'dragend',function(){
		moveDotsPolyPit.show();
		moveDotsPolyPit.arr=[];
		stoppprev=0;
	});
	google.maps.event.addListener(dragMarker,'drag',function(){moveDotsPolyPit.show();});
	google.maps.event.addListener(delMarker,'mouseover',function(){
		Write_Status(0, WUS.t.dSelX, '#f44');
		cancelprev();
	});
	google.maps.event.addListener(delMarker,'mouseout',function(){Write_Status(0);});
	google.maps.event.addListener(delMarker,'click',function(){
		counter=collectDotsPolyPit2(0);
		Write_Status(3, WUS.t.dotsX+': '+counter, '#f44');
		is_changed=1;
		remakeid(); drawpoly(); showmark();
	});

	moveDotsPolyPit.show=function(){
		if (inshowprocess==0){
			inshowprocess=1;
			var deltaxy1=dragMarker.position;
			var x=deltaxy1.lng()-moveDotsPolyPit.xy.lng();
			var y=deltaxy1.lat()-moveDotsPolyPit.xy.lat();
			for(var i=0;i<moveDotsPolyPit.markers.length;i++) moveDotsPolyPit.markers[i].setPosition(_createLL(moveDotsPolyPit.arr[i].lat()+y,moveDotsPolyPit.arr[i].lng()+x));
			drawpoly(); showmark();

			delDotsPolyPit.sdRP1.setPosition(_createLL(moveDotsPolyPit.xyp1.lat()+y,moveDotsPolyPit.xyp1.lng()+x));
			delDotsPolyPit.sdRP2.setPosition(_createLL(moveDotsPolyPit.xyp2.lat()+y,moveDotsPolyPit.xyp2.lng()+x));
			delDotsPolyPit.redrawRect();
			inshowprocess=0;
		}
	}
}

function collectDotsPolyPit2(m){
	var p1 = delDotsPolyPit.sdRP1.position,
		p2 = delDotsPolyPit.sdRP2.position,
		xMx=Math.max(p1.lng(),p2.lng()),
		xMn=Math.min(p1.lng(),p2.lng()),
		yMx=Math.max(p1.lat(),p2.lat()),
		yMn=Math.min(p1.lat(),p2.lat()),
		mX, mY, C=0, s=[],
		p=function(){if(m==1)s.push(markerz[i]); else {if(m!=2)_Mremove(i); C++;}}

	if (Smode==1) for(var i=markerz.length-1;i>=0;i--){
		var k = markerz[i].position;
		mX=k.lng(); mY=k.lat();
		if((mX<xMx&&mX>xMn&&mY<yMx&&mY>yMn)) p();
	} else if (Smode==2) {
		if (mark1minN>=mark2minN) 
			for(var i=mark1minN;i>=mark2minN;i--) p();	
		else {
			for(var i=markerz.length-1;i>=mark2minN;i--) p();
			for(var i=mark1minN;i>=0;i--) p();
		}
	}
	if(m==1)return s;
	else return C;
}
function delDotsPolyPit(){}

//################## Преобразование отрезка ###################

function Begin_line_selection(){
	Line_sel_arrow_position = bounds.getCenter();
	Line_selection();
}

function Line_selection(){

  if (markerz.length>2){
	Write_Status(0, WUS.t.LTi+':');
	var Arrow=new google.maps.MarkerImage();
	Arrow.url=iconURL("Arrow_top_left");
	Arrow.size=new google.maps.Size(32,32);
	Arrow.anchor=new google.maps.Point(0,-10);

	Line_sel_Arrow=new google.maps.Marker({position:Line_sel_arrow_position,icon:Arrow,draggable:true,title:WUS.t.dSelS});
	Line_sel_Arrow.setMap(map);
	google.maps.event.addListener(Line_sel_Arrow,'drag', function(){ Select_line(); });
	google.maps.event.addListener(cancelprev, 'mouseover', function(){ Select_line(); });

	var Select_line=function(){
		cancelprev();
		var ml=markerz.length,
			sel_line=[],
			c=_getC(), x=c.lng(), y=c.lat(),
			ax=c.distanceFrom(_createLL(y,x+0.1)),
			ay=c.distanceFrom(_createLL(y+0.1,x)),
			p=Line_sel_Arrow.position,
			y1=p.lat(), x1=p.lng()
			p0=markerz[0].position,
			p1=markerz[ml-1].position,
			mX=(p0.lng()/2+p1.lng()/2-x1)*ax,
			mY=(p0.lat()/2+p1.lat()/2-y1)*ay,
			mR=Math.sqrt(mX*mX+mY*mY),
			mmin=mR;

		mark_minN1=ml-1;
		mark_minN2=0;

		for(var i=ml-2;i>=0;i--){
			var a=markerz[i].position,
				b=markerz[i+1].position;
			mX=(a.lng()/2+b.lng()/2-x1)*ax;
			mY=(a.lat()/2+b.lat()/2-y1)*ay;
			mR=Math.sqrt(mX*mX+mY*mY);
			if(mmin>mR){mmin=mR; mark_minN1=i; mark_minN2=i+1;}
		}
		sel_line[0] = markerz[mark_minN1].position;
		sel_line[1] = markerz[mark_minN2].position;

		Remove_sel_lines();
		var Pl = function(c,w){return new google.maps.Polyline({path:sel_line,strokeColor:c,strokeWeight:w,strokeOpacity:1})};
		sel_line1 = Pl('#000',8); sel_line1.setMap(map);
		sel_line2 = Pl('#fff',4); sel_line2.setMap(map);
	}
	Select_line();
  } else {
	CEdit_pswitch(0);
	Write_Status(0, WUS.t.LTe);
  }
}
sel_line1 = sel_line2 = sel_line3 = new google.maps.Polyline();

function End_line_selection(){
	if(typeof Line_sel_Arrow != "undefined") Line_sel_arrow_position = Line_sel_Arrow.position;
	Remove_LT_ovrly();
}

function Remove_sel_lines(){
	if(sel_line1) sel_line1.setMap(null);
	if(sel_line2) sel_line2.setMap(null);
	if(sel_line3) sel_line3.setMap(null);
}

function Remove_LT_ovrly(){
	if(typeof Line_sel_Arrow != "undefined") Line_sel_Arrow.setMap(null);
	Remove_sel_lines();
}

function Highlight_slider(slider, color){ slider.parentNode.style.backgroundColor=color; }
function setParam(param, val){ _ge('input_'+param).value=val; }
function getParam(param){return parseFloat(_ge('input_'+param).value) }

function Slider_field(s,b){
	s.style.left  = b?-40:-4;
	s.style.width = b?100:28;
	s.style.top   = b?-42:-2;
	s.style.height= b?100:20;
	s.style.zIndex= b?7e3:6e3;
}

function Line_transform(m){
	_ge('Description_img').innerHTML='<img src="'+iconURL('Line00'+m)+'" style="width:100px; height:60px; margin:1px; position:relative; float:left;">';

	_sdisp('CEdit_line_1',0);
	_sdisp('Redo_LT',1);
	_sdisp('CEdit_line_2',1);
	Write_Status(0);

	var s='slider_', Cx='C_x', Ct='C_x_text', A='A', B='B', C='C', a='25.0', b='50.0', с='0.0';
	setParam(A,a); setParam('plus_A',0); setLft(s+A,51);
	setParam(B,a); setParam('plus_B',0); setLft(s+B,51);
	setParam(C,b); setParam('plus_C',0); setLft(s+C,101);

	if((m==1)||(m==4)){
		if(m==1){ _ge(Ct).innerHTML=''; _sdisp(Cx,0); }
		else { _ge(Ct).innerHTML='A↔B'; _sdisp(Cx,1); }
		setParam(A,b); setLft(s+A,101);
		setParam(B,b); setLft(s+B,101);
	} else {
		if(m==5){
			setParam(A,с); setLft(s+A,'1');
			setParam(B,с); setLft(s+B,'1');
		} 
		_sdisp(Cx,1);
		_ge(Ct).innerHTML='A=B';
	}
	End_line_selection();
	tranform_mode=m;
	Line_transform_preview();
}

function Line_transform_params(e){

	var inp = 'input_',	pl = 'plus_', sl = 'slider_',
		t = tranform_mode, p,
		v = function(e,c){_ge(inp+e).value=c};

	if(moveState==false){
		v(e,getParam(e).toFixed(1));
		p = getParam(e);
		if((!p)||(p<0))v(e,'0.0');
		if(p>100) v(e,'100.0');
		setLft(sl+e, getParam(e)*2+1);
		v(pl+e,getParam(pl+e).toFixed());
		p = getParam(pl+e);
		if((!p)||(p<0)) v(pl+e,0);
		if(p>1e4) v(pl+e,1e4);
	} else v(e,((parseInt(retLft(sl+e))-1)/2).toFixed(1));

	if((t!=1)&&(t!=4)&&(_chck('C_x'))){
		if(e=='A'){
			if(getParam('A')>50) v('A','50.0');
			setLft(sl+'A', getParam('A')*2+1);
			v('B',_ge(inp+'A').value);
			setLft(sl+'B', retLft(sl+'A'));
		} else
		if(e=='B'){
			if(getParam('B')>50) v('B','50.0');
			setLft(sl+'B', getParam('B')*2+1);
			v('A',_ge(inp+'B').value);
			setLft(sl+'A', retLft(sl+'B'));
		}
	}

	if(((getParam('A')+getParam('B'))>100)||(t==1)||(t==4)){
		if (e=='A') {
			v('B',(100-getParam('A')).toFixed(1));
			setLft(sl+'B', getParam('B')*2+1);
		}
		if (e=='B') {
			v('A',(100-getParam('B')).toFixed(1));
			setLft(sl+'A', getParam('A')*2+1);
		}
	}
	Line_transform_preview();
}

function Line_transform_preview(){

	Remove_sel_lines();
	sel_line=[];

	var p1 = markerz[mark_minN1].position,
		p2 = markerz[mark_minN2].position,
		pP = (mark_minN2==markerz.length-1)?markerz[0].position:markerz[mark_minN2+1].position,
		pM = (mark_minN1==0)?markerz[markerz.length-1].position:markerz[mark_minN1-1].position,

		y1 = p1.lat(), x1 = p1.lng(),
		y2 = p2.lat(), x2 = p2.lng(),

		C_dir = (_chck('C_dir'))?-1:1,
		A = (getParam('A')+getParam('plus_A'))/100,
		B = (getParam('B')+getParam('plus_B'))/100,
		C = (getParam('C')+getParam('plus_C'))/100*C_dir,

		cnt=_getC(), x=cnt.lng(), y=cnt.lat(),
		xy = cnt.distanceFrom(_createLL(y,x+0.1))/cnt.distanceFrom(_createLL(y+0.1,x)),

		dy=y2-y1, Ay=dy*A, By=dy*B, Cy=dy*C/xy,
		dx=x2-x1, Ax=dx*A, Bx=dx*B, Cx=dx*C*xy,
	
		o1 = function(y0,x0){return _createLL( y1+y0, x1+x0)},
		o2 = function(y0,x0){return _createLL( y2-y0, x2-x0)},
		AC = o1(Ay-Cx, Ax+Cy),
		BC = o2(By+Cx, Bx-Cy);

	A=o1(Ay,Ax); B=o2(By,Bx);
	
	var m = tranform_mode,
		k = _chck('C_x'),
		l = [];

	l[1] = [p1,AC,p2];
	l[2] = [p1,A,AC,BC,B,p2];
	l[3] = [p1,AC,BC,p2];
	l[4] = k?[p1,A,AC,o2(Cx,-Cy),pP]:[pM,o1(-Cx,Cy),BC,B,p2];
	l[5] = [pM, o1(-xy*Ax-Cx, Ay/xy+Cy), o2(xy*Bx+Cx, By/xy-Cy), pP];
	sel_line = l[m];
	insert_from=(((m==4)&&(!k))||(m==5))?1:0;
	insert_to=((m==4)&&k)?4:(m==5)?3:sel_line.length;
	
	white_line=[];
	for (var i=insert_from; i<insert_to;i++) white_line[i-insert_from]=sel_line[i];

	var line = function(path,c,w){return new google.maps.Polyline({path:path,strokeColor:c,strokeWeight:w,strokeOpacity:1});};

	sel_line1= line(sel_line,'#000',4);   sel_line1.setMap(map);
	sel_line2= line(sel_line,'#999',2);   sel_line2.setMap(map);
	sel_line3= line(white_line,'#fff',2); sel_line3.setMap(map);
}

function Apply_line_transform() {

 	pre_markerz=markerz.slice();
	var ml = markerz.length;
    clear_markerz();

	var e = (mark_minN1==0)?(ml-1):(mark_minN1-1),
		s = (mark_minN2==ml-1)?0:(mark_minN2+1),
		j = 0;

	var f = function(s,e,i){for(var i=s; i<=e; i++)_MPposUpd(pre_markerz[i].position,j++);}
	if (s>e) { f(s,ml-1,i); f(0,e,i); }  
	else f(s,e,i);
	for( var i = insert_from; i < insert_to; i++ ) _MPposUpd(sel_line[i],j++);
	drawpoly(); showmark();
	Remove_sel_lines();
    poly_ready_to_save();
}

setTimeout(function(){
	var f = show_svgdiv.toString();
	modified_show_svgdiv = f.substring(f.indexOf('{')+1,f.lastIndexOf('}')).replace('\'stroke-width\',"1"','\'stroke-width\',lW').replace('\'stroke\',o[4]','\'stroke\',o[5]').replace('"stroke-width", "1"','"stroke-width", lW').replace('"stroke", o[4]','"stroke", o[5]');
	show_svgdiv = function(kvid,point,polyz,o) {
		var sv = function(obj){return _ge(obj).options[_ge(obj).selectedIndex].value}
		if(!o)o=[];
		o[4] = WUS_Pset_get(0);
		o[5] = WUS_Pset_get(1);
		o[8] = WUS_Pset_get(3);
		lW = WUS_Pset_get(2);
		WUS_p_mode3=0;
		eval(modified_show_svgdiv);
	}
},100);

//######### Копирование и вставка описания (Взято из Wikimapper+)
function copy_form() {
	if( _ge( 'wikiedit' ) ) {
		var e = _ge( 'wikiedit' );

		g_tagedit_copy = {
			n: e.form_name.value,
			d: e.form_description.value,
			h: e.nomer_doma.value,
			l: e.street.value,
			s: e.new_street.value,
			b: e.is_building.checked,
			w: e.wikipedia.value
		};
		g_tagedit_copy.c = [];

		for(var i=0; i<2; i++) for(var cat_id in ar_tcats_cur[i]) g_tagedit_copy.c.push(ar_tcats_cur[i][cat_id]);
		alert(WUS.t.cOK);
	}
}

function _add_div(n) {
	_ge('additional_edits').insertBefore(_ge('add_div'+n),_ge('additional_edits').childNodes[0]);
	_sdisp('add_div'+n,'block'); _sdisp('td'+n,0);
}

function paste_form() { 
	if( g_tagedit_copy && _ge('wikiedit') ) {

		_add_div(1); _add_div(2); _add_div(5); _add_div(7);

		var e = _ge('wikiedit');
		var c = g_tagedit_copy;
		e.form_name.value = c.n;
		e.form_description.value = c.d;
		e.nomer_doma.value = c.h;
		e.street.value = c.l;
		e.new_street.value = c.s;
		e.is_building.checked = c.b;
		e.wikipedia.value = c.w;
		for( var cat_id in c.c ) tcats_upd( 1, c.c[cat_id] );
	}
}
} // end translateVariableCC

function   _ge(obj){return document.getElementById(obj)}
function  _gtn(obj){return document.getElementsByTagName(obj)}
function _HTML(obj){return _ge(obj).innerHTML}
function  _chset(n){var i = (typeof localStorage == "undefined")?'':localStorage.getItem('WUS_S_o'); return i?i.split(',')[n]=='1':0}
function  _jw3()   {return _ge('jwiframe3').contentDocument}
function   _jw()   {return _ge('jwiframe').contentDocument}
function   _sv(obj){return _ge(obj).options[_ge(obj).selectedIndex].value}
function _cdiv()   {return document.createElement('div')}
function _remv(obj){if (_ge(obj)) _ge(obj).parentNode.removeChild(_ge(obj));}
function _seli(obj,val){_ge(obj).selectedIndex = val;}
function _gdisp(obj){return _ge(obj).style.display;}
function _sdisp(obj,val){_ge(obj).style.display = (val==1)?'':(val==0)?'none':val;}
function  _stop(obj,val){_ge(obj).style.top = val+'px';}
function iconURL(name){return 'http://www.webmap.clan.su/file/wmus/'+name+'.png'}

WUS.N='Wikimapia UserScript';
WUS.PE='CEditPanel';
WUS.Fnt='font-family: &quot;Verdana&quot;, &quot;Arial&quot;, &quot;Helvetica&quot;, sans-serif; ';
WUS.b='jwindow_body';
WUS.B='jwindow3_body';

if (_ge('wm0')){

var pitScript_tVCC_S=document.createElement('script');
pitScript_tVCC_S.type='text/javascript';
_gtn('head')[0].insertBefore(pitScript_tVCC_S,_gtn('head')[0].firstChild);
var t_pitScript_tVCC_S=window.WUSfn.toString();
t_pitScript_tVCC_S=t_pitScript_tVCC_S.substring(t_pitScript_tVCC_S.indexOf('{')+1,t_pitScript_tVCC_S.lastIndexOf('}'));
pitScript_tVCC_S.appendChild(document.createTextNode(t_pitScript_tVCC_S+'if(!window.name)window.name="00000";\n'));

var script_div=_cdiv();
document.body.insertBefore(script_div,document.body.firstChild);

//####################################### Панель управления контурами ###############################
var img  = '<img style="width: 32px; height:32px; margin:1px; position:relative; float:left; cursor:pointer;" src="http://www.webmap.clan.su/file/wmus/';

CEditPanel_HTML='<div style="width:470px; height:60px; float:left">';
a01='style="position:absolute; background-color:#888; width:222px; height:18px; left:5px; top:';
a02='px;"><div style="position:absolute; top:1px; left:1px; background-color:#000; color:#fff; font-Size:12px; font-Weight:bolder; text-align:center; width:20px; height:16px; cursor:pointer" onmousedown="initMove(this,event); return false;" onmouseout="moveState=false; Highlight_slider(this,\'#888\');" onmouseover="Highlight_slider(this,\'#aaa\');" onmouseup="moveState=false;" onmousemove="moveHandler(this,event); move_bound(this); Line_transform_params(\'iii\');" id="slider_iii">iii<div style="position:absolute; top:-2px; left:-4px; z-index:6000; width:28px; height:20px; cursor:pointer" onmousedown="Slider_field(this,1);" onmouseup="Slider_field(this);" onmouseover="Slider_field(this);" ></div></div></div><input class="searchin" onChange="Line_transform_params(\'iii\');" onBlur="Line_transform_params(\'iii\');" onMouseOver="this.select();" value="0.0" style="position:absolute; text-align: center; left:230px; width: 47px; height:20px; font-Size:12px; font-Weight:bolder; top:yyypx;"id="input_iii"><div style="position:absolute; top:yyypx; left:278px; color:#fff; font-Size:14px; line-height:18px; font-Weight:bolder; text-align:center; width:10px; height:18px;">+</div><input class="searchin" onChange="Line_transform_params(\'iii\');" onBlur="Line_transform_params(\'iii\');" onMouseOver="this.select();"value="0" style="position:absolute; text-align: center; left:290px; width: 47px; height:20px; font-Size:12px; font-Weight:bolder; top:yyypx;"id="input_plus_iii"><div style=" cursor:pointer; position:absolute; top:yyypx; left:338px; color:#955; font-Size:15px; line-height:18px; text-align:center; width:10px; height:18px;" onClick="_ge(\'input_plus_iii\').value=\'0\'; Line_transform_params(\'iii\');" onMouseOver="this.style.color=\'#f00\'" onMouseOut="this.style.color=\'#955\'">&#9003;</div>';

CEditPanel_HTML+='<div id="Line_parameters" style="width:355px; height:60px; position:relative; float:left;" onmouseover="Write_Status(0, \''+WUS.T.LTp+'\');"> \
<div '+a01+ '1'+a02.replace(/iii/g,'A').replace(/yyy/g,'0')+'  \
<div '+a01+'21'+a02.replace(/iii/g,'B').replace(/yyy/g,'20')+' \
<div '+a01+'41'+a02.replace(/iii/g,'C').replace(/yyy/g,'40')+' \
<input id="C_dir" type="checkbox" style="position:absolute; top:41px; left:363px;" onclick="Line_transform_params(\'C\');"><div style="position:absolute; top:41px; left:378px; color:#fff; font-Size:14px; font-Weight:bolder; text-align:center; width:20px; height:18px;">±</div><input id="C_x" type="checkbox" style="position:absolute; top:41px; left:400px;" onclick="Line_transform_params(\'A\');"><div id="C_x_text" style="position:absolute; top:41px; left:419px; color:#fff; font-Size:14px; font-Weight:bolder; text-align:center; width:25px; height:18px;"></div></div> \
'+img+'Arrow_top_left.png"  onmouseover="Write_Status(0, \''+WUS.T.Rsegsel+'\');" \
	onclick="_sdisp(\'CEdit_line_2\',0); _sdisp(\'CEdit_line_1\',1); Line_selection();"> \
'+img+'Apply.png" onmouseover="Write_Status(0, \''+WUS.T.LTa+'\');"  \
	onclick="_sdisp(\'CEdit_line_2\',0); _sdisp(\'CEdit_line_1\',1); Apply_line_transform(); Line_selection();"> \
'+img+'Button_cancel.png" onmouseover="Write_Status(0, \''+WUS.T.LTc+'\');"  \
	onclick="_sdisp(\'CEdit_line_2\',0); _sdisp(\'CEdit_main\',1); End_line_selection();"> \
</div>';

	//Панель редактирования контура
	function createCEP(){

		var H0=H1=H2=H3='',
			p = 'Page_repeat; Page_copy; Page_paste; kml32; Shape_flip_horizontal; Shape_flip_vertical; RotateBig; Gtk-zoom-fit; Editdelete; Pdo3; Select1; Select2; Line2; Rectangle; Circle; Poly4; PolyN'.split('; ');
		
		for(var i=0;i<17;i++) H0+='<div id="WUSCEbtn'+i+'" style="background:url('+iconURL(p[i])+'); opacity:'+(i>2?1:0.5)+';"></div>';
		for(var i=3;i<21;i++) H1+='<div><div id="WUSCEpoly'+i+'">'+i+'</div></div>';
		H2+='<div id="Redo_LT" style="background:url('+iconURL('redo')+'); display:none;" onmouseover="Line_transform_preview();" onmouseout="End_line_selection(); Line_selection();"></div>';
		for(var i=1;i<6;i++) H2+='<div id="WUSCElnb'+i+'" style="background:url('+iconURL('Line0'+i)+'); width:64px; margin:0 9px;"></div>';
		H2+='<div id="Cancel_LT" style="background:url('+iconURL('Button_cancel')+');"></div>';
		H3+='<div id="Description_img" style="width:100px; height:60px; float:left"></div>'+CEditPanel_HTML;

		var H = '<div id="'+WUS.PE+'" class="WUS_panel" style="padding:3px; display:none;" unselectable="on" onmousemove="CEdit_mover(event)" onclick="CEdit_Lclick(event)" oncontextmenu="CEdit_Rclick(event); return false;" onrightclick="CEdit_Rclick(event); return false;" onmouseover="stoppprev=1;cancelprev();" onmouseout="stoppprev=0;">\
			<div id="CEditS0" style="font-Weight:700; font-variant: normal; '+WUS.Fnt+' font-Size:12px; color:#777; position:relative; cursor:default; width:100%; text-align:center; margin-top:-3px; margin-bottom:5px;  text-shadow:0 0 3px #000, 0 0 3px #000, 0 0 3px #000;">'+WUS.N+'</div>\
			<div id="CEdit_main" class="WUS_CEbtn">'+H0+'</div>\
			<div id="CEdit_poly" class="WUS_CEbtn">'+H1+'</div>\
			<div id="CEdit_line_1" class="WUS_CEbtn">'+H2+'</div>\
			<div id="CEdit_line_2">'+H3+'</div>\
			<div class="WUS_statline">\
				<br>\
				<div id="CEditS1">&nbsp;</div>\
				<div id="CEditS2" style="cursor:pointer;">&nbsp;</div>\
				<div id="CEditS3">&nbsp;</div>\
				<div id="CEditS4" style="float:right;">&nbsp;</div>\
				<br>\
				<div id="CEditS5">&nbsp;</div>\
			</div>\
		</div>';

		H+= '</div>';
		var EP=_cdiv(); script_div.appendChild(EP); EP.innerHTML=H;
	}
}else{
	var pitGoogleAdsS=_gtn('script');
	for(var i=0;i<pitGoogleAdsS.length;i++){
		if(pitGoogleAdsS[i].text.indexOf('document.write')>-1&&pitGoogleAdsS[i].parentNode.lastChild.innerHTML=='')pitGoogleAdsS[i].parentNode.removeChild(pitGoogleAdsS[i].parentNode.lastChild);
	}
	setTimeout(function(){
		var GoogleAds=_gtn('ins');
		for(var i=0;i<GoogleAds.length;i++)GoogleAds[i].parentNode.removeChild(GoogleAds[i]);
		_remv('upper_ad_block_put'); _remv('upper_ad_block'); _remv('google_ads_frame1'); _remv('google_ads_frame2');
		
	},300);
}
//####################  кнопки в заголовке окна

if(_ge('jwindow_title_menu')){
var pitDivGoBack=document.createElement('span');
_remv('pitDivGoBackD');
pitDivGoBack.id='pitDivGoBackD';
pitDivGoBack.style.cursor='pointer';
pitDivGoBack.style.position='absolute';
pitDivGoBack.style.top='2px';
pitDivGoBack.style.right='17px';

pitDivGoBack.innerHTML='<span onclick="jwindow3_menu(0);" id="pitLastPlaceSpn" style="margin-right:7px" title="'+WUS.T.LastTag+' ('+WUS.N+')"><img src="'+iconURL('Back')+'" alt="" border="0" style="position: relative; left: 0px; top: 0px"/></span><span onclick="jwStyle = _ge(\'jwindow\').style; scr_w=window.opera?document.documentElement.clientWidth:document.body.clientWidth; scr_h=window.opera?document.documentElement.clientHeight:document.body.clientHeight; if ((parseInt(jwStyle.height) != parseInt(scr_h))||( parseInt(jwStyle.width) != parseInt(scr_w))) {jwt=jwStyle.top; jwStyle.top = 0; jwl=jwStyle.left; jwStyle.left = 0; jwh=jwStyle.height; jwStyle.height = parseInt(scr_h); jww=jwStyle.width; jwStyle.width = scr_w;} else {jwStyle.top = jwt; jwStyle.left = jwl; jwStyle.height = jwh; jwStyle.width = jww; } _ge(\''+WUS.b+'\').style.height = parseInt(jwStyle.height)-20;" Style="margin-right:7px" title="'+WUS.T.Max+' ('+WUS.N+')"><img src="'+iconURL('Maximize')+'" alt="" border="0" style="position: relative; left: 0px; top: 0px"/></span><span onclick="window.open(window.location.href);" Style="margin-right:7px" title="'+WUS.T.NewTab+' ('+WUS.N+')"><img src="'+iconURL('Dubl')+'" alt="" border="0" style="position: relative; left: 0px; top: 0px"/></span>';

parent.document.getElementById('jwindow_title_menu').parentNode.insertBefore(pitDivGoBack,parent.document.getElementById('jwindow_title_menu'));
}

if(_ge('wm0')){   //####################### Кнопки в основном окне

function createButtonsPanel(n,p,pos,icons){
	var H = '<div style="width:10px; height:50%; position:absolute; z-index:10; bottom:0px; '+pos+':0px; opacity:0;" onmouseover="ScriptPanelTT('+n+')"></div><div id="'+p+'ScriptPanel" unselectable="on" style="width:36px; position:absolute; overflow-x:hidden; overflow-y:hidden; z-index:11; bottom:45%; margin-bottom:-185px; '+pos+':0px; opacity:1"><div style="background: url('+iconURL(p+'/t')+'); height:17px;"></div><div style="background: url('+iconURL(p+'/c')+') repeat; cursor:pointer; padding-top:7px; padding-left:5px;">';
	for(var i=0; i<icons.split('; ').length; i++)
		H+='<div style="background: url('+iconURL(p+'/'+icons.split('; ')[i])+') center no-repeat; width:24px; height:24px; margin-bottom:6px; '+((n==1)?'padding-left:5px;':'')+'" onclick="ScriptPanelClick('+(i+(n-1)*10)+')" onmouseover="ScriptPanelTT('+n+','+i+')" onmouseout="ScriptPanelTT('+n+')"></div>';
	H += '</div><div style="background: url('+iconURL(p+'/b')+'); height:7px; margin-top:-6px;"></div></div>';
	return H;
}

BP_HTML  = createButtonsPanel(1,'r','right', 'wl; home; road; user; set');
BP_HTML += createButtonsPanel(2,'l', 'left', 're; back; layers; bm; mm');
BP_HTML += '<textarea id="S_list_buf" style="display:none"></textarea><div id="uid_input" style="display:none"></div>';
BP_HTML += '<div id="ScriptTT" style="position: absolute; color:#000; font-Weight:bolder; '+WUS.Fnt+' font-Size:12px; z-index:20; line-height:10px; text-shadow:0 0 18px #fff, 0 0 17px #fff, 0 0 16px #fff, 0 0 15px #fff, 0 0 14px #fff, 0 0 13px #fff, 0 0 12px #fff; display:none; bottom:45%;"></div>';

// Левая панель
wus_left_2='';LayerListRow=0;
WUS.T.lay = WUS.T.lay.split('; ');
function createLayerPoint(c,i,d){ wus_left_2+='<div onclick="ScriptPanelClick('+c+')"><img src="'+iconURL('lp/'+i)+'" alt="" border="0"/><span id="wus_'+d+'">○</span> '+WUS.T.lay[LayerListRow++]+'</div>'; }
function createLayerTitle(){wus_left_2+='<div style="color:#f51a1a;font-Size:14px;cursor:default; margin-top:7px;">'+WUS.T.lay[LayerListRow++]+'</div>';}

createLayerTitle(); for (var n=0; n<3; n++) createLayerPoint('100,'+[3,6,5][n],'m'+n,'mt'+[3,6,5][n]);
createLayerTitle(); for (var n=0; n<4; n++) createLayerPoint('101,'+[8,0,9,4][n],'v'+n,'vt'+[8,0,9,4][n]);
createLayerTitle(); createLayerPoint(102,'hl','s1'); createLayerPoint(103,'sg','s2');

BP_HTML+='<div id="wus_left" class="WUS_panel" style="left: 37px; bottom:45%; margin-bottom:-185px; display:none;" unselectable="on">\
	<div style="margin:-3px; margin-bottom:-7px; height:22px;">\
		<div class="WUS_l">'+WUS.N+'</div>\
		<div style="float:right; cursor:pointer;" onclick="WUS_left_open(0);">\
			<img src="'+iconURL('x')+'" alt="" border="0"/>\
		</div>\
	</div>\
	<textarea style="display:none;" id="resources_panel_pre"></textarea>\
	<div id="wus_left_1" class="WUS_list"></div>\
	<div id="wus_left_2" style="width:160px;" class="WUS_list">'+wus_left_2+'</div>\
</div>';

wus_search='';
WUS.T.srch = WUS.T.srch.split('; ');
for (var n=0; n<6; n++) wus_search +='<div onclick="ScriptPanelClick(50'+n+')" style="width:90px;"><img src="'+iconURL('s/'+n)+'" alt="" border="0"/>'+WUS.T.srch[n]+'</div>';
BP_HTML += '<div id="search_panel" onmousemove="ShowSearchPanel();" onmouseout="ShowSearchPanel(500);" style="z-index:200000; right:3px; top:25px; width:270px; display:none;" class="WUS_panel"><div class="WUS_list">'+wus_search+'</div><div class="WUS_l">'+WUS.N+'</div></div>'

var BtnPanel=_cdiv(); script_div.appendChild(BtnPanel); BtnPanel.innerHTML=BP_HTML;

//###################### Панель информации о скрипте
var APanel=_cdiv(); script_div.appendChild(APanel);
APanel_innerHTML ='<div id="script_panel" style="display:none;"><div style="cursor:pointer; position:absolute; width:100%; height:100%; left:0; top:0; background-Color:#000; opacity: 0.6; z-index: 99999;" onclick="_sdisp(\'script_panel\',0)"></div><div id="about_panel" style="position:absolute; width:600px; height:170px; left:50%; margin-left:-300px; top:50%; margin-top:-100px; background:rgba(0,0,0,0.7); z-index:99999; -webkit-border-radius:17px; -moz-border-radius:17px; border-radius:17px; border:2px solid #777;" unselectable="on"><div style="position:absolute; width:100%; height:100%; left:0; top:0;"><div style="color:#fd0; '+WUS.Fnt+' font-Weight:bolder; font-Size:12px; line-height:12px; width:140px; height:30px; left: 10px; top:7px; position:absolute; z-index:99999; text-align:center;"><img src="/wiki/skins/common/images/wiki.png" border="0"/>UserScript v.'+WUS.v+'</div><div style="color:#fff; font-Size:15px; line-height:16px; width:440px; height:155px; left:160px; top:7px; position:absolute; z-index:99999;">'+WUS.T.about+'</div><div style="font-Weight:bolder; font-Size:15px; width:300px; height:12px; right:139px; bottom:10px; position: absolute; text-align:left; z-index:99999;"><a style="color:#ccc;" href="http://'+WUS.T.home+'" target="_blank">'+WUS.T.homeT+'</a></div><div style="color:#aaa; font-Weight:bolder; font-Size:15px; width:200px; height:12px; right:12px; bottom:10px; position:absolute; text-align:right; z-index: 99999;"><i><a style="color:#ccc;" href="javascript:" onclick="_sdisp(\'script_panel\',0); jwindow(\'/user/350424/\',0,0,\'\',1);">IIIeka</a>, '+WUS.d+'</i></div></div></div>';
APanel.innerHTML=APanel_innerHTML;

//###################### Проверка личных сообщений ######

var MPanel=_cdiv();
script_div.appendChild(MPanel);
MPanel.innerHTML='<div id="message_panel" title="('+WUS.N+')" style="display:none; width: 240px; height: 40px; position: absolute; z-index: 2000; left: 35px; top: 70px" unselectable="on"><div id="message_panel_bg" style="position: absolute; overflow-x: hidden; overflow-y: hidden; width: 240px; height: 40px; background-Color:#000; opacity: 0.7;"></div><div onclick="jwindow(\'/user/messages/?uid=\'+uid,0,0,\'\',1);jwindow3_menu(1);" title="('+WUS.N+')" style="color:#ff0; font-Weight:bolder; font-Size:17px; line-height:17px; width: 220px; height: 30px; left: 10px; top: -5px; position: absolute; z-index: 2000; cursor: pointer;"><img src="http://www.webmap.clan.su/file/wmus/Email7.gif" alt="" border="0" style="position: relative;  left: -5px; top: 10px; cursor: pointer;"/><i> '+WUS.T.mes+'</i></div><div id="messages_list" style="color:#fff; font-Size:13px;  line-height:18px; font-Weight:bolder; width: 210px; height: 30px; left: 15px; top: 50px; position: absolute; z-index: 2000; cursor: pointer;"></div></div>';		

function private_message_request(){
	var i = parseInt(_HTML('uid_input'));
	if (i){
		xmlhttp1=new XMLHttpRequest();
		xmlhttp1.open('GET','/user/messages/?uid='+i,true);
		xmlhttp1.onreadystatechange=function(){private_message_request2(xmlhttp1)};
		xmlhttp1.send(null);
	} else mes_req_enable = 1;
}

function private_message_request2(x){

	if(x.readyState!=4){mes_req_enable = 1; return;}
	var Mes=x.responseText.split('class="row'),
		Mes_len=Mes.length-1,
		mp = 'message_panel',
		text='', n=55;
	for (var ms=1; ms<Mes_len; ms++)
		if (Mes[ms].split('<span class="likelink"').length==4){
			var NoM = Mes[ms].split('<span class="likelink"')[3].split('(')[1].split(')')[0],
				data = Mes[ms].split('class="name"')[1],
				UN  = data.split('>')[2].split('<')[0],
				LM  = data.split('<br')[1].split('<span')[1].split(' ');
			if (LM.length>4) LM[3]= LM[3] +' '+ LM[4];
			on_click= 'jwindow(\'/user/messages/?sid='+_HTML('uid_input')+'&rid='+Mes[ms].split('onclick="linkclick')[1].split('\'')[1]+'\',0,0,\'\',1)';
			text+='<span onclick="'+on_click+'">'+UN+' ('+NoM+') <span style="color:#aaa; font-Size:10px;line-height:14px;"> '+LM[2]+' '+LM[3]+'</span></span><br>';
			n+=18;
		}
	if (text){
		_ge(mp).style.height=n;	_ge(mp+'_bg').style.height=n;
		_ge('messages_list').innerHTML=text;
		_sdisp(mp,1); _stop(mp,70);
	} 
	else if (_gdisp(mp)=='') _sdisp(mp,0);	
	mes_req_enable = 1;
}
}

cur_location = ' ';
mes_req_period = 0;
mes_req_enable = 1;
delta_start_values = 50;
jw_move_state=0;
WLbtn_onclick1 = '';
WLbtn_onclick2 = '';
start_value=0;

function divFunc() {

// Установка областей для перемещения и изменения размера окна
if ((_ge('jwindow'))&&(_ge('movejwindow'))){

	var J = _ge('jwindow').style,
		M = _ge('movejwindow').style,
		R = _ge('resizejwindow').style,
		JL = parseInt(J.left),
		JW = parseInt(J.width),
		JT = parseInt(J.top),
		JH = parseInt(J.height),
		B = JL+JW-60,
		T = JT+JH-60,
		W = JW-350,
		L = JL+250,
		b = WUS.B;
		
	if (_ge(b)&&(_gdisp(b) != 'none')&& (_ge(b).style.width)) {jw3_w = parseInt(_ge(b).style.width);}
	else jw3_w = 0;

	if((J.display == "block")&&(jw_move_state == 0)) {
		if (jw3_w && (jw3_w > JL)) {
			J.left = (JL - (jw3_w / 2));
			if (JL < 0) J.left = 0;
			_ge('jwindow').style.left = J.left;
		}
		M.width=W; M.left=L; M.top=J.top;
		if (JW>400) M.display = '';
		else M.display = 'none';
		R.left=B; R.top=T; R.display='';
		jw_move_state = 1;
	} else if((J.display == "none")&&(jw_move_state == 1)){
		jw_move_state = 2;
		M.display = R.display = 'none';
	} else if(jw_move_state == 2) jw_move_state = 0;
	else if((M.left!=L)&&(M.top!=J.top)&&(R.left!=B)&&(R.top!=T)&&(M.height=='20px')&&(R.height=='70px')){
		if (JW>400){ M.left=L; M.top=JT; M.width= W;}
		else M.display = 'none';
		R.left=B; R.top=T;
	}
	if (M.left!=L) J.left = parseInt(M.left) - 250;
}


if (_ge('jw3cm')){	
	// Сохранение адреса текущего открытого окна описания объекта
	if ((location.href.split('show=').length > 1)&&(location.href.split('show=')[1] != cur_location)){
		GoBackD_HTML = _HTML('pitDivGoBackD');
		_ge('pitDivGoBackD').innerHTML = GoBackD_HTML.split('onclick="')[0]+'onclick="jwindow3_menu(0);setTimeout(function(){jwindow_close();jwindow(\''+cur_location+'\',0,0,0,1);},150);" id="pitLastPlaceSpn"'+GoBackD_HTML.split('id="pitLastPlaceSpn"')[1];
		cur_location = location.href.split('show=')[1];
	}
	if ((_ge('jwiframe'))&&(_ge('jwiframe').src.indexOf('http://wikimapia.org/street/')>-1)&&!(_HTML(WUS.b).indexOf('street/history/show')>-1)&&!(_jw().getElementById('open_in_side_panel_div'))){
		_jw().getElementsByClassName('permalink')[0].parentNode.innerHTML+='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="likelink" id="open_in_side_panel_div" onclick="parent.jwindow3(\''+_ge('jwiframe').src+'\');">'+WUS.T.inLP+'</span>';
	}
}
var PE=WUS.PE, s = _ge('showinf');
if (s&&s.clientHeight){
	if (_ge(PE)){
		if (s.innerHTML.indexOf('/wiki/Adding_place')>-1){
			if (_gdisp(PE)=='none'){
				var p=['main','poly','line_1','line_2'];
				for (var i=0; i<4; i++) _sdisp('CEdit_'+p[i], !i);
				_sdisp(PE,1);
			}
		}
		_ge(PE).style.left=_ge('map').offsetWidth/2-_ge(PE).offsetWidth/2+'px';
		_ge(PE).style.bottom=parseInt(s.offsetHeight)+5+'px';
	} else createCEP();
} else if (_ge(PE)&&(_gdisp(PE)!='none'))_sdisp(PE,0);

if(_ge('wm0')){			// Проверка сообщений
	if (mes_req_enable)	mes_req_period++;
	if (mes_req_period == 150) {
		mes_req_period = mes_req_enable = 0;
		private_message_request();
	}
}

// Кнопки в окне редактирования
	if ((_ge('wikiedit'))&&(!_ge('wikiedit_btns'))){
		Edit_btns=' <button id="wikiedit_btns" class="button1" onclick="copy_form(); return false;">'+WUS.T.c+'</button> <button class="button1" onclick="paste_form(); is_changed++; is_t_changed++; return false;">'+WUS.T.p+'</button> ';
		_ge('wikiedit').getElementsByTagName('button')[0].parentNode.innerHTML+=Edit_btns;
	}

// Список наблюдений
	wl_place = '', B=WUS.B, b=WUS.b;
	if (_ge(B)&&((_HTML(B).indexOf('test_zoom(')>-1)||(_HTML(B).indexOf('onclick="RoadRev.load')>-1))&&!_ge('WLplus3')) wl_place = B;
	else if	(is_wl_in_jw=_ge(b)&&((_HTML(b).indexOf('test_zoom(')>-1)||(_HTML(b).indexOf('onclick="RoadRev.load')>-1))&&!_ge('WLplus')) wl_place = b;

	if ((wl_place==B)||(wl_place==b)){
		Watch_list=_HTML(wl_place).replace(/color: #555555;/g, 'color: #000;').replace(/color: #555;/g, 'color: #000;').replace(/85, 85, 85/g, '0, 0, 0');
		if (_chset(4)||_chset(5)){
			edit=Watch_list.split('<h3>');
			Watch_list=edit[0];
			var uid_=window.uid||_HTML('uid_input');
			for (var i=1; i<edit.length;i++){
				if (_chset(5)){	
					if (uid_&&(edit[i].indexOf('/user/'+uid_)>-1)) // свои действия
						edit[i]=edit[i].replace(/a href="\/user\//, 'a style="background-color:#ae6; padding:1 5px;" href="/user/');
					else if (edit[i].indexOf('/guest/')>-1)	// действия гостя
						edit[i]=edit[i].replace(/a href="\/guest\//, 'a style="background-color:#e7b; padding:1 5px;" href="/guest/');
				}
				var div='<div style="font-size:12px; background-color:#%1; border:1px solid #%2; padding:2px; font-weight:lighter; width: 100%; -webkit-border-radius:3px; -moz-border-radius:3px; border-radius:3px;">', editi=edit[i].replace(/<\/h3>/, '</div>');
				if (_chset(4)){	
					if ((edit[i].indexOf('color: #f00;')>-1)||(edit[i].indexOf('rgb(255, 0, 0);')>-1))
						edit[i]=div.replace(/%1/,'fa9').replace(/%2/,'a55')+editi; // удалённые объекты
					else if ((edit[i].indexOf('href="/linear/')>-1)||(edit[i].indexOf('href="/ferry/')>-1)||(edit[i].indexOf('href="/railroad/')>-1)||(edit[i].indexOf('href="/river/')>-1)||(edit[i].indexOf('href="/street/')>-1))
						edit[i]=div.replace(/%1/,'ed9').replace(/%2/,'e94')+editi; // линейные объекты
					else edit[i]=div.replace(/%1/,'e5efaa').replace(/%2/,'885')+editi; // все остальные заголовки
				} else 	edit[i]='<div style="font-size: 12px; width:100%;">'+editi;
				Watch_list+=edit[i];
			}
		}
		if (_chset(6))
			Watch_list=Watch_list.replace(/font-size: 12px;/g, 'font-size: 11px; margin: 1px;').replace(/float: right;/g, 'float: right; font-size:11px; padding: 1px; margin: 1px;').replace(/class="modifications"/g, 'class="modifications" style="font-size: 10px; color:#000; margin: 1px;"').replace(/<p>/g, '<p style="font-size: 10px; color:#000; padding: 3px; margin: 1px;">').replace(/>добавлено /g, '>+ ').replace(/>добавлены /g, '>+ ').replace(/>добавлен /g, '>+ ').replace(/>добавлена /g, '>+ ').replace(/>установлен /g, '>+ ').replace(/>загружена /g, '>+ ').replace(/>удалено /g, '>– ').replace(/>удалены /g, '>– ').replace(/>удалена /g, '>– ').replace(/>снят /g, '>– ').replace(/>удалён участок/g, '>– участок').replace(/«объект является зданием»/g, '«здание»')
		else if (wl_place==b)
			Watch_list=Watch_list.replace(/font-size: 12px;/g, 'font-size: 12px; margin: 1px;').replace(/float: right;/g, 'float: right; font-size:12px; line-height: 10px; padding: 1px; margin: 1px;').replace(/class="modifications"/g, 'class="modifications" style="font-size: 12px; line-height: 10px; color:#000; margin: 1px;"').replace(/<p>/g, '<p style="margin: 1px; font-size: 12px; line-height: 10px; color:#000; padding: 3px;">').replace(/<h3>/g, '<hr><div style="font-size: 12px; line-height: 10px; margin: 1px;">').replace(/<\/h3>/g, '</div>');

		if (wl_place==B) _ge(wl_place).innerHTML = '<div id="WLplus3"/>'+Watch_list;
		if (wl_place==b)  _ge(wl_place).innerHTML = '<div id="WLplus"/>'+Watch_list.replace(/jwindow3/g, 'jwindow').replace(/, function\(data\) { parent.j3_put\(data\); }/g, '').replace(/WatchList.load/g, 'jwindow').replace(/●/g, '').replace(/width:100/g, 'width:98');
	}
	if ((wl_place==B)&&!_ge('WatchlistControls')){
		enable_btn1 = enable_btn2 = 1;
		goto_btns = _HTML(wl_place).split('width: 50%;">');

		if (goto_btns[2].split('WatchList.load').length>1){ // Если есть кнопка ВПЕРЁД>>
			WLbtn_onclick1 = goto_btns[2].split('WatchList.load')[1].split('start=')[0];
			WLbtn_onclick2 = goto_btns[2].split('\',')[1].split('">')[0];
			for (var w=-1; w<6; w++) if (goto_btns[2].indexOf('watch='+w)>-1) WLbtn_onclick1 += 'watch='+w+'&';
		} else enable_btn2 = 0; // Нет кнопки ВПЕРЁД>>

		if (goto_btns[1].split('WatchList.load').length>1){ // Если есть кнопка <<НАЗАД
			if (!enable_btn2){ // Если нет кнопки ВПЕРЁД>>
				WLbtn_onclick1 = goto_btns[1].split('WatchList.load')[1].split('\',')[0].split('&amp;start=')[0]+'&amp;';
				WLbtn_onclick2 = goto_btns[1].split('\',')[1].split('">')[0];
				for (var w=-1; w<6; w++) if (goto_btns[1].indexOf('watch='+w)>-1) WLbtn_onclick1 += 'watch='+w+'&';
			}
		} else enable_btn1 = 0; // Нет кнопки НАЗАД>>

		if (enable_btn1||enable_btn2){  // Если есть кнопка <<НАЗАД или кнопка ВПЕРЁД>>

			start_values=_HTML(wl_place).split('text-align: left; width: 50%;')[1].split('%3A%22');
			start_value=start_values[start_values.length-1].split('%22')[0];
			start_value= new Date(start_value*1e3);
			btn_onclick=WLbtn_onclick1+'start=\'+_ge(\'startInput\').value';
			var inp = '<input class="searchin" onMouseOver="this.select();" style="border:1px solid #aaa; text-align: center; width: 27px; font-Weight:bolder;" value="';

			var di = function(date, id){return inp + (('00'+date).slice(-2)) + '" id="'+id+'">'}

			document.getElementsByClassName('prevnext')[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.innerHTML+='<span id="WatchlistControls">\
			<table style="font-size:14px; font-Weight:bolder; width: 97%; padding: 2px; margin:5px; border:1px solid #aaa; background-color:#f5f5f5;"><tbody><tr> \
				<td style="width: 90%;"><div style="width: 100%; text-align: right; font-size:8px; margin-bottom:5px; color:#777;">'+WUS.N+'</div>'+inp.replace('27px','45px')+start_value.getFullYear()+'" id="yearInput">. '+di(start_value.getMonth()+1,'monthInput')+'. '+di(start_value.getDate(),'dayInput')+' &nbsp;'+di(start_value.getHours(),'hourInput')+': '+di(start_value.getMinutes(),'minInput')+': '+di(start_value.getSeconds(),'secInput')+'&nbsp;\
					<span class="prevnext" style="font-Weight:bold; font-size:11px;" onclick="WatchList.load'+WLbtn_onclick1+'start=\'+(Date.UTC(_ge(\'yearInput\').value, _ge(\'monthInput\').value-1, _ge(\'dayInput\').value, _ge(\'hourInput\').value, _ge(\'minInput\').value, _ge(\'secInput\').value) / 1000),'+WLbtn_onclick2+'">'+WUS.T.gt+' </span> \
				</td> \
			</tr></tbody></table></span>';
		}
	}

	var rsp = 'rScriptPanel';
	if (_ge(rsp)){
		var j3d = _gdisp(B),	rsr = parseInt(_ge(rsp).style.right);
		if((j3d=='block')&&(!rsr))_ge(rsp).style.right=(parseInt(_ge(B).style.width)-1)+'px';
		else if ((j3d=='none')&&rsr) _ge(rsp).style.right=0;
	}

	// Привязанные объекты в боковой панели
	if (_ge(B)&&(_HTML(B).indexOf('id="langsline"')>-1)&&!_ge('street_in_side')){

		if((_ge('S_list_buf'))&&(_ge('S_list_buf').value != '')) S_list_btn_onclick='_ge(\''+B+'\').innerHTML = _ge(\'S_list_buf\').value; _ge(\'WUSrlinpf\').value=Fstring; Fstring=\'\'; onFilterInput();';
		else S_list_btn_onclick = 'streets_list();';

		jw3_iHTML='<div style="font-size:10px; line-height:12px; font-weight:bold; color:#777; text-align:right;padding-right: 10px;">'+WUS.N+'</div><h1 style="color:#d71a1a; font-size:18px; line-height:20px;">&nbsp;<span style="font-size:16px; line-height:18px; cursor:pointer;" onclick="'+S_list_btn_onclick+'"><img src="/img/toleft.png" style="margin: 0 -4px; opacity:0.3;" alt="" border="0"/><img src="/img/toleft.png" style="margin: 0 -4px; opacity:0.6;" alt="" border="0"/></span>&nbsp;'+_gtn('h1')[0].innerHTML+'</h1>';

		if(_gtn('ol').length > 0) jw3_iHTML+='<ul style="color:#aaa; margin-left:-10px; font-size:8px;">'+_gtn('ol')[0].innerHTML.replace(/<a href=/g,'<span style="cursor:pointer; text-decoration:none; color:#333; line-height: 18px; font-size:12px;" xxx=').replace(/<\/a>/g,'</span>').replace(/onclick="/g,'onclick="this.style.opacity=\'0.5\';').replace(/<li/g,'<li onmouseover="this.style.background=\'#eee\'" onmouseout="this.style.background=\'#fff\'" ')+'</ul>';

		_ge(B).innerHTML = jw3_iHTML+'<div id="street_in_side" />';
	}

	// Список контактов в боковой панели
	if (_ge('jwiframe3')&&(_jw3().getElementsByClassName('tabs-back').length>0)&&!_ge('jwiframe3')._ge('users_in_side')){
		all_spans = _jw3().getElementsByTagName('span');
		for (var i=0; i<all_spans.length; i++) if (all_spans[i].className=="prevnext") _jw3().getElementsByTagName('span')[i].parentNode.innerHTML=all_spans[i].parentNode.innerHTML.replace(/jwindow\(/g,'jwindow3\(');
		var users_in_side=_jw3().createElement('div');
		users_in_side.style.display = 'none';
		_jw3().body.appendChild(users_in_side);
		_jw3().getElementsByClassName('tabs-back')[0].style.display='none';
		users_in_side.innerHTML='<div id="users_in_side" />';
	}
}

timer1 = window.setInterval(divFunc,130);

if (_ge('wm0')){
	var WUS_info=_cdiv(), v=WUS.v;
	script_div.appendChild(WUS_info);
	WUS_info.innerHTML='<div id="WUS_link" onclick="_sdisp(\'script_panel\',1); " style="z-index:1; position: absolute; left:203px; bottom: 2px; color:#fff; font-Weight:bolder; '+WUS.Fnt+' font-Size:11px; line-height:11px; cursor:pointer; text-shadow:0 0 3px #000, 0 0 3px #000, 0 0 2px #000, 0 0 2px #000;" title="'+WUS.T.i+'">'+WUS.N+' v.'+v+'</div>';
	var w = "WMUS_Version";
	if (typeof localStorage != "undefined"){
		var o=localStorage.getItem('WMUS_ver');
		if (o!=v){
			if (o) alert(WUS.N+' '+WUS.T.updOK+' '+v+' ('+WUS.d+') '+WUS.T.updI);
			localStorage.setItem('WMUS_ver', v);
		}
	}
}

if (window.location.href.indexOf('/streets')>-1){
	var l = _ge('streets');
	if (l){
		l.innerHTML+='<style type="text/css">\
			.wusSList {position:relative;}\
			.wusSList:hover {background:#e7e7e7;}\
			.wusSList a {font-Weight:bold}\
			.wusSList div {display:none; position:absolute; right:-52px; top:-7px; height:26px; border: 1px solid #777; z-index:998;}\
			.wusSList:hover > div {display:block;}\
			.wusSList div img {padding:5px; background:#fff; cursor:pointer;}\
			.wusSList div img:hover {background:#bbb; z-index:999;}\
		</style>';
		l = document.getElementsByClassName('two-columns clearfix')[0].childNodes;
		for (i=0; i<l.length; i++){
			if (l[i].localName&&(l[i].localName.toLowerCase()=='li')){
				var id = l[i].innerHTML.split('/streets/')[1].split('/')[0];
				s_list_innerHTML ='<span class="wusSList">'+l[i].innerHTML+'&nbsp;&nbsp;<div title="('+WUS.N+')"><img src="'+iconURL('sg/v')+'" onclick="window.open(\'http://wikimapia.org/#show=/street/'+id+'/\')"/><img src="'+iconURL('sg/e')+'" onclick="window.open(\'http://wikimapia.org/#show=/object/edit/?object_type=2&amp;id='+id+'&lng='+WUS.l+'\')"/></div></span>';
				l[i].innerHTML = s_list_innerHTML;
			}
		}
	}
}
}