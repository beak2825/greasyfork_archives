// ==UserScript==
// @name         arXiv下载PDF文件自动重命名为论文名
// @description  能够直接把下载的文件名默认修改为论文名，并且符合Windows文件命名规范。会在搜索页面以及单个论文界面产生一个下载论文的超链接，点击即可。[2023-12-17修改版]
// @name:ar      تحميل ملفات PDF من arXiv مع إعادة تسمية تلقائية باسم البحث
// @description:ar  يتيح تعديل اسم الملف المحمّل مباشرة إلى اسم البحث، مع الالتزام بقواعد تسمية الملفات في Windows. يضيف رابطًا لتحميل البحث في صفحة البحث وواجهة الورقة الواحدة، انقر للتحميل. [نسخة معدلة 2023-12-17]
// @name:bg      Изтегляне на PDF файлове от arXiv с автоматично преименуване на заглавието на статията
// @description:bg  Позволява директно променяне на името на изтегления файл на заглавието на статията, съобразено с правилата за именуване на файлове в Windows. Добавя хипервръзка за изтегляне на статията на страницата за търсене и интерфейса на отделната статия, кликнете за изтегляне. [Модифицирана версия от 17.12.2023]
// @name:cs      Stahování PDF souborů z arXiv s automatickým přejmenováním na název článku
// @description:cs  Umožňuje přímo přejmenovat stažený soubor na název článku v souladu s pravidly pojmenování souborů ve Windows. Přidává hypertextový odkaz pro stažení článku na vyhledávací stránce i rozhraní jednotlivého článku, stačí kliknout. [Upravená verze z 17. 12. 2023]
// @name:da      Download af PDF-filer fra arXiv med automatisk omdøbning til artiklens titel
// @description:da  Gør det muligt at omdøbe den downloadede fil direkte til artiklens titel i overensstemmelse med Windows' filnavneregler. Tilføjer et hyperlink til at downloade artiklen på søgesiden og i grænsefladen for en enkelt artikel, klik for at downloade. [Opdateret version 17-12-2023]
// @name:de      Herunterladen von PDF-Dateien von arXiv mit automatischer Umbenennung in den Titel des Papers
// @description:de  Ermöglicht die direkte Umbenennung der heruntergeladenen Datei in den Titel des Papers, konform mit den Windows-Dateibenennungsregeln. Fügt einen Hyperlink zum Herunterladen des Papers auf der Suchseite und der Einzelpaper-Oberfläche hinzu, einfach klicken. [Geänderte Version vom 17.12.2023]
// @name:el      Λήψη αρχείων PDF από το arXiv με αυτόματη μετονομασία στον τίτλο της εργασίας
// @description:el  Επιτρέπει την άμεση μετονομασία του ληφθέντος αρχείου στον τίτλο της εργασίας, σύμφωνα με τους κανόνες ονοματοδοσίας αρχείων των Windows. Προσθέτει υπερσύνδεσμο για τη λήψη της εργασίας στη σελίδα αναζήτησης και στη διεπαφή μεμονωμένης εργασίας, κάντε κλικ για λήψη. [Τροποποιημένη έκδοση 17-12-2023]
// @name:en      arXiv PDF Download with Automatic Renaming to Paper Title
// @description:en  Allows directly renaming the downloaded file to the paper title, compliant with Windows file naming conventions. Adds a hyperlink to download the paper on the search page and individual paper interface, just click to download. [Modified version 12/17/2023]
// @name:eo      Elŝuto de PDF-dosieroj de arXiv kun Aŭtomata Alinomigo al Titolo de la Papero
// @description:eo  Permesas rekte alinomi la elŝutitan dosieron al la titolo de la papero, konforme al la reguloj pri dosiernomado en Windows. Aldonas hiperligilon por elŝuti la paperon en la serĉpaĝo kaj la interfaco de unuopaj paperoj, simple alklaku por elŝuti. [Modifita versio 17-12-2023]
// @name:es      Descarga de PDFs de arXiv con renombrado automático al título del artículo
// @description:es  Permite renombrar directamente el archivo descargado al título del artículo, cumpliendo con las normas de nomenclatura de archivos de Windows. Añade un hipervínculo para descargar el artículo en la página de búsqueda y en la interfaz de un solo artículo, haz clic para descargar. [Versión modificada 17-12-2023]
// @name:fi      Lataa PDF-tiedostoja arXivistä automaattisesti uudelleennimettynä artikkelin otsikkoon
// @description:fi  Mahdollistaa ladatun tiedoston nimeämisen suoraan artikkelin otsikkoon Windowsin tiedostonimistandardeja noudattaen. Lisää hyperlinkin artikkelin lataamiseen hakusivulle ja yksittäisen artikkelin käyttöliittymään, napsauta ladataksesi. [Muokattu versio 17.12.2023]
// @name:fr      Téléchargement de PDF depuis arXiv avec renommage automatique au titre de l’article
// @description:fr  Permet de renommer directement le fichier téléchargé au titre de l’article, conformément aux règles de nommage des fichiers sous Windows. Ajoute un hyperlien pour télécharger l’article sur la page de recherche et l’interface d’un article unique, cliquez pour télécharger. [Version modifiée du 17/12/2023]
// @name:fr-CA   Téléchargement de PDF d’arXiv avec renommage automatique au titre de l’article
// @description:fr-CA  Permet de renommer directement le fichier téléchargé au titre de l’article, selon les règles de nommage des fichiers de Windows. Ajoute un hyperlien pour télécharger l’article sur la page de recherche et l’interface d’un seul article, cliquez pour télécharger. [Version modifiée 17-12-2023]
// @name:he      הורדת קבצי PDF מ-arXiv עם שינוי שם אוטומטי לכותרת המאמר
// @description:he  מאפשר לשנות את שם הקובץ שהורד ישירות לכותרת המאמר, תוך עמידה בכללי מתן שמות לקבצים ב-Windows. מוסיף קישור להורדת המאמר בדף החיפוש ובממשק של מאמר בודד, לחץ להורדה. [גרסה מתוקנת 17-12-2023]
// @name:hr      Preuzimanje PDF-ova s arXiva uz automatsko preimenovanje u naslov članka
// @description:hr  Omogućuje izravno preimenovanje preuzete datoteke u naslov članka, u skladu s pravilima imenovanja datoteka u Windowsu. Dodaje hipervezu za preuzimanje članka na stranici za pretraživanje i sučelju pojedinačnog članka, kliknite za preuzimanje. [Izmijenjena verzija 17. 12. 2023.]
// @name:hu      PDF fájlok letöltése az arXiv-ról automatikus átnevezéssel a cikk címére
// @description:hu  Lehetővé teszi a letöltött fájl közvetlen átnevezését a cikk címére, a Windows fájl-elnevezési szabályainak megfelelően. Hiperhivatkozást ad a cikk letöltéséhez a keresőoldalon és az egyes cikkek felületén, kattintson a letöltéshez. [Módosított verzió: 2023.12.17.]
// @name:id      Unduh PDF dari arXiv dengan Penggantian Nama Otomatis ke Judul Makalah
// @description:id  Memungkinkan penggantian nama file yang diunduh langsung ke judul makalah, sesuai dengan aturan penamaan file Windows. Menambahkan tautan untuk mengunduh makalah di halaman pencarian dan antarmuka makalah tunggal, klik untuk mengunduh. [Versi yang dimodifikasi 17-12-2023]
// @name:it      Scarica PDF da arXiv con rinominazione automatica al titolo dell’articolo
// @description:it  Consente di rinominare direttamente il file scaricato con il titolo dell’articolo, conforme alle regole di denominazione dei file di Windows. Aggiunge un collegamento ipertestuale per scaricare l’articolo nella pagina di ricerca e nell’interfaccia di un singolo articolo, fai clic per scaricare. [Versione modificata 17/12/2023]
// @name:ja      arXivのPDFファイルを論文タイトルに自動リネームしてダウンロード
// @description:ja  ダウンロードしたファイル名を論文タイトルに直接変更でき、Windowsのファイル命名規則に準拠します。検索ページおよび個別の論文インターフェースに論文をダウンロードするハイパーリンクを追加し、クリックするだけでダウンロード可能です。[2023年12月17日改訂版]
// @name:ka      arXiv-დან PDF ფაილების ჩამოტვირთვა ავტომატური გადარქმევით სტატიის სათაურზე
// @description:ka  საშუალებას გაძლევთ პირდაპირ გადაარქვათ ჩამოტვირთული ფაილი სტატიის სათაურად, Windows-ის ფაილის დასახელების წესების შესაბამისად. ამატებს ჰიპერბმულს სტატიის ჩამოსატვირთად საძიებო გვერდზე და ცალკეული სტატიის ინტერფეისში, დააწკაპუნეთ ჩამოსატვირთად. [შესწორებული ვერსია 17.12.2023]
// @name:ko      arXiv PDF 파일을 논문 제목으로 자동 이름 변경하여 다운로드
// @description:ko  다운로드한 파일 이름을 논문 제목으로 직접 변경할 수 있으며, Windows 파일 명명 규칙을 준수합니다. 검색 페이지와 개별 논문 인터페이스에 논문을 다운로드할 수 있는 하이퍼링크를 추가하여 클릭만으로 다운로드 가능합니다. [2023-12-17 수정판]
// @name:nb      Last ned PDF-filer fra arXiv med automatisk omdøping til artikkelens tittel
// @description:nb  Gjør det mulig å direkte omdøpe den nedlastede filen til artikkelens tittel, i samsvar med Windows’ regler for filnavn. Legger til en hyperlenke for å laste ned artikkelen på søkesiden og grensesnittet for en enkelt artikkel, klikk for å laste ned. [Modifisert versjon 17.12.2023]
// @name:nl      Download PDF’s van arXiv met automatische hernoeming naar de titel van het artikel
// @description:nl  Maakt het mogelijk om de gedownloade bestandsnaam direct te wijzigen in de titel van het artikel, conform de Windows-bestandsnaamregels. Voegt een hyperlink toe om het artikel te downloaden op de zoekpagina en de interface van een enkel artikel, klik om te downloaden. [Gewijzigde versie 17-12-2023]
// @name:pl      Pobieranie plików PDF z arXiv z automatyczną zmianą nazwy na tytuł artykułu
// @description:pl  Umożliwia bezpośrednią zmianę nazwy pobranego pliku na tytuł artykułu, zgodnie z zasadami nazewnictwa plików w systemie Windows. Dodaje hiperłącze do pobrania artykułu na stronie wyszukiwania oraz w interfejsie pojedynczego artykułu, kliknij, aby pobrać. [Wersja zmodyfikowana 17.12.2023]
// @name:pt-BR   Baixar PDFs do arXiv com renomeação automática para o título do artigo
// @description:pt-BR  Permite renomear diretamente o arquivo baixado para o título do artigo, em conformidade com as regras de nomenclatura de arquivos do Windows. Adiciona um hiperlink para baixar o artigo na página de busca e na interface de um único artigo, clique para baixar. [Versão modificada 17/12/2023]
// @name:ro      Descărcare PDF-uri de pe arXiv cu redenumire automată în titlul lucrării
// @description:ro  Permite redenumirea directă a fișierului descărcat în titlul lucrării, conform regulilor de denumire a fișierelor din Windows. Adaugă un hyperlink pentru descărcarea lucrării pe pagina de căutare și în interfața unei singure lucrări, faceți clic pentru a descărca. [Versiune modificată 17-12-2023]
// @name:ru      Скачивание PDF-файлов с arXiv с автоматическим переименованием в заголовок статьи
// @description:ru  Позволяет напрямую переименовать скачанный файл в заголовок статьи в соответствии с правилами именования файлов в Windows. Добавляет гиперссылку для скачивания статьи на странице поиска и в интерфейсе отдельной статьи, нажмите для скачивания. [Модифицированная версия от 17.12.2023]
// @name:sk      Stiahnutie PDF súborov z arXiv s automatickým premenovaním na názov článku
// @description:sk  Umožňuje priamo premenovať stiahnutý súbor na názov článku v súlade s pravidlami pomenovania súborov vo Windows. Pridáva hypertextový odkaz na stiahnutie článku na vyhľadávacej stránke a rozhraní jednotlivého článku, kliknite na stiahnutie. [Upravená verzia 17. 12. 2023]
// @name:sr      Преузимање PDF-ова са arXiv-а уз аутоматско преименовање у наслов чланка
// @description:sr  Омогућава директно преименовање преузете датотеке у наслов чланка, у складу са правилима именовања датотека у Windows-у. Додаје хипервезу за преузимање чланка на страници за претрагу и интерфејсу појединачног чланка, кликните за преузимање. [Измењена верзија 17.12.2023.]
// @name:sv      Ladda ner PDF-filer från arXiv med automatisk omdöpning till artikelns titel
// @description:sv  Gör det möjligt att direkt byta namn på den nedladdade filen till artikelns titel, i enlighet med Windows regler för filnamn. Lägger till en hyperlänk för att ladda ner artikeln på sök-sidan och gränssnittet för en enskild artikel, klicka för att ladda ner. [Modifierad version 17-12-2023]
// @name:th      ดาวน์โหลด PDF จาก arXiv พร้อมเปลี่ยนชื่ออัตโนมัติเป็นชื่อบทความ
// @description:th  ช่วยให้สามารถเปลี่ยนชื่อไฟล์ที่ดาวน์โหลดโดยตรงเป็นชื่อบทความได้ตามกฎการตั้งชื่อไฟล์ของ Windows เพิ่มไฮเปอร์ลิงก์สำหรับดาวน์โหลดบทความในหน้าค้นหาและอินเทอร์เฟซบทความเดี่ยว คลิกเพื่อดาวน์โหลด [รุ่นแก้ไข 17-12-2023]
// @name:tr      arXiv’den PDF dosyalarını makale başlığına otomatik yeniden adlandırarak indir
// @description:tr  İndirilen dosyanın adını doğrudan makale başlığına yeniden adlandırmayı sağlar ve Windows dosya adlandırma kurallarına uygundur. Arama sayfasında ve tek bir makale arayüzünde makaleyi indirmek için bir köprü ekler, indirmek için tıklayın. [Değiştirilmiş sürüm 17.12.2023]
// @name:ug      arXiv دىن PDF ھۆججەتلىرىنى ماقالە ماۋزۇسىغا ئاپتوماتىك ئۆزگەرتىپ چۈشۈرۈش
// @description:ug  چۈشۈرۈلگەن ھۆججەتنىڭ نامىنى بىۋاسىتە ماقالە ماۋزۇسىغا ئۆزگەرتىشكە يول قويىدۇ ۋە Windows ھۆججەت نام بېرىش قائىدىلىرىگە ئۇيغۇن كېلىدۇ. ئىزدەش بېتىدە ۋە يەككە ماقالە كۆرۈنمە يۈزىدە ماقالىنى چۈشۈرۈش ئۈچۈن بىرەر ئۇلىنىش قوشىدۇ، چۈشۈرۈش ئۈچۈن چېكىڭ. [ئۆزگەرتىلگەن نەشرى 2023-12-17]
// @name:uk      Завантаження PDF-файлів з arXiv з автоматичним перейменуванням на заголовок статті
// @description:uk  Дозволяє безпосередньо перейменувати завантажений файл на заголовок статті відповідно до правил іменування файлів у Windows. Додає гіперпосилання для завантаження статті на сторінці пошуку та в інтерфейсі окремої статті, натисніть для завантаження. [Модифікована версія від 17.12.2023]
// @name:vi      Tải PDF từ arXiv với tự động đổi tên thành tiêu đề bài báo
// @description:vi  Cho phép đổi tên tệp tải xuống trực tiếp thành tiêu đề bài báo, tuân thủ quy tắc đặt tên tệp của Windows. Thêm một siêu liên kết để tải bài báo trên trang tìm kiếm và giao diện bài báo đơn lẻ, nhấp để tải xuống. [Phiên bản chỉnh sửa 17-12-2023]
// @name:zh      arXiv下载PDF文件自动重命名为论文名
// @description:zh  能够直接把下载的文件名默认修改为论文名，并且符合Windows文件命名规范。会在搜索页面以及单个论文界面产生一个下载论文的超链接，点击即可。[2023-12-17修改版]
// @name:zh-CN   arXiv下载PDF文件自动重命名为论文名
// @description:zh-CN  能够直接把下载的文件名默认修改为论文名，并且符合Windows文件命名规范。会在搜索页面以及单个论文界面产生一个下载论文的超链接，点击即可。[2023-12-17修改版]
// @name:zh-HK   arXiv下載PDF檔案自動重新命名為論文名
// @description:zh-HK  可以直接將下載的檔案名預設改為論文名，並符合Windows檔案命名規範。喺搜索頁面同單篇論文介面會產生一個下載論文的超連結，按一下即可。[2023-12-17修改版]
// @name:zh-SG   arXiv下载PDF文件自动重命名为论文名
// @description:zh-SG  能够直接把下载的文件名默认修改为论文名，并且符合Windows文件命名规范。会在搜索页面以及单个论文界面产生一个下载论文的超链接，点击即可。[2023-12-17修改版]
// @name:zh-TW   arXiv下載PDF檔案自動重新命名為論文名
// @description:zh-TW  能夠直接將下載的檔案名稱預設修改為論文名稱，且符合Windows檔案命名規範。將在搜尋頁面以及單篇論文介面產生一個下載論文的超連結，點擊即可。[2023-12-17修改版]
// @namespace    Tampermonkey
// @version      0.1.3
// @author       Aspen138
// @match        *://arxiv.org/abs/*
// @match        *://arxiv.org/search/*
// @icon         https://arxiv.org/favicon.ico
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/482493/arXiv%E4%B8%8B%E8%BD%BDPDF%E6%96%87%E4%BB%B6%E8%87%AA%E5%8A%A8%E9%87%8D%E5%91%BD%E5%90%8D%E4%B8%BA%E8%AE%BA%E6%96%87%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/482493/arXiv%E4%B8%8B%E8%BD%BDPDF%E6%96%87%E4%BB%B6%E8%87%AA%E5%8A%A8%E9%87%8D%E5%91%BD%E5%90%8D%E4%B8%BA%E8%AE%BA%E6%96%87%E5%90%8D.meta.js
// ==/UserScript==


//原作者的CSS选择器有点问题。
//建议装上SelectorGadget浏览器扩展，直接边调试边改代码。



(function() {
    'use strict';
    const url = location.pathname,webTitle = document.title
    var downloadName = '',downloadPath = ''
    var papertitle = '',papertime = ''
    if(url.search('/abs/')!=-1){
        papertitle = document.querySelector("#abs > h1").innerText
        downloadPath = document.querySelector(".download-pdf")
        papertime = document.querySelector(".dateline").innerText.replace("[Submitted on ","").replace("]","")
        downloadName = renamePaperFile(papertitle,papertime)
        addDownloadButton(downloadPath,downloadName,document.querySelector("#abs-outer > div.extra-services > div.full-text"))
    }
    if(url.search('/search/')!=-1){
        var paperlist = document.querySelectorAll("#main-container > div.content > ol > li")
        for(let paper in paperlist){
            papertitle = paperlist[paper].children[1].innerText
            papertime = paperlist[paper].querySelector("p.is-size-7").innerText.split(";")[0].replace("Submitted ","")
            downloadName = renamePaperFile(papertitle,papertime)
            downloadPath = paperlist[paper].children[0].children[0].children[1].children[0].href+'.pdf'
            addDownloadButton(downloadPath,downloadName,paperlist[paper].children[0])
        }
    }

    function addDownloadButton(downloadPath,downloadName,element){
        var button = document.createElement("a"); //创建一个input对象（提示框按钮）
        button.id = "downloadPaper";
        button.textContent = "下载论文（重命名）";
        button.setAttribute("href", downloadPath)
        button.setAttribute("download", downloadName)
        element.append(button);
    }
    function renamePaperFile(name,time){
        var downloadName = name.replace(': ','：')
        downloadName = downloadName.replace(':','：')
        downloadName = downloadName.replace('?','？')
        downloadName = downloadName.replace('/',' OR ')
        downloadName = downloadName.replace('"','“')+'.pdf'
        return '['+time+']'+downloadName
    }
})();