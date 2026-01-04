// ==UserScript==
// @namespace    http://linkme.bio/jhonpergon/?userscript=redemonitor
// @version      0.2
// @author       Jhon Pérgon

// @name         Monitor de Tráfego de Dados ↓↑
// @name:pt         Monitor de Tráfego de Dados ↓↑
// @name:pt-BR         Monitor de Tráfego de Dados ↓↑
// @name:pt-PT         Monitor de Tráfego de Dados ↓↑
// @name:es         Monitor de Tráfico de Datos ↓↑
// @name:en         Monitor de Tráfego de Dados ↓↑
// @name:fr         Monitor de Trafic de Données ↓↑
// @name:ru         Мониторинг Трафика Данных ↓↑
// @name:ja         データトラフィックモニター ↓↑
// @name:ko         데이터 트래픽 모니터 ↓↑
// @name:zh-TW         數據流量監控 ↓↑
// @name:zh-CN         数据流量监控 ↓↑
// @name:id         Monitor Lalu Lintas Data ↓↑
// @name:ug         داتا ترافىك كونتروللىغۇچ ↓↑
// @name:ar         جهاز مراقبة حركة البيانات ↓↑
// @name:he         מוניטור תנועת נתונים ↓↑
// @name:hi         डेटा ट्रैफिक मॉनिटर ↓↑
// @name:th         ตัวเฝ้าระวังการจราจรข้อมูล ↓↑
// @name:bg         Монитор на Трафика на Данни ↓↑
// @name:ro         Monitor de Trafic de Date ↓↑
// @name:fi         Tietoliikenteen Monitori ↓↑
// @name:it         Monitor del Traffico Dati ↓↑
// @name:el         Παρακολούθηση της Κίνησης Δεδομένων ↓↑
// @name:eo         Datentrafikomonitoro ↓↑
// @name:hu         Adatforgalom Figyelő ↓↑
// @name:nb         Data Trafikkovervåker ↓↑
// @name:sk         Monitor Dátového Toku ↓↑
// @name:sv         Data Trafikövervakare ↓↑
// @name:sr         Монитор Саобраћаја Података ↓↑
// @name:pl         Monitor Ruchu Danych ↓↑
// @name:nl         Data Verkeer Monitor ↓↑
// @name:de         Datenverkehrsmonitor ↓↑
// @name:da         Data Trafikovervågning ↓↑
// @name:cs         Monitor Datového Toku ↓↑
// @name:uk         Монітор Трафіку Даних ↓↑
// @name:tr         Veri Trafik İzleyici ↓↑
// @name:vi         Giám Sát Lưu Lượng Dữ Liệu ↓↑
// @name:fr-CA         Monitor de Trafic de Données ↓↑

// @description         Exibe em tempo real a quantidade de dados recebidos e enviados no site. No entanto possui limitações na detecção de upload de arquivos.
// @description:pt         Mostra em tempo real a quantidade de dados recebidos e enviados no site. No entanto, tem limitações na detecção de upload de arquivos.
// @description:pt-BR         Exibe em tempo real a quantidade de dados recebidos e enviados no site. No entanto, tem limitações na detecção de upload de arquivos.
// @description:pt-PT         Mostra em tempo real a quantidade de dados recebidos e enviados no site. No entanto, tem limitações na detecção de upload de arquivos.
// @description:en         Displays in real time the amount of data received and sent on the website. However, it has limitations in detecting file uploads.
// @description:es         Muestra en tiempo real la cantidad de datos recibidos y enviados en el sitio. Sin embargo, tiene limitaciones en la detección de la carga de archivos.
// @description:fr         Affiche en temps réel la quantité de données reçues et envoyées sur le site. Cependant, il présente des limitations dans la détection du téléchargement de fichiers.
// @description:ru         Показывает в реальном времени количество данных, полученных и отправленных на сайте. Однако есть ограничения в обнаружении загрузки файлов.
// @description:ja         サイトで受信および送信されたデータの量をリアルタイムで表示します。ただし、ファイルのアップロードの検出に制限があります。
// @description:ko         사이트에서 수신 및 송신된 데이터 양을 실시간으로 표시합니다. 그러나 파일 업로드 감지에는 제한 사항이 있습니다.
// @description:zh-TW         實時顯示網站接收和發送的數據量。但是，在檔案上傳檢測方面存在限制。
// @description:zh-CN         实时显示网站接收和发送的数据量。但是，在文件上传检测方面存在限制。
// @description:id         Menampilkan jumlah data yang diterima dan dikirim secara real-time di situs web. Namun, memiliki keterbatasan dalam mendeteksi unggahan berkas.
// @description:ug         ئاپتا سىتادا يوللىنىپ كېتىپ بولغان ئۇچۇر سانىنى تەھرىرلىۋاتىدۇ. بىراق، ھۆججەت يۈكلەشنى تەكشۈرۈش ۋەجۇدىيەتلەرى بار.
// @description:ar         يعرض في الوقت الحقيقي كمية البيانات التي تم استلامها وإرسالها على الموقع. ومع ذلك، يوجد قيود في الكشف عن تحميل الملفات.
// @description:he         מציג בזמן אמת כמות של נתונים שנשלחו והתקבלו באתר. אך יש לו הגבלות בזיהוי העלאת קבצים.
// @description:hi         साइट पर प्राप्त और भेजे गए डेटा की मात्रा को वास्तविक समय में प्रदर्शित करता है। हालांकि, फ़ाइल अपलोड की पहचान में कुछ सीमाएं हैं.
// @description:th         แสดงปริมาณข้อมูลที่รับและส่งในเวลาจริงบนเว็บไซต์ แต่มีข้อจำกัดในการตรวจจับการอัปโหลดไฟล์.
// @description:bg         Показва в реално време количеството данни, получавани и изпращани на сайта. Въпреки това има ограничения при откриването на качването на файлове.
// @description:ro         Afișează în timp real cantitatea de date primite și trimise pe site. Cu toate acestea, există limitări în detectarea încărcării de fișiere.
// @description:fi         Näyttää reaaliajassa sivustolle saapuneen ja lähetetyn datan määrän. Huomaa kuitenkin, että se on rajoitettu tiedoston lataamisen havaitsemisessa.
// @description:it         Mostra in tempo reale la quantità di dati ricevuti e inviati sul sito. Tuttavia, presenta limitazioni nella rilevazione dell'upload dei file.
// @description:el         Εμφανίζει σε πραγματικό χρόνο τον όγκο των δεδομένων που λαμβάνονται και αποστέλλονται στον ιστότοπο. Ωστόσο, υπάρχουν περιορισμοί στην ανίχνευση της μεταφόρτωσης αρχείων.
// @description:eo         Montras en tempo realan la kvanton de datumoj ricevitaj kaj senditaj sur la retejo. Tamen, ĝi havas limigojn en la detekto de alŝuto de dosieroj.
// @description:hu         Valós időben mutatja be az oldalon kapott és elküldött adatok mennyiségét. Azonban korlátozásokkal jár a fájlfeltöltés érzékelésében.
// @description:nb         Viser i sanntid mengden data som mottas og sendes på nettstedet. Det har imidlertid begrensninger i deteksjonen av opplasting av filer.
// @description:sk         Zobrazuje v reálnom čase množstvo dát prijatých a odoslaných na webovej stránke. Má však obmedzenia pri detekcii nahrávania súborov.
// @description:sv         Visar i realtid mängden data som tas emot och skickas på webbplatsen. Det har dock begränsningar i upptäckten av filuppladdning.
// @description:sr         Приказује у реалном времену количину података који су примљени и послати на веб-сајту. Међутим, постоје ограничења у откривању учитавања фајлова.
// @description:pl         Wyświetla w czasie rzeczywistym ilość danych otrzymanych i wysłanych na stronie internetowej. Jednak ma ograniczenia w wykrywaniu przesyłania plików.
// @description:nl         Toont in realtime de hoeveelheid ontvangen en verzonden gegevens op de website. Het heeft echter beperkingen bij het detecteren van het uploaden van bestanden.
// @description:de         Zeigt in Echtzeit die Menge der auf der Website empfangenen und gesendeten Daten an. Es gibt jedoch Einschränkungen bei der Erkennung von Datei-Uploads.
// @description:da         Viser i realtid mængden af data, der er modtaget og sendt på webstedet. Det har dog begrænsninger i opdagelsen af filoverførsel.
// @description:cs         Zobrazuje v reálném čase množství dat přijatých a odeslaných na webu. Má však omezení ve sledování nahrávání souborů.
// @description:uk         Показує в реальному часі кількість даних, отриманих і відправлених на сайті. Проте є обмеження в виявленні завантаження файлів.
// @description:tr         Sitede alınan ve gönderilen veri miktarını gerçek zamanlı olarak gösterir. Ancak dosya yükleme tespitinde sınırlamaları vardır.
// @description:vi         Hiển thị số lượng dữ liệu nhận và gửi trên trang web trong thời gian thực. Tuy nhiên, có hạn chế trong việc phát hiện tải lên tệp.
// @description:fr-CA         Affiche en temps réel la quantité de données reçues et envoyées sur le site. Cependant, il présente des limites dans la détection du téléchargement de fichiers.

// @icon         data:image/png;base64,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
// @match        *://*/*
// @grant        none
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478629/Monitor%20de%20Tr%C3%A1fego%20de%20Dados%20%E2%86%93%E2%86%91.user.js
// @updateURL https://update.greasyfork.org/scripts/478629/Monitor%20de%20Tr%C3%A1fego%20de%20Dados%20%E2%86%93%E2%86%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.3/font/bootstrap-icons.css");');

    let addOne = false;
    // Crie um elemento de div para exibir o tráfego de rede
    const trafficDiv = document.createElement('div');
    trafficDiv.style.position = 'fixed';
    trafficDiv.style.zIndex = '999999';
    trafficDiv.style.left = '0';
    trafficDiv.style.bottom = '0';
    trafficDiv.style.fontSize = '11px';
    trafficDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    trafficDiv.style.color = 'white';
    trafficDiv.style.padding = '5px';

    if(addOne == false){
      document.body.appendChild(trafficDiv);
      addOne = true;
    }

    // Variável para rastrear o tamanho total dos recursos recebidos no último segundo
    let totalReceivedSize = 0;
    let receivedLastSecond = 0;
    let totalUploadedSize = 0;
    let uploadedLastSecond = 0;

    // Função para formatar bytes em KB ou MB
    function formatBytes(bytes) {
        if (bytes < 1024) {
            return bytes.toFixed(2) + ' Kb';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(1) + ' Kb';
        } else {
            return (bytes / (1024 * 1024)).toFixed(1) + ' Mb';
        }
    }

    // Função para atualizar o tráfego de rede
    function updateTraffic() {
        // Obtenha os dados de tráfego de rede
        const resources = window.performance.getEntriesByType('resource');

        // Calcule o tamanho dos recursos recebidos nos últimos segundos
        const now = performance.now();
        const receivedThisSecond = resources.reduce((acc, entry) => {
            if (now - entry.responseEnd < 1000) { // dentro do último segundo
                return acc + entry.transferSize;
            } else {
                return acc;
            }
        }, 0);

        // Calcule a velocidade de download no último segundo
        const downloadSpeed = (receivedThisSecond - receivedLastSecond) / 1024; // em KB/s
        receivedLastSecond = receivedThisSecond;
        totalReceivedSize += receivedThisSecond;

        // Calcule a velocidade de upload no último segundo
        const uploadedThisSecond = totalUploadedSize - uploadedLastSecond;
        const uploadSpeed = uploadedThisSecond / 1024; // em KB/s
        uploadedLastSecond = totalUploadedSize;

        // Atualize o conteúdo da div com os dados de tráfego formatados
        trafficDiv.innerHTML = `<b><i class="bi bi-arrow-down"></i> ${formatBytes(totalReceivedSize)} • <i class="bi bi-speedometer"></i> ${formatBytes(receivedThisSecond)} | <i class="bi bi-arrow-up"></i> ${formatBytes(uploadedThisSecond)}</b>`;
    }

    // Adicione um ouvinte de eventos para elementos de input type=file para rastrear o tamanho dos arquivos enviados
    document.body.addEventListener('change', function(event) {
        if (event.target && event.target.tagName === 'INPUT' && event.target.type === 'file') {
            const files = event.target.files;
            for (let i = 0; i < files.length; i++) {
                totalUploadedSize += files[i].size;
            }
            updateTraffic();
        }
    });

    // Chame a função de atualização a cada segundo
    setInterval(updateTraffic, 1000);
})();

