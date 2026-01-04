// ==UserScript==
// @name         🔐 Secure Password Generator
// @name:fr      🔐 Générateur de mot de passe sécurisé
// @name:es      🔐 Generador de contraseña segura
// @name:de      🔐 Sicherer Passwortgenerator
// @name:pt      🔐 Gerador de senha segura
// @name:ru      🔐 Генератор надежных паролей
// @name:zh-CN    🔐 安全密码生成器
// @name:zh-TW    🔐 安全密碼產生器
// @name:ar      🔐 منشئ كلمات مرور آمنة
// @name:ja      🔐 安全なパスワードジェネレーター
// @name:ko      🔐 안전한 비밀번호 생성기
// @name:it      🔐 Generatore di password sicure
// @name:hi      🔐 सुरक्षित पासवर्ड जनरेटर

// @description  A lightweight, secure password generator available on every website. Fully customizable (length, symbols, numbers, uppercase). Automatically copies to clipboard. Local-only, privacy-respecting. Multilingual interface.
// @description:fr Générateur de mot de passe sécurisé, léger et accessible sur tous les sites web. Entièrement personnalisable (longueur, symboles, chiffres, majuscules). Copie automatique dans le presse-papiers. Fonctionne uniquement en local. Interface multilingue intelligente.
// @description:es Generador ligero y seguro de contraseñas en cualquier página. Totalmente personalizable (longitud, símbolos, números, mayúsculas). Copia automática al portapapeles. 100% local, respetando tu privacidad.
// @description:de Leichter, sicherer Passwortgenerator auf jeder Website. Voll anpassbar (Länge, Symbole, Zahlen, Großbuchstaben). Kopiert automatisch in die Zwischenablage. Lokal, datenschutzfreundlich.
// @description:pt Gerador de senha leve e seguro em qualquer site. Totalmente personalizável (tamanho, símbolos, números, maiúsculas). Copia automática para a área de transferência. 100% local, respeita sua privacidade.
// @description:ru Лёгкий и надёжный генератор паролей на любом сайте. Полностью настраивается (длина, символы, цифры, прописные буквы). Автокопия в буфер обмена. Локальный, уважает приватность.
// @description:zh-CN 一个轻量级、安全的密码生成器，适用于所有网站。支持完全自定义（长度、符号、数字、大写字母），自动复制到剪贴板，100% 本地运行，保护隐私，多语言界面。
// @description:zh-TW 一個輕量、安全的密碼產生器，適用於所有網站。支援完整自訂（長度、符號、數字、大寫字母），自動複製到剪貼簿，百分之百本地執行，隱私無虞，多語界面。
// @description:ar مولّد كلمات مرور خفيفة وآمنة يعمل على كل موقع. قابل للتخصيص الكامل (طول، رموز، أرقام، أحرف كبيرة). ينسخ تلقائياً للحافظة. تشغيل محلي، يحترم الخصوصية.
// @description:ja 軽量で安全なパスワードジェネレーター。全サイト対応。カスタマイズ可能（長さ、記号、数字、大文字）。クリップボードに自動コピー。ローカル実行、プライバシー重視。
// @description:ko 모든 웹사이트에서 작동하는 경량 보안 비밀번호 생성기. 완전 사용자 지정 가능(길이, 기호, 숫자, 대문자). 클립보드 자동 복사. 로컬 실행, 개인정보 보호.
// @description:it Generatore di password leggero e sicuro su ogni sito. Completamente personalizzabile (lunghezza, simboli, numeri, maiuscole). Copia automatica negli appunti. Solo locale, rispetta la privacy.
// @description:hi हर वेबसाइट पर काम करने वाला हल्का, सुरक्षित पासवर्ड जनरेटर। पूरी तरह अनुकूलन योग्य (लंबाई, प्रतीक, संख्याएँ, बड़े अक्षर)। स्वचालित क्लिपबोर्ड कॉपी। केवल लोकल, गोपनीयता संरक्षित।

// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @author       Dℝ∃wX
// @copyright    2025 DℝᴇwX
// @license      Apache-2.0
// @match        *://*/*
// @grant        none

// @tag          password
// @tag          secure password
// @tag          generator
// @tag          security
// @tag          clipboard
// @tag          productivity
// @tag          customization
// @tag          privacy
// @downloadURL https://update.greasyfork.org/scripts/541200/%F0%9F%94%90%20Secure%20Password%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/541200/%F0%9F%94%90%20Secure%20Password%20Generator.meta.js
// ==/UserScript==

/*
Copyright 2025 Dℝ∃wX

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

(function() {
    'use strict';

const translations = {
    en: {
        generate: 'Generate',
        generateFull: 'Generate Password',
        length: 'Length',
        uppercase: 'Uppercase',
        numbers: 'Numbers',
        symbols: 'Symbols',
        copied: 'Password copied:',
        close: '✕'
    },
    fr: {
        generate: 'Générer',
        generateFull: 'Générer Un Mot De Passe',
        length: 'Longueur',
        uppercase: 'Majuscules',
        numbers: 'Chiffres',
        symbols: 'Symboles',
        copied: 'Mot de passe copié :',
        close: '✕'
    },
    es: {
        generate: 'Generar',
        generateFull: 'Generar Contraseña',
        length: 'Longitud',
        uppercase: 'Mayúsculas',
        numbers: 'Números',
        symbols: 'Símbolos',
        copied: 'Contraseña copiada:',
        close: '✕'
    },
    de: {
        generate: 'Generieren',
        generateFull: 'Passwort generieren',
        length: 'Länge',
        uppercase: 'Großbuchstaben',
        numbers: 'Zahlen',
        symbols: 'Symbole',
        copied: 'Passwort kopiert:',
        close: '✕'
    },
    it: {
        generate: 'Genera',
        generateFull: 'Genera Password',
        length: 'Lunghezza',
        uppercase: 'Maiuscole',
        numbers: 'Numeri',
        symbols: 'Simboli',
        copied: 'Password copiata:',
        close: '✕'
    },
    pt: {
        generate: 'Gerar',
        generateFull: 'Gerar Senha',
        length: 'Comprimento',
        uppercase: 'Maiúsculas',
        numbers: 'Números',
        symbols: 'Símbolos',
        copied: 'Senha copiada:',
        close: '✕'
    },
    nl: {
        generate: 'Genereren',
        generateFull: 'Wachtwoord genereren',
        length: 'Lengte',
        uppercase: 'Hoofdletters',
        numbers: 'Cijfers',
        symbols: 'Symbolen',
        copied: 'Wachtwoord gekopieerd:',
        close: '✕'
    },
    ru: {
        generate: 'Сгенерировать',
        generateFull: 'Создать пароль',
        length: 'Длина',
        uppercase: 'Заглавные буквы',
        numbers: 'Цифры',
        symbols: 'Символы',
        copied: 'Пароль скопирован:',
        close: '✕'
    },
    ja: {
        generate: '生成',
        generateFull: 'パスワードを生成',
        length: '長さ',
        uppercase: '大文字',
        numbers: '数字',
        symbols: '記号',
        copied: 'パスワードをコピーしました:',
        close: '✕'
    },
    ko: {
        generate: '생성',
        generateFull: '비밀번호 생성',
        length: '길이',
        uppercase: '대문자',
        numbers: '숫자',
        symbols: '기호',
        copied: '비밀번호가 복사되었습니다:',
        close: '✕'
    },
    zh: {
        generate: '生成',
        generateFull: '生成密码',
        length: '长度',
        uppercase: '大写字母',
        numbers: '数字',
        symbols: '符号',
        copied: '密码已复制：',
        close: '✕'
    },
    ar: {
        generate: 'توليد',
        generateFull: 'توليد كلمة المرور',
        length: 'الطول',
        uppercase: 'أحرف كبيرة',
        numbers: 'أرقام',
        symbols: 'رموز',
        copied: 'تم نسخ كلمة المرور:',
        close: '✕'
    },
        pl: {
        generate: 'Generuj',
        generateFull: 'Wygeneruj hasło',
        length: 'Długość',
        uppercase: 'Wielkie litery',
        numbers: 'Cyfry',
        symbols: 'Symbole',
        copied: 'Hasło skopiowane:',
        close: '✕'
    },
    tr: {
        generate: 'Oluştur',
        generateFull: 'Şifre Oluştur',
        length: 'Uzunluk',
        uppercase: 'Büyük harfler',
        numbers: 'Rakamlar',
        symbols: 'Semboller',
        copied: 'Şifre kopyalandı:',
        close: '✕'
    },
    sv: {
        generate: 'Generera',
        generateFull: 'Generera Lösenord',
        length: 'Längd',
        uppercase: 'Versaler',
        numbers: 'Siffror',
        symbols: 'Symboler',
        copied: 'Lösenord kopierat:',
        close: '✕'
    },
    ro: {
        generate: 'Generează',
        generateFull: 'Generează Parolă',
        length: 'Lungime',
        uppercase: 'Majuscule',
        numbers: 'Cifre',
        symbols: 'Simboluri',
        copied: 'Parola a fost copiată:',
        close: '✕'
    },
    vi: {
        generate: 'Tạo',
        generateFull: 'Tạo Mật Khẩu',
        length: 'Độ dài',
        uppercase: 'Chữ hoa',
        numbers: 'Số',
        symbols: 'Ký hiệu',
        copied: 'Mật khẩu đã được sao chép:',
        close: '✕'
    },
    hi: {
        generate: 'जनरेट करें',
        generateFull: 'पासवर्ड जनरेट करें',
        length: 'लंबाई',
        uppercase: 'बड़े अक्षर',
        numbers: 'संख्याएँ',
        symbols: 'प्रतीक',
        copied: 'पासवर्ड कॉपी किया गया:',
        close: '✕'
    },
    th: {
        generate: 'สร้าง',
        generateFull: 'สร้างรหัสผ่าน',
        length: 'ความยาว',
        uppercase: 'ตัวพิมพ์ใหญ่',
        numbers: 'ตัวเลข',
        symbols: 'สัญลักษณ์',
        copied: 'คัดลอกรหัสผ่านแล้ว:',
        close: '✕'
    },
        zh_HK: {
        generate: '產生',
        generateFull: '產生密碼',
        length: '長度',
        uppercase: '大寫字母',
        numbers: '數字',
        symbols: '符號',
        copied: '密碼已複製：',
        close: '✕'
    },
    zh_TW: {
        generate: '產生',
        generateFull: '產生密碼',
        length: '長度',
        uppercase: '大寫字母',
        numbers: '數字',
        symbols: '符號',
        copied: '密碼已複製：',
        close: '✕'
    },
    ms: {
        generate: 'Jana',
        generateFull: 'Jana Kata Laluan',
        length: 'Panjang',
        uppercase: 'Huruf besar',
        numbers: 'Nombor',
        symbols: 'Simbol',
        copied: 'Kata laluan disalin:',
        close: '✕'
    },
    id: {
        generate: 'Buat',
        generateFull: 'Buat Kata Sandi',
        length: 'Panjang',
        uppercase: 'Huruf besar',
        numbers: 'Angka',
        symbols: 'Simbol',
        copied: 'Kata sandi disalin:',
        close: '✕'
    },
    bn: {
        generate: 'তৈরি করুন',
        generateFull: 'পাসওয়ার্ড তৈরি করুন',
        length: 'দৈর্ঘ্য',
        uppercase: 'বড় হাতের অক্ষর',
        numbers: 'সংখ্যা',
        symbols: 'প্রতীক',
        copied: 'পাসওয়ার্ড কপি হয়েছে:',
        close: '✕'
    },
    ta: {
        generate: 'உருவாக்கு',
        generateFull: 'கடவுச்சொல்லை உருவாக்கு',
        length: 'நீளம்',
        uppercase: 'பெரிய எழுத்துக்கள்',
        numbers: 'எண்கள்',
        symbols: 'சின்னங்கள்',
        copied: 'கடவுச்சொல் நகலெடுக்கப்பட்டது:',
        close: '✕'
    },
    ur: {
        generate: 'پیدا کریں',
        generateFull: 'پاس ورڈ بنائیں',
        length: 'لمبائی',
        uppercase: 'بڑے حروف',
        numbers: 'اعداد',
        symbols: 'علامات',
        copied: 'پاس ورڈ کاپی ہو گیا:',
        close: '✕'
    }


};


    const userLang = (navigator.language || navigator.userLanguage).slice(0, 2);
    const i18n = translations[userLang] || translations.en;


    function generatePassword(length, includeUppercase, includeNumbers, includeSymbols) {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '?!@#$%^&*()=';

        let charset = lowercase;
        let password = [];

        if (includeUppercase) {
            charset += uppercase;
            password.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
        }
        if (includeNumbers) {
            charset += numbers;
            password.push(numbers[Math.floor(Math.random() * numbers.length)]);
        }
        if (includeSymbols) {
            charset += symbols;
            password.push(symbols[Math.floor(Math.random() * symbols.length)]);
        }
        password.push(lowercase[Math.floor(Math.random() * lowercase.length)]);

        const remainingLength = length - password.length;
        for (let i = 0; i < remainingLength; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password.push(charset[randomIndex]);
        }

        for (let i = password.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [password[i], password[j]] = [password[j], password[i]];
        }

        return password.join('');
    }


    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.left = '20px';
    container.style.width = '50px';
    container.style.height = '50px';
    container.style.borderRadius = '25px';
    container.style.backgroundColor = '#1e40af';
    container.style.zIndex = '9999';
    container.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
    container.style.transition = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s';
    container.style.overflow = 'hidden';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'flex-end';

    const button = document.createElement('button');
    button.style.width = '100%';
    button.style.height = '50px';
    button.style.backgroundColor = 'transparent';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.fontSize = '24px';
    button.style.color = 'white';
    button.style.position = 'relative';

    const buttonContent = document.createElement('span');
    buttonContent.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
            <path d="M12 16v2"></path>
            <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
        </svg>
    `;
    buttonContent.style.transition = 'opacity 0.2s ease, font-size 0.2s ease, padding 0.2s ease, font-weight 0.2s ease';
    buttonContent.style.display = 'inline-flex';
    buttonContent.style.alignItems = 'center';
    buttonContent.style.justifyContent = 'center';
    buttonContent.style.width = '100%';
    buttonContent.style.height = '100%';
    button.appendChild(buttonContent);

    const settingsButton = document.createElement('button');
    settingsButton.textContent = '+';
    settingsButton.style.position = 'absolute';
    settingsButton.style.right = '8px';
    settingsButton.style.width = '24px';
    settingsButton.style.height = '24px';
    settingsButton.style.borderRadius = '50%';
    settingsButton.style.border = '2px solid #A7F3A3';
    settingsButton.style.backgroundColor = 'transparent';
    settingsButton.style.color = '#A7F3A3';
    settingsButton.style.fontSize = '16px';
    settingsButton.style.display = 'none';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.alignItems = 'center';
    settingsButton.style.justifyContent = 'center';
    button.appendChild(settingsButton);

    const menuContent = document.createElement('div');
    menuContent.style.height = '0';
    menuContent.style.opacity = '0';
    menuContent.style.transition = 'opacity 0.2s ease';
    menuContent.style.padding = '0 16px';
    menuContent.style.color = 'white';
    menuContent.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';
    menuContent.style.overflow = 'hidden';
    menuContent.style.display = 'flex';
    menuContent.style.flexDirection = 'column';

    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.alignSelf = 'flex-end';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = '#F87171';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.padding = '12px';
    closeButton.style.marginRight = '-15px';
    closeButton.style.display = 'none';
    menuContent.appendChild(closeButton);

    const params = document.createElement('div');
    params.style.flex = '1';
params.innerHTML = `
    <label style="display: block; margin-bottom: 8px; font-size: 14px;">
        ${i18n.length}:
        <input type="number" id="passwordLength" value="12" min="4" max="50"
               style="width: calc(100% - 14px); padding: 6px; border-radius: 4px; border: none; margin-top: 4px; color: black;">
    </label>
    <label style="display: block; margin-bottom: 8px; font-size: 14px;">
        <input type="checkbox" id="includeUppercase" checked style="margin-right: 8px;">
        ${i18n.uppercase}
    </label>
    <label style="display: block; margin-bottom: 8px; font-size: 14px;">
        <input type="checkbox" id="includeNumbers" checked style="margin-right: 8px;">
        ${i18n.numbers}
    </label>
    <label style="display: block; font-size: 14px;">
        <input type="checkbox" id="includeSymbols" checked style="margin-right: 8px;">
        ${i18n.symbols}
    </label>
`;

    menuContent.appendChild(params);

    container.appendChild(menuContent);
    container.appendChild(button);

    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '12px 24px';
    notification.style.backgroundColor = '#1f2937';
    notification.style.color = 'white';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '10000';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    notification.style.maxWidth = '300px';
    notification.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    notification.style.transform = 'translateY(10px)';

    document.body.appendChild(container);
    document.body.appendChild(notification);

    container.addEventListener('mouseenter', () => {
        if (container.style.height === '50px' || container.style.height === '') {
            container.style.width = '200px';
            container.style.backgroundColor = '#2563eb';
            buttonContent.style.opacity = '0';
            setTimeout(() => {
                buttonContent.textContent = i18n.generateFull;
                buttonContent.style.fontSize = '14px';
                buttonContent.style.fontWeight = 'normal';
                buttonContent.style.opacity = '1';
                buttonContent.style.padding = '0 32px 0 16px';
                settingsButton.style.display = 'flex';
            }, 200);
        }
    });

    container.addEventListener('mouseleave', () => {
        if (container.style.height === '50px' || container.style.height === '') {
            container.style.width = '50px';
            container.style.backgroundColor = '#1e40af';
            buttonContent.style.opacity = '0';
            settingsButton.style.display = 'none';
            setTimeout(() => {
                if (container.style.height === '50px' || container.style.height === '') {
                    buttonContent.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
                            <path d="M12 16v2"></path>
                            <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                        </svg>
                    `;
                    buttonContent.style.fontSize = '24px';
                    buttonContent.style.fontWeight = 'normal';
                    buttonContent.style.opacity = '1';
                    buttonContent.style.padding = '0';
                    settingsButton.style.display = 'none';
                }
            }, 200);
        }
    });

    button.addEventListener('click', (e) => {
        if (e.target !== settingsButton) {
            const length = parseInt(document.getElementById('passwordLength')?.value || 12);
            const includeUppercase = document.getElementById('includeUppercase')?.checked ?? true;
            const includeNumbers = document.getElementById('includeNumbers')?.checked ?? true;
            const includeSymbols = document.getElementById('includeSymbols')?.checked ?? true;
            const password = generatePassword(length, includeUppercase, includeNumbers, includeSymbols);

            navigator.clipboard.writeText(password).then(() => {
                notification.textContent = `${i18n.copied} ${password}`;
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateY(10px)';
                }, 1500);
            }).catch(err => {
                console.error('Erreur lors de la copie :', err);
            });
        }
    });

    settingsButton.addEventListener('click', () => {
        container.style.width = '200px';
        container.style.height = '270px';
        container.style.backgroundColor = '#2563eb';
        buttonContent.style.opacity = '0';
        settingsButton.style.display = 'none';
        menuContent.style.height = '220px';
        setTimeout(() => {
            buttonContent.textContent = i18n.generate;
            buttonContent.style.fontSize = '12px';
            buttonContent.style.fontWeight = 'bold';
            buttonContent.style.opacity = '1';
            buttonContent.style.padding = '0';
            menuContent.style.opacity = '1';
            closeButton.style.display = 'block';
        }, 200);
    });

    closeButton.addEventListener('click', () => {
        menuContent.style.opacity = '0';
        closeButton.style.display = 'none';
        buttonContent.style.opacity = '0';
        setTimeout(() => {
            container.style.width = '50px';
            container.style.height = '50px';
            container.style.backgroundColor = '#1e40af';
            menuContent.style.height = '0';
            buttonContent.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
                    <path d="M12 16v2"></path>
                    <path d="M8 11V7a4 4 0 0 1 8 0v4"></path>
                </svg>
            `;
            buttonContent.style.fontSize = '24px';
            buttonContent.style.fontWeight = 'normal';
            buttonContent.style.opacity = '1';
            buttonContent.style.padding = '0';
            settingsButton.style.display = 'none';
        }, 200);
    });



})();