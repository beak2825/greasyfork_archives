// ==UserScript==
// @namespace    http://Vebascans.net/
// @version      2.3.3
// @license      MIT
// @name         Custom Background Manager
// @name:es      Administrador de Fondos
// @name:zh      自定义背景管理器
// @name:hi      कस्टम बैकग्राउंड प्रबंधक
// @name:ar      مدير الخلفية المخصص
// @name:pt      Gerenciador de Plano de Fundo Personalizado
// @name:ru      Менеджер пользовательского фона
// @name:ja      カスタム背景マネージャー
// @name:de      Benutzerdefinierter Hintergrund-Manager
// @name:fr      Gestionnaire de Fond d'Écran Personnalisé
// @name:it      Gestore di Sfondo Personalizzato
// @name:ko      사용자 지정 배경 관리자
// @name:tr      Özel Arka Plan Yöneticisi
// @name:vi      Trình Quản Lý Nền Tùy Chỉnh
// @name:id      Pengelola Latar Belakang Kustom
// @name:bn      কাস্টম ব্যাকগ্রাউন্ড ম্যানেজার
// @name:pa      ਕਸਟਮ ਬੈਕਗ੍ਰਾਊਂਡ ਮੈਨੇਜਰ
// @name:ur      حسب ضرورت پس منظر مینیجر
// @name:ta      தனிப்பயன் பின்னணி மேலாளர்
// @name:fa      مدیر پس‌زمینه سفارشی
// @description:en      Change background for websites [priority: manga-manhwa sites]
// @description:es      Cambiar el fondo de los sitios web [prioridad: sitios de manga-manhwa]
// @description:zh      更改网站背景 [优先：漫画-漫画网站]
// @description:hi      वेबसाइटों के लिए पृष्ठभूमि बदलें [प्राथमिकता: मांगा-मनह्वा साइटें]
// @description:ar      تغيير الخلفية لمواقع الويب [الأولوية: مواقع المانجا-مانهوا]
// @description:pt      Alterar o plano de fundo dos sites [prioridade: sites de manga-manhwa]
// @description:ru      Изменение фона для веб-сайтов [приоритет: сайты манги-манхвы]
// @description:ja      ウェブサイトの背景を変更 [優先: マンガ・マンファサイト]
// @description:de      Hintergrund für Websites ändern [Priorität: Manga-Manhwa-Seiten]
// @description:fr      Modifier l'arrière-plan des sites Web [priorité : sites de manga-manhwa]
// @description:it      Cambia lo sfondo dei siti web [priorità: siti di manga-manhwa]
// @description:ko      웹사이트 배경 변경 [우선 순위: 만화-만화 사이트]
// @description:tr      Web siteleri için arka plan değiştirme [öncelik: manga-manhwa siteleri]
// @description:vi      Thay đổi nền trang web [ưu tiên: trang manga-manhwa]
// @description:id      Mengubah latar belakang situs web [prioritas: situs manga-manhwa]
// @description:bn      ওয়েবসাইটের জন্য ব্যাকগ্রাউন্ড পরিবর্তন করুন [অগ্রাধিকার: মাঙ্গা-মানহওয়া সাইট]
// @description:pa      ਵੈੱਬਸਾਈਟਾਂ ਲਈ ਪਿਛੋਕੜ ਬਦਲੋ [ਤਰਜੀਹ: ਮੰਗਾ-ਮਾਨ੍ਹਵਾ ਸਾਈਟਾਂ]
// @description:ur      ویب سائٹس کے لیے پس منظر تبدیل کریں [ترجیح: مانگا-مانہوا سائٹس]
// @description:ta      இணையதளங்களுக்கு பின்னணியை மாற்றவும் [முன்னுரிமை: மங்கா-மன்வா தளங்கள்]
// @description:fa      تغییر پس‌زمینه برای وب‌سایت‌ها [اولویت: سایت‌های مانگا-مانهوا]
// @author       www.vebascans.net
// @match        https://*/*
// @grant        none
// @icon         https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhi0QDJZNeXWcaD9lXWMN2yenYt5XGrqfPavkCFpWLe01CpSEsMn7IGpbOLqxEfjx4QUUi4wgTw0Kc7vP7FrKjPKpcaaCu1N6QRJzlZvS_Wwr2r3kA4l0-E5wl7xObsZchd8YNSxySFZATPAr2bnrkANBUrmy8Rpdexe-mxG8N6QDojEj0onaNNXF_6g-s/w200/logo.png
// @description Web siteleri için arka plan değiştirme [öncelikli manga-manhwa siteleri]
// @downloadURL https://update.greasyfork.org/scripts/525109/Custom%20Background%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/525109/Custom%20Background%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1) SweetAlert2 kütüphanesini otomatik yükle:
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    script.onload = main; // Kütüphane yüklendikten sonra main() fonksiyonunu çalıştır
    document.head.appendChild(script);

    // 2) Tüm kodu main() içine alıyoruz:
    function main() {

        /**************************************************************************
         *  SweetAlert Tanımlaması
         **************************************************************************/
        const Toast = Swal.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });

        /**************************************************************************
         *  0) Sabitler
         **************************************************************************/
        const ACTIVE_KEY   = 'VebaScans.net_custom_wp_active';   // Son seçilen veri (URL/Color)
        const HISTORY_KEY  = 'VebaScans.net_custom_wp_history';  // Tüm geçmiş
        const SETTINGS_KEY = 'vebascans.net_custom_wp_settings'; // Arka plan ayarları

        /**************************************************************************
         *  1) Local Storage Yardımcı Fonksiyonları
         **************************************************************************/
        function getActiveData() {
            try {
                const str = localStorage.getItem(ACTIVE_KEY);
                return str ? JSON.parse(str) : null;
            } catch (e) {
                return null;
            }
        }

        function setActiveData(obj) {
            localStorage.setItem(ACTIVE_KEY, JSON.stringify(obj));
            applyActiveDataToBody(); // Aktif veri her değiştiğinde body'yi güncelle
        }

        function removeActiveData() {
            localStorage.removeItem(ACTIVE_KEY);
            applyActiveDataToBody();
        }

        function getHistoryData() {
            try {
                const str = localStorage.getItem(HISTORY_KEY);
                return str ? JSON.parse(str) : [];
            } catch (e) {
                return [];
            }
        }

        function addToHistory(obj) {
            let history = getHistoryData();

            // 1) Eğer geçmişte aynı öğe zaten varsa ekleme yapma
            const exists = history.some(item => item.type === obj.type && item.value === obj.value);
            if (exists) return; // Aynısı varsa, ekleme yapmadan çık

            // 2) Yeni öğeyi ekle
            history.push(obj);

            // 3) Aynı öğelerin tekrarını önlemek için filtrele (sadece bir tane kalacak)
            history = history.filter((item, index, self) =>
                index === self.findIndex(t => t.type === item.type && t.value === item.value)
            );

            // 4) Güncellenmiş geçmişi kaydet
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        }

        // Geçmişten silme
        function removeFromHistory(obj) {
            let history = getHistoryData();
            history = history.filter(x => !(x.type === obj.type && x.value === obj.value));
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        }

        // Ayarlar
        function getSettings() {
            try {
                const str = localStorage.getItem(SETTINGS_KEY);
                return str ? JSON.parse(str) : {};
            } catch (e) {
                return {};
            }
        }

        function setSettings(newSettings) {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
        }

        /**************************************************************************
         *  2) BODY Arkaplanını Aktif Veriye (URL/Color) ve Ayarlara Göre Uygulama
         **************************************************************************/
        function applyActiveDataToBody() {
            const activeData = getActiveData();
            const settings = getSettings();
            // Arkaplan tekrar ayarı (varsayılan = 'no-repeat')
            const bgRepeat = settings.bgRepeat || 'no-repeat';
            // Arkaplan sabit ayarı (varsayılan = 'scroll')
            const bgAttachment = settings.bgAttachment || 'scroll';

            if (!activeData) {
                // Aktif bir şey yoksa varsayılan temize çek
                document.body.style.backgroundImage = '';
                document.body.style.backgroundColor = '';
                document.body.style.backgroundRepeat = '';
                document.body.style.backgroundAttachment = '';
                return;
            }

            if (activeData.type === 'url') {
                // Body için arkaplan resmi
                document.body.style.backgroundImage = `url(${activeData.value})`;
                document.body.style.backgroundRepeat = bgRepeat;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundAttachment = bgAttachment;
                document.body.style.backgroundColor = '';

                // .body-wrap için
                try {
                    const bodyWrap = document.querySelector('body.text-ui-light .body-wrap');
                    bodyWrap.style.backgroundImage = `url(${activeData.value})`;
                    bodyWrap.style.backgroundRepeat = bgRepeat;
                    bodyWrap.style.backgroundSize = 'cover';
                    bodyWrap.style.backgroundAttachment = bgAttachment;
                    bodyWrap.style.backgroundColor = '';
                } catch (error) { /* .body-wrap yoksa hata görmezden gel */ }

                // .site-content için
                try {
                    const sitecontent = document.querySelector('.site-content');
                    sitecontent.style.backgroundImage = `url(${activeData.value})`;
                    sitecontent.style.backgroundRepeat = bgRepeat;
                    sitecontent.style.backgroundSize = 'cover';
                    sitecontent.style.backgroundAttachment = bgAttachment;
                    sitecontent.style.backgroundColor = '';
                } catch (error) { /* .site-content yoksa hata görmezden gel */ }

                // .mainholder için
                try {
                    const mainholder = document.querySelector('.mainholder');
                    mainholder.style.backgroundImage = `url(${activeData.value})`;
                    mainholder.style.backgroundRepeat = bgRepeat;
                    mainholder.style.backgroundSize = 'cover';
                    mainholder.style.backgroundAttachment = bgAttachment;
                    mainholder.style.backgroundColor = '';
                } catch (error) { /* .mainholder yoksa hata görmezden gel */ }

            } else if (activeData.type === 'color') {
                // Body için arkaplan rengi
                document.body.style.backgroundImage = 'none';
                document.body.style.backgroundColor = activeData.value;
                document.body.style.backgroundRepeat = bgRepeat;
                document.body.style.backgroundAttachment = bgAttachment;

                // .body-wrap için
                try {
                    const bodyWrap = document.querySelector('body.text-ui-light .body-wrap');
                    bodyWrap.style.backgroundImage = 'none';
                    bodyWrap.style.backgroundColor = activeData.value;
                    bodyWrap.style.backgroundRepeat = bgRepeat;
                    bodyWrap.style.backgroundAttachment = bgAttachment;
                } catch (error) { /* .body-wrap yoksa hata görmezden gel */ }

                // .site-content için
                try {
                    const sitecontent = document.querySelector('.site-content');
                    sitecontent.style.backgroundImage = 'none';
                    sitecontent.style.backgroundColor = activeData.value;
                    sitecontent.style.backgroundRepeat = bgRepeat;
                    sitecontent.style.backgroundAttachment = bgAttachment;
                } catch (error) { /* .site-content yoksa hata görmezden gel */ }

                // .mainholder için
                try {
                    const mainholder = document.querySelector('.mainholder');
                    mainholder.style.backgroundImage = 'none';
                    mainholder.style.backgroundColor = activeData.value;
                    mainholder.style.backgroundRepeat = bgRepeat;
                    mainholder.style.backgroundAttachment = bgAttachment;
                } catch (error) { /* .mainholder yoksa hata görmezden gel */ }
            }
        }
        /**************************************************************************
         *  3) MODAL Arayüzü Oluşturma
         **************************************************************************/
        let modalOverlay, modalContent;

        window.addEventListener('load', () => {
            createModal();
            createToggleShortcut(); // F7 ile aç/kapa
            applyActiveDataToBody(); // Sayfa açıldığında kaydedilmiş aktif veriyi uygula
        });

        // F7 ile modal aç/kapa
        function createToggleShortcut() {
            window.addEventListener('keydown', (e) => {
                if (e.altKey && (e.key === 'v' || e.key === 'V')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    toggleModal();
                }
            }, { capture: true });
        }

        function toggleModal(forceOpen) {
            const isHidden = (modalOverlay.style.display === 'none');
            if (forceOpen === true) {
                showModal();
            } else if (forceOpen === false) {
                hideModal();
            } else {
                if (isHidden) showModal(); else hideModal();
            }
        }

        function showModal() {
            modalOverlay.style.display = 'block';
            refreshHistoryList();
            refreshActiveLabel();
            refreshSettingsUI();
            applyModalTheme(); // Tema ayarını modal açıldığında uygula
        }

        function hideModal() {
            modalOverlay.style.display = 'none';
        }

        function createModal() {
            // (1) Overlay
            modalOverlay = document.createElement('div');
            Object.assign(modalOverlay.style, {
                display: 'none',
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: '99999',
                color: '#000'
            });
            document.body.appendChild(modalOverlay);

            // (2) İçerik
            modalContent = document.createElement('div');
            Object.assign(modalContent.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                backgroundColor: '#fff',
                padding: '20px',
                borderTopLeftRadius: '15px',
                borderBottomRightRadius: '15px',
                border: '3px solid black',
                minHeight: '450px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                fontWeight: 'normal',
                color: '#000',
            });
            modalOverlay.appendChild(modalContent);

            // (3) Logo
            const img = document.createElement('img');
            img.src = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhi0QDJZNeXWcaD9lXWMN2yenYt5XGrqfPavkCFpWLe01CpSEsMn7IGpbOLqxEfjx4QUUi4wgTw0Kc7vP7FrKjPKpcaaCu1N6QRJzlZvS_Wwr2r3kA4l0-E5wl7xObsZchd8YNSxySFZATPAr2bnrkANBUrmy8Rpdexe-mxG8N6QDojEj0onaNNXF_6g-s/w800/logo.png';
            img.alt = 'Logo';
            Object.assign(img.style, {
                width: '130px',
                position: 'absolute',
                top: '0',
                right: '50%',
                transform: 'translate(50%, -50%)'
            });
            modalContent.appendChild(img);

            // (4) Başlık
            const header = document.createElement('h3');
            header.innerHTML = '<a href="https://www.vebascans.net/" style="color: #b83eae;font-weight: 500;text-decoration: none;font-family: fantasy;text-shadow: 0 0 3px #b83eae;letter-spacing: 1px;">Vebascans</a> - Custom Background';
            header.style.margin = '0 0 10px 0';
            header.style.color = 'black';
            header.style.marginTop = '45px';
            modalContent.appendChild(header);

            // (5) Kapat butonu
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" fill-rule="evenodd">
                        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/>
                        <path fill="currentColor" d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"/>
                    </g>
                </svg>`;
            Object.assign(closeBtn.style, {
                position: 'absolute',
                top: '10px',
                right: '10px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'black'
            });
            closeBtn.onclick = () => hideModal();
            modalContent.appendChild(closeBtn);

            // (6) Seçim Menüsü (URL mi Renk mi)
            const selectDiv = document.createElement('div');
            Object.assign(selectDiv.style, {
                display: 'flex',
                flexDirection: 'row',
                gap: '5px',
                marginBottom: '10px'
            });
            modalContent.appendChild(selectDiv);

            const selectLabel = document.createElement('label');
            selectLabel.textContent = 'Seçim: ';
            selectLabel.style.display = 'flex';
            selectLabel.style.alignItems = 'center';
            selectDiv.appendChild(selectLabel);

            const selectInput = document.createElement('select');
            selectInput.id = 'typeSelect';
            selectInput.style.background ='white';
            selectInput.style.border ='2px solid black';
            selectInput.style.borderRadius  ='3px';
            selectInput.style.color = 'black';
            const optUrl   = new Option('URL', 'url');
            const optColor = new Option('Renk', 'color');
            selectInput.add(optUrl);
            selectInput.add(optColor);
            selectDiv.appendChild(selectInput);

            // (7) URL input
            const urlInput = document.createElement('input');
            urlInput.type = 'text';
            urlInput.id = 'urlInput';
            urlInput.placeholder = 'Görsel URL giriniz...';
            urlInput.style.background ='transparent';
            urlInput.style.border ='2px solid black';
            urlInput.style.borderRadius  ='3px';
            selectDiv.appendChild(urlInput);

            // (8) Color input
            const colorInput = document.createElement('input');
            colorInput.type = 'color';
            colorInput.id = 'colorInput';
            colorInput.value = '#000000';
            colorInput.style.width = '50px';
            colorInput.style.height = '30px';
            colorInput.style.display = 'none';
            selectDiv.appendChild(colorInput);

            // Seçim değişince hangi input görünsün?
            selectInput.addEventListener('change', () => {
                if (selectInput.value === 'url') {
                    urlInput.style.display   = 'inline-block';
                    colorInput.style.display = 'none';
                } else {
                    urlInput.style.display   = 'none';
                    colorInput.style.display = 'inline-block';
                }
            });

            // (9) Aktar butonu
            const aktarBtn = document.createElement('button');
            aktarBtn.textContent = 'Aktar';
            aktarBtn.style.marginLeft = '5px';
            aktarBtn.style.padding = '5px 10px';
            aktarBtn.style.cursor = 'pointer';
            aktarBtn.style.color = 'black';
            aktarBtn.style.border ='2px solid black';
            aktarBtn.style.borderRadius  ='3px';
            aktarBtn.style.background = 'transparent';
            selectDiv.appendChild(aktarBtn);

            aktarBtn.onclick = () => {
                const currentType = selectInput.value; // 'url' | 'color'
                let currentValue = '';
                if (currentType === 'url') {
                    currentValue = urlInput.value.trim();
                    if (!currentValue) {
                        Toast.fire({ icon: 'error', title: 'Lütfen bir URL girin.' });
                        return;
                    }
                } else {
                    currentValue = colorInput.value; // #rrggbb
                    if (!currentValue) {
                        Toast.fire({ icon: 'error', title: 'Lütfen bir renk seçin.' });
                        return;
                    }
                }

                // Yeni aktif obje
                const newActiveObj = { type: currentType, value: currentValue };
                setActiveData(newActiveObj);
                addToHistory(newActiveObj);

                refreshHistoryList();
                refreshActiveLabel();

                // URL tipini kullandıysa inputu temizleyelim
                if (currentType === 'url') {
                    urlInput.value = '';
                }
                Toast.fire({ icon: 'success', title: 'Yeni aktif değer atandı ve body arkaplanı güncellendi!' });
            };

            // (10) Tekrar / Tek Sefer AYARI
            const repeatDiv = document.createElement('div');
            repeatDiv.style.margin = '10px 0';
            repeatDiv.style.display = 'flex';
            repeatDiv.style.flexDirection = 'row';
            repeatDiv.style.gap = '10px';
            modalContent.appendChild(repeatDiv);

            const repeatLabel = document.createElement('span');
            repeatLabel.textContent = 'Arkaplan Tekrarı:';
            repeatLabel.style.alignSelf = 'center';
            repeatDiv.appendChild(repeatLabel);

            const labelRepeat = document.createElement('label');
            const radioRepeat = document.createElement('input');
            radioRepeat.type = 'radio';
            radioRepeat.name = 'bgRepeat';
            radioRepeat.value = 'repeat';
            radioRepeat.style.marginRight = '5px';
            labelRepeat.appendChild(radioRepeat);
            labelRepeat.appendChild(document.createTextNode('Tekrarlı'));
            repeatDiv.appendChild(labelRepeat);

            const labelNoRepeat = document.createElement('label');
            const radioNoRepeat = document.createElement('input');
            radioNoRepeat.type = 'radio';
            radioNoRepeat.name = 'bgRepeat';
            radioNoRepeat.value = 'no-repeat';
            radioNoRepeat.style.marginRight = '5px';
            labelNoRepeat.appendChild(radioNoRepeat);
            labelNoRepeat.appendChild(document.createTextNode('Tek Sefer'));
            repeatDiv.appendChild(labelNoRepeat);

            [radioRepeat, radioNoRepeat].forEach(radio => {
                radio.addEventListener('change', () => {
                    const newVal = radio.value; // 'repeat' | 'no-repeat'
                    const s = getSettings();
                    s.bgRepeat = newVal;
                    setSettings(s);
                    applyActiveDataToBody();
                });
            });

            // (10b) Arkaplan Sabit AYARI
            const attachDiv = document.createElement('div');
            attachDiv.style.margin = '10px 0';
            attachDiv.style.display = 'flex';
            attachDiv.style.flexDirection = 'row';
            attachDiv.style.gap = '10px';
            modalContent.appendChild(attachDiv);

            const attachLabel = document.createElement('span');
            attachLabel.textContent = 'Arkaplan Sabitliği:';
            attachLabel.style.alignSelf = 'center';
            attachDiv.appendChild(attachLabel);

            const labelFixed = document.createElement('label');
            const radioFixed = document.createElement('input');
            radioFixed.type = 'radio';
            radioFixed.name = 'bgAttach';
            radioFixed.value = 'fixed';
            radioFixed.style.marginRight = '5px';
            labelFixed.appendChild(radioFixed);
            labelFixed.appendChild(document.createTextNode('Sabit (Fixed)'));
            attachDiv.appendChild(labelFixed);

            const labelScroll = document.createElement('label');
            const radioScroll = document.createElement('input');
            radioScroll.type = 'radio';
            radioScroll.name = 'bgAttach';
            radioScroll.value = 'scroll';
            radioScroll.style.marginRight = '5px';
            labelScroll.appendChild(radioScroll);
            labelScroll.appendChild(document.createTextNode('Kaydır (Scroll)'));
            attachDiv.appendChild(labelScroll);

            [radioFixed, radioScroll].forEach(radio => {
                radio.addEventListener('change', () => {
                    const newVal = radio.value; // 'fixed' | 'scroll'
                    const s = getSettings();
                    s.bgAttachment = newVal;
                    setSettings(s);
                    applyActiveDataToBody();
                });
            });

            // (11) Aktif Veriyi Sil
            const removeActiveBtn = document.createElement('button');
            removeActiveBtn.textContent = 'Devre dışı bırak';
            removeActiveBtn.style.marginBottom = '10px';
            removeActiveBtn.style.padding = '5px 10px';
            removeActiveBtn.style.cursor = 'pointer';
            removeActiveBtn.style.color = 'black';
            removeActiveBtn.style.background = 'transparent';
            removeActiveBtn.style.border ='2px solid black';
            removeActiveBtn.style.borderRadius  ='3px';
            modalContent.appendChild(removeActiveBtn);

            removeActiveBtn.onclick = () => {
                removeActiveData();
                refreshHistoryList();
                refreshActiveLabel();
                Toast.fire({ icon: 'info', title: 'Aktif veri silindi. Arkaplan temizlendi.' });
            };

            // (12) Şu anda aktif veriyi gösteren label
            const activeDiv = document.createElement('div');
            activeDiv.id = 'activeDiv';
            activeDiv.style.marginTop = '10px';
            modalContent.appendChild(activeDiv);

            // (13) Geçmiş Başlık
            const historyTitle = document.createElement('h4');
            historyTitle.textContent = 'Geçmiş';
            historyTitle.style.margin = '10px 0 5px 0';
            modalContent.appendChild(historyTitle);

            // (14) Geçmiş Container
            const historyContainer = document.createElement('div');
            historyContainer.id = 'historyContainer';
            historyContainer.style.maxHeight = '200px';
            historyContainer.style.overflowY = 'auto';
            historyContainer.style.border = '1px solid #ccc';
            historyContainer.style.padding = '5px';
            modalContent.appendChild(historyContainer);

            // Yedekleme (Dışa/İçe Aktar)
            const importExportTitle = document.createElement('h4');
            importExportTitle.textContent = 'Yedekleme';
            importExportTitle.style.margin = '10px 0 5px 0';
            modalContent.appendChild(importExportTitle);

            const exportBtn = document.createElement('button');
            exportBtn.textContent = 'Dışa Aktar (JSON)';
            exportBtn.style.padding = '5px 10px';
            exportBtn.style.cursor = 'pointer';
            exportBtn.style.color = 'black';
            exportBtn.style.background = 'transparent';
            exportBtn.style.border = '2px solid black';
            exportBtn.style.borderRadius = '3px';
            exportBtn.style.marginRight = '10px';
            modalContent.appendChild(exportBtn);

            exportBtn.onclick = () => {
                exportDataAsJson();
            };

            const importBtn = document.createElement('button');
            importBtn.textContent = 'İçe Aktar (JSON)';
            importBtn.style.padding = '5px 10px';
            importBtn.style.cursor = 'pointer';
            importBtn.style.color = 'black';
            importBtn.style.background = 'transparent';
            importBtn.style.border = '2px solid black';
            importBtn.style.borderRadius = '3px';
            modalContent.appendChild(importBtn);

            const importInput = document.createElement('input');
            importInput.type = 'file';
            importInput.accept = 'application/json';
            importInput.style.display = 'none';
            modalContent.appendChild(importInput);

            importBtn.addEventListener('click', () => {
                importInput.click(); // Dosya seçme penceresini aç
            });

            importInput.addEventListener('change', () => {
                if (importInput.files && importInput.files[0]) {
                    importDataFromJson(importInput.files[0]);
                }
            });

            /**************************************************************************
             *  _Eklenen Kod Başlangıcı_ (Tema Ayarı)
             **************************************************************************/
            // Tema AYARI için radyo seçenekleri
            const themeDiv = document.createElement('div');
            themeDiv.style.marginTop = '15px';
            themeDiv.style.display = 'flex';
            themeDiv.style.flexDirection = 'row';
            themeDiv.style.gap = '10px';
            modalContent.appendChild(themeDiv);

            const themeLabel = document.createElement('span');
            themeLabel.textContent = 'Modal Tema:';
            themeLabel.style.alignSelf = 'center';
            themeDiv.appendChild(themeLabel);

            const labelLight = document.createElement('label');
            const radioLight = document.createElement('input');
            radioLight.type = 'radio';
            radioLight.name = 'modalTheme';
            radioLight.value = 'light';
            radioLight.style.marginRight = '5px';
            labelLight.appendChild(radioLight);
            labelLight.appendChild(document.createTextNode('Aydınlık'));
            themeDiv.appendChild(labelLight);

            const labelDark = document.createElement('label');
            const radioDark = document.createElement('input');
            radioDark.type = 'radio';
            radioDark.name = 'modalTheme';
            radioDark.value = 'dark';
            radioDark.style.marginRight = '5px';
            labelDark.appendChild(radioDark);
            labelDark.appendChild(document.createTextNode('Karanlık'));
            themeDiv.appendChild(labelDark);

            // Radyo değişimiyle tema ayarını kaydetme
            [radioLight, radioDark].forEach(radio => {
                radio.addEventListener('change', () => {
                    const newVal = radio.value; // 'light' | 'dark'
                    const s = getSettings();
                    s.theme = newVal;
                    setSettings(s);
                    applyModalTheme(); // Tema uygulansın
                });
            });

            const support = document.createElement('div');
support.innerHTML = `
  <h3 style="color: black; margin: 4px 0;">Destek;</h3>
  <a href="https://www.vebascans.net/discord" style="color: black;align-items: center; display: flex; text-decoration: none;">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g fill="currentColor" fill-opacity="0">
        <circle cx="9" cy="12" r="1.5">
          <animate fill="freeze" attributeName="fill-opacity" begin="1.3s" dur="0.15s" values="0;1"/>
        </circle>
        <circle cx="15" cy="12" r="1.5">
          <animate fill="freeze" attributeName="fill-opacity" begin="1.45s" dur="0.15s" values="0;1"/>
        </circle>
        <path d="M5 5l7 0.2l7 -0.2l3 10l-3 3.4h-14l-3.5 -3.4l3.5 -10Z">
          <animate fill="freeze" attributeName="fill-opacity" begin="1.7s" dur="0.15s" values="0;0.3"/>
        </path>
      </g>
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path stroke-dasharray="32" stroke-dashoffset="32" d="M12 6h2l1 -2c0 0 2.5 0.5 4 1.5c3.53 2.35 3 9.5 3 10.5c-1.33 2.17 -5.5 3.5 -5.5 3.5l-1 -2M12 6h-2l-0.97 -2c0 0 -2.5 0.5 -4 1.5c-3.53 2.35 -3 9.5 -3 10.5c1.33 2.17 5.5 3.5 5.5 3.5l1 -2">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.7s" values="32;0"/>
        </path>
        <path stroke-dasharray="16" stroke-dashoffset="16" d="M5.5 16c5 2.5 8 2.5 13 0">
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.4s" values="16;0"/>
        </path>
      </g>
    </svg>
  </a>`;
            support.style.marginTop = '15px';
            support.style.display = 'flex';
            support.style.flexDirection = 'row';
            support.style.gap = '10px';
            modalContent.appendChild(support);
        }

        /**************************************************************************
         *  4) Geçmiş & Aktif Listeyi Güncelleme
         **************************************************************************/
        function refreshHistoryList() {
            const historyContainer = document.getElementById('historyContainer');
            if (!historyContainer) return;

            historyContainer.innerHTML = '';

            const historyData = getHistoryData();
            const activeData  = getActiveData(); // {type:'...', value:'...'}

            historyData.forEach((item) => {
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.alignItems = 'center';
                row.style.marginBottom = '8px';
                row.style.cursor = 'pointer';
                row.style.justifyContent = 'space-between';

                const leftPart = document.createElement('div');
                leftPart.style.display = 'flex';
                leftPart.style.alignItems = 'center';
                leftPart.style.gap = '8px';

                // URL ise küçük görsel
                if (item.type === 'url') {
                    const imgThumb = document.createElement('img');
                    imgThumb.src = item.value;
                    imgThumb.alt = 'Görsel';
                    imgThumb.style.width = '30px';
                    imgThumb.style.height = '30px';
                    imgThumb.style.objectFit = 'cover';
                    leftPart.appendChild(imgThumb);

                    const label = document.createElement('span');
                    label.textContent = 'URL';
                    leftPart.appendChild(label);

                } else if (item.type === 'color') {
                    // Renk ise kutu
                    const colorBox = document.createElement('span');
                    colorBox.style.display = 'inline-block';
                    colorBox.style.width = '30px';
                    colorBox.style.height = '30px';
                    colorBox.style.backgroundColor = item.value;
                    colorBox.style.border = '1px solid #000';
                    leftPart.appendChild(colorBox);

                    const label = document.createElement('span');
                    label.textContent = item.value;
                    leftPart.appendChild(label);
                }

                // Aktif mi?
                if (activeData && activeData.type === item.type && activeData.value === item.value) {
                    const activeSpan = document.createElement('span');
                    activeSpan.textContent = ' (Aktif)';
                    activeSpan.style.color = 'green';
                    leftPart.appendChild(activeSpan);
                }

                // Tıklayınca bu itemi aktif yap
                leftPart.addEventListener('click', () => {
                    setActiveData(item);
                    refreshHistoryList();
                    refreshActiveLabel();
                    Toast.fire({ icon: 'success', title: 'Aktif değer güncellendi!' });
                });

                // Sağ kısma "Geçmişten Sil" butonu
                const rightPart = document.createElement('button');
                rightPart.innerHTML  = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m20 9l-1.995 11.346A2 2 0 0 1 16.035 22h-8.07a2 2 0 0 1-1.97-1.654L4 9m17-3h-5.625M3 6h5.625m0 0V4a2 2 0 0 1 2-2h2.75a2 2 0 0 1 2 2v2m-6.75 0h6.75"/></svg>';
                rightPart.style.border ='2px solid black';
                rightPart.style.color= 'black'
                rightPart.style.borderRadius  ='3px';
                rightPart.style.background = 'transparent';
                rightPart.style.padding = '3px 5px';
                rightPart.style.cursor = 'pointer';

                rightPart.addEventListener('click', (e) => {
                    e.stopPropagation(); // Aktif yapma tıklamasını engelle

                    // Aktif veriyi al
                    const activeData = getActiveData();

                    // Eğer silinmek istenen veri aktif veriyle eşleşiyorsa, işlemi durdur
                    if (activeData && activeData.type === item.type && activeData.value === item.value) {
                        Toast.fire({ icon: 'warning', title: 'Aktif olan bir veriyi silemezsiniz!' });
                        return; // İşlemi durdur
                    }

                    // Eğer aktif veri değilse, geçmişten sil
                    removeFromHistory(item);
                    refreshHistoryList();
                    Toast.fire({ icon: 'info', title: 'Geçmişten silindi.' });
                });

                row.appendChild(leftPart);
                row.appendChild(rightPart);
                historyContainer.appendChild(row);
            });
        }

        function refreshActiveLabel() {
            const activeDiv = document.getElementById('activeDiv');
            if (!activeDiv) return;

            const activeData = getActiveData();
            if (!activeData) {
                activeDiv.textContent = 'Şu anda aktif bir değer yok.';
            } else {
                if (activeData.type === 'url') {
                    activeDiv.innerHTML = `
                        Aktif: URL →
                        <img src="${activeData.value}"
                            alt="Aktif Görsel"
                            style="width: 100px; height: auto; object-fit: cover; margin-left:5px;"/>
                    `;
                } else {
                    activeDiv.innerHTML = `
                        Aktif: Renk →
                        <span style="display:inline-block; width:20px; height:20px;
                                    background-color:${activeData.value};
                                    border:1px solid #000; vertical-align:middle;">
                        </span>
                        ${activeData.value}
                    `;
                }
            }
        }

        /**************************************************************************
         *  5) Arkaplan Ayarı (Tekrar / Tek Sefer / Sabit) Radyo Butonlarını Güncelleme
         **************************************************************************/
        function refreshSettingsUI() {
            const settings = getSettings();
            const bgRepeat = settings.bgRepeat || 'no-repeat'; // Varsayılan no-repeat
            const bgAttach = settings.bgAttachment || 'scroll'; // Varsayılan scroll

            // Tekrar radyo
            const radiosRepeat = document.getElementsByName('bgRepeat');
            radiosRepeat.forEach(radio => {
                radio.checked = (radio.value === bgRepeat);
            });

            // Sabit/Kaydır radyo
            const radiosAttach = document.getElementsByName('bgAttach');
            radiosAttach.forEach(radio => {
                radio.checked = (radio.value === bgAttach);
            });

            // _Eklenen Kod: Modal Tema radyo
            const theme = settings.theme || 'light'; // Varsayılan 'light'
            const radiosTheme = document.getElementsByName('modalTheme');
            radiosTheme.forEach(radio => {
                radio.checked = (radio.value === theme);
            });
        }

        // Tema uygulama fonksiyonu
function applyModalTheme() {
    const settings = getSettings();
    const theme = settings.theme || 'light';

    if (theme === 'dark') {
        // Modal ana gövde
        modalContent.style.backgroundColor = '#070707';
        modalContent.style.color = 'white';
        modalContent.style.border = '2px solid white';

        // Tüm alt öğeleri tarayalım:
        const allElements = modalContent.querySelectorAll('*');
        allElements.forEach(el => {
            // Eğer siyah sınır varsa beyaza çevir
            if (el.style.border === '2px solid black') {
                el.style.border = '2px solid white';
            }
            // Yazı rengi siyahsa beyaza çevir
            if (el.style.color === 'black') {
                el.style.color = 'white';
            }
            // Arka plan beyaz veya 'transparent' ise #070707 yap
            const bg = el.style.backgroundColor || el.style.background;
            if (bg === 'white' || bg === 'transparent') {
                el.style.backgroundColor = '#070707';
            }
        });

    } else {
        // Light (aydınlık) tema için varsayılanlar
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.color = 'black';
        modalContent.style.border = '2px solid black';

        // Tekrar tüm alt öğeleri dolaşıp varsayılan değerlere çekebilirsiniz
        const allElements = modalContent.querySelectorAll('*');
        allElements.forEach(el => {
            // Siyah kenarlık
            if (el.style.border === '2px solid white') {
                el.style.border = '2px solid black';
            }
            // Yazı rengi beyaz ise siyaha çevir
            if (el.style.color === 'white') {
                el.style.color = 'black';
            }
            // Arka plan koyu ise beyaza veya transparent’e döndürebilirsiniz
            const bg = el.style.backgroundColor || el.style.background;
            if (bg === 'rgb(7, 7, 7)' || bg === '#070707') {
                el.style.backgroundColor = 'white';
            }
        });
    }
}

        // Dışa Aktar (JSON olarak)
        function exportDataAsJson() {
            // Tek bir obje içine aktif, geçmiş ve ayarları al
            const data = {
                active: getActiveData(),
                history: getHistoryData(),
                settings: getSettings()
            };
            const jsonStr = JSON.stringify(data, null, 2);

            // Dosya oluşturup otomatik indirme linki
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Vebascans_CustomBackground.json';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            Toast.fire({ icon: 'success', title: 'Veriler JSON formatında indirildi!' });
        }

        // İçe Aktar (JSON dosyasından)
        function importDataFromJson(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);

                    // Dosyada hangi veriler varsa alıp localStorage'a yazalım
                    if (imported.active) {
                        localStorage.setItem(ACTIVE_KEY, JSON.stringify(imported.active));
                    }
                    if (imported.history) {
                        localStorage.setItem(HISTORY_KEY, JSON.stringify(imported.history));
                    }
                    if (imported.settings) {
                        localStorage.setItem(SETTINGS_KEY, JSON.stringify(imported.settings));
                    }

                    // Yeniden uygula ve arayüzü tazele
                    applyActiveDataToBody();
                    refreshHistoryList();
                    refreshActiveLabel();
                    refreshSettingsUI();
                    applyModalTheme();

                    Toast.fire({ icon: 'success', title: 'JSON verileri başarıyla içe aktarıldı!' });
                } catch (error) {
                    Toast.fire({ icon: 'error', title: 'Geçersiz JSON dosyası veya okuma hatası!' });
                }
            };
            reader.readAsText(file);
        }

    } // main() sonu

})(); // IIFE sonu
