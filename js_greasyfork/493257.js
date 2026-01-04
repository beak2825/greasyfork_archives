// ==UserScript==
// @name         📘极速翻页丨无动画全屏切换丨墨水屏电子屏优化
// @name:ar      📘التصفح السريع بدون رسوم متحركة丨نافذة عائمة مخصصة丨وضع اللون الأسود
// @name:bg      📘Бързо прелистване без анимация
// @name:ckb     📘پەڕەکردنەوەی خێرا丨پنجرەی دیاریکراوی مەترسیدار
// @name:cs      📘Rychlé přetáčení bez animace丨Přizpůsobitelné plovoucí okno
// @name:da      📘Hurtig sidevending uden animation丨Tilpasset flydende vindue丨Sort tilstand丨E-Ink optimering
// @name:de      📘Blättern ohne Animation丨Anpassbares schwebendes Fenster丨Schwarzmodus丨E-Ink Optimierung
// @name:el      📘Γρήγορη κύλιση χωρίς κινούμενα σχέδια
// @name:en      📘Fast Page Turning丨No Animation Full Screen丨Custom Floating Window
// @name:eo      📘Rapida paĝo-turnado丨Senanima plena-ekrana丨Agordebla flosanta fenestro
// @name:es      📘Paso de página rápido丨Cambio de pantalla completa丨Ventana flotante personalizable
// @name:fi      📘Nopea sivunkääntö丨Ei animaatiota丨Mukautettava kelluva ikkuna丨Tumma tila丨E-Ink optimointi
// @name:fr      📘Changement de page rapide丨Changement d'écran丨Fenêtre flottante personnalisable
// @name:fr-ca   📘Changement de page rapide丨Changement d'écran丨Fenêtre flottante personnalisable
// @name:he      📘הפיכת דף מהירה丨החלפת מסך מלאה丨חלון צף מותאם אישית丨מצב כהה丨E-Ink אופטימיזציה
// @name:hr      📘Brzo okretanje stranica丨Plutajući prozor丨Crni način rada丨E-Ink optimizacija
// @name:hu      📘Gyors oldalforgatás丨Animáció nélküli teljes képernyős丨Testreszabható lebegő ablak
// @name:id      📘Pembalikan halaman cepat丨Beralih ke layar penuh丨Jendela mengambang yang dapat disesuaikan
// @name:it      📘Cambio pagina veloce丨Cambio a schermo intero丨Finestra mobile personalizzabile=
// @name:ja      📘高速ページめくり丨アニメーションなし
// @name:ka      📘სწრაფი გვერდის გადაქცევა丨ანიმაციის გარეშე
// @name:ko      📘빠른 페이지 넘기기丨애니메이션 없는丨사용자 정의 가능한 플로팅 창丨어두운 모드
// @name:nb      📘Rask sidevending丨Ingen animasjon丨Tilpassbart flytende vindu丨Mørk modus丨E-Ink optimalisering
// @name:nl      📘Snelle paginawisseling丨Geen animatie丨Aanpasbaar zwevend venster丨Donkere modus丨E-Ink optimalisatie
// @name:pl      📘Szybkie przewracanie stron丨Pełnoekranowe przełączanie丨Dostosowywane pływające okno
// @name:pt-br   📘Virada de página rápida丨Alternância de tela cheia丨Janela flutuante personalizável
// @name:ro      📘Răsfoire rapidă a paginilor丨Comutare pe ecran丨Fereastră plutitoare personalizabilă
// @name:ru      📘Быстрая перелистывание страниц
// @name:sk      📘Rýchle otáčanie stránok丨Prechod na celú obrazovku丨Prispôsobiteľné plávajúce okno
// @name:sr      📘Брзо прелиставање страница
// @name:sv      📘Snabb sidvändning丨Ingen animering丨Anpassningsbart flytande fönster
// @name:th      📘เปลี่ยนหน้ารวดเร็ว丨เปลี่ยนเต็มหน้าจอ
// @name:tr      📘Hızlı Sayfa Çevirme丨Animasyonsuz Tam Ekran丨Özelleştirilebilir Yüzen Pencere
// @name:uk      📘Швидке перегортання сторінок丨Перемикання на повний екран
// @name:ug      📘تىز بەت ئۆزگەرتمەك丨ئانىماسىيەسىز تولۇق ئېكرانغا كۆچ
// @name:vi      📘Lật trang nhanh丨Chuyển đổi toàn màn hình丨Cửa sổ nổi có thể tùy chỉnh丨Chế độ tố
// @name:zh-cn   📘极速翻页丨无动画全屏切换丨自定义悬浮窗丨黑色模式丨E-Ink优化
// @name:zh-tw   📘極速翻頁丨無動畫全屏切換丨自定義懸浮窗丨黑色模式丨E-Ink優化
// @version      2.4.5
// @description  👍忽略滑动动画，快速切换页面，可以通过键盘或浮动窗口进行操作，并调整黑色模式、悬浮窗大小和滑动保留页面比例。
// @description:ar      👍تجاهل الرسوم المتحركة للتمرير، تبديل الصفحة بسرعة، يمكن تشغيلها باستخدام لوحة المفاتيح أو النافذة العائمة، وضبط الوضع الأسود، حجم النافذة العائمة، ونسبة التمرير المحتفظ بها.
// @description:bg      👍Игнорирайте анимациите при превъртане, бързо превключвайте страниците, можете да го направите с клавиатурата или плаващия прозорец, и настройте черния режим, размера на плаващия прозорец и запазената пропорция на превъртане.
// @description:ckb     👍کاریگەری نەکردنی ئەنیمەیشنی خوڕیندنەوە، گەڕاندنی لاپەڕە بە خێرا، دەتوانرێت بە کیبۆرد یان پەنجەری بەپەرییەوە کارپێکراوە، وە دۆخی ڕەش، قەبارەی پەنجەری بەپەری و بەشکردنی پاشکەوتکراوی خوڕیندنی پەڕە وەرگیرێت.
// @description:cs      👍Ignorujte animační efekty při posouvání, rychle přepínejte stránky, můžete to provádět pomocí klávesnice nebo plovoucího okna, a upravte černý režim, velikost plovoucího okna a poměr posouvání, který zůstane zachován.
// @description:da      👍Ignorer animationsrulning, skift hurtigt sider, kan betjenes med tastatur eller flydende vindue, og juster sort tilstand, flydende vinduets størrelse og den reserverede rulleforhold.
// @description:de      👍Ignorieren Sie Animationsscrollen, schnelles Seitenwechsel, kann mit Tastatur oder schwebendem Fenster bedient werden, und passen Sie den Schwarzmodus, die Größe des schwebenden Fensters und das beibehaltene Scrollverhältnis an.
// @description:el      👍Παρακάμψτε τα εφέ κύλισης, αλλάξτε γρήγορα σελίδες, μπορείτε να το κάνετε με το πληκτρολόγιο ή το πλωτό παράθυρο, και προσαρμόστε τη σκοτεινή λειτουργία, το μέγεθος του πλωτού παραθύρου και την αναλογία κύλισης που διατηρείται.
// @description:en      👍Ignore scroll animations, quickly switch pages, can be operated using keyboard or floating window, and adjust dark mode, floating window size, and retained scrolling ratio.
// @description:eo      👍Ignoru rulumanimaciojn, rapide ŝanĝi paĝojn, povas esti funkciigita per klavaro aŭ flosanta fenestro, kaj ĝustigu nigra reĝimo, flosanta fenestro grandeco, kaj retenita rulado proporcio.
// @description:es      👍Ignore las animaciones de desplazamiento, cambie de página rápidamente, puede operarse con el teclado o la ventana flotante, y ajuste el modo oscuro, el tamaño de la ventana flotante y la proporción de desplazamiento retenido.
// @description:fi      👍Ohita vieritysanimaatiot, vaihda sivuja nopeasti, voidaan käyttää näppäimistöllä tai kelluvalla ikkunalla, ja säädä tumma tila, kelluvan ikkunan koko ja säilytetty vierityssuhde.
// @description:fr      👍Ignorez les animations de défilement, changez rapidement de page, peut être utilisé avec le clavier ou la fenêtre flottante, et ajustez le mode sombre, la taille de la fenêtre flottante et le rapport de défilement conservé.
// @description:fr-ca   👍Ignorez les animations de défilement, changez rapidement de page, peut être utilisé avec le clavier ou la fenêtre flottante, et ajustez le mode sombre, la taille de la fenêtre flottante et le rapport de défilement conservé.
// @description:he      👍התעלם מאנימציות גלילה, החלף דפים במהירות, ניתן להפעיל באמצעות המקלדת או החלון הצף, והתאם את מצב כהה, גודל החלון הצף ויחס הגלילה שנותר.
// @description:hr      👍Zanemarite animacije pomicanja, brzo mijenjajte stranice, može se upravljati pomoću tipkovnice ili plutajućeg prozora, i prilagodite crni način rada, veličinu plutajućeg prozora i omjer zadržanog pomicanja.
// @description:hu      👍Hagyja figyelmen kívül az animált görgetést, gyorsan váltson oldalakat, billentyűzettel vagy lebegő ablakkal is vezérelhető, és állítsa be a sötét módot, a lebegő ablak méretét és a megtartott görgetési arányt.
// @description:id      👍Abaikan animasi gulir, cepat beralih halaman, dapat dioperasikan menggunakan keyboard atau jendela mengambang, dan sesuaikan mode gelap, ukuran jendela mengambang, dan rasio gulir yang dipertahankan.
// @description:it      👍Ignora le animazioni di scorrimento, cambia rapidamente pagina, può essere utilizzato con la tastiera o la finestra mobile, e regola la modalità scura, la dimensione della finestra mobile e il rapporto di scorrimento mantenuto.
// @description:ja      👍スクロールアニメーションを無視して、ページをすばやく切り替えることができます。キーボードまたはフローティングウィンドウを使用して操作でき、ダークモード、フローティングウィンドウのサイズ、および保持されたスクロール比率を調整できます。
// @description:ka      👍უარყავით გადახვევის ანიმაციები, სწრაფად გადართეთ გვერდები, შესაძლებელია კლავიატურით ან მცურავი ფანჯრით მართვა, და დაარეგულირეთ მუქი რეჟიმი, მცურავი ფანჯრის ზომა და შენახული გადახვევის თანაფარდობა.
// @description:ko      👍스크롤 애니메이션을 무시하고 페이지를 빠르게 전환하며, 키보드 또는 플로팅 창을 사용하여 조작할 수 있으며, 어두운 모드, 플로팅 창 크기 및 유지된 스크롤 비율을 조정합니다.
// @description:nb      👍Ignorer animasjonsrulling, bytt sider raskt, kan betjenes med tastatur eller flytende vindu, og juster mørk modus, størrelse på flytende vindu og beholdt rulleforhold.
// @description:nl      👍Negeer scrollanimaties, schakel snel tussen pagina's, kan worden bediend met toetsenbord of zwevend venster, en pas de donkere modus, zwevend venstergrootte en behouden scrollverhouding aan.
// @description:pl      👍Ignoruj animacje przewijania, szybko przełączaj strony, można obsługiwać za pomocą klawiatury lub pływającego okna oraz dostosować tryb ciemny, rozmiar pływającego okna i zachowany współczynnik przewijania.
// @description:pt-br   👍Ignore as animações de rolagem, alterne rapidamente entre as páginas, pode ser operado usando o teclado ou janela flutuante e ajuste o modo escuro, o tamanho da janela flutuante e a proporção de rolagem retida.
// @description:ro      👍Ignorați animațiile de derulare, comutați rapid paginile, poate fi operat folosind tastatura sau fereastra plutitoare și ajustați modul întunecat, dimensiunea ferestrei plutitoare și raportul de derulare reținut.
// @description:ru      👍Игнорируйте анимацию прокрутки, быстро переключайте страницы, можно управлять с помощью клавиатуры или плавающего окна и настраивать темный режим, размер плавающего окна и сохраненное соотношение прокрутки.
// @description:sk      👍Ignorujte animačné posúvanie, rýchlo prepínajte stránky, dá sa ovládať pomocou klávesnice alebo plávajúceho okna, a nastavte tmavý režim, veľkosť plávajúceho okna a zachovaný pomer posúvania.
// @description:sr      👍Игноришите анимацију померања, брзо мењајте странице, може се управљати помоћу тастатуре или плутајућег прозора и подесити црни режим, величину плутајућег прозора и задржани однос померања.
// @description:sv      👍Ignorera rullningsanimationer, växla snabbt mellan sidor, kan användas med tangentbord eller flytande fönster och justera mörkt läge, flytande fönsterstorlek och behållen rullningsförhållande.
// @description:th      👍ละเว้นภาพเคลื่อนไหวการเลื่อน สลับหน้าจออย่างรวดเร็ว สามารถใช้งานด้วยแป้นพิมพ์หรือหน้าต่างลอย และปรับโหมดมืด ขนาดหน้าต่างลอย และอัตราส่วนการเลื่อนที่เก็บไว้
// @description:tr      👍Kaydırma animasyonlarını yoksay, sayfaları hızlıca değiştir, klavye veya yüzen pencere ile çalıştırılabilir ve karanlık modu, yüzen pencere boyutunu ve korunan kaydırma oranını ayarla.
// @description:uk      👍Ігноруйте анімації прокручування, швидко перемикайте сторінки, можна керувати за допомогою клавіатури або плаваючого вікна та налаштовувати темний режим, розмір плаваючого вікна та збережене співвідношення прокручування.
// @description:ug      👍ئانيماسىيەسىز بەت ئۆزگەرتمەك، بەت ئالماشتۇرۇشنى تېزلەشتۈرۈش، كۇنۇپكا تاختىسى ياكى شېشىكلەتيلگەن كۇنۇپكا ئارقىلىق ئىشلىتىش، قارا ھالەت، شېشىكلەتيلگەن كۇنۇپكا چوڭلۇقى ۋە ساقلانغان ئوقۇش نىسبىتىنى تەڭشەش.
// @description:vi      👍Bỏ qua hoạt ảnh cuộn, nhanh chóng chuyển đổi trang, có thể được vận hành bằng bàn phím hoặc cửa sổ nổi và điều chỉnh chế độ tối, kích thước cửa sổ nổi và tỷ lệ cuộn được giữ lại.
// @description:zh-cn   👍忽略滑动动画，快速切换页面，可以通过键盘或浮动窗口进行操作，并调整黑色模式、悬浮窗大小和滑动保留页面比例。
// @description:zh-tw   👍忽略滑動動畫，快速切換頁面，可以通過鍵盤或浮動窗口進行操作，並調整黑色模式、懸浮窗大小和滑動保留頁面比例。
// @author       Jingyu0123
// @match        *://*/*
// @license      GPL
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @namespace    https://greasyfork.org/users/1292046
// @downloadURL https://update.greasyfork.org/scripts/493257/%F0%9F%93%98%E6%9E%81%E9%80%9F%E7%BF%BB%E9%A1%B5%E4%B8%A8%E6%97%A0%E5%8A%A8%E7%94%BB%E5%85%A8%E5%B1%8F%E5%88%87%E6%8D%A2%E4%B8%A8%E5%A2%A8%E6%B0%B4%E5%B1%8F%E7%94%B5%E5%AD%90%E5%B1%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/493257/%F0%9F%93%98%E6%9E%81%E9%80%9F%E7%BF%BB%E9%A1%B5%E4%B8%A8%E6%97%A0%E5%8A%A8%E7%94%BB%E5%85%A8%E5%B1%8F%E5%88%87%E6%8D%A2%E4%B8%A8%E5%A2%A8%E6%B0%B4%E5%B1%8F%E7%94%B5%E5%AD%90%E5%B1%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


(function() {
	'use strict';
	const userLang = (navigator.language || navigator.userLanguage)
		.toLowerCase();
	const systemDefaultLabel = () => {
		switch (userLang) {
			case 'en':
				return 'System Default: English';
			case 'ar':
				return 'النظام الافتراضي: العربية';
			case 'bg':
				return 'Системен по подразбиране: Български';
			case 'ckb':
				return 'سیستەمە بنەڕەتییەکان: کوردی';
			case 'cs':
				return 'Systémový výchozí: Čeština';
			case 'da':
				return 'Systemstandard: Dansk';
			case 'de':
				return 'Systemstandard: Deutsch';
			case 'el':
				return 'Προεπιλογή συστήματος: Ελληνικά';
			case 'eo':
				return 'Sistemo Defaŭlte: Esperanto';
			case 'es':
				return 'Predeterminado del sistema: Español';
			case 'fi':
				return 'Järjestelmän oletus: Suomi';
			case 'fr':
				return 'Défaut système: Français';
			case 'fr-ca':
				return 'Défaut système: Français (Canada)';
			case 'he':
				return 'ברירת מחדל מערכת: עברית';
			case 'hr':
				return 'Zadano po sustavu: Hrvatski';
			case 'hu':
				return 'Rendszer alapértelmezett: Magyar';
			case 'id':
				return 'Bawaan sistem: Bahasa Indonesia';
			case 'it':
				return 'Predefinito del sistema: Italiano';
			case 'ja':
				return 'システムデフォルト: 日本語';
			case 'ka':
				return 'სისტემის ნაგულისხმები: ქართული';
			case 'ko':
				return '시스템 기본값: 한국어';
			case 'nb':
				return 'Systemstandard: Norsk';
			case 'nl':
				return 'Systeemstandaard: Nederlands';
			case 'pl':
				return 'Domyślny systemowy: Polski';
			case 'pt-br':
				return 'Padrão do sistema: Português (Brasil)';
			case 'ro':
				return 'Implicit sistem: Română';
			case 'ru':
				return 'Системный по умолчанию: Русский';
			case 'sk':
				return 'Systémový predvolený: Slovenčina';
			case 'sr':
				return 'Системски подразумевани: Српски';
			case 'sv':
				return 'Systemstandard: Svenska';
			case 'th':
				return 'ค่าเริ่มต้นของระบบ: ไทย';
			case 'tr':
				return 'Sistem Varsayılanı: Türkçe';
			case 'uk':
				return 'Системний за замовчуванням: Українська';
			case 'ug':
				return 'سىستېما بويىچە: ئۇيغۇرچە';
			case 'vi':
				return 'Mặc định hệ thống: Tiếng Việt';
			case 'zh-cn':
				return '系统默认：简体中文';
			case 'zh-tw':
				return '系統預設：繁體中文';
			default:
				return `System Default: ${navigator.language}`;
		}
	};

	const LANGUAGE_NAMES = {
		"en": "English",
		"ar": "العربية",
		"bg": "Български",
		"ckb": "کوردی",
		"cs": "Čeština",
		"da": "Dansk",
		"de": "Deutsch",
		"el": "Ελληνικά",
		"eo": "Esperanto",
		"es": "Español",
		"fi": "Suomi",
		"fr": "Français",
		"fr-ca": "Français (Canada)",
		"he": "עברית",
		"hr": "Hrvatski",
		"hu": "Magyar",
		"id": "Bahasa Indonesia",
		"it": "Italiano",
		"ja": "日本語",
		"ka": "ქართული",
		"ko": "한국어",
		"nb": "Norsk",
		"nl": "Nederlands",
		"pl": "Polski",
		"pt-br": "Português (Brasil)",
		"ro": "Română",
		"ru": "Русский",
		"sk": "Slovenčina",
		"sr": "Српски",
		"sv": "Svenska",
		"th": "ไทย",
		"tr": "Türkçe",
		"uk": "Українська",
		"ug": "ئۇيغۇرچە",
		"vi": "Tiếng Việt",
		"zh-cn": "简体中文",
		"zh-tw": "繁體中文"
	};

	const LANG = {
		ar: {
			autoDetectModeOptions: {
				close: 'إغلاق',
				sameColor: 'نفس اللون',
				invertColor: 'عكس اللون'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 حفظ',
				donate: '🔄 تحديث/💰 دعم'
			},
			settings: {
				darkMode: '🌑 الوضع الداكن',
				autoDetect: '🔎 تعديل لون النافذة العائمة تلقائيًا (تجاهل التعديلات أعلاه)',
				close: 'إغلاق',
				same: 'نفس',
				invert: 'عكس',
				layout: '↕️ ترتيب الأزرار عموديًا',
				floatWindowSize: '📏 حجم النافذة العائمة',
				reservedHeightPercentage: '📄 نسبة الارتفاع المحجوزة',
				windowOpacity: '🌫️ شفافية النافذة',
				textOpacity: '🖋️ شفافية النص',
				closeFloatWindow: '📴 إغلاق النافذة العائمة (اضغط طويلاً للتحريك)',
				enableHotkeys: 'تمكين مفاتيح الاختصار لتغيير الصفحات',
				hotkeys: '🎛️ إعداد مفاتيح الاختصار لتغيير الصفحات لجهاز الكمبيوتر',
				upKey: 'مفتاح تغيير الصفحة للأعلى',
				downKey: 'مفتاح تغيير الصفحة للأسفل',
				hotkeyInstructions: '💬 يرجى إعداد مفاتيح الاختصار لتغيير الصفحات\n💡 اختر مربع النص واضغط على مفتاح الاختصار الهدف:',
				confirmCloseFloatWindow: '❗️ هل أنت متأكد أنك تريد إغلاق النافذة العائمة؟\n🖥️ يمكنك إعادة فتحها من خلال الخيارات في مدير السكربت على الكمبيوتر،\n📱 إذا لم يكن لدى مدير السكربت واجهة رسومية، يمكنك إعادة تثبيت السكربت.',
				confirmUpdate: '⚠️ لا يستطيع بعض مديري السكربتات اكتشاف التحديثات تلقائيًا، لذا عليك التحقق يدويًا.\n🔄 الإصدار الحالي هو: v2.4.5.\n💬 إذا كان لديك أي مشاكل مع السكربت، أو إذا كانت لديك أي أفكار، يمكنك ترك رسالة في منطقة تعليقات السكربت.\n📄 يحتوي قسم المقدمة على صفحة إصدار السكربت أيضًا على طرق لدعمي.\n🥤 إذا كان هذا السكربت قد حل مشكلة كبيرة لك، آمل أن تتمكن من شراء لي شاي بالحليب!'
			},
			menu: {
				showFloatingWindow: 'إظهار النافذة العائمة'
			}
		},
		bg: {
			autoDetectModeOptions: {
				close: 'Затвори',
				sameColor: 'Същият цвят',
				invertColor: 'Обърнат цвят'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Запази',
				donate: '🔄 Актуализиране/💰 Подкрепа'
			},
			settings: {
				darkMode: '🌑 Тъмен режим',
				autoDetect: '🔎 Автоматично настройване на цвета на плаващия прозорец (Игнориране на горните промени)',
				close: 'Затвори',
				same: 'Същият',
				invert: 'Обърнат',
				layout: '↕️ Вертикално подреждане на бутоните',
				floatWindowSize: '📏 Размер на плаващия прозорец',
				reservedHeightPercentage: '📄 Запазен процент на страницата',
				windowOpacity: '🌫️ Прозрачност на прозореца',
				textOpacity: '🖋️ Прозрачност на текста',
				closeFloatWindow: '📴 Затваряне на плаващия прозорец (Дълго натискане за преместване)',
				enableHotkeys: 'Активиране на клавишни комбинации за превъртане на страницата',
				hotkeys: '🎛️ Настройка на клавишни комбинации за превъртане на страницата за компютър',
				upKey: 'Клавиш за превъртане нагоре',
				downKey: 'Клавиш за превъртане надолу',
				hotkeyInstructions: '💬 Моля, настройте клавишите за превъртане на страницата\n💡 Изберете текстовото поле и натиснете целевия клавиш:',
				confirmCloseFloatWindow: '❗️ Сигурни ли сте, че искате да затворите плаващия прозорец?\n🖥️ Можете да го отворите отново чрез опциите в мениджъра на скриптове на компютъра,\n📱 Ако мениджърът на скриптове няма графичен интерфейс, можете да преинсталирате скрипта.',
				confirmUpdate: '⚠️ Някои мениджъри на скриптове не могат автоматично да откриват актуализации, затова трябва да проверите ръчно.\n🔄 Текущата версия е: v2.4.5.\n💬 Ако имате проблеми със скрипта или идеи, можете да оставите съобщение в зоната за обратна връзка със скрипта.\n📄 Във въведението на страницата за издаване на скрипта има и начини за подкрепа.\n🥤 Ако този скрипт е решил голям проблем за вас, надявам се да можете да ми купите млечен чай!'
			},
			menu: {
				showFloatingWindow: 'Показване на плаващия прозорец'
			}
		},
		ckb: {
			autoDetectModeOptions: {
				close: 'داخستن',
				sameColor: 'هەمان ڕەنگ',
				invertColor: 'پێچەوانەکردنی ڕەنگ'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 پاشەکەوتکردن',
				donate: '🔄 نوێکردنەوە/💰 پشتیوانی'
			},
			settings: {
				darkMode: '🌑 دۆخی تاریک',
				autoDetect: '🔎 ڕەنگی پەنجەرەی ڕاوە بکە بە شێوەی خۆکار (پێگەی بەرز مەچێنە)',
				close: 'داخستن',
				same: 'هەمان',
				invert: 'پێچەوانە',
				layout: '↕️ ڕێکخستنی دووگمەکان بە ستوون',
				floatWindowSize: '📏 قەبارەی پەنجەرەی ڕاوە',
				reservedHeightPercentage: '📄 ڕێژەی پەڕەی پاراستە',
				windowOpacity: '🌫️ ڕووناکی پەنجەرە',
				textOpacity: '🖋️ ڕووناکی دەق',
				closeFloatWindow: '📴 داخستنی پەنجەرەی ڕاوە (بە درێژی کرتە بکە بۆ جوڵاندن)',
				enableHotkeys: 'چالاککردنی دووگمەکانی گرژە بۆ گۆڕینی پەڕە',
				hotkeys: '🎛️ ڕێکخستنی دووگمەکانی گرژە بۆ گۆڕینی پەڕە بۆ کۆمپیوتەر',
				upKey: 'دووگمەی بەرزکردنی پەڕە',
				downKey: 'دووگمەی داشکاندنی پەڕە',
				hotkeyInstructions: '💬 تکایە دووگمەکانی گرژە بۆ گۆڕینی پەڕە ڕێکبخەن\n💡 بۆ گەڕان بۆ ناوەکانی گرژە مەترسێ بەستە بۆ ناوەکانی دەق:',
				confirmCloseFloatWindow: '❗️ دڵنیای لە داخستنی پەنجەرەی ڕاوە؟\n🖥️ دەتوانیت جاریکتر بەکاردەهێنی تێکەڵەکانی ناو مدیر سکریپت بۆ ڕووکاری کۆمپیوتەر،\n📱 ئەگەر مدیر سکریپت ڕووکارێکی وێنەی نیە، دەتوانیت سکریپتەکە دووبارە دامەزرێنی.',
				confirmUpdate: '⚠️ هەندێک لە مدیرانی سکریپت ناتوانن نوێکاریەکان بە شێوەی خۆکار دیاری بکەن، بۆیە پێویستە بە دەست دیاری بکەیت.\n🔄 وەشانی ئێستا بریتیە: v2.4.5.\n💬 ئەگەر هەر هەڵەیەکت لە سکریپتەکە هەیە، یان ئایدیاکانی هەیە، دەتوانیت پەیامێک لە شوێنی هەڵەکاری سکریپت بەجێبهێنیت.\n📄 لە بەشی ناونیشانی سکریپتیش کە لە پەڕەی بڵاوکردنەوەی سکریپت بەجێهێشت، ڕێگا لە چاوەڕوانی پشتیوانییەکانیش هەیە.\n🥤 ئەگەر ئەم سکریپتە کێشەیەکی گەورە بۆ تۆ چاک کرد، هیوامە توانایی کراوێکی شیر چایم بەرز بیت!'
			},
			menu: {
				showFloatingWindow: 'پەنجەرەی ڕاوە نیشانبە'
			}
		},
		cs: {
			autoDetectModeOptions: {
				close: 'Zavřít',
				sameColor: 'Stejná barva',
				invertColor: 'Invertovat barvu'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Uložit',
				donate: '🔄 Aktualizace/💰 Podpora'
			},
			settings: {
				darkMode: '🌑 Tmavý režim',
				autoDetect: '🔎 Automaticky nastavit barvu plovoucího okna (Ignorovat výše uvedené změny)',
				close: 'Zavřít',
				same: 'Stejný',
				invert: 'Invertovat',
				layout: '↕️ Vertikální uspořádání tlačítek',
				floatWindowSize: '📏 Velikost plovoucího okna',
				reservedHeightPercentage: '📄 Rezervovaný procentní podíl stránky',
				windowOpacity: '🌫️ Průhlednost okna',
				textOpacity: '🖋️ Průhlednost textu',
				closeFloatWindow: '📴 Zavřít plovoucí okno (Dlouhým stiskem přesuňte)',
				enableHotkeys: 'Povolit klávesové zkratky pro změnu stránky',
				hotkeys: '🎛️ Nastavit klávesové zkratky pro změnu stránky pro PC',
				upKey: 'Klávesa pro posun stránky nahoru',
				downKey: 'Klávesa pro posun stránky dolů',
				hotkeyInstructions: '💬 Nastavte prosím klávesové zkratky pro změnu stránky\n💡 Vyberte textové pole a stiskněte cílovou klávesu:',
				confirmCloseFloatWindow: '❗️ Opravdu chcete zavřít plovoucí okno?\n🖥️ Můžete jej znovu otevřít prostřednictvím možností ve správci skriptů na PC,\n📱 Pokud správce skriptů nemá grafické rozhraní, můžete skript znovu nainstalovat.',
				confirmUpdate: '⚠️ Někteří správci skriptů nemohou automaticky detekovat aktualizace, proto je třeba zkontrolovat ručně.\n🔄 Aktuální verze je: v2.4.5.\n💬 Pokud máte nějaké problémy se skriptem nebo nápady, můžete zanechat zprávu v oblasti zpětné vazby skriptu.\n📄 Sekce úvodu na stránce vydání skriptu také obsahuje způsoby, jak mě podpořit.\n🥤 Pokud tento skript vyřešil velký problém pro vás, doufám, že mi můžete koupit mléčný čaj!'
			},
			menu: {
				showFloatingWindow: 'Zobrazit plovoucí okno'
			}
		},
		da: {
			autoDetectModeOptions: {
				close: 'Luk',
				sameColor: 'Samme farve',
				invertColor: 'Invertér farve'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Gem',
				donate: '🔄 Opdater/💰 Støtte'
			},
			settings: {
				darkMode: '🌑 Mørk tilstand',
				autoDetect: '🔎 Juster farven på det flydende vindue automatisk (Ignorer ovenstående ændringer)',
				close: 'Luk',
				same: 'Samme',
				invert: 'Invertér',
				layout: '↕️ Lodret knaplayout',
				floatWindowSize: '📏 Størrelse på flydende vindue',
				reservedHeightPercentage: '📄 Reserveret sideprocent',
				windowOpacity: '🌫️ Vinduesgennemsigtighed',
				textOpacity: '🖋️ Tekstgennemsigtighed',
				closeFloatWindow: '📴 Luk flydende vindue (Hold nede for at flytte)',
				enableHotkeys: 'Aktivér genvejstaster til sideskift',
				hotkeys: '🎛️ Indstil genvejstaster til sideskift til PC',
				upKey: 'Op-tast til sideskift',
				downKey: 'Ned-tast til sideskift',
				hotkeyInstructions: '💬 Indstil venligst genvejstasterne til sideskift\n💡 Vælg tekstfeltet og tryk på måltasten:',
				confirmCloseFloatWindow: '❗️ Er du sikker på, at du vil lukke det flydende vindue?\n🖥️ Du kan åbne det igen via indstillingerne i script-manageren på PC,\n📱 Hvis script-manageren ikke har en grafisk grænseflade, kan du geninstallere scriptet.',
				confirmUpdate: '⚠️ Nogle script-managere kan ikke automatisk registrere opdateringer, så du skal tjekke manuelt.\n🔄 Den nuværende version er: v2.4.5.\n💬 Hvis du har nogen problemer med scriptet, eller hvis du har nogen idéer, kan du efterlade en besked i scriptets feedback-område.\n📄 Introduktionssektionen på script-udgivelsessiden indeholder også måder at støtte mig på.\n🥤 Hvis dette script har løst et stort problem for dig, håber jeg, at du kan købe mig en mælkete!'
			},
			menu: {
				showFloatingWindow: 'Vis flydende vindue'
			}
		},
		de: {
			autoDetectModeOptions: {
				close: 'Schließen',
				sameColor: 'Gleiche Farbe',
				invertColor: 'Farbe umkehren'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Speichern',
				donate: '🔄 Aktualisieren/💰 Unterstützen'
			},
			settings: {
				darkMode: '🌑 Dunkelmodus',
				autoDetect: '🔎 Automatische Anpassung der Farbe des schwebenden Fensters (Obige Änderungen ignorieren)',
				close: 'Schließen',
				same: 'Gleiche',
				invert: 'Umkehren',
				layout: '↕️ Vertikale Schaltflächenanordnung',
				floatWindowSize: '📏 Größe des schwebenden Fensters',
				reservedHeightPercentage: '📄 Reservierter Seitenanteil',
				windowOpacity: '🌫️ Fenstertransparenz',
				textOpacity: '🖋️ Texttransparenz',
				closeFloatWindow: '📴 Schwebendes Fenster schließen (Lange drücken zum Bewegen)',
				enableHotkeys: 'Hotkeys zum Seitenwechsel aktivieren',
				hotkeys: '🎛️ Hotkeys zum Seitenwechsel für PC einstellen',
				upKey: 'Hotkey für Seitennach oben',
				downKey: 'Hotkey für Seitennach unten',
				hotkeyInstructions: '💬 Bitte stellen Sie die Hotkeys für den Seitenwechsel ein\n💡 Wählen Sie das Textfeld aus und drücken Sie die gewünschte Taste:',
				confirmCloseFloatWindow: '❗️ Sind Sie sicher, dass Sie das schwebende Fenster schließen möchten?\n🖥️ Sie können es über die Optionen im Skript-Manager auf dem PC erneut öffnen,\n📱 Wenn der Skript-Manager keine grafische Oberfläche hat, können Sie das Skript erneut installieren.',
				confirmUpdate: '⚠️ Einige Skript-Manager können Updates nicht automatisch erkennen, daher müssen Sie manuell überprüfen.\n🔄 Die aktuelle Version ist: v2.4.5.\n💬 Wenn Sie Probleme mit dem Skript haben oder Ideen haben, können Sie eine Nachricht im Feedback-Bereich des Skripts hinterlassen.\n📄 Der Einführungsteil auf der Skript-Veröffentlichungsseite enthält auch Möglichkeiten, mich zu unterstützen.\n🥤 Wenn dieses Skript ein großes Problem für Sie gelöst hat, hoffe ich, dass Sie mir einen Milchtee kaufen können!'
			},
			menu: {
				showFloatingWindow: 'Schwebendes Fenster anzeigen'
			}
		},
		el: {
			autoDetectModeOptions: {
				close: 'Κλείσιμο',
				sameColor: 'Ίδιο χρώμα',
				invertColor: 'Αντιστροφή χρώματος'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Αποθήκευση',
				donate: '🔄 Ενημέρωση/💰 Υποστήριξη'
			},
			settings: {
				darkMode: '🌑 Σκοτεινή λειτουργία',
				autoDetect: '🔎 Αυτόματη προσαρμογή χρώματος του πλωτού παραθύρου (Αγνόηση των παραπάνω αλλαγών)',
				close: 'Κλείσιμο',
				same: 'Ίδιο',
				invert: 'Αντιστροφή',
				layout: '↕️ Κάθετη διάταξη κουμπιών',
				floatWindowSize: '📏 Μέγεθος πλωτού παραθύρου',
				reservedHeightPercentage: '📄 Ποσοστό διατήρησης σελίδας',
				windowOpacity: '🌫️ Διαφάνεια παραθύρου',
				textOpacity: '🖋️ Διαφάνεια κειμένου',
				closeFloatWindow: '📴 Κλείσιμο πλωτού παραθύρου (Πατήστε παρατεταμένα για μετακίνηση)',
				enableHotkeys: 'Ενεργοποίηση πλήκτρων συντόμευσης για αλλαγή σελίδας',
				hotkeys: '🎛️ Ρύθμιση πλήκτρων συντόμευσης για αλλαγή σελίδας στον υπολογιστή',
				upKey: 'Πλήκτρο για αλλαγή σελίδας προς τα πάνω',
				downKey: 'Πλήκτρο για αλλαγή σελίδας προς τα κάτω',
				hotkeyInstructions: '💬 Παρακαλώ ρυθμίστε τα πλήκτρα συντόμευσης για αλλαγή σελίδας\n💡 Επιλέξτε το πεδίο κειμένου και πατήστε το επιθυμητό πλήκτρο:',
				confirmCloseFloatWindow: '❗️ Είστε βέβαιοι ότι θέλετε να κλείσετε το πλωτό παράθυρο;\n🖥️ Μπορείτε να το ανοίξετε ξανά μέσω των επιλογών στον διαχειριστή σεναρίων στον υπολογιστή,\n📱 Εάν ο διαχειριστής σεναρίων δεν διαθέτει γραφικό περιβάλλον, μπορείτε να επανεγκαταστήσετε το σενάριο.',
				confirmUpdate: '⚠️ Μερικοί διαχειριστές σεναρίων δεν μπορούν να εντοπίσουν αυτόματα τις ενημερώσεις, επομένως πρέπει να ελέγξετε χειροκίνητα.\n🔄 Η τρέχουσα έκδοση είναι: v2.4.5.\n💬 Εάν αντιμετωπίζετε προβλήματα με το σενάριο ή έχετε ιδέες, μπορείτε να αφήσετε ένα μήνυμα στην περιοχή σχολίων του σεναρίου.\n📄 Το τμήμα εισαγωγής στη σελίδα κυκλοφορίας του σεναρίου περιλαμβάνει επίσης τρόπους υποστήριξης.\n🥤 Εάν αυτό το σενάριο έλυσε ένα μεγάλο πρόβλημα για εσάς, ελπίζω να μπορείτε να μου αγοράσετε ένα γάλα τσάι!'
			},
			menu: {
				showFloatingWindow: 'Εμφάνιση πλωτού παραθύρου'
			}
		},
		en: {
			autoDetectModeOptions: {
				close: 'Close',
				sameColor: 'Same Color',
				invertColor: 'Invert Color'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Save',
				donate: '🔄 Update/💰 Donate'
			},
			settings: {
				darkMode: '🌑 Dark Mode',
				autoDetect: '🔎 Auto Adjust Floating Window Color (Ignore above changes)',
				close: 'Close',
				same: 'Same',
				invert: 'Invert',
				layout: '↕️ Vertical Button Layout',
				floatWindowSize: '📏 Floating Window Size',
				reservedHeightPercentage: '📄 Reserved Page Percentage',
				windowOpacity: '🌫️ Window Opacity',
				textOpacity: '🖋️ Text Opacity',
				closeFloatWindow: '📴 Close Floating Window (Long press to move)',
				enableHotkeys: 'Enable Page Turn Hotkeys',
				hotkeys: '🎛️ Set Page Turn Hotkeys for PC',
				upKey: 'Page Up Hotkey',
				downKey: 'Page Down Hotkey',
				hotkeyInstructions: '💬 Please set the page turn hotkeys\n💡 Select the text box and press the target hotkey:',
				confirmCloseFloatWindow: '❗️ Are you sure you want to close the floating window?\n🖥️ You can reopen it through the options in the script manager on PC,\n📱 If the script manager has no graphical interface, you can reinstall the script.',
				confirmUpdate: '⚠️ Some script managers cannot automatically detect updates, so you need to check manually.\n🔄 The current version is: v2.4.5.\n💬 If there are any problems with the script, or if you have any ideas, you can leave a message in the script feedback area.\n📄 The introduction section on the script release page also contains ways to support me.\n🥤 If this script has solved a big problem for you, I hope you can buy me a milk tea!'
			},
			menu: {
				showFloatingWindow: 'Show Floating Window'
			}
		},
		eo: {
			autoDetectModeOptions: {
				close: 'Fermi',
				sameColor: 'Sama Koloro',
				invertColor: 'Inversigi Koloron'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Konservi',
				donate: '🔄 Ĝisdatigo/💰 Donaci'
			},
			settings: {
				darkMode: '🌑 Malluma Reĝimo',
				autoDetect: '🔎 Aŭtomata Agordo de Flosanta Fenestro Koloro (Ignori supre ŝanĝojn)',
				close: 'Fermi',
				same: 'Sama',
				invert: 'Inversigi',
				layout: '↕️ Vertikala Butona Aranĝo',
				floatWindowSize: '📏 Grandeco de Flosanta Fenestro',
				reservedHeightPercentage: '📄 Rezervita Paĝa Procentaĵo',
				windowOpacity: '🌫️ Fenestro Travidebleco',
				textOpacity: '🖋️ Teksto Travidebleco',
				closeFloatWindow: '📴 Fermi Flosantan Fenestron (Longa premo por movi)',
				enableHotkeys: 'Ebligi Paĝŝanĝajn Ŝparklavojn',
				hotkeys: '🎛️ Agordi Paĝŝanĝajn Ŝparklavojn por PC',
				upKey: 'Supra Ŝparklavo por Paĝo',
				downKey: 'Malsupra Ŝparklavo por Paĝo',
				hotkeyInstructions: '💬 Bonvolu agordi la paĝŝanĝajn ŝparklavojn\n💡 Elektu la tekstokeston kaj premu la celan ŝparklavon:',
				confirmCloseFloatWindow: '❗️ Ĉu vi certas, ke vi volas fermi la flosantan fenestron?\n🖥️ Vi povas malfermi ĝin denove per la opcioj en la skripta administrilo sur PC,\n📱 Se la skripta administrilo ne havas grafikan interfacon, vi povas reinstali la skripton.',
				confirmUpdate: '⚠️ Iuj skriptaj administriloj ne povas aŭtomate detekti ĝisdatigojn, do vi devas kontroli permane.\n🔄 La nuna versio estas: v2.4.5.\n💬 Se vi havas problemojn kun la skripto aŭ ideojn, vi povas lasi mesaĝon en la skripta reaga areo.\n📄 La enkonduka sekcio en la skripta eldona paĝo ankaŭ enhavas manierojn por subteni min.\n🥤 Se ĉi tiu skripto solvis grandan problemon por vi, mi esperas, ke vi povas aĉeti al mi lakton teon!'
			},
			menu: {
				showFloatingWindow: 'Montri Flosantan Fenestron'
			}
		},
		es: {
			autoDetectModeOptions: {
				close: 'Cerrar',
				sameColor: 'Mismo color',
				invertColor: 'Invertir color'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Guardar',
				donate: '🔄 Actualizar/💰 Donar'
			},
			settings: {
				darkMode: '🌑 Modo oscuro',
				autoDetect: '🔎 Ajuste automático del color de la ventana flotante (Ignorar los cambios anteriores)',
				close: 'Cerrar',
				same: 'Mismo',
				invert: 'Invertir',
				layout: '↕️ Diseño vertical de botones',
				floatWindowSize: '📏 Tamaño de la ventana flotante',
				reservedHeightPercentage: '📄 Porcentaje de página reservada',
				windowOpacity: '🌫️ Opacidad de la ventana',
				textOpacity: '🖋️ Opacidad del texto',
				closeFloatWindow: '📴 Cerrar ventana flotante (Mantener pulsado para mover)',
				enableHotkeys: 'Habilitar teclas de acceso rápido para cambiar de página',
				hotkeys: '🎛️ Configurar teclas de acceso rápido para cambiar de página en PC',
				upKey: 'Tecla de subir página',
				downKey: 'Tecla de bajar página',
				hotkeyInstructions: '💬 Por favor, configure las teclas de acceso rápido para cambiar de página\n💡 Seleccione el cuadro de texto y presione la tecla objetivo:',
				confirmCloseFloatWindow: '❗️ ¿Está seguro de que desea cerrar la ventana flotante?\n🖥️ Puede volver a abrirla a través de las opciones en el administrador de scripts en PC,\n📱 Si el administrador de scripts no tiene una interfaz gráfica, puede reinstalar el script.',
				confirmUpdate: '⚠️ Algunos administradores de scripts no pueden detectar automáticamente las actualizaciones, por lo que debe verificar manualmente.\n🔄 La versión actual es: v2.4.5.\n💬 Si tiene algún problema con el script o ideas, puede dejar un mensaje en el área de comentarios del script.\n📄 La sección de introducción en la página de publicación del script también contiene formas de apoyarme.\n🥤 Si este script ha resuelto un gran problema para usted, espero que pueda comprarme un té con leche!'
			},
			menu: {
				showFloatingWindow: 'Mostrar ventana flotante'
			}
		},
		fi: {
			autoDetectModeOptions: {
				close: 'Sulje',
				sameColor: 'Sama väri',
				invertColor: 'Käännä väri'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Tallenna',
				donate: '🔄 Päivitä/💰 Lahjoita'
			},
			settings: {
				darkMode: '🌑 Tumma tila',
				autoDetect: '🔎 Säädä kelluvan ikkunan väri automaattisesti (Ohita yllä olevat muutokset)',
				close: 'Sulje',
				same: 'Sama',
				invert: 'Käännä',
				layout: '↕️ Pystysuuntainen painikeasettelu',
				floatWindowSize: '📏 Kelluvan ikkunan koko',
				reservedHeightPercentage: '📄 Varattu sivuprosentti',
				windowOpacity: '🌫️ Ikkunan läpinäkyvyys',
				textOpacity: '🖋️ Tekstin läpinäkyvyys',
				closeFloatWindow: '📴 Sulje kelluva ikkuna (Paina pitkään siirtääksesi)',
				enableHotkeys: 'Ota käyttöön sivunvaihtonäppäimet',
				hotkeys: '🎛️ Määritä sivunvaihtonäppäimet PC:lle',
				upKey: 'Sivun yläosa pikanäppäin',
				downKey: 'Sivun alaosa pikanäppäin',
				hotkeyInstructions: '💬 Määritä sivunvaihtonäppäimet\n💡 Valitse tekstiruutu ja paina tavoitenäppäintä:',
				confirmCloseFloatWindow: '❗️ Oletko varma, että haluat sulkea kelluvan ikkunan?\n🖥️ Voit avata sen uudelleen PC:llä olevista script managerin vaihtoehdoista,\n📱 Jos script managerilla ei ole graafista käyttöliittymää, voit asentaa skriptin uudelleen.',
				confirmUpdate: '⚠️ Jotkut script managerit eivät voi automaattisesti havaita päivityksiä, joten sinun on tarkistettava manuaalisesti.\n🔄 Nykyinen versio on: v2.4.5.\n💬 Jos sinulla on ongelmia skriptin kanssa tai ideoita, voit jättää viestin skriptin palautekenttään.\n📄 Julkaisusivun johdanto-osiossa on myös tapoja tukea minua.\n🥤 Jos tämä skripti on ratkaissut suuren ongelman sinulle, toivon, että voit ostaa minulle maitoteetä!'
			},
			menu: {
				showFloatingWindow: 'Näytä kelluva ikkuna'
			}
		},
		fr: {
			autoDetectModeOptions: {
				close: 'Fermer',
				sameColor: 'Même couleur',
				invertColor: 'Inverser couleur'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Enregistrer',
				donate: '🔄 Mettre à jour/💰 Faire un don'
			},
			settings: {
				darkMode: '🌑 Mode sombre',
				autoDetect: '🔎 Ajuster automatiquement la couleur de la fenêtre flottante (Ignorer les modifications ci-dessus)',
				close: 'Fermer',
				same: 'Même',
				invert: 'Inverser',
				layout: '↕️ Disposition verticale des boutons',
				floatWindowSize: '📏 Taille de la fenêtre flottante',
				reservedHeightPercentage: '📄 Pourcentage de page réservée',
				windowOpacity: '🌫️ Opacité de la fenêtre',
				textOpacity: '🖋️ Opacité du texte',
				closeFloatWindow: '📴 Fermer la fenêtre flottante (Appuyez longuement pour déplacer)',
				enableHotkeys: 'Activer les raccourcis clavier pour changer de page',
				hotkeys: '🎛️ Définir les raccourcis clavier pour changer de page sur PC',
				upKey: 'Raccourci clavier pour monter la page',
				downKey: 'Raccourci clavier pour descendre la page',
				hotkeyInstructions: '💬 Veuillez définir les raccourcis clavier pour changer de page\n💡 Sélectionnez la zone de texte et appuyez sur la touche cible :',
				confirmCloseFloatWindow: '❗️ Êtes-vous sûr de vouloir fermer la fenêtre flottante ?\n🖥️ Vous pouvez la rouvrir via les options du gestionnaire de scripts sur PC,\n📱 Si le gestionnaire de scripts n\'a pas d\'interface graphique, vous pouvez réinstaller le script.',
				confirmUpdate: '⚠️ Certains gestionnaires de scripts ne peuvent pas détecter automatiquement les mises à jour, vous devez donc vérifier manuellement.\n🔄 La version actuelle est : v2.4.5.\n💬 Si vous avez des problèmes avec le script ou des idées, vous pouvez laisser un message dans la zone de commentaires du script.\n📄 La section d\'introduction sur la page de publication du script contient également des moyens de me soutenir.\n🥤 Si ce script a résolu un gros problème pour vous, j\'espère que vous pourrez m\'acheter un thé au lait !'
			},
			menu: {
				showFloatingWindow: 'Afficher la fenêtre flottante'
			}
		},
		'fr-ca': {
			autoDetectModeOptions: {
				close: 'Fermer',
				sameColor: 'Même couleur',
				invertColor: 'Inverser couleur'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Enregistrer',
				donate: '🔄 Mettre à jour/💰 Faire un don'
			},
			settings: {
				darkMode: '🌑 Mode sombre',
				autoDetect: '🔎 Ajuster automatiquement la couleur de la fenêtre flottante (Ignorer les modifications ci-dessus)',
				close: 'Fermer',
				same: 'Même',
				invert: 'Inverser',
				layout: '↕️ Disposition verticale des boutons',
				floatWindowSize: '📏 Taille de la fenêtre flottante',
				reservedHeightPercentage: '📄 Pourcentage de page réservée',
				windowOpacity: '🌫️ Opacité de la fenêtre',
				textOpacity: '🖋️ Opacité du texte',
				closeFloatWindow: '📴 Fermer la fenêtre flottante (Appuyez longuement pour déplacer)',
				enableHotkeys: 'Activer les raccourcis clavier pour changer de page',
				hotkeys: '🎛️ Définir les raccourcis clavier pour changer de page sur PC',
				upKey: 'Raccourci clavier pour monter la page',
				downKey: 'Raccourci clavier pour descendre la page',
				hotkeyInstructions: '💬 Veuillez définir les raccourcis clavier pour changer de page\n💡 Sélectionnez la zone de texte et appuyez sur la touche cible :',
				confirmCloseFloatWindow: '❗️ Êtes-vous sûr de vouloir fermer la fenêtre flottante ?\n🖥️ Vous pouvez la rouvrir via les options du gestionnaire de scripts sur PC,\n📱 Si le gestionnaire de scripts n\'a pas d\'interface graphique, vous pouvez réinstaller le script.',
				confirmUpdate: '⚠️ Certains gestionnaires de scripts ne peuvent pas détecter automatiquement les mises à jour, vous devez donc vérifier manuellement.\n🔄 La version actuelle est : v2.4.5.\n💬 Si vous avez des problèmes avec le script ou des idées, vous pouvez laisser un message dans la zone de commentaires du script.\n📄 La section d\'introduction sur la page de publication du script contient également des moyens de me soutenir.\n🥤 Si ce script a résolu un gros problème pour vous, j\'espère que vous pourrez m\'acheter un thé au lait !'
			},
			menu: {
				showFloatingWindow: 'Afficher la fenêtre flottante'
			}
		},
		he: {
			autoDetectModeOptions: {
				close: 'סגור',
				sameColor: 'אותו צבע',
				invertColor: 'היפוך צבע'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 שמור',
				donate: '🔄 עדכן/💰 תרום'
			},
			settings: {
				darkMode: '🌑 מצב כהה',
				autoDetect: '🔎 התאם אוטומטית את צבע חלון הצף (התעלם מהשינויים לעיל)',
				close: 'סגור',
				same: 'אותו',
				invert: 'הפוך',
				layout: '↕️ פריסת כפתורים אנכית',
				floatWindowSize: '📏 גודל חלון צף',
				reservedHeightPercentage: '📄 אחוז שמירת הדף',
				windowOpacity: '🌫️ אטימות חלון',
				textOpacity: '🖋️ אטימות טקסט',
				closeFloatWindow: '📴 סגור חלון צף (לחיצה ארוכה להעברה)',
				enableHotkeys: 'אפשר מקשי קיצור להחלפת דף',
				hotkeys: '🎛️ הגדר מקשי קיצור להחלפת דף במחשב',
				upKey: 'מקשי קיצור לדף למעלה',
				downKey: 'מקשי קיצור לדף למטה',
				hotkeyInstructions: '💬 אנא הגדר את מקשי הקיצור להחלפת דף\n💡 בחר את תיבת הטקסט ולחץ על מקש המטרה:',
				confirmCloseFloatWindow: '❗️ האם אתה בטוח שברצונך לסגור את החלון הצף?\n🖥️ תוכל לפתוח אותו מחדש באמצעות האפשרויות במנהל הסקריפטים במחשב,\n📱 אם למנהל הסקריפטים אין ממשק גרפי, תוכל להתקין מחדש את הסקריפט.',
				confirmUpdate: '⚠️ חלק ממנהלי הסקריפטים לא יכולים לזהות עדכונים באופן אוטומטי, לכן עליך לבדוק באופן ידני.\n🔄 הגרסה הנוכחית היא: v2.4.5.\n💬 אם יש לך בעיות עם הסקריפט או רעיונות, תוכל להשאיר הודעה באזור המשוב של הסקריפט.\n📄 סעיף המבוא בדף שחרור הסקריפט מכיל גם דרכים לתמוך בי.\n🥤 אם הסקריפט הזה פתר בעיה גדולה עבורך, אני מקווה שתוכל לקנות לי תה חלב!'
			},
			menu: {
				showFloatingWindow: 'הצג חלון צף'
			}
		},
		hr: {
			autoDetectModeOptions: {
				close: 'Zatvori',
				sameColor: 'Ista boja',
				invertColor: 'Invertiraj boju'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Spremi',
				donate: '🔄 Ažuriraj/💰 Doniraj'
			},
			settings: {
				darkMode: '🌑 Tamni način',
				autoDetect: '🔎 Automatski prilagodi boju plutajućeg prozora (Ignoriraj gore navedene promjene)',
				close: 'Zatvori',
				same: 'Isto',
				invert: 'Invertiraj',
				layout: '↕️ Vertikalni raspored gumba',
				floatWindowSize: '📏 Veličina plutajućeg prozora',
				reservedHeightPercentage: '📄 Postotak zadržane stranice',
				windowOpacity: '🌫️ Prozirnost prozora',
				textOpacity: '🖋️ Prozirnost teksta',
				closeFloatWindow: '📴 Zatvori plutajući prozor (Dugo pritisnite za premještanje)',
				enableHotkeys: 'Omogući tipke prečaca za promjenu stranice',
				hotkeys: '🎛️ Postavite tipke prečaca za promjenu stranice na računalu',
				upKey: 'Tipka prečaca za pomicanje stranice prema gore',
				downKey: 'Tipka prečaca za pomicanje stranice prema dolje',
				hotkeyInstructions: '💬 Molimo postavite tipke prečaca za promjenu stranice\n💡 Odaberite tekstualni okvir i pritisnite ciljnu tipku:',
				confirmCloseFloatWindow: '❗️ Jeste li sigurni da želite zatvoriti plutajući prozor?\n🖥️ Možete ga ponovno otvoriti putem opcija u upravitelju skripti na računalu,\n📱 Ako upravitelj skripti nema grafičko sučelje, možete ponovno instalirati skriptu.',
				confirmUpdate: '⚠️ Neki upravitelji skripti ne mogu automatski otkriti ažuriranja, pa morate ručno provjeriti.\n🔄 Trenutna verzija je: v2.4.5.\n💬 Ako imate bilo kakvih problema sa skriptom ili ideje, možete ostaviti poruku u području za povratne informacije skripte.\n📄 U uvodnom dijelu na stranici za objavljivanje skripte također se nalaze načini kako me podržati.\n🥤 Ako vam je ova skripta riješila veliki problem, nadam se da mi možete kupiti mliječni čaj!'
			},
			menu: {
				showFloatingWindow: 'Prikaži plutajući prozor'
			}
		},
		hu: {
			autoDetectModeOptions: {
				close: 'Bezárás',
				sameColor: 'Azonos szín',
				invertColor: 'Szín inverzió'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Mentés',
				donate: '🔄 Frissítés/💰 Adományozás'
			},
			settings: {
				darkMode: '🌑 Sötét mód',
				autoDetect: '🔎 Automatikus színbeállítás a lebegő ablakhoz (Figyelmen kívül hagyja a fenti módosításokat)',
				close: 'Bezárás',
				same: 'Azonos',
				invert: 'Invertálás',
				layout: '↕️ Függőleges gombelrendezés',
				floatWindowSize: '📏 Lebegő ablak mérete',
				reservedHeightPercentage: '📄 Fenntartott oldal százaléka',
				windowOpacity: '🌫️ Ablak átlátszósága',
				textOpacity: '🖋️ Szöveg átlátszósága',
				closeFloatWindow: '📴 Lebegő ablak bezárása (Hosszan nyomva mozgatható)',
				enableHotkeys: 'Gyorsbillentyűk engedélyezése az oldalváltáshoz',
				hotkeys: '🎛️ Gyorsbillentyűk beállítása PC-hez',
				upKey: 'Fel oldalváltó gyorsbillentyű',
				downKey: 'Le oldalváltó gyorsbillentyű',
				hotkeyInstructions: '💬 Kérjük, állítsa be az oldalváltó gyorsbillentyűket\n💡 Válassza ki a szövegdobozt, és nyomja meg a célt billentyűt:',
				confirmCloseFloatWindow: '❗️ Biztosan be akarja zárni a lebegő ablakot?\n🖥️ Újra megnyithatja a script kezelő opcióin keresztül a PC-n,\n📱 Ha a script kezelőnek nincs grafikus felülete, újratelepítheti a scriptet.',
				confirmUpdate: '⚠️ Néhány script kezelő nem tudja automatikusan észlelni a frissítéseket, így manuálisan kell ellenőriznie.\n🔄 Az aktuális verzió: v2.4.5.\n💬 Ha bármilyen problémája van a script-tel vagy ötletei vannak, hagyhat üzenetet a script visszajelzési területén.\n📄 A script kiadási oldalának bevezető részében módokat is találhat a támogatásomra.\n🥤 Ha ez a script nagy problémát oldott meg önnek, remélem, hogy vásárol nekem egy tejteát!'
			},
			menu: {
				showFloatingWindow: 'Lebegő ablak megjelenítése'
			}
		},
		id: {
			autoDetectModeOptions: {
				close: 'Tutup',
				sameColor: 'Warna yang sama',
				invertColor: 'Balik warna'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Simpan',
				donate: '🔄 Perbarui/💰 Donasi'
			},
			settings: {
				darkMode: '🌑 Mode Gelap',
				autoDetect: '🔎 Sesuaikan Warna Jendela Mengambang secara Otomatis (Abaikan perubahan di atas)',
				close: 'Tutup',
				same: 'Sama',
				invert: 'Balik',
				layout: '↕️ Tata Letak Tombol Vertikal',
				floatWindowSize: '📏 Ukuran Jendela Mengambang',
				reservedHeightPercentage: '📄 Persentase Halaman yang Disimpan',
				windowOpacity: '🌫️ Opasitas Jendela',
				textOpacity: '🖋️ Opasitas Teks',
				closeFloatWindow: '📴 Tutup Jendela Mengambang (Tekan lama untuk memindahkan)',
				enableHotkeys: 'Aktifkan Pintasan Keyboard untuk Mengganti Halaman',
				hotkeys: '🎛️ Atur Pintasan Keyboard untuk PC',
				upKey: 'Pintasan Halaman Atas',
				downKey: 'Pintasan Halaman Bawah',
				hotkeyInstructions: '💬 Silakan atur pintasan keyboard untuk mengganti halaman\n💡 Pilih kotak teks dan tekan tombol target:',
				confirmCloseFloatWindow: '❗️ Apakah Anda yakin ingin menutup jendela mengambang?\n🖥️ Anda dapat membukanya kembali melalui opsi di manajer skrip di PC,\n📱 Jika manajer skrip tidak memiliki antarmuka grafis, Anda dapat menginstal ulang skrip.',
				confirmUpdate: '⚠️ Beberapa manajer skrip tidak dapat mendeteksi pembaruan secara otomatis, jadi Anda perlu memeriksa secara manual.\n🔄 Versi saat ini adalah: v2.4.5.\n💬 Jika ada masalah dengan skrip atau ide, Anda dapat meninggalkan pesan di area umpan balik skrip.\n📄 Bagian pengantar di halaman rilis skrip juga berisi cara mendukung saya.\n🥤 Jika skrip ini telah menyelesaikan masalah besar bagi Anda, saya harap Anda dapat membelikan saya teh susu!'
			},
			menu: {
				showFloatingWindow: 'Tampilkan Jendela Mengambang'
			}
		},
		it: {
			autoDetectModeOptions: {
				close: 'Chiudi',
				sameColor: 'Stesso colore',
				invertColor: 'Inverti colore'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Salva',
				donate: '🔄 Aggiorna/💰 Dona'
			},
			settings: {
				darkMode: '🌑 Modalità scura',
				autoDetect: '🔎 Regola automaticamente il colore della finestra flottante (Ignora le modifiche sopra)',
				close: 'Chiudi',
				same: 'Stesso',
				invert: 'Inverti',
				layout: '↕️ Layout verticale dei pulsanti',
				floatWindowSize: '📏 Dimensione della finestra flottante',
				reservedHeightPercentage: '📄 Percentuale di pagina riservata',
				windowOpacity: '🌫️ Opacità della finestra',
				textOpacity: '🖋️ Opacità del testo',
				closeFloatWindow: '📴 Chiudi finestra flottante (Premi a lungo per spostare)',
				enableHotkeys: 'Abilita scorciatoie per cambiare pagina',
				hotkeys: '🎛️ Imposta scorciatoie per cambiare pagina su PC',
				upKey: 'Scorciatoia per pagina su',
				downKey: 'Scorciatoia per pagina giù',
				hotkeyInstructions: '💬 Si prega di impostare le scorciatoie per cambiare pagina\n💡 Seleziona la casella di testo e premi il tasto di destinazione:',
				confirmCloseFloatWindow: '❗️ Sei sicuro di voler chiudere la finestra flottante?\n🖥️ Puoi riaprirla tramite le opzioni nel gestore degli script su PC,\n📱 Se il gestore degli script non ha un\'interfaccia grafica, puoi reinstallare lo script.',
				confirmUpdate: '⚠️ Alcuni gestori di script non possono rilevare automaticamente gli aggiornamenti, quindi è necessario controllare manualmente.\n🔄 La versione attuale è: v2.4.5.\n💬 Se ci sono problemi con lo script o idee, puoi lasciare un messaggio nell\'area di feedback dello script.\n📄 La sezione introduttiva nella pagina di rilascio dello script contiene anche modi per supportarmi.\n🥤 Se questo script ha risolto un grosso problema per te, spero che tu possa comprarmi un tè al latte!'
			},
			menu: {
				showFloatingWindow: 'Mostra finestra flottante'
			}
		},
		ja: {
			autoDetectModeOptions: {
				close: '閉じる',
				sameColor: '同じ色',
				invertColor: '色を反転'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 保存',
				donate: '🔄 更新/💰 寄付'
			},
			settings: {
				darkMode: '🌑 ダークモード',
				autoDetect: '🔎 浮動ウィンドウの色を自動調整（上記の変更を無視）',
				close: '閉じる',
				same: '同じ',
				invert: '反転',
				layout: '↕️ 垂直ボタン配置',
				floatWindowSize: '📏 浮動ウィンドウのサイズ',
				reservedHeightPercentage: '📄 予約ページの割合',
				windowOpacity: '🌫️ ウィンドウの不透明度',
				textOpacity: '🖋️ テキストの不透明度',
				closeFloatWindow: '📴 浮動ウィンドウを閉じる（長押しで移動）',
				enableHotkeys: 'ページ送りのホットキーを有効にする',
				hotkeys: '🎛️ PCのページ送りホットキーを設定',
				upKey: '上のページ送りホットキー',
				downKey: '下のページ送りホットキー',
				hotkeyInstructions: '💬 ページ送りホットキーを設定してください\n💡 テキストボックスを選択し、ターゲットキーを押します:',
				confirmCloseFloatWindow: '❗️ 浮動ウィンドウを閉じてもよろしいですか？\n🖥️ PCのスクリプトマネージャーのオプションから再度開くことができます,\n📱 スクリプトマネージャーにグラフィカルインターフェースがない場合は、スクリプトを再インストールできます。',
				confirmUpdate: '⚠️ 一部のスクリプトマネージャーは自動的に更新を検出できないため、手動で確認する必要があります。\n🔄 現在のバージョンは：v2.4.5です。\n💬 スクリプトに問題がある場合やアイデアがある場合は、スクリプトのフィードバックエリアにメッセージを残すことができます。\n📄 スクリプトのリリースページのイントロダクションセクションには、私をサポートする方法も記載されています。\n🥤 このスクリプトがあなたにとって大きな問題を解決した場合、ミルクティーを買っていただけると嬉しいです！'
			},
			menu: {
				showFloatingWindow: '浮動ウィンドウを表示'
			}
		},
		ka: {
			autoDetectModeOptions: {
				close: 'დახურვა',
				sameColor: 'იგივე ფერი',
				invertColor: 'ფერის ინვერსია'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 შენახვა',
				donate: '🔄 განახლება/💰 შემოწირულობა'
			},
			settings: {
				darkMode: '🌑 მუქი რეჟიმი',
				autoDetect: '🔎 ავტომატური ფერის რეგულირება მცურავი ფანჯრისთვის (იგნორირება ზემოთ ცვლილებების)',
				close: 'დახურვა',
				same: 'იგივე',
				invert: 'ინვერსია',
				layout: '↕️ ვერტიკალური ღილაკების განლაგება',
				floatWindowSize: '📏 მცურავი ფანჯრის ზომა',
				reservedHeightPercentage: '📄 გვერდის შენახული პროცენტული რაოდენობა',
				windowOpacity: '🌫️ ფანჯრის გამჭვირვალობა',
				textOpacity: '🖋️ ტექსტის გამჭვირვალობა',
				closeFloatWindow: '📴 მცურავი ფანჯრის დახურვა (ხანგრძლივად დაჭერით გადასაადგილებლად)',
				enableHotkeys: 'სწრაფი ღილაკების ჩართვა გვერდის გადაცემისთვის',
				hotkeys: '🎛️ სწრაფი ღილაკების დაყენება კომპიუტერისთვის',
				upKey: 'ზემოთ გვერდის სწრაფი ღილაკი',
				downKey: 'ქვემოთ გვერდის სწრაფი ღილაკი',
				hotkeyInstructions: '💬 გთხოვთ დააყენოთ გვერდის სწრაფი ღილაკები\n💡 აირჩიეთ ტექსტის ყუთი და დააჭირეთ მიზნობი ღილაკი:',
				confirmCloseFloatWindow: '❗️ დარწმუნებული ხართ, რომ გსურთ მცურავი ფანჯრის დახურვა?\n🖥️ შეგიძლიათ თავიდან გახსნათ იგი კომპიუტერზე სკრიპტ მენეჯერის პარამეტრების მეშვეობით,\n📱 თუ სკრიპტ მენეჯერს არ აქვს გრაფიკული ინტერფეისი, შეგიძლიათ თავიდან დააინსტალიროთ სკრიპტი.',
				confirmUpdate: '⚠️ ზოგიერთი სკრიპტ მენეჯერი არ შეუძლია ავტომატურად განახლების აღმოჩენა, ამიტომ უნდა შეამოწმოთ ხელით.\n🔄 მიმდინარე ვერსიაა: v2.4.5.\n💬 თუ სკრიპტთან რაიმე პრობლემა გაქვთ ან იდეები გაქვთ, შეგიძლიათ დატოვოთ შეტყობინება სკრიპტის უკუკავშირის არეალში.\n📄 სკრიპტის გამოშვების გვერდზე შესავალ ნაწილში ასევე არის გზები, რომ მომცეს მხარდაჭერა.\n🥤 თუ ეს სკრიპტი დიდ პრობლემას გადაგიწყვიტეთ, იმედი მაქვს, რომ შემომიძენთ რძიან ჩაის!'
			},
			menu: {
				showFloatingWindow: 'მცურავი ფანჯრის ჩვენება'
			}
		},
		ko: {
			autoDetectModeOptions: {
				close: '닫기',
				sameColor: '같은 색상',
				invertColor: '색상 반전'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 저장',
				donate: '🔄 업데이트/💰 기부'
			},
			settings: {
				darkMode: '🌑 다크 모드',
				autoDetect: '🔎 플로팅 창 색상 자동 조정 (위의 변경 사항 무시)',
				close: '닫기',
				same: '같은',
				invert: '반전',
				layout: '↕️ 수직 버튼 레이아웃',
				floatWindowSize: '📏 플로팅 창 크기',
				reservedHeightPercentage: '📄 예약된 페이지 비율',
				windowOpacity: '🌫️ 창 불투명도',
				textOpacity: '🖋️ 텍스트 불투명도',
				closeFloatWindow: '📴 플로팅 창 닫기 (길게 눌러 이동)',
				enableHotkeys: '페이지 전환 단축키 사용',
				hotkeys: '🎛️ PC용 페이지 전환 단축키 설정',
				upKey: '페이지 위로 단축키',
				downKey: '페이지 아래로 단축키',
				hotkeyInstructions: '💬 페이지 전환 단축키를 설정해주세요\n💡 텍스트 상자를 선택하고 대상 키를 누르세요:',
				confirmCloseFloatWindow: '❗️ 플로팅 창을 닫으시겠습니까?\n🖥️ PC의 스크립트 관리자 옵션을 통해 다시 열 수 있습니다,\n📱 스크립트 관리자에 그래픽 인터페이스가 없는 경우, 스크립트를 다시 설치할 수 있습니다.',
				confirmUpdate: '⚠️ 일부 스크립트 관리자는 업데이트를 자동으로 감지할 수 없으므로 수동으로 확인해야 합니다.\n🔄 현재 버전은: v2.4.5입니다.\n💬 스크립트에 문제가 있거나 아이디어가 있는 경우, 스크립트 피드백 영역에 메시지를 남길 수 있습니다.\n📄 스크립트 릴리스 페이지의 소개 섹션에는 나를 지원하는 방법도 포함되어 있습니다.\n🥤 이 스크립트가 큰 문제를 해결해 주었다면, 저에게 밀크티를 사주셨으면 합니다!'
			},
			menu: {
				showFloatingWindow: '플로팅 창 표시'
			}
		},
		nb: {
			autoDetectModeOptions: {
				close: 'Lukk',
				sameColor: 'Samme farge',
				invertColor: 'Inverter farge'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Lagre',
				donate: '🔄 Oppdater/💰 Doner'
			},
			settings: {
				darkMode: '🌑 Mørk modus',
				autoDetect: '🔎 Juster fargen på den flytende vinduet automatisk (Ignorer endringene ovenfor)',
				close: 'Lukk',
				same: 'Samme',
				invert: 'Inverter',
				layout: '↕️ Vertikal knappoppsett',
				floatWindowSize: '📏 Størrelse på flytende vindu',
				reservedHeightPercentage: '📄 Reservert sideandel',
				windowOpacity: '🌫️ Vinduets opasitet',
				textOpacity: '🖋️ Tekstopasitet',
				closeFloatWindow: '📴 Lukk flytende vindu (Langt trykk for å flytte)',
				enableHotkeys: 'Aktiver hurtigtaster for sideskift',
				hotkeys: '🎛️ Angi hurtigtaster for sideskift for PC',
				upKey: 'Side opp hurtigtast',
				downKey: 'Side ned hurtigtast',
				hotkeyInstructions: '💬 Vennligst angi hurtigtaster for sideskift\n💡 Velg tekstboksen og trykk på målknappen:',
				confirmCloseFloatWindow: '❗️ Er du sikker på at du vil lukke det flytende vinduet?\n🖥️ Du kan åpne det igjen via alternativene i skriptbehandleren på PC,\n📱 Hvis skriptbehandleren ikke har et grafisk grensesnitt, kan du installere skriptet på nytt.',
				confirmUpdate: '⚠️ Noen skriptbehandlere kan ikke automatisk oppdage oppdateringer, så du må sjekke manuelt.\n🔄 Den nåværende versjonen er: v2.4.5.\n💬 Hvis det er noen problemer med skriptet, eller hvis du har noen ideer, kan du legge igjen en melding i skriptets tilbakemeldingsområde.\n📄 Introduksjonsseksjonen på skriptutgivelsessiden inneholder også måter å støtte meg på.\n🥤 Hvis dette skriptet har løst et stort problem for deg, håper jeg du kan kjøpe meg en milk tea!'
			},
			menu: {
				showFloatingWindow: 'Vis flytende vindu'
			}
		},
		nl: {
			autoDetectModeOptions: {
				close: 'Sluiten',
				sameColor: 'Zelfde kleur',
				invertColor: 'Kleur omkeren'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Opslaan',
				donate: '🔄 Bijwerken/💰 Doneren'
			},
			settings: {
				darkMode: '🌑 Donkere modus',
				autoDetect: '🔎 Automatisch aanpassen van de kleur van het zwevende venster (Negeer bovenstaande wijzigingen)',
				close: 'Sluiten',
				same: 'Zelfde',
				invert: 'Omkeren',
				layout: '↕️ Verticale knopindeling',
				floatWindowSize: '📏 Grootte van het zwevende venster',
				reservedHeightPercentage: '📄 Gereserveerd paginapercentage',
				windowOpacity: '🌫️ Vensteropaciteit',
				textOpacity: '🖋️ Tekstopaciteit',
				closeFloatWindow: '📴 Zwevend venster sluiten (Lang indrukken om te verplaatsen)',
				enableHotkeys: 'Sneltoetsen voor paginawisseling inschakelen',
				hotkeys: '🎛️ Sneltoetsen voor paginawisseling instellen voor pc',
				upKey: 'Pagina omhoog sneltoets',
				downKey: 'Pagina omlaag sneltoets',
				hotkeyInstructions: '💬 Stel de sneltoetsen voor paginawisseling in\n💡 Selecteer het tekstvak en druk op de doelsneltoets:',
				confirmCloseFloatWindow: '❗️ Weet je zeker dat je het zwevende venster wilt sluiten?\n🖥️ Je kunt het opnieuw openen via de opties in de scriptbeheerder op de pc,\n📱 Als de scriptbeheerder geen grafische interface heeft, kun je het script opnieuw installeren.',
				confirmUpdate: '⚠️ Sommige scriptbeheerders kunnen updates niet automatisch detecteren, dus je moet handmatig controleren.\n🔄 De huidige versie is: v2.4.5.\n💬 Als er problemen zijn met het script of als je ideeën hebt, kun je een bericht achterlaten in het feedbackgedeelte van het script.\n📄 Het inleidende gedeelte op de scriptuitgavesite bevat ook manieren om me te steunen.\n🥤 Als dit script een groot probleem voor je heeft opgelost, hoop ik dat je me een milk tea kunt kopen!'
			},
			menu: {
				showFloatingWindow: 'Zwevend venster weergeven'
			}
		},
		pl: {
			autoDetectModeOptions: {
				close: 'Zamknij',
				sameColor: 'Taki sam kolor',
				invertColor: 'Odwróć kolor'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Zapisz',
				donate: '🔄 Aktualizuj/💰 Wesprzyj'
			},
			settings: {
				darkMode: '🌑 Tryb ciemny',
				autoDetect: '🔎 Automatycznie dostosuj kolor pływającego okna (Ignoruj powyższe zmiany)',
				close: 'Zamknij',
				same: 'Taki sam',
				invert: 'Odwróć',
				layout: '↕️ Układ przycisków pionowy',
				floatWindowSize: '📏 Rozmiar pływającego okna',
				reservedHeightPercentage: '📄 Zarezerwowany procent strony',
				windowOpacity: '🌫️ Przezroczystość okna',
				textOpacity: '🖋️ Przezroczystość tekstu',
				closeFloatWindow: '📴 Zamknij pływające okno (Przytrzymaj, aby przesunąć)',
				enableHotkeys: 'Włącz skróty klawiaturowe do zmiany strony',
				hotkeys: '🎛️ Ustaw skróty klawiaturowe do zmiany strony na PC',
				upKey: 'Skrót klawiszowy do przewijania strony w górę',
				downKey: 'Skrót klawiszowy do przewijania strony w dół',
				hotkeyInstructions: '💬 Proszę ustawić skróty klawiaturowe do zmiany strony\n💡 Wybierz pole tekstowe i naciśnij docelowy klawisz skrótu:',
				confirmCloseFloatWindow: '❗️ Czy na pewno chcesz zamknąć pływające okno?\n🖥️ Możesz je ponownie otworzyć za pomocą opcji w menedżerze skryptów na PC,\n📱 Jeśli menedżer skryptów nie ma interfejsu graficznego, możesz ponownie zainstalować skrypt.',
				confirmUpdate: '⚠️ Niektóre menedżery skryptów nie mogą automatycznie wykrywać aktualizacji, więc musisz sprawdzić ręcznie.\n🔄 Aktualna wersja to: v2.4.5.\n💬 Jeśli masz jakiekolwiek problemy ze skryptem lub pomysły, możesz zostawić wiadomość w sekcji opinii o skrypcie.\n📄 W sekcji wstępnej na stronie wydania skryptu znajdują się również sposoby na wsparcie mnie.\n🥤 Jeśli ten skrypt rozwiązał duży problem, mam nadzieję, że możesz kupić mi herbatę mleczną!'
			},
			menu: {
				showFloatingWindow: 'Pokaż pływające okno'
			}
		},
		ro: {
			autoDetectModeOptions: {
				close: 'Închide',
				sameColor: 'Aceeași culoare',
				invertColor: 'Inversează culoarea'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Salvează',
				donate: '🔄 Actualizează/💰 Donează'
			},
			settings: {
				darkMode: '🌑 Mod întunecat',
				autoDetect: '🔎 Ajustează automat culoarea ferestrei plutitoare (Ignoră modificările de mai sus)',
				close: 'Închide',
				same: 'Aceeași',
				invert: 'Inversează',
				layout: '↕️ Aranjament vertical al butoanelor',
				floatWindowSize: '📏 Dimensiunea ferestrei plutitoare',
				reservedHeightPercentage: '📄 Procentajul paginii rezervat',
				windowOpacity: '🌫️ Opacitatea ferestrei',
				textOpacity: '🖋️ Opacitatea textului',
				closeFloatWindow: '📴 Închide fereastra plutitoare (Apasă și ține pentru a muta)',
				enableHotkeys: 'Activează tastele rapide pentru schimbarea paginii',
				hotkeys: '🎛️ Configurează tastele rapide pentru schimbarea paginii pe PC',
				upKey: 'Tasta rapidă pentru urcarea paginii',
				downKey: 'Tasta rapidă pentru coborârea paginii',
				hotkeyInstructions: '💬 Te rugăm să configurezi tastele rapide pentru schimbarea paginii\n💡 Selectează caseta de text și apasă tasta rapidă dorită:',
				confirmCloseFloatWindow: '❗️ Ești sigur că vrei să închizi fereastra plutitoare?\n🖥️ O poți redeschide prin opțiunile din managerul de scripturi de pe PC,\n📱 Dacă managerul de scripturi nu are o interfață grafică, poți reinstala scriptul.',
				confirmUpdate: '⚠️ Unii manageri de scripturi nu pot detecta automat actualizările, așa că trebuie să verifici manual.\n🔄 Versiunea curentă este: v2.4.5.\n💬 Dacă există probleme cu scriptul sau dacă ai idei, poți lăsa un mesaj în zona de feedback a scriptului.\n📄 Secțiunea de introducere de pe pagina de lansare a scriptului conține, de asemenea, modalități de a mă sprijini.\n🥤 Dacă acest script a rezolvat o problemă majoră pentru tine, sper că îmi poți cumpăra un ceai cu lapte!'
			},
			menu: {
				showFloatingWindow: 'Arată fereastra plutitoare'
			}
		},
		ru: {
			autoDetectModeOptions: {
				close: 'Закрыть',
				sameColor: 'Тот же цвет',
				invertColor: 'Инвертировать цвет'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Сохранить',
				donate: '🔄 Обновить/💰 Пожертвовать'
			},
			settings: {
				darkMode: '🌑 Темный режим',
				autoDetect: '🔎 Автоматически настроить цвет плавающего окна (Игнорировать изменения выше)',
				close: 'Закрыть',
				same: 'Тот же',
				invert: 'Инвертировать',
				layout: '↕️ Вертикальная компоновка кнопок',
				floatWindowSize: '📏 Размер плавающего окна',
				reservedHeightPercentage: '📄 Процент зарезервированной страницы',
				windowOpacity: '🌫️ Непрозрачность окна',
				textOpacity: '🖋️ Непрозрачность текста',
				closeFloatWindow: '📴 Закрыть плавающее окно (Нажмите и удерживайте для перемещения)',
				enableHotkeys: 'Включить горячие клавиши для смены страниц',
				hotkeys: '🎛️ Настроить горячие клавиши для смены страниц на ПК',
				upKey: 'Горячая клавиша для прокрутки страницы вверх',
				downKey: 'Горячая клавиша для прокрутки страницы вниз',
				hotkeyInstructions: '💬 Пожалуйста, настройте горячие клавиши для смены страниц\n💡 Выберите текстовое поле и нажмите нужную горячую клавишу:',
				confirmCloseFloatWindow: '❗️ Вы уверены, что хотите закрыть плавающее окно?\n🖥️ Вы можете открыть его снова через настройки в менеджере скриптов на ПК,\n📱 Если у менеджера скриптов нет графического интерфейса, вы можете переустановить скрипт.',
				confirmUpdate: '⚠️ Некоторые менеджеры скриптов не могут автоматически обнаруживать обновления, поэтому вам нужно проверять вручную.\n🔄 Текущая версия: v2.4.5.\n💬 Если у вас есть проблемы со скриптом или идеи, вы можете оставить сообщение в разделе отзывов о скрипте.\n📄 Раздел введения на странице выпуска скрипта также содержит способы поддержать меня.\n🥤 Если этот скрипт решил большую проблему для вас, надеюсь, вы сможете купить мне молочный чай!'
			},
			menu: {
				showFloatingWindow: 'Показать плавающее окно'
			}
		},
		sk: {
			autoDetectModeOptions: {
				close: 'Zavrieť',
				sameColor: 'Rovnaká farba',
				invertColor: 'Invertovať farbu'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Uložiť',
				donate: '🔄 Aktualizovať/💰 Prispieť'
			},
			settings: {
				darkMode: '🌑 Tmavý režim',
				autoDetect: '🔎 Automaticky nastaviť farbu plávajúceho okna (Ignorovať vyššie uvedené zmeny)',
				close: 'Zavrieť',
				same: 'Rovnaké',
				invert: 'Invertovať',
				layout: '↕️ Vertikálne usporiadanie tlačidiel',
				floatWindowSize: '📏 Veľkosť plávajúceho okna',
				reservedHeightPercentage: '📄 Rezervované percento stránky',
				windowOpacity: '🌫️ Nepriehľadnosť okna',
				textOpacity: '🖋️ Nepriehľadnosť textu',
				closeFloatWindow: '📴 Zavrieť plávajúce okno (Dlhým stlačením môžete okno presunúť)',
				enableHotkeys: 'Povoliť klávesové skratky na otáčanie stránok',
				hotkeys: '🎛️ Nastaviť klávesové skratky na otáčanie stránok na PC',
				upKey: 'Klávesová skratka na posun stránky nahor',
				downKey: 'Klávesová skratka na posun stránky nadol',
				hotkeyInstructions: '💬 Prosím, nastavte klávesové skratky na otáčanie stránok\n💡 Vyberte textové pole a stlačte požadovanú klávesovú skratku:',
				confirmCloseFloatWindow: '❗️ Ste si istí, že chcete zavrieť plávajúce okno?\n🖥️ Môžete ho znova otvoriť cez možnosti v správcovi skriptov na PC,\n📱 Ak správca skriptov nemá grafické rozhranie, môžete skript znova nainštalovať.',
				confirmUpdate: '⚠️ Niektorí správcovia skriptov nedokážu automaticky detekovať aktualizácie, takže ich musíte skontrolovať manuálne.\n🔄 Aktuálna verzia je: v2.4.5.\n💬 Ak máte akékoľvek problémy so skriptom alebo nápady, môžete zanechať správu v sekcii spätnej väzby skriptu.\n📄 Sekcia úvodu na stránke vydania skriptu tiež obsahuje spôsoby, ako ma podporiť.\n🥤 Ak tento skript vyriešil veľký problém pre vás, dúfam, že mi môžete kúpiť mliečny čaj!'
			},
			menu: {
				showFloatingWindow: 'Zobraziť plávajúce okno'
			}
		},
		sr: {
			autoDetectModeOptions: {
				close: 'Zatvori',
				sameColor: 'Ista boja',
				invertColor: 'Inverzna boja'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Sačuvaj',
				donate: '🔄 Ažuriraj/💰 Doniraj'
			},
			settings: {
				darkMode: '🌑 Tamni režim',
				autoDetect: '🔎 Automatski podešava boju plutajućeg prozora (Ignoriši gore navedene promene)',
				close: 'Zatvori',
				same: 'Isto',
				invert: 'Inverzno',
				layout: '↕️ Vertikalni raspored dugmića',
				floatWindowSize: '📏 Veličina plutajućeg prozora',
				reservedHeightPercentage: '📄 Rezervisani procenat stranice',
				windowOpacity: '🌫️ Providnost prozora',
				textOpacity: '🖋️ Providnost teksta',
				closeFloatWindow: '📴 Zatvori plutajući prozor (Dugim pritiskom možeš premestiti prozor)',
				enableHotkeys: 'Omogući prečice za promenu stranica',
				hotkeys: '🎛️ Podesi prečice za promenu stranica na računaru',
				upKey: 'Prečica za pomeranje stranice nagore',
				downKey: 'Prečica za pomeranje stranice nadole',
				hotkeyInstructions: '💬 Molimo podesite prečice za promenu stranica\n💡 Izaberi tekstualno polje i pritisni željenu prečicu:',
				confirmCloseFloatWindow: '❗️ Da li ste sigurni da želite da zatvorite plutajući prozor?\n🖥️ Možete ga ponovo otvoriti kroz opcije u menadžeru skripti na računaru,\n📱 Ako menadžer skripti nema grafički interfejs, možete ponovo instalirati skript.',
				confirmUpdate: '⚠️ Neki menadžeri skripti ne mogu automatski da detektuju ažuriranja, tako da morate ručno da proverite.\n🔄 Trenutna verzija je: v2.4.5.\n💬 Ako imate bilo kakvih problema sa skriptom ili ideje, možete ostaviti poruku u sekciji za povratne informacije o skriptu.\n📄 U uvodnom delu na stranici za objavljivanje skripta nalaze se i načini kako da me podržite.\n🥤 Ako vam je ovaj skript rešio veliki problem, nadam se da mi možete kupiti mlečni čaj!'
			},
			menu: {
				showFloatingWindow: 'Prikaži plutajući prozor'
			}
		},
		sv: {
			autoDetectModeOptions: {
				close: 'Stäng',
				sameColor: 'Samma färg',
				invertColor: 'Invertera färg'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Spara',
				donate: '🔄 Uppdatera/💰 Donera'
			},
			settings: {
				darkMode: '🌑 Mörkt läge',
				autoDetect: '🔎 Justera automatiskt färgen på det flytande fönstret (Ignorera ovanstående ändringar)',
				close: 'Stäng',
				same: 'Samma',
				invert: 'Invertera',
				layout: '↕️ Vertikal knappuppställning',
				floatWindowSize: '📏 Storlek på flytande fönster',
				reservedHeightPercentage: '📄 Reserverad sidprocent',
				windowOpacity: '🌫️ Fönstrets opacitet',
				textOpacity: '🖋️ Textens opacitet',
				closeFloatWindow: '📴 Stäng flytande fönster (Håll nedtryckt för att flytta)',
				enableHotkeys: 'Aktivera snabbtangenter för sidvändning',
				hotkeys: '🎛️ Ställ in snabbtangenter för sidvändning på datorn',
				upKey: 'Snabbtangent för att bläddra uppåt',
				downKey: 'Snabbtangent för att bläddra nedåt',
				hotkeyInstructions: '💬 Ställ in snabbtangenter för sidvändning\n💡 Välj textrutan och tryck på önskad snabbtangent:',
				confirmCloseFloatWindow: '❗️ Är du säker på att du vill stänga det flytande fönstret?\n🖥️ Du kan öppna det igen genom alternativen i skripthanteraren på datorn,\n📱 Om skripthanteraren inte har ett grafiskt gränssnitt kan du installera om skriptet.',
				confirmUpdate: '⚠️ Vissa skripthanterare kan inte automatiskt upptäcka uppdateringar, så du måste kontrollera manuellt.\n🔄 Den nuvarande versionen är: v2.4.5.\n💬 Om det finns några problem med skriptet eller om du har några idéer kan du lämna ett meddelande i skriptets feedback-avsnitt.\n📄 Introduktionssektionen på skriptets utgåvasida innehåller också sätt att stödja mig.\n🥤 Om detta skript har löst ett stort problem för dig hoppas jag att du kan köpa mig en mjölkte!'
			},
			menu: {
				showFloatingWindow: 'Visa flytande fönster'
			}
		},
		th: {
			autoDetectModeOptions: {
				close: 'ปิด',
				sameColor: 'สีเดียวกัน',
				invertColor: 'สีตรงข้าม'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 บันทึก',
				donate: '🔄 อัปเดต/💰 บริจาค'
			},
			settings: {
				darkMode: '🌑 โหมดมืด',
				autoDetect: '🔎 ปรับสีของหน้าต่างลอยโดยอัตโนมัติ (ไม่สนใจการเปลี่ยนแปลงข้างต้น)',
				close: 'ปิด',
				same: 'เหมือนกัน',
				invert: 'สลับสี',
				layout: '↕️ จัดเรียงปุ่มในแนวตั้ง',
				floatWindowSize: '📏 ขนาดหน้าต่างลอย',
				reservedHeightPercentage: '📄 เปอร์เซ็นต์พื้นที่หน้าจอที่สงวนไว้',
				windowOpacity: '🌫️ ความทึบของหน้าต่าง',
				textOpacity: '🖋️ ความทึบของข้อความ',
				closeFloatWindow: '📴 ปิดหน้าต่างลอย (กดค้างเพื่อย้าย)',
				enableHotkeys: 'เปิดใช้งานปุ่มลัดสำหรับเปลี่ยนหน้า',
				hotkeys: '🎛️ ตั้งค่าปุ่มลัดสำหรับเปลี่ยนหน้าบนคอมพิวเตอร์',
				upKey: 'ปุ่มลัดสำหรับเลื่อนหน้าขึ้น',
				downKey: 'ปุ่มลัดสำหรับเลื่อนหน้าลง',
				hotkeyInstructions: '💬 กรุณาตั้งค่าปุ่มลัดสำหรับเปลี่ยนหน้า\n💡 เลือกกล่องข้อความแล้วกดปุ่มลัดที่ต้องการ:',
				confirmCloseFloatWindow: '❗️ คุณแน่ใจหรือว่าต้องการปิดหน้าต่างลอย?\n🖥️ คุณสามารถเปิดได้อีกครั้งผ่านตัวเลือกในตัวจัดการสคริปต์บนคอมพิวเตอร์,\n📱 หากตัวจัดการสคริปต์ไม่มีอินเทอร์เฟซกราฟิก คุณสามารถติดตั้งสคริปต์ใหม่ได้.',
				confirmUpdate: '⚠️ ตัวจัดการสคริปต์บางตัวไม่สามารถตรวจจับการอัปเดตโดยอัตโนมัติได้ ดังนั้นคุณต้องตรวจสอบด้วยตนเอง\n🔄 เวอร์ชันปัจจุบันคือ: v2.4.5.\n💬 หากมีปัญหาใด ๆ กับสคริปต์หรือมีไอเดียใด ๆ คุณสามารถฝากข้อความไว้ในส่วนความคิดเห็นของสคริปต์\n📄 ส่วนบทนำในหน้าการเผยแพร่สคริปต์ยังมีวิธีสนับสนุนฉันด้วย.\n🥤 หากสคริปต์นี้แก้ปัญหาใหญ่ให้คุณ ฉันหวังว่าคุณจะซื้อชาไข่มุกให้ฉัน!'
			},
			menu: {
				showFloatingWindow: 'แสดงหน้าต่างลอย'
			}
		},
		tr: {
			autoDetectModeOptions: {
				close: 'Kapat',
				sameColor: 'Aynı Renk',
				invertColor: 'Renkleri Tersine Çevir'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Kaydet',
				donate: '🔄 Güncelle/💰 Bağış Yap'
			},
			settings: {
				darkMode: '🌑 Karanlık Mod',
				autoDetect: '🔎 Yüzer pencere rengini otomatik ayarla (Yukarıdaki değişiklikleri yok say)',
				close: 'Kapat',
				same: 'Aynı',
				invert: 'Tersine Çevir',
				layout: '↕️ Dikey Düğme Düzeni',
				floatWindowSize: '📏 Yüzer Pencere Boyutu',
				reservedHeightPercentage: '📄 Ayrılan Sayfa Yüzdesi',
				windowOpacity: '🌫️ Pencere Opaklığı',
				textOpacity: '🖋️ Metin Opaklığı',
				closeFloatWindow: '📴 Yüzer Pencereyi Kapat (Taşımak için uzun basın)',
				enableHotkeys: 'Sayfa Değiştirme Kısayol Tuşlarını Etkinleştir',
				hotkeys: '🎛️ PC için Sayfa Değiştirme Kısayol Tuşlarını Ayarla',
				upKey: 'Sayfa Yukarı Kısayol Tuşu',
				downKey: 'Sayfa Aşağı Kısayol Tuşu',
				hotkeyInstructions: '💬 Lütfen sayfa değiştirme kısayol tuşlarını ayarla\n💡 Metin kutusunu seçin ve istediğiniz kısayol tuşuna basın:',
				confirmCloseFloatWindow: '❗️ Yüzer pencereyi kapatmak istediğinize emin misiniz?\n🖥️ Bilgisayarda komut dosyası yöneticisindeki seçeneklerden tekrar açabilirsiniz,\n📱 Komut dosyası yöneticisinin grafik arayüzü yoksa, komut dosyasını yeniden yükleyebilirsiniz.',
				confirmUpdate: '⚠️ Bazı komut dosyası yöneticileri güncellemeleri otomatik olarak algılayamaz, bu nedenle manuel olarak kontrol etmeniz gerekir.\n🔄 Mevcut sürüm: v2.4.5.\n💬 Komut dosyasıyla ilgili herhangi bir sorun veya fikriniz varsa, komut dosyasının geri bildirim bölümünde mesaj bırakabilirsiniz.\n📄 Komut dosyası yayın sayfasındaki tanıtım bölümü de beni desteklemenin yollarını içerir.\n🥤 Bu komut dosyası sizin için büyük bir sorunu çözdüyse, umarım bana bir sütlü çay alabilirsiniz!'
			},
			menu: {
				showFloatingWindow: 'Yüzer Pencereyi Göster'
			}
		},
		uk: {
			autoDetectModeOptions: {
				close: 'Закрити',
				sameColor: 'Такий самий колір',
				invertColor: 'Інвертувати колір'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Зберегти',
				donate: '🔄 Оновити/💰 Пожертвувати'
			},
			settings: {
				darkMode: '🌑 Темний режим',
				autoDetect: '🔎 Автоматично налаштовувати колір плаваючого вікна (Ігнорувати вище зазначені зміни)',
				close: 'Закрити',
				same: 'Такий самий',
				invert: 'Інвертувати',
				layout: '↕️ Вертикальне розташування кнопок',
				floatWindowSize: '📏 Розмір плаваючого вікна',
				reservedHeightPercentage: '📄 Відсоток зарезервованої сторінки',
				windowOpacity: '🌫️ Непрозорість вікна',
				textOpacity: '🖋️ Непрозорість тексту',
				closeFloatWindow: '📴 Закрити плаваюче вікно (Натисніть і утримуйте для переміщення)',
				enableHotkeys: 'Увімкнути гарячі клавіші для перегортання сторінок',
				hotkeys: '🎛️ Налаштувати гарячі клавіші для перегортання сторінок на ПК',
				upKey: 'Гаряча клавіша для перегортання сторінки вгору',
				downKey: 'Гаряча клавіша для перегортання сторінки вниз',
				hotkeyInstructions: '💬 Будь ласка, налаштуйте гарячі клавіші для перегортання сторінок\n💡 Виберіть текстове поле і натисніть потрібну гарячу клавішу:',
				confirmCloseFloatWindow: '❗️ Ви впевнені, що хочете закрити плаваюче вікно?\n🖥️ Ви можете відкрити його знову через опції в менеджері скриптів на ПК,\n📱 Якщо у менеджера скриптів немає графічного інтерфейсу, ви можете перевстановити скрипт.',
				confirmUpdate: '⚠️ Деякі менеджери скриптів не можуть автоматично виявляти оновлення, тому вам потрібно перевіряти вручну.\n🔄 Поточна версія: v2.4.5.\n💬 Якщо у вас виникли проблеми зі скриптом або є ідеї, ви можете залишити повідомлення у розділі відгуків про скрипт.\n📄 Розділ введення на сторінці випуску скрипта також містить способи підтримати мене.\n🥤 Якщо цей скрипт вирішив велику проблему для вас, сподіваюся, ви зможете купити мені молочний чай!'
			},
			menu: {
				showFloatingWindow: 'Показати плаваюче вікно'
			}
		},
		ug: {
			autoDetectModeOptions: {
				close: 'تاقاش',
				sameColor: 'ئوخشاش رەڭ',
				invertColor: 'رەڭنى ئەكسەرتىش'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 ساقلاش',
				donate: '🔄 يېڭىلاش/💰 ھېسا قىل'
			},
			settings: {
				darkMode: '🌑 قاراڭغۇ ھالەت',
				autoDetect: '🔎 قالقما ئۆينىڭ رەڭگىنى ئاپتوماتىك تەڭشەش (يۇقىرىدىكى ئۆزگەرتىشلەرنى پەرۋا قىلماڭ)',
				close: 'تاقاش',
				same: 'ئوخشاش',
				invert: 'ئەكسەرتىش',
				layout: '↕️ تۈگمىلەرنىڭ تىك تىزىلىشى',
				floatWindowSize: '📏 قالقما ئۆينىڭ چوڭلۇقى',
				reservedHeightPercentage: '📄 ساقلانغان بەتنىڭ پىرسەنتى',
				windowOpacity: '🌫️ ئۆينىڭ كۆرۈنمەي',
				textOpacity: '🖋️ تېكستنىڭ كۆرۈنمەي',
				closeFloatWindow: '📴 قالقما ئۆينى تاقاش (يۆتكەش ئۈچۈن ئۇزۇن بېسىپ تۇرۇڭ)',
				enableHotkeys: 'بەت ئالماشتۇرۇش ئىسسىق كۇنۇپكىلىرىنى قوزغىتىش',
				hotkeys: '🎛️ كومپىيۇتېردا بەت ئالماشتۇرۇش ئىسسىق كۇنۇپكىلىرىنى تەڭشەش',
				upKey: 'بەتمىنىڭ ئۈستىگە ئىسسىق كۇنۇپكا',
				downKey: 'بەتمىنىڭ ئاستىغا ئىسسىق كۇنۇپكا',
				hotkeyInstructions: '💬 بەت ئالماشتۇرۇش ئىسسىق كۇنۇپكىلىرىنى تەڭشەڭ\n💡 تېكىست رامكىنى تاللاپ، ئىسسىق كۇنۇپكىنى بېسىڭ:',
				confirmCloseFloatWindow: '❗️ قالقما ئۆينى تاقاشقا ئىشەنەمسىز؟\n🖥️ سىز ئۇنى كومپىيۇتېردىكى سىزىق ئۆتكۈزگۈچ باشقۇرغۇچىدىكى تاللاش ئارقىلىق قايتا ئېچىشىڭىز مۇمكىن,\n📱 سىزىق ئۆتكۈزگۈچ باشقۇرغۇچىدا گرافىك ئاكتىپ قۇرۇلمىسى بولمىسا، سىزىق ئۆتكۈزگۈچنى قايتا قاچىلاڭ.',
				confirmUpdate: '⚠️ بەزى سىزىق ئۆتكۈزگۈچ باشقۇرغۇچىلار ئۆزئارا يېڭىلانغاننى بىلمەيدۇ، شۇڭا قولدا تەكشۈرۈش كېرەك.\n🔄 نۆۋەتتىكى نەشر: v2.4.5.\n💬 سىزىق ئۆتكۈزگۈچ بىلەن مۇناسىۋەتلىك مەسىلە ياكى پىكىرىڭىز بولسا، سىز سىزىق ئۆتكۈزگۈچ قايتۇرۇش بۆلىكىدە ئۇچۇر قالدۇرالايسىز.\n📄 سىزىق ئۆتكۈزگۈچ نەشرىنىڭ كۆرۈنمە بەتتە مەننى قوللاش ئۇسۇلىمۇ بار.\n🥤 بۇ سىزىق ئۆتكۈزگۈچ سىز ئۈچۈن چوڭ مەسىلىنى ھەل قىلدى، سىز ماڭا بىر ئىچەرلىك بىردەك ھويلايسىز!'
			},
			menu: {
				showFloatingWindow: 'قالقما ئۆينى كۆرسىتىڭ'
			}
		},
		vi: {
			autoDetectModeOptions: {
				close: 'Đóng',
				sameColor: 'Cùng màu',
				invertColor: 'Đảo ngược màu'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 Lưu',
				donate: '🔄 Cập nhật/💰 Ủng hộ'
			},
			settings: {
				darkMode: '🌑 Chế độ tối',
				autoDetect: '🔎 Tự động điều chỉnh màu cửa sổ nổi (Bỏ qua các thay đổi trên)',
				close: 'Đóng',
				same: 'Cùng',
				invert: 'Đảo ngược',
				layout: '↕️ Bố cục nút dọc',
				floatWindowSize: '📏 Kích thước cửa sổ nổi',
				reservedHeightPercentage: '📄 Tỷ lệ phần trăm trang được giữ lại',
				windowOpacity: '🌫️ Độ mờ của cửa sổ',
				textOpacity: '🖋️ Độ mờ của văn bản',
				closeFloatWindow: '📴 Đóng cửa sổ nổi (Nhấn giữ để di chuyển)',
				enableHotkeys: 'Bật phím nóng để lật trang',
				hotkeys: '🎛️ Đặt phím nóng để lật trang trên PC',
				upKey: 'Phím nóng lật trang lên',
				downKey: 'Phím nóng lật trang xuống',
				hotkeyInstructions: '💬 Vui lòng đặt phím nóng để lật trang\n💡 Chọn hộp văn bản và nhấn phím nóng mong muốn:',
				confirmCloseFloatWindow: '❗️ Bạn có chắc chắn muốn đóng cửa sổ nổi không?\n🖥️ Bạn có thể mở lại nó thông qua các tùy chọn trong trình quản lý kịch bản trên PC,\n📱 Nếu trình quản lý kịch bản không có giao diện đồ họa, bạn có thể cài đặt lại kịch bản.',
				confirmUpdate: '⚠️ Một số trình quản lý kịch bản không thể tự động phát hiện cập nhật, vì vậy bạn cần kiểm tra thủ công.\n🔄 Phiên bản hiện tại là: v2.4.5.\n💬 Nếu có bất kỳ vấn đề nào với kịch bản hoặc nếu bạn có bất kỳ ý tưởng nào, bạn có thể để lại tin nhắn trong phần phản hồi của kịch bản.\n📄 Phần giới thiệu trên trang phát hành kịch bản cũng chứa các cách để hỗ trợ tôi.\n🥤 Nếu kịch bản này đã giải quyết một vấn đề lớn cho bạn, tôi hy vọng bạn có thể mua cho tôi một ly trà sữa!'
			},
			menu: {
				showFloatingWindow: 'Hiển thị cửa sổ nổi'
			}
		},

		"zh-cn": {
			autoDetectModeOptions: {
				close: '关闭',
				sameColor: '同色',
				invertColor: '反色'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 保存',
				donate: '🔄 更新/💰 赞赏'
			},
			settings: {
				darkMode: '🌑 黑色模式',
				autoDetect: '🔎 自动调整悬浮窗颜色（忽略上方修改）',
				close: '关闭',
				same: '同色',
				invert: '反色',
				layout: '↕️ 竖向排列按钮',
				floatWindowSize: '📏 悬浮窗大小',
				reservedHeightPercentage: '📄 保留页面比例',
				windowOpacity: '🌫️ 窗口透明度',
				textOpacity: '🖋️ 文字透明度',
				closeFloatWindow: '📴 关闭悬浮窗（长按悬浮窗可以移动）',
				enableHotkeys: '开启翻页热键功能',
				hotkeys: '🎛️ 设置电脑端翻页热键',
				upKey: '上翻页热键',
				downKey: '下翻页热键',
				hotkeyInstructions: '💬 请设置翻页热键\n💡 选中文本框后直接按下目标热键试试吧:',
				confirmCloseFloatWindow: '❗️ 确定要关闭悬浮窗吗？\n🖥️ 电脑端可以通过脚本管理器中的选项重新打开，\n📱 若脚本管理器没有图形化界面，可以重新安装脚本。',
				confirmUpdate: '⚠️ 一部分脚本管理器无法自动检测脚本是否有更新，所以需要你去看一下。\n🔄 现在的版本号是：v2.4.5。\n💬 如果脚本有任何问题，或者你有任何创意，都可以在脚本反馈区留言。\n📄 在脚本发布页的介绍部分也放置了赞赏方式，\n🥤 如果这个脚本帮你解决了大问题，能不能请我吃顿麦当劳\n或者只是在小红书和Greasy Fork上帮我点个评分，都是对我莫大的鼓励，谢谢你！'
			},
			menu: {
				showFloatingWindow: '显示悬浮窗'
			}
		},
		"zh-tw": {
			autoDetectModeOptions: {
				close: '關閉',
				sameColor: '同色',
				invertColor: '反色'
			},
			buttons: {
				settings: '=',
				down: '↓',
				up: '↑',
				save: '💾 保存',
				donate: '🔄 更新/💰 贊賞'
			},
			settings: {
				darkMode: '🌑 黑色模式',
				autoDetect: '🔎 自動調整懸浮窗顏色（忽略上方修改）',
				close: '關閉',
				same: '同色',
				invert: '反色',
				layout: '↕️ 豎向排列按鈕',
				floatWindowSize: '📏 懸浮窗大小',
				reservedHeightPercentage: '📄 保留頁面比例',
				windowOpacity: '🌫️ 窗口透明度',
				textOpacity: '🖋️ 文字透明度',
				closeFloatWindow: '📴 關閉懸浮窗（長按懸浮窗可以移動）',
				enableHotkeys: '開啟翻頁快捷鍵功能',
				hotkeys: '🎛️ 設定電腦端翻頁快捷鍵',
				upKey: '上翻頁快捷鍵',
				downKey: '下翻頁快捷鍵',
				hotkeyInstructions: '💬 請設置翻頁快捷鍵\n💡 選中文本框後直接按下目標快捷鍵試試吧:',
				confirmCloseFloatWindow: '❗️ 確定要關閉懸浮窗嗎？\n🖥️ 電腦端可以通過腳本管理器中的選項重新打開，\n📱 若腳本管理器沒有圖形化界面，可以重新安裝腳本。',
				confirmUpdate: '⚠️ 一部分腳本管理器無法自動檢測腳本是否有更新，所以需要你去看一下。\n🔄 現在的版本號是：v2.4.5。\n💬 如果腳本有任何問題，或者你有任何創意，都可以在腳本反饋區留言。\n📄 在腳本發佈頁的介紹部分也放置了贊賞方式，\n🥤 如果這個腳本幫你解決了大問題，希望你能請我喝杯奶茶哦！'
			},
			menu: {
				showFloatingWindow: '顯示懸浮窗'
			}
		}
	};

	function setLanguage(lang) {
		if (lang === 'default') {
			lang = getDefaultLang();
		}
		if (currentLang !== lang) {
			currentLang = lang;
			GM_setValue('currentLang', lang);
			location.reload();
		}
	}

	function getDefaultLang() {
		return LANG[userLang] ? userLang : 'en';
	}

	var currentLang = GM_getValue('currentLang', 'default');
	const initialLang = currentLang === 'default' ? getDefaultLang() : currentLang;
	setLanguage(initialLang);

	const autoDetectModeOptions = [LANG[currentLang].autoDetectModeOptions.close, LANG[currentLang].autoDetectModeOptions.sameColor, LANG[currentLang].autoDetectModeOptions.invertColor];
	var usePgUpPgDn = GM_getValue('usePgUpPgDn', true);
	var reservedHeightPercentage = GM_getValue('reservedHeightPercentage', 0);
	var isBlackMode = GM_getValue('isBlackMode', false);
	var floatWindowSize = GM_getValue('floatWindowSize', 80);
	var autoDetectMode = GM_getValue('autoDetectMode', LANG[currentLang].autoDetectModeOptions.close);
	var isVerticalLayout = GM_getValue('isVerticalLayout', true);
	var windowOpacity = GM_getValue('windowOpacity', 0.8);
	var textOpacity = GM_getValue('textOpacity', 1.0);
	var floatWindowVisible = GM_getValue('floatWindowVisible', true);
	var upKey = GM_getValue('upKey', 'PageUp');
	var downKey = GM_getValue('downKey', 'PageDown');
	var enableHotkeys = GM_getValue('enableHotkeys', true);

	function detectDarkMode() {
		const bgColor = window.getComputedStyle(document.body)
			.backgroundColor;
		const colorValues = bgColor.match(/\d+/g);
		if (colorValues) {
			const r = parseInt(colorValues[0]);
			const g = parseInt(colorValues[1]);
			const b = parseInt(colorValues[2]);
			const brightness = (r * 299 + g * 587 + b * 114) / 1000;
			return brightness < 128;
		}
		return false;
	}

	if (autoDetectMode === LANG[currentLang].autoDetectModeOptions.sameColor) {
		isBlackMode = detectDarkMode();
	} else if (autoDetectMode === LANG[currentLang].autoDetectModeOptions.invertColor) {
		isBlackMode = !detectDarkMode();
	}

	function createFloatingWindow() {
		if (document.getElementById('floatingWindow')) {
			return;
		}

		if (!floatWindowVisible) return;

		const floatWindow = document.createElement('div');
		floatWindow.id = 'floatingWindow';
		const initialLeft = GM_getValue('floatWindowLeft', 'calc(100% - 90px)');
		const initialTop = GM_getValue('floatWindowTop', 'calc(100% - 270px)');
		floatWindow.style = `
        position: fixed;
        left: ${initialLeft};
        top: ${initialTop};
        width: ${isVerticalLayout ? floatWindowSize + 'px' : (floatWindowSize * 3) + 'px'};
        height: ${isVerticalLayout ? (floatWindowSize * 3) + 'px' : floatWindowSize + 'px'};
        background-color: ${isBlackMode ? 'black' : 'white'};
        color: ${isBlackMode ? 'white' : 'black'};
        border: 0px;
        z-index: 10000;
        display: flex;
        flex-direction: ${isVerticalLayout ? 'column' : 'row'};
        align-items: center;
        justify-content: space-around;
        padding: 5px;
        border-radius: 5px;
        opacity: ${windowOpacity};
    `;

		const btnSettings = document.createElement('button');
		btnSettings.innerHTML = LANG[currentLang].buttons.settings;
		btnSettings.style = buttonStyle();

		const btnDown = document.createElement('button');
		btnDown.innerHTML = LANG[currentLang].buttons.down;
		btnDown.style = buttonStyle();
		btnDown.onclick = () => scrollPage(1);

		const btnUp = document.createElement('button');
		btnUp.innerHTML = LANG[currentLang].buttons.up;
		btnUp.style = buttonStyle();
		btnUp.onclick = () => scrollPage(-1);

		floatWindow.appendChild(btnSettings);
		floatWindow.appendChild(btnUp);
		floatWindow.appendChild(btnDown);
		document.body.appendChild(floatWindow);

		let isDragging = false;
		let initialX, initialY;
		let dragOffsetX, dragOffsetY;

		const startDrag = (event) => {
			event.preventDefault();
			isDragging = false;
			initialX = event.clientX || event.touches[0].clientX;
			initialY = event.clientY || event.touches[0].clientY;

			const style = window.getComputedStyle(floatWindow, null);
			dragOffsetX = parseInt(style.getPropertyValue('left'), 10) - initialX;
			dragOffsetY = parseInt(style.getPropertyValue('top'), 10) - initialY;

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('touchmove', onTouchMove);
			document.addEventListener('mouseup', onMouseUp);
			document.addEventListener('touchend', onTouchEnd);
		};

		const onMouseMove = (event) => {
			handleDrag(event.clientX, event.clientY);
		};

		const onTouchMove = (event) => {
			event.preventDefault();
			handleDrag(event.touches[0].clientX, event.touches[0].clientY);
		};

		const handleDrag = (clientX, clientY) => {
			const movedX = clientX - initialX;
			const movedY = clientY - initialY;
			if (Math.abs(movedX) > 5 || Math.abs(movedY) > 5) {
				isDragging = true;
				floatWindow.style.left = (clientX + dragOffsetX) + 'px';
				floatWindow.style.top = (clientY + dragOffsetY) + 'px';
			}
		};

		const onMouseUp = () => {
			endDrag();
		};

		const onTouchEnd = () => {
			event.preventDefault();
			endDrag();
		};

		const endDrag = () => {
			if (isDragging) {
				GM_setValue('floatWindowLeft', floatWindow.style.left);
				GM_setValue('floatWindowTop', floatWindow.style.top);
			} else {
				showSettings();
			}
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('touchmove', onTouchMove);
			document.removeEventListener('mouseup', onMouseUp);
			document.removeEventListener('touchend', onTouchEnd);
		};

		btnSettings.addEventListener('mousedown', startDrag);
		btnSettings.addEventListener('touchstart', startDrag);
	}

	function scrollPage(direction) {
		const screenHeight = window.innerHeight;
		const reservedHeight = screenHeight * reservedHeightPercentage / 100;
		window.scrollBy(0, direction * (screenHeight - reservedHeight));
	}

	window.addEventListener('keydown', function(event) {
		if (!enableHotkeys) return;
		const screenHeight = window.innerHeight;
		const reservedHeight = screenHeight * reservedHeightPercentage / 100;
		if ((event.key === upKey || event.key === downKey)) {
			const direction = event.key === downKey ? 1 : -1;
			window.scrollBy(0, direction * (screenHeight - reservedHeight));
			event.preventDefault();
		}
	});

	createFloatingWindow();

	GM_registerMenuCommand(LANG[currentLang].menu.showFloatingWindow, function() {
		GM_setValue('floatWindowVisible', true);
		location.reload();
	});

	function buttonStyle() {
		return `
        width: ${floatWindowSize}px;
        height: ${floatWindowSize}px;
        font-size: 20px;
        background-color: ${isBlackMode ? 'black' : 'white'};
        color: ${isBlackMode ? 'white' : 'black'};
        border: none;
        opacity: ${textOpacity};
        outline: none;
    `;
	}

	function showSettings() {
		const createLanguageDropdown = () => {
			const container = document.createElement('div');
			container.style = 'margin-bottom: 10px; display: flex; justify-content: space-between; width: 100%;';

			const label = document.createElement('label');
			label.innerText = '🌐 语言 / Language';
			container.appendChild(label);

			const select = document.createElement('select');

			const systemDefaultOption = document.createElement('option');
			systemDefaultOption.value = 'default';
			systemDefaultOption.innerText = systemDefaultLabel();
			if (currentLang === 'default') {
				systemDefaultOption.selected = true;
			}
			select.appendChild(systemDefaultOption);

			for (const [langCode, langName] of Object.entries(LANGUAGE_NAMES)) {
				const option = document.createElement('option');
				option.value = langCode;
				option.innerText = langName;
				if (langCode === currentLang) {
					option.selected = true;
				}
				select.appendChild(option);
			}

			select.onchange = () => {
				setLanguage(select.value);
			};

			container.appendChild(select);
			return container;
		};



		const settingsWindow = document.createElement('div');
		settingsWindow.style = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            background-color: ${isBlackMode ? 'black' : 'white'};
            color: ${isBlackMode ? 'white' : 'black'};
            border: 1px solid #ccc;
            z-index: 10001;
            padding: 20px;
            border-radius: 5px;
        `;

		const closeButton = document.createElement('button');
		closeButton.innerHTML = '✖️';
		closeButton.style = `
        position: absolute;
        top: 0px;
        right: 0px;
        background: none;
        border: none;
        font-size: 16px;
        color: ${isBlackMode ? 'white' : 'black'};
        cursor: pointer;
    `;
		closeButton.onclick = () => {
			document.body.removeChild(settingsWindow);
		};

		settingsWindow.appendChild(closeButton);

		const settingsContainer = document.createElement('div');
		settingsContainer.style = `
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            color: ${isBlackMode ? 'white' : 'black'};
        `;

		const updateColors = () => {
			settingsWindow.style.backgroundColor = isBlackMode ? 'black' : 'white';
			settingsWindow.style.color = isBlackMode ? 'white' : 'black';
			settingsContainer.style.color = isBlackMode ? 'white' : 'black';
			saveButton.style.backgroundColor = isBlackMode ? 'black' : 'white';
			saveButton.style.color = isBlackMode ? 'white' : 'black';
			donateButton.style.backgroundColor = isBlackMode ? 'black' : 'white';
			donateButton.style.color = isBlackMode ? 'white' : 'black';

			const inputs = settingsWindow.querySelectorAll('input, select');
			inputs.forEach(input => {
				input.style.backgroundColor = isBlackMode ? 'black' : 'white';
				input.style.color = isBlackMode ? 'white' : 'black';
			});
		};

		const createSetting = (labelText, value, onClick) => {
			const container = document.createElement('div');
			container.style = `
                display: flex;
                justify-content: space-between;
                width: 100%;
                margin-bottom: 10px;
                cursor: pointer;
            `;
			container.onclick = onClick;

			const label = document.createElement('span');
			label.innerText = labelText;
			container.appendChild(label);

			const indicator = document.createElement('span');
			indicator.innerText = value ? '✔️' : '✖️';
			container.appendChild(indicator);

			return container;
		};

		const modeSetting = createSetting(LANG[currentLang].settings.darkMode, isBlackMode, () => {
			isBlackMode = !isBlackMode;
			modeSetting.lastChild.innerText = isBlackMode ? '✔️' : '✖️';
			GM_setValue('isBlackMode', isBlackMode);
			updateColors();
		});

		const createAutoDetectSetting = (labelText, currentOption, optionValue) => {
			const container = document.createElement('div');
			container.style = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex: 1;
                margin-bottom: 10px;
                cursor: pointer;
                padding-right: 10px;
            `;
			container.onclick = () => {
				autoDetectMode = optionValue;
				GM_setValue('autoDetectMode', autoDetectMode);
				updateAutoDetectSettings();
			};

			const label = document.createElement('span');
			label.innerText = labelText;
			container.appendChild(label);

			const indicator = document.createElement('span');
			indicator.innerText = (currentOption === optionValue) ? '✔️' : '✖️';
			container.appendChild(indicator);

			return container;
		};

		const updateAutoDetectSettings = () => {
			autoDetectSettingContainer.style = `
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                width: 100%;
            `;
			autoDetectSettingContainer.innerHTML = '';

			const explanationText = document.createElement('div');
			explanationText.innerText = LANG[currentLang].settings.autoDetect;
			explanationText.style = 'margin-bottom: 10px; display: block; width: 100%; text-align: left;';
			autoDetectSettingContainer.appendChild(explanationText);

			const settingsContainer = document.createElement('div');
			settingsContainer.style = 'display: flex; justify-content: space-between; width: 75%;';
			settingsContainer.appendChild(createAutoDetectSetting(LANG[currentLang].settings.close, autoDetectMode, LANG[currentLang].autoDetectModeOptions.close));
			settingsContainer.appendChild(createAutoDetectSetting(LANG[currentLang].settings.same, autoDetectMode, LANG[currentLang].autoDetectModeOptions.sameColor));
			settingsContainer.appendChild(createAutoDetectSetting(LANG[currentLang].settings.invert, autoDetectMode, LANG[currentLang].autoDetectModeOptions.invertColor));

			autoDetectSettingContainer.appendChild(settingsContainer);
		};

		const layoutSetting = createSetting(LANG[currentLang].settings.layout, isVerticalLayout, () => {
			isVerticalLayout = !isVerticalLayout;
			layoutSetting.lastChild.innerText = isVerticalLayout ? '✔️' : '✖️';
		});

		const createPercentageInput = (labelText, value, min, max) => {
			const container = document.createElement('div');
			container.style = `
                display: flex;
                justify-content: space-between;
                width: 100%;
                margin-bottom: 10px;
            `;

			const label = document.createElement('label');
			label.innerText = labelText;
			container.appendChild(label);

			const input = document.createElement('input');
			input.type = 'number';
			input.value = value;
			input.min = min;
			input.max = max;
			input.style = `
                width: 50px;
                background-color: ${isBlackMode ? 'black' : 'white'};
                color: ${isBlackMode ? 'white' : 'black'};
            `;

			const percentageLabel = document.createElement('span');
			percentageLabel.innerText = '%';

			container.appendChild(input);
			container.appendChild(percentageLabel);

			return {
				container,
				input
			};
		};

		const sizeInput = createPercentageInput(LANG[currentLang].settings.floatWindowSize, floatWindowSize, 20, 100);
		const percentageInput = createPercentageInput(LANG[currentLang].settings.reservedHeightPercentage, reservedHeightPercentage, 0, 100);
		const windowOpacityInput = createPercentageInput(LANG[currentLang].settings.windowOpacity, windowOpacity * 100, 20, 100);
		const textOpacityInput = createPercentageInput(LANG[currentLang].settings.textOpacity, textOpacity * 100, 20, 100);

		const saveButton = document.createElement('button');
		saveButton.innerHTML = LANG[currentLang].buttons.save;
		saveButton.style = `
            margin-top: 10px;
            background-color: ${isBlackMode ? 'black' : 'white'};
            color: ${isBlackMode ? 'white' : 'black'};
            outline: none;
        `;
		saveButton.onclick = () => {
			floatWindowSize = parseInt(sizeInput.input.value, 10);
			reservedHeightPercentage = Math.min(100, Math.max(0, parseInt(percentageInput.input.value, 10)));
			windowOpacity = Math.min(1, Math.max(0.2, parseFloat(windowOpacityInput.input.value) / 100));
			textOpacity = Math.min(1, Math.max(0.2, parseFloat(textOpacityInput.input.value) / 100));
			GM_setValue('floatWindowSize', floatWindowSize);
			GM_setValue('isVerticalLayout', isVerticalLayout);
			GM_setValue('reservedHeightPercentage', reservedHeightPercentage);
			GM_setValue('windowOpacity', windowOpacity);
			GM_setValue('textOpacity', textOpacity);
			document.body.removeChild(settingsWindow);
			location.reload();
		};

		const donateButton = document.createElement('button');
		donateButton.innerHTML = LANG[currentLang].buttons.donate;
		donateButton.style = `
            margin-top: 10px;
            background-color: ${isBlackMode ? 'black' : 'white'};
            color: ${isBlackMode ? 'white' : 'black'};
            outline: none;
        `;
		donateButton.onclick = () => {
			if (confirm(LANG[currentLang].settings.confirmUpdate)) {
				window.open('https://greasyfork.org/zh-CN/scripts/493257', '_blank');
			}
		};

		const toggleFloatWindow = () => {
			floatWindowVisible = !floatWindowVisible;
			GM_setValue('floatWindowVisible', floatWindowVisible);
			document.body.removeChild(settingsWindow);
			location.reload();
		};

		const confirmToggleFloatWindow = () => {
			if (confirm(LANG[currentLang].settings.confirmCloseFloatWindow)) {
				toggleFloatWindow();
			}
		};

		const floatWindowSetting = createSetting(LANG[currentLang].settings.closeFloatWindow, false, confirmToggleFloatWindow);

		const createSeparator = () => {
			const separator = document.createElement('hr');
			separator.style = 'width: 100%; margin: 10px 0; border: none; border-top: 1px solid #ccc;';
			return separator;
		};

		settingsContainer.appendChild(modeSetting);

		const hotkeysToggleSetting = createSetting(LANG[currentLang].settings.enableHotkeys, enableHotkeys, () => {
			enableHotkeys = !enableHotkeys;
			hotkeysToggleSetting.lastChild.innerText = enableHotkeys ? '✔️' : '✖️';
			GM_setValue('enableHotkeys', enableHotkeys);
		});

		const autoDetectSettingContainer = document.createElement('div');
		settingsContainer.appendChild(autoDetectSettingContainer);
		updateAutoDetectSettings();

		settingsContainer.appendChild(createSeparator());

		settingsContainer.appendChild(layoutSetting);
		settingsContainer.appendChild(sizeInput.container);
		settingsContainer.appendChild(percentageInput.container);
		settingsContainer.appendChild(windowOpacityInput.container);
		settingsContainer.appendChild(textOpacityInput.container);
		settingsContainer.appendChild(floatWindowSetting);

		settingsContainer.appendChild(createSeparator());

		const hotkeySetting = createSetting(LANG[currentLang].settings.hotkeys, false, () => {
			const hotkeyWindow = document.createElement('div');
			hotkeyWindow.style = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 300px;
                background-color: ${isBlackMode ? 'black' : 'white'};
                color: ${isBlackMode ? 'white' : 'black'};
                border: 1px solid #ccc;
                z-index: 10002;
                padding: 20px;
                border-radius: 5px;
            `;

			const closeButton = document.createElement('button');
			closeButton.innerHTML = '✖️';
			closeButton.style = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 16px;
        color: ${isBlackMode ? 'white' : 'black'};
        cursor: pointer;
    `;
			closeButton.onclick = () => {
				document.body.removeChild(hotkeyWindow);
			};

			hotkeyWindow.appendChild(closeButton);

			const hotkeyContainer = document.createElement('div');
			hotkeyContainer.style = `
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                color: ${isBlackMode ? 'white' : 'black'};
            `;

			const explanationText = document.createElement('div');
			explanationText.innerText = LANG[currentLang].settings.hotkeyInstructions;
			explanationText.style = 'margin-bottom: 10px; display: block; width: 100%;';
			hotkeyWindow.appendChild(explanationText);

			const createHotkeySetting = (labelText, currentKey, onKeyChange) => {
				const container = document.createElement('div');
				container.style = `
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    margin-bottom: 10px;
                `;

				const label = document.createElement('label');
				label.innerText = labelText;
				container.appendChild(label);

				const input = document.createElement('input');
				input.type = 'text';
				input.value = currentKey;
				input.style = `
                    width: 100px;
                    background-color: ${isBlackMode ? 'black' : 'white'};
                    color: ${isBlackMode ? 'white' : 'black'};
                `;
				input.onkeydown = (event) => {
					event.preventDefault();
					input.value = event.key;
					onKeyChange(event.key);
				};

				container.appendChild(input);
				return container;
			};

			const upKeySetting = createHotkeySetting(LANG[currentLang].settings.upKey, upKey, (key) => {
				upKey = key;
			});
			const downKeySetting = createHotkeySetting(LANG[currentLang].settings.downKey, downKey, (key) => {
				downKey = key;
			});

			const hotkeySaveButton = document.createElement('button');
			hotkeySaveButton.innerHTML = LANG[currentLang].buttons.save;
			hotkeySaveButton.style = `
                margin-top: 10px;
                background-color: ${isBlackMode ? 'black' : 'white'};
                color: ${isBlackMode ? 'white' : 'black'};
            `;
			hotkeySaveButton.onclick = () => {
				GM_setValue('upKey', upKey);
				GM_setValue('downKey', downKey);
				document.body.removeChild(hotkeyWindow);
			};

			hotkeyContainer.appendChild(upKeySetting);
			hotkeyContainer.appendChild(downKeySetting);
			hotkeyContainer.appendChild(hotkeySaveButton);

			hotkeyWindow.appendChild(hotkeyContainer);
			document.body.appendChild(hotkeyWindow);
			const escKeyListener = (event) => {
				if (event.key === 'Escape') {
					document.body.removeChild(hotkeyWindow);
					document.removeEventListener('keydown', escKeyListener);
				}
			};
			document.addEventListener('keydown', escKeyListener);
			settingsWindow.style.display = 'none';
		});

		settingsContainer.appendChild(hotkeysToggleSetting);
		settingsContainer.appendChild(hotkeySetting);

		const buttonContainer = document.createElement('div');
		buttonContainer.style = `
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-top: 10px;
        `;

		saveButton.style = `
            flex: 1;
            margin-right: 10px;
            background-color: ${isBlackMode ? 'black' : 'white'};
            color: ${isBlackMode ? 'white' : 'black'};
        `;
		buttonContainer.appendChild(saveButton);

		donateButton.style = `
            flex: 1;
            background-color: ${isBlackMode ? 'black' : 'white'};
            color: ${isBlackMode ? 'white' : 'black'};
        `;
		buttonContainer.appendChild(donateButton);

		const languageDropdown = createLanguageDropdown();
		settingsContainer.appendChild(languageDropdown);
		settingsContainer.appendChild(buttonContainer);
		settingsWindow.appendChild(settingsContainer);
		document.body.appendChild(settingsWindow);

		const escKeyListener = (event) => {
			if (event.key === 'Escape') {
				document.body.removeChild(settingsWindow);
				document.removeEventListener('keydown', escKeyListener);
			}
		};
		document.addEventListener('keydown', escKeyListener);

		updateColors();
	}

	createFloatingWindow();

	GM_registerMenuCommand(LANG[currentLang].menu.showFloatingWindow, function() {
		GM_setValue('floatWindowVisible', true);
		location.reload();
	});
})();
