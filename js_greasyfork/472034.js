// ==UserScript==
// @name                        Twitter X Icon
// @namespace                   TwitterX
// @match                       https://twitter.com/*
// @grant                       none
// @unwrap
// @inject-into                 page
// @version                     0.1.13
// @author                      CY Fung
// @description                 Change Twitter X Icon
// @run-at                      document-start
// @license                     MIT

// @description:ja              Twitterアイコンをカスタマイズして個性を表現しましょう。
// @description:zh-TW           自訂 Twitter 圖示，展現獨特風格。
// @description:zh-CN           自定义 Twitter 图标，展现独特风格。

// @description:ko              트위터 아이콘을 원하는 이미지로 변경하여 개성을 표현하세요.
// @description:ru              Замените иконку Twitter на свое изображение и выразите свою индивидуальность.
// @description:af              Vervang die Twitter-ikoon met 'n persoonlike prent om jou individualiteit uit te druk.
// @description:az              Twitter nişanını şəxsi şəkil ilə dəyişdirin və özünüzü ifadə edin.
// @description:id              Ganti ikon Twitter dengan gambar pilihan Anda dan tunjukkan gaya pribadi.
// @description:ms              Tukar ikon Twitter dengan imej pilihan anda dan tunjukkan gaya peribadi.
// @description:bs              Zamijenite Twitter ikonu sa odabranom slikom i izrazite svoj stil.
// @description:ca              Canvieu la icona de Twitter amb una imatge personalitzada i mostreu el vostre estil.
// @description:cs              Změňte ikonu Twitteru na vlastní obrázek a vyjádřete svůj osobní styl.
// @description:da              Skift Twitter-ikonet med et personligt billede og vis din stil.
// @description:de              Ersetzen Sie das Twitter-Icon durch ein persönliches Bild und zeigen Sie Ihren Stil.
// @description:et              Asendage Twitteri ikoon isikliku pildiga ja näidake oma stiili.
// @description:es              Cambia el ícono de Twitter por una imagen personalizada y muestra tu estilo.
// @description:eu              Aldatu Twitter ikurria zure irudi pertsonal batekin eta erakutsi zure estiloa.
// @description:fr              Remplacez l'icône Twitter par une image personnalisée et montrez votre style.
// @description:gl              Cambia o icona de Twitter cunha imaxe personalizada e mostra o teu estilo.
// @description:hr              Zamijenite Twitter ikonu osobnom slikom i pokažite svoj stil.
// @description:zu              Thayela uhlobo lweTwitter ngezithombe ozokhetha ukuze uphazamise izibonelo zakho.
// @description:is              Skiptu út Twitter tákn með persónulegu myndi og sýndu stílinn þinn.
// @description:it              Sostituisci l'icona di Twitter con un'immagine personalizzata e mostra il tuo stile.
// @description:sw              Badilisha ishara ya Twitter na picha yako ya kibinafsi na onyesha mtindo wako.
// @description:lv              Mainiet Twitter ikonu ar personīgu attēlu un parādiet savu stilu.
// @description:lt              Pakeiskite „Twitter“ piktogramą asmeniniu vaizdu ir parodykite savo stilų.
// @description:hu              Cserélje le a Twitter ikont egyéni képre, és mutassa meg stílusát.
// @description:nl              Vervang het Twitter-pictogram door een aangepaste afbeelding en toon uw stijl.
// @description:uz              Twitter niqobini o'zgartiring va shaxsiy tasvir bilan o'zingizni ifodalang.
// @description:pl              Zmień ikonę Twittera na wybrany obraz i pokaż swój styl.
// @description:pt              Substitua o ícone do Twitter por uma imagem personalizada e mostre o seu estilo.
// @description:pt-BR           Substitua o ícone do Twitter por uma imagem personalizada e mostre o seu estilo.
// @description:ro              Înlocuiți iconița Twitter cu o imagine personalizată și arătați-vă stilul.
// @description:sq              Zëvendësoni ikonën e Twitter me një imazh të personalizuar dhe tregoni stilin tuaj.
// @description:sk              Nahraďte ikonu Twitteru vlastným obrázkom a ukážte svoj štýl.
// @description:sl              Zamenjajte ikono Twitter z izbrano sliko in izrazite svoj slog.
// @description:sr              Zamenite Twitter ikonu ličnom slikom i pokažite svoj stil.
// @description:fi              Vaihda Twitter-kuvake omalla kuvalla ja näytä oma tyyli.
// @description:sv              Byt ut Twitter-ikonen med en anpassad bild och visa din stil.
// @description:vi              Thay đổi biểu tượng Twitter bằng hình ảnh tùy chỉnh và thể hiện phong cách của bạn.
// @description:tr              Twitter simgesini istediğiniz bir görüntüyle değiştirin ve tarzınızı gösterin.
// @description:be              Замяніце іконку Twitter на свой малюнак і выразіце свой стыль.
// @description:bg              Заменете иконата на Twitter с изображение по ваш избор и покажете своя стил.
// @description:ky              Twitter иконкасын карата муркунун издесеңиз жана стилиңизди көрсөтүңүз.
// @description:kk              Twitter белгісін таңдап жатқан суретпен ауыстырып, стильіңізді көрсетіңіз.
// @description:mk              Заменете ја иконата на Twitter со слика по ваш избор и прикажете го вашиот стил.
// @description:mn              Twitter хэрэглэгчийн дүрсийг өөрчил, таны ихэнх стилийг харуулна уу.
// @description:uk              Замініть іконку Twitter на свій малюнок і виразіть свій стиль.
// @description:el              Αντικαταστήστε το εικονίδιο του Twitter με εικόνα της επιλογής σας και εμφανίστε το στυλ σας.
// @description:hy              Փոխարինեք Twitter-ի պատկերն անձնանշանով և ցուցադրեք ձեր ոլորտը:
// @description:ur              ٹوئٹر آئیکن کو آپ کی منتخب تصویر سے تبدیل کریں اور اپنی شہرت کو ظاہر کریں۔
// @description:ar              قم بتغيير أيقونة Twitter إلى صورة اختيارك وعرض أسلوبك الشخصي.
// @description:fa              آیکن Twitter را با تصویر انتخابی تغییر داده و سبک خود را نشان دهید.
// @description:ne              आफ्नो छवि छान्ने गरी ट्विटर चिन्ह परिवर्तन गर्नुहोस् र आफ्नो शैली प्रदर्शन गर्नुहोस्।
// @description:mr              Twitter चिन्हाची प्रतिनिधित्व करण्यासाठी आपली पसंतीची चित्रे वापरा.
// @description:hi              ट्विटर आइकन को अपनी पसंदीदा तस्वीर से बदलें और अपनी शैली दिखाएं।
// @description:as              আপোনাৰ বৰ্ণনাৰ সৈতে Twitter চিনত পৰিষ্কৰণ কৰক।
// @description:bn              আপনার পছন্দের ছবি দিয়ে Twitter চিহ্নিকা পরিবর্তন করুন এবং আপনার শৈলী প্রদর্শন করুন।
// @description:pa              ਆਪਣੀ ਚੋਣ ਦੀ ਤਸਵੀਰ ਨਾਲ Twitter ਚਿੰਨਕ ਨੂੰ ਬਦਲੋ ਅਤੇ ਆਪਣੀ ਸ਼ੈਲੀ ਦਿਖਾਓ।
// @description:gu              આપની પસંદની ચિત્રો સાથે Twitter ચિન્હ બદલો અને તમારી શૈલી બતાવો.
// @description:or              ଆପଣଙ୍କ ପସନ୍ଦର ଚିତ୍ରରେ Twitter ପ୍ରତିକା ବଦଳାନ୍ତୁ ଏବଂ ଆପଣଙ୍କ ସ୍ଟାଇଲ ଦର୍ଶନ ଦିଅନ୍ତୁ।
// @description:ta              உங்கள் ஆர்வம் உள்ள படத்தைப் பயன்படுத்தி Twitter ஐகானை மாற்றவும் உங்கள் பார்வையைக் காட்டுங்கள்.
// @description:te              మీ ఇష్టమైన చిత్రంతో Twitter గురించిన చిహ్నాన్ని మార్చండి మరియు మీ శైలిని చూపించండి.
// @description:kn              ನಿಮ್ಮ ಆಸಕ್ತಿಗೆ ಅನುಗುನವಾಗಿ Twitter ಚಿಹ್ನೆಯನ್ನು ಬದಲಾಯಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಶೈಲಿಯನ್ನು ತೋರಿಸಿ.
// @description:ml              നിങ്ങളുടെ ഇഷ്ട ചിത്രം ഉപയോഗിച്ച് Twitter ചിഹ്നം മാറ്റുകയും നിങ്ങളുടെ ശൈലി കാണിക്കുകയും ചെയ്യുക.
// @description:si              ඔබේ ආදරයෙන් Twitter ලකුණ වෙනස් කිරීමේදී ඔබේ ප්‍රධාන වෙළඳ ආකර්ෂණය පෙන්වන්ද සඳහා ඉඩදීම.
// @description:th              เปลี่ยนไอคอน Twitter ด้วยภาพที่คุณเลือกและแสดงสไตล์ของคุณ
// @description:lo              ປ່ຽນເວັບໄຊ Twitter ໂດຍຮູບພາບທີ່ເຈົ້າເລືອກແລະສະແດງສະຖານທີ່ຂ້ອຍ
// @description:my              Twitter အိုင်ကွန်းရွေးကို သင်ရွေးသောပုံမျှ နှင့်သင်၏အပြင်ကိုပြပေးပါ။
// @description:ka              Twitter ხატულა შეიცვალეთ თქვენი რასიელი სურათით და გამოაჩინეთ თქვენი სტილი.
// @description:am              የጥንቃቄዎን ምስል በ Twitter አይኮን መቀየር እና ስብስቦችዎን ተማሪዎች እንዴት ያቀየረው እንደሚፈልግ ትስጋላችሁ።
// @description:km              ប្តូររូបក្នុង Twitter ជារូបសម្រាប់អ្នកដែលអ្នកស្រលាញ់យ៉ាងមាននងពីរបៀបផ្សេងៗ

// @downloadURL https://update.greasyfork.org/scripts/472034/Twitter%20X%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/472034/Twitter%20X%20Icon.meta.js
// ==/UserScript==


(() => {

  let mIconUrl = '';
  let linkCache = new Map();

  let waa = new WeakSet();

  let mDotUrlMap = new Map();

  const op = {
    radius: (canvasSize) => Math.round(canvasSize.width * 0.14),

    x: (canvasSize, radius) => canvasSize.width - radius * 2 + radius * 0.05,

    y: (canvasSize, radius) => 0 + radius * 2 - radius * 0.3,

  };

  function addRedDotToImage(dataUriBase64, op) {
    return new Promise((resolve, reject) => {
      // Create an image element to load the data URI
      const image = new Image();
      image.onload = () => {

        const { width, height } = image;
        const canvasSize = {
          width, height
        }

        const radius = op.radius(canvasSize);
        const dotX = op.x(canvasSize, radius);
        const dotY = op.y(canvasSize, radius);

        // Convert the canvas back to a data URI base64 string
        let revisedDataUriBase64;
        if (dataUriBase64.startsWith('data:image/svg+xml')) {
          // For SVG, create a new SVG element and add the circle element
          const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svgElement.setAttribute('width', width);
          svgElement.setAttribute('height', height);

          // Create a new image element within the SVG
          const svgImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
          svgImageElement.setAttribute('width', width);
          svgImageElement.setAttribute('height', height);
          svgImageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', dataUriBase64);
          svgElement.appendChild(svgImageElement);

          // Create a red dot circle element
          const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circleElement.setAttribute('cx', dotX);
          circleElement.setAttribute('cy', dotY);
          circleElement.setAttribute('r', radius);
          circleElement.setAttribute('fill', 'red');
          svgElement.appendChild(circleElement);

          if (typeof btoa !== 'function') return reject();
          try {

            // Convert the modified SVG element back to a data URI base64 string
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(svgElement);
            revisedDataUriBase64 = 'data:image/svg+xml;base64,' + btoa(svgString);
          } catch (e) { }
        } else {

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0);

          // Draw a red dot on the top right corner
          ctx.beginPath();
          ctx.arc(dotX, dotY, radius, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
          try {
            revisedDataUriBase64 = canvas.toDataURL();
          } catch (e) { }
        }


        if (!revisedDataUriBase64) {
          return reject();
        }

        // Convert the canvas back to a data URI base64 string
        // const revisedDataUriBase64 = canvas.toDataURL();
        resolve(revisedDataUriBase64);
      };

      // Set the image source to the provided data URI
      image.src = dataUriBase64;
    });
  }


  function myLink(link, dottable) {

    if (waa.has(link)) return;
    waa.add(link);


    let hrefDtor = Object.getOwnPropertyDescriptor(link.constructor.prototype, 'href');

    if (!hrefDtor.set || !hrefDtor.get) {
      return;
    }

    const getHref = () => {
      return hrefDtor.get.call(link)
    }

    let qq = null;


    async function updateURL(hh) {


      // console.log('old href', hh, link.getAttribute('has-dot') === 'true')

      let nurl = mIconUrl;

      if (nurl && hh) {

        let href = hh;
        let isDotted = link.getAttribute('has-dot') === 'true'

        if (isDotted && !nurl.startsWith('http')) {
          nurl = await addRedDotToImage(nurl, op);
        }



        if (hh !== nurl && nurl) {


          let rel = link.getAttribute('rel');
          if (rel === 'icon' || rel === 'shortcut icon') {
            const link1 = document.querySelector('link[rel="icon"]');
            const link2 = document.querySelector('link[rel="shortcut icon"]');

            if(link1) link1.setAttribute('has-dot', isDotted ? 'true' : 'false');
            if(link2) link2.setAttribute('has-dot', isDotted ? 'true' : 'false');

            if(link1) link1.href = nurl;
            if(link2) link2.href = nurl;
          } else {
            link.href = nurl;
          }



        }

      }





    }

    function ckk() {
      const hh = getHref();
      if (qq === hh) return;
      qq = hh;
      updateURL(hh);
    }


    function updateDotState(hh2) {

      if (hh2 && typeof hh2 == 'string' && hh2.startsWith('http')) {
        let href = hh2;
        let isDotted = false;

        if (mDotUrlMap.has(href)) isDotted = mDotUrlMap.get(href);
        else {

          if (href.endsWith('/twitter-pip.3.ico')) isDotted = true;
          else {

            let q = /\?[^?.:\/\\]+/.exec(href);
            q = q ? q[0] : '';

            if (q) {
              isDotted = true;
            }

          }

          mDotUrlMap.set(href, isDotted);


        }


        link.setAttribute('has-dot', isDotted ? 'true' : 'false')
      }

      Promise.resolve().then(ckk)



    }

    let hh2 = null;

    hh2 = getHref();
    updateDotState(hh2);

    Object.defineProperty(link, 'href', {
      get() {
        return hh2;
      },
      set(a) {
        if (!a || a.startsWith('http')) {
          hh2 = a;
          updateDotState(hh2);
        }
        return hrefDtor.set.call(this, a);
      }

    });



    document.addEventListener('my-twitter-icon-has-changed', (evt) => {

      if (!evt) return;
      let detail = evt.detail;

      if (!detail) return;
      let mIconUrl = detail.mIconUrl;
      if (!mIconUrl) return;


      link.href = mIconUrl;
      // console.log('icon changed')

      Promise.resolve().then(ckk);



    }, true);

  }

  function mIconFn(iconUrl, rel, dottable) {



    const selector = `link[rel~="${rel}"]`;
    let link = document.querySelector(selector);
    if (!link) {

      /** @type {HTMLLinkElement} */
      link = document.createElement("link");
      link.rel = `${rel}`;
      link.href = iconUrl;
      document.head.appendChild(link);
    }

    for (const link of document.querySelectorAll(selector)) {
      if (waa.has(link)) continue;
      myLink(link, dottable);
    }


  }

  function replacePageIcon(iconUrl) {
    mIconFn(iconUrl, 'icon', 1)
  }

  function replaceAppIcon(iconUrl) {

    mIconFn(iconUrl, 'apple-touch-icon', 0);
  }


  const addCSS = (href) => {
    let p = document.querySelector('style#j8d4f');
    if (!p) {
      p = document.createElement('style');
      p.id = 'j8d4f';
      document.head.appendChild(p);
    }

    let newTextContent = `
        a[href][my-custom-icon] > div::before {

            background-image: url("${href}");
            --my-custom-icon-padding: 6px;
            position: absolute;
            left: var(--my-custom-icon-padding);
            right: var(--my-custom-icon-padding);
            top: var(--my-custom-icon-padding);
            bottom: var(--my-custom-icon-padding);
            content: '';
            color: #fff;
            display: block;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 46%;
        }
        a[href][my-custom-icon] svg::before {
            display: block;
            position: absolute;
            content: "";
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
        }


        a[href][my-custom-icon] svg path {
            visibility: collapse;
        }

        `;
    newTextContent = newTextContent.trim();

    if (p.textContent !== newTextContent) p.textContent = newTextContent;
  }

  let qdd = 0;

  function sendMessageIconChanged(mIconUrl) {
    document.dispatchEvent(new CustomEvent('my-twitter-icon-has-changed', { detail: { mIconUrl } }));
  }

  function changeIconFn() {
    mIconUrl = localStorage.getItem('myCustomTwitterIcon');
    if (!mIconUrl) return;

    let tid = qdd = Date.now();

    if (tid !== qdd) return;

    addCSS(mIconUrl);
    replacePageIcon(mIconUrl);
    replaceAppIcon(mIconUrl);

    sendMessageIconChanged(mIconUrl)


  }


  function onImageLoaded(dataURL) {


    // Save the data URL to localStorage with a specific key
    localStorage.setItem('myCustomTwitterIcon', dataURL);
    // console.log('myCustomTwitterIcon - done');
    changeIconFn();



  }


  // Function to handle the image drop event
  function handleDrop(event) {
    if (!event) return;

    if (!(event.target instanceof HTMLElement)) return;

    event.preventDefault();
    // Check if the target element is the desired anchor with href="/home"
    const targetElement = event.target.closest('a[href][my-custom-icon]');
    if (!targetElement) return;

    // Get the dropped file (assuming only one file is dropped)
    const file = event.dataTransfer.files[0];

    // Check if the dropped file is an image
    if (!file || !file.type.startsWith('image/')) return;

    linkCache.clear();

    // Read the image file and convert to base64 data URL
    let reader = new FileReader();
    reader.onload = function () {
      Promise.resolve(reader.result).then(onImageLoaded);
      reader = null;
    };
    reader.readAsDataURL(file);
  }

  // Function to handle the dragover event and allow dropping
  function handleDragOver(event) {
    event.preventDefault();
  }


  if (localStorage.getItem('myCustomTwitterIcon')) {

    changeIconFn();
  }

  let observer = null;

  // Function to check if the target element is available and hook the drag and drop functionality
  function hookDragAndDrop() {
    const targetElement = document.querySelector('a[href="/home"][aria-label="Twitter"], a[href="/home"][aria-label="X"]');
    if (targetElement && observer) {
      targetElement.setAttribute('my-custom-icon', '');
      targetElement.addEventListener('dragover', handleDragOver);
      targetElement.addEventListener('drop', handleDrop);
      // console.log('Drag and drop functionality hooked.');

      document.head.appendChild(document.createElement('style')).textContent = `
           a[href="/home"][aria-label="Twitter"][my-custom-icon] *,
           a[href="/home"][aria-label="X"][my-custom-icon] * {
                pointer-events: none;
           }
     `;


      observer.takeRecords();
      // Stop and disconnect the observer since the targetElement is found
      observer.disconnect();
      observer = null;

      if (localStorage.getItem('myCustomTwitterIcon')) {

        changeIconFn();
      }


    }
  }

  // Use MutationObserver to observe changes in the document
  observer = new MutationObserver(function (mutationsList, observer) {
    let p = false;
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' || mutation.type === 'subtree') {
        p = true;

      }
    }
    if (p) hookDragAndDrop();
  });

  // Start observing the entire document
  observer.observe(document, { childList: true, subtree: true });

  document.addEventListener('change-my-twitter-icon', () => {
    changeIconFn();
  }, true);

})();