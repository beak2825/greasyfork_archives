// ==UserScript==
// @name             QR Code Recognizer
// @name:ar          مُعرِّف رمز الاستجابة السريعة
// @name:bg          Разпознаване на QR код
// @name:cs          Rozpoznávač QR kódů
// @name:da          QR-kode genkender
// @name:de          QR-Code-Erkennung
// @name:el          Αναγνώριση QR Code
// @name:en          QR Code Recognizer
// @name:eo          QR-Koda Rekonilo
// @name:es          Reconocedor de código QR
// @name:fi          QR-koodin tunnistin
// @name:fr          Reconnaissance de code QR
// @name:fr-CA       Reconnaissance de code QR
// @name:he          זיהוי קוד QR
// @name:hr          Prepoznavanje QR koda
// @name:hu          QR-kód felismerő
// @name:id          Pengenal Kode QR
// @name:it          Riconoscitore di codici QR
// @name:ja          QRコード認識
// @name:ka          QR კოდის ამოცნობა
// @name:ko          QR 코드 인식기
// @name:nb          QR-kode gjenkjenner
// @name:nl          QR-code herkenner
// @name:pl          Rozpoznawacz kodów QR
// @name:pt-BR       Reconhecedor de Código QR
// @name:ro          Recunoaștere cod QR
// @name:ru          Распознаватель QR-кода
// @name:sk          Rozpoznávač QR kódov
// @name:sr          Препознавач QР кода
// @name:sv          QR-kodavkännare
// @name:th          ตัวรู้จำ QR โค้ด
// @name:tr          QR Kod Tanıyıcı
// @name:ug          QR كودنى تونۇش
// @name:uk          Розпізнавач QR-коду
// @name:vi          Nhận diện mã QR
// @name:zh          二维码识别器
// @name:zh-CN       二维码识别器
// @name:zh-HK       二維碼識別器
// @name:zh-SG       二维码识别器
// @name:zh-TW       二維碼識別器
// @description      Adds QR code recognition option to right-click menu when hovering over images
// @description:ar   يضيف خيار التعرف على رمز الاستجابة السريعة في القائمة المنبثقة عند تمرير المؤشر فوق الصور
// @description:bg   Добавя опция за разпознаване на QR код в контекстното меню при преминаване над изображения
// @description:cs   Přidává možnost rozpoznání QR kódu do kontextové nabídky při najetí myší na obrázky
// @description:da   Tilføjer mulighed for QR-kode-genkendelse i højreklikmenuen ved at holde musen hen over billeder
// @description:de   Fügt eine Option zur QR-Code-Erkennung im Kontextmenü hinzu, wenn der Mauszeiger über Bildern schwebt
// @description:el   Προσθέτει επιλογή αναγνώρισης QR Code στο αναδυόμενο μενού όταν αιωρείται πάνω από εικόνες
// @description:en   Adds QR code recognition option to right-click menu when hovering over images
// @description:eo   Aldenas QR-koda rekona elekteblon al kunteksta menuo super bildoj
// @description:es   Agrega la opción de reconocimiento de código QR al menú contextual al pasar el mouse sobre las imágenes
// @description:fi   Lisää QR-koodin tunnistusvaihtoehdon hiiren kakkospainikemenyyyn kuvien päällä leijuessa
// @description:fr   Ajoute une option de reconnaissance de code QR dans le menu contextuel lors du survol d'images
// @description:fr-CA Ajoute une option de reconnaissance de code QR dans le menu contextuel lors du survol d'images
// @description:he   מוסיף אפשרות לזיהוי קוד QR בתפריט הקליק-ימני בעת ריחוף מעל תמונות
// @description:hr   Dodaje mogućnost prepoznavanja QR koda u kontekstni izbornik pri lebdenju iznad slika
// @description:hu   QR-kód felismerési lehetőséget ad a jobb kattintás menübe a képek fölött lebegve
// @description:id   Menambahkan opsi pengenalan kode QR ke menu klik kanan saat mengarkan gambar
// @description:it   Aggiunge un'opzione di riconoscimento del codice QR al menu contestuale quando si passa sopra le immagini
// @description:ja   画像上にマウスを置いたときに右クリックメニューにQRコード認識オプションを追加
// @description:ka   QR კოდის ამოცნობის პარამეტრს უმატებს კონტექსტურ მენიუს სურათებზე სვლისას
// @description:ko   이미지 위로 마우스를 올렸을 때 오른쪽 클릭 메뉴에 QR 코드 인식 옵션 추가
// @description:nb   Legger til QR-kode gjenkjenningsalternativ i høyreklikkmenyen når man svever over bilder
// @description:nl   Voegt een QR-code herkenningsmogelijkheid toe aan het rechtermuisknopmenu bij het zweven over afbeeldingen
// @description:pl   Dodaje opcję rozpoznawania kodów QR do menu kontekstowego podczas najechania na obrazy
// @description:pt-BR Adiciona a opção de reconhecimento de código QR ao menu de contexto ao passar o mouse sobre imagens
// @description:ro   Adaugă opțiunea de recunoaștere a codului QR în meniul contextual la trecerea cu mouse-ul peste imagini
// @description:ru   Добавляет опцию распознавания QR-кода в контекстное меню при наведении на изображения
// @description:sk   Pridá možnosť rozpoznávania QR kódov do kontextovej ponuky pri prejdení myšou cez obrázky
// @description:sr   Додаје опцију препознавања QР кода у контекстни мени при лебдењу изнад слика
// @description:sv   Lägger till ett QR-kodavkänningsalternativ i högerklicksmenyn när muspekaren svävar över bilder
// @description:th   เพิ่มตัวเลือกการรู้จำ QR โค้ดในเมนูคลิกขวาเมื่อวางเมาส์เหนือรูปภาพ
// @description:tr   Resimler üzerinde gezinirken sağ tıklama menüsüne QR kod tanıma seçeneği ekler
// @description:ug   رەسىملەرنىڭ ئۈستىدە تۇرغاندا ئوڭ چېكىش تىزىملىكىگە QR كود تونۇش تاللىمىنى قوشىدۇ
// @description:uk   Додає параметр розпізнавання QR-коду в контекстне меню при наведенні на зображення
// @description:vi   Thêm tùy chọn nhận diện mã QR vào menu chuột phải khi di chuột qua hình ảnh
// @description:zh   悬浮在图片上时，右键菜单里给出识别二维码的选项
// @description:zh-CN 悬浮在图片上时，右键菜单里给出识别二维码的选项
// @description:zh-HK 懸浮在圖片上時，右鍵選單裡給出識別二維碼的選項
// @description:zh-SG 悬浮在图片上时，右键菜单里给出识别二维码的选项
// @description:zh-TW 懸浮在圖片上時，右鍵選單裡給出識別二維碼的選項
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @author       aspen138
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @require      https://unpkg.com/jsqr/dist/jsQR.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484409/QR%20Code%20Recognizer.user.js
// @updateURL https://update.greasyfork.org/scripts/484409/QR%20Code%20Recognizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedImage = null;

    // 添加右键菜单选项
    document.addEventListener('contextmenu', function(event) {
        // 确定是否是图片元素
        if (event.target.tagName === 'IMG') {
            selectedImage = event.target; // 保存当前选中的图片
        } else {
            selectedImage = null;
        }
    }, false);

    // 注册菜单命令
    GM_registerMenuCommand("识别二维码", function() {
        console.log("selectedImage=", selectedImage);
        if (selectedImage) {
            decodeQRCode(selectedImage);
        }
    }, 'r');

    function decodeQRCode(image) {
        // 创建Canvas来读取图片内容
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = image.naturalWidth; // 使用图片的原始尺寸
        canvas.height = image.naturalHeight;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        // 使用jsQR库识别二维码
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        // 如果识别出二维码，发送通知显示结果
        if (code) {
            alert(`二维码内容：${code.data}`+ '     二维码识别结果');  //别用GM_notification了吧
        } else {
            alert('未识别到二维码，请确保图片中包含一个可识别的二维码。' + '   二维码识别错误');  //别用GM_notification了吧
        }
    }
})();