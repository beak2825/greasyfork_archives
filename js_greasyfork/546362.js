// ==UserScript==
// @name        智能翻译助手
// @name:zh-CN  智能翻译助手
// @name:zh-TW  智能翻譯助手
// @name:zh-HK  智能翻譯助手
// @name:en     Intelligent Translation Assistant
// @name:es     Asistente de Traducción Inteligente
// @name:fr     Assistant de Traduction Intelligent
// @name:de     Intelligenter Übersetzungsassistent
// @name:it     Assistente di Traduzione Intelligente
// @name:pt     Assistente de Tradução Inteligente
// @name:pt-BR  Assistente de Tradução Inteligente
// @name:ru     Интеллектуальный Переводчик
// @name:ja     インテリジェント翻訳アシスタント
// @name:ko     지능형 번역 도우미
// @name:ar     مساعد الترجمة الذكي
// @name:tr     Akıllı Çeviri Asistanı
// @name:nl     Intelligente Vertaalassistent
// @name:pl     Inteligentny Asystent Tłumaczenia
// @name:sv     Intelligent Översättningsassistent
// @name:da     Intelligent Oversættelsesassistent
// @name:fi     Älykäs Käännösavustaja
// @name:no     Intelligent Oversettelsesassistent
// @name:cs     Inteligentní Překladový Asistent
// @name:hu     Intelligens Fordító Asszisztens
// @name:ro     Asistent de Traducere Inteligent
// @name:sk     Inteligentný Prekladový Asistent
// @name:uk     Інтелектуальний Помічник Перекладу
// @name:bg     Интелигентен Преводачески Асистент
// @name:el     Έξυπνος Βοηθός Μετάφρασης
// @name:he     עוזר תרגום חכם
// @name:hi     इंटेलिजेंट ट्रांसलेशन असिस्टेंट
// @name:th     ผู้ช่วยแปลอัจฉริยะ
// @name:vi     Trợ lý Dịch thuật Thông minh
// @name:id     Asisten Terjemahan Cerdas
// @name:ms     Pembantu Terjemahan Pintar
// @name:tl     Matalinong Katulong sa Pagsasalin
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description       功能强大的网页翻译工具，支持多语言，可自定义配置，界面精美，支持移动端
// @description:zh-CN 功能强大的网页翻译工具，支持多语言，可自定义配置，界面精美，支持移动端
// @description:zh-TW 功能強大的網頁翻譯工具，支援多語言，可自訂配置，介面精美，支援行動端
// @description:zh-HK 功能強大的網頁翻譯工具，支援多語言，可自訂配置，介面精美，支援行動端
// @description:en    Powerful web translation tool, supports multiple languages, customizable configuration, beautiful interface, mobile support
// @description:es    Potente herramienta de traducción web, admite múltiples idiomas, configuración personalizable, interfaz elegante, compatible con dispositivos móviles
// @description:fr    Outil de traduction web puissant, prend en charge plusieurs langues, configuration personnalisable, interface élégante, prise en charge mobile
// @description:de    Leistungsstarkes Web-Übersetzungstool, unterstützt mehrere Sprachen, anpassbare Konfiguration, schöne Oberfläche, Mobilgeräte-Unterstützung
// @description:it    Potente strumento di traduzione web, supporta più lingue, configurazione personalizzabile, interfaccia elegante, supporto mobile
// @description:pt    Ferramenta de tradução web poderosa, suporta vários idiomas, configuração personalizável, interface bonita, suporte móvel
// @description:pt-BR Ferramenta de tradução web poderosa, suporta vários idiomas, configuração personalizável, interface bonita, suporte móvel
// @description:ru    Мощный веб-инструмент перевода, поддерживает несколько языков, настраиваемая конфигурация, красивый интерфейс, поддержка мобильных устройств
// @description:ja    強力なウェブ翻訳ツール、多言語対応、カスタマイズ可能な設定、美しいインターフェース、モバイルサポート
// @description:ko    강력한 웹 번역 도구, 다국어 지원, 사용자 정의 구성, 아름다운 인터페이스, 모바일 지원
// @description:ar    أداة ترجمة ويب قوية، تدعم لغات متعددة، تكوين قابل للتخصيص، واجهة جميلة، دعم للأجهزة المحمولة
// @description:tr    Güçlü web çeviri aracı, çoklu dil desteği, özelleştirilebilir yapılandırma, güzel arayüz, mobil destek
// @description:nl    Krachtige webvertaaltool, ondersteunt meerdere talen, aanpasbare configuratie, mooie interface, ondersteuning voor mobiele apparaten
// @description:pl    Potężne narzędzie do tłumaczenia stron internetowych, obsługuje wiele języków, konfigurowalne ustawienia, piękny interfejs, obsługa urządzeń mobilnych
// @description:sv    Kraftfull webböversättningsverktyg, stöder flera språk, anpassningsbar konfiguration, vackert gränssnitt, mobilstöd
// @description:da    Kraftfuldt weboversættelsesværktøj, understøtter flere sprog, tilpasningsbar konfiguration, smukt interface, mobilunderstøttelse
// @description:fi    Tehokas verkkokäännöstyökalu, tukee useita kieliä, mukautettava määritys, kaunis käyttöliittymä, mobiilituki
// @description:no    Kraftig nettoversettelsesverktøy, støtter flere språk, tilpassbar konfigurasjon, vakkert grensesnitt, mobilstøtte
// @description:cs    Výkonný nástroj pro webový překlad, podporuje více jazyků, přizpůsobitelná konfigurace, krásné rozhraní, podpora mobilních zařízení
// @description:hu    Hatékony webes fordítási eszköz, támogatja a többnyelvűséget, testreszabható konfiguráció, szép felület, mobil támogatás
// @description:ro    Instrument puternic de traducere web, suportă mai multe limbi, configurație personalizabilă, interfață frumoasă, suport pentru dispozitive mobile
// @description:sk    Výkonný nástroj pre webový preklad, podporuje viac jazykov, prispôsobiteľná konfigurácia, krásne rozhranie, podpora mobilných zariadení
// @description:uk    Потужний веб-інструмент перекладу, підтримує кілька мов, настроювана конфігурація, красивий інтерфейс, підтримка мобільних пристроїв
// @description:bg    Мощен уеб преводачески инструмент, поддържа множество езици, персонализируема конфигурация, красив интерфейс, поддръжка на мобилни устройства
// @description:el    Ισχυρό εργαλείο μετάφρασης ιστού, υποστηρίζει πολλές γλώσσες, προσαρμόσιμη διαμόρφωση, όμορφη διεπαφή, υποστήριξη κινητών
// @description:he    כלי תרגום אינטרנט חזק, תומך במספר שפות, תצורה ניתנת להתאמה אישית, ממשק יפה, תמיכה בנייד
// @description:hi    शक्तिशाली वेब अनुवाद उपकरण, कई भाषाओं का समर्थन करता है, अनुकूलन योग्य विन्यास, सुंदर इंटरफेस, मोबाइल समर्थन
// @description:th    เครื่องมือแปลเว็บที่มีประสิทธิภาพ รองรับหลายภาษา การกำหนดค่าที่ปรับแต่งได้ อินเทอร์เฟซที่สวยงาม การรองรับมือถือ
// @description:vi    Công cụ dịch web mạnh mẽ, hỗ trợ đa ngôn ngữ, cấu hình tùy chỉnh, giao diện đẹp, hỗ trợ di động
// @description:id    Alat terjemahan web yang kuat, mendukung banyak bahasa, konfigurasi yang dapat disesuaikan, antarmuka yang indah, dukungan seluler
// @description:ms    Alat terjemahan web yang berkuasa, menyokong pelbagai bahasa, konfigurasi boleh suai, antara muka yang cantik, sokongan mudah alih
// @description:tl    Makapangyarihang tool sa pagsasalin ng web, sumusuporta sa maraming wika, naaayos na pagsasaayos, magandang interface, suporta sa mobile
// @author       Eray
// @icon      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAABvBAMAAAApjDIIAAAA82VYSWZNTQAqAAAACAAFAQAAAwAAAAEAcQAAAQEAAwAAAAEAbwAAATEAAgAAABcAAABKh2kABAAAAAEAAABhARIABAAAAAEAAAAAAAAAAEFuZHJvaWQgUEQyMTE4X0FfOS4zLjEAAASQAwACAAAAFAAAAJeSkQACAAAABDc4MgCQEQACAAAABwAAAKuSCAAEAAAAAQAAAAAAAAAAMjAyNTowODoxOSAyMjoxMjoxMAArMDg6MDAAAAMBAAADAAAAAQBxAAABMQACAAAAFwAAANwBAQADAAAAAQBvAAAAAAAAQW5kcm9pZCBQRDIxMThfQV85LjMuMQA+yDmGAAAAFVBMVEVuY8VtacxwXbxub9P///+3s+Pp6Pd/O4+7AAAGzklEQVRYw41Yy3IcNwwEqEhnTljKmTUp57zjjXyOotGeV9bj7NiK/v8TghdJkDu7MWVLpSr1NtBoYMCB/eZJyz6lNC1p6k+cECGCnC3UsoXDSGeCGAlKZwOZ+EvRE31fOjTSP2Ld5Ez8Py3MOXlUFMoI/AW4GS1hhDPxmfhL2JRSGClUPEUSbL/o6dVhjPBSnqrRGU5RaMiShUUQzniCpGqIrgTrsmxxRqvJKeciVdE0CZJ8WYRTNRqRzKecPQyNEyFWIJy3T6pQrFlKyFoUGMSxM20oW5Q5l2cqJdGAhSwqr6IjniKXvTm2GaBA2bEADTVyLnvn2JYmc6pjIbZWgb6WRjk4Vv61cmxyCmVxbBWWfUflVJHsZOikXfbbjp1UG0ZgAYJPcl9rsiRHycGarltVqcIOjhVdyT0IXtcMPadkuRTvFbNymtolrG2BtjxTETalvrNinHoH0Amdtsk7dmmORW0S6NChIltvDY6NpZ2bAwiWGdpxFmia7l5fF+GTaalTNnqFLE+zgIwPETa9fXw8mdtbY6IHwtCXOn6m6WVdnzjBWJVtnITKNVrXlVpMQVqs3nRKmIMh09JGgYWrSJs9XEr0aQbzbRuxTVeNtozY2IvTOBcGE+Ptaz2E/Lf9ths42ULAht2b57581LOua/vl4+gwQY5VZbFHHxFtn103RjRicLVMf55DHl1fZmEsjtfpM13gHAg5z6VO2ekip1WDCZlzVs5kEr19DOd9XQ/8c4e9rkIqo2BSy6ZxbFMQD/wzOliWLBnJT0uxDz841ROlOfGlBNrmFoTqBBnMfVvGyaYdIxEHbSRL42QrDGMEpcHeRdbRPnxm4ZQUhxkrRr9e10fourKlyZxcl/00kEp/3ZBAWBaKOkk4yyBIHbEVFXkcaI+8tEoOWc5BOJnUQbkU0pggaSL68ayxzp6zrQW3VH7GRU3T4UwcaZbs3FdI0/t6eGLON0uzQQP7nT5gFm1PRyyl9w+X892nGQqlxMp5qmfcHInTbxQl6XPNTYLQpal9bfXUseUfJAx5gvhW06R5chRpZzDSeWbOve0hFY4U5g+8ou/PSknhP4A8EkwhcYJbmMoTOn5hdW85WOXkZrNyMoz0Ec6NJYbDPb7UYPnXwy4UYbUuGfQB5CijdtcjB6vy3PBY+CbBiqzGWbYC/5TGO5khBwtWhsw3HQSqkFQljXssW53MsIoqcmSwPcj0Yc7ZOKfFbwW66U/6x0crpnzMQf2uJwtyXH5kGnBqB2uuTzr/LEtVVqNtewxGvdEY53OVluXaaZZSlnDKacvvrQ1oMGnvuVM5RM1zVm07VfVCE23Y/ygCHX9hvcR/YlquDEx+GdUVT4pyKKSZW+YPiljC1EhLPbsNj+Ds2PX5xUiv6Kc0AZQGs2hPt0ok266Pu1slzTIZZvqwzyG0cnqFsGwwYoNnuDLSGw6Uk/0eznLKVgCTUgJwto8QCHMPM33/yymryNSE5TGrWXKCghFpc+DRq8rOpcv6O20sWXI57ngOsbQxZzLS42yB9tGWpbJkCUp6FAfx43ZliXKu4MZpS+XUKCHfHYDDfGQH0Ad+V1F7pGWJJUsdeFev0pz3NDFnFbfFW5CxWNZR0oxdRNqDPfgfpEnGaOVCQqdlqdNVm1PPIecThcw8qBNo50bzJ7+i1CQrEttWedeylMfItUd+nk847dKOXAlPKQ5o5+tYT5Rq2p327rl77nVr2YMLt0RbOCNc7drDSwV61t2IB/8QLbZbUES35/PO8zt3mv7pJ0aGPtpyCwK3iwZ9RrNd5flDf/veSUTIWG5B/tpV9jv2Xubeoq5mF3lk1DuJvveBbvuheLktZ+mteSYf/j1oGxtnjN0+EbQ5deLdmP9atPr+pb9EZ9YnSHP+WnyuLeqQWKrS3Q90oeDmtElA4M5FHC0/DYZbRZbFGTKP2TZ9KICvHSfGliV2nIFuhE9t4NGi8XWoynDx4nVdlvWMaYq+JSF0VcFyeqjV3zYR118tWr13uVpmAfLzErYwXbR9LSun7ltz9tPSc0L/gkGvpbrHzmUT2ULy7AJ0VQliWeUEHepbERMnDO8KtL3siXeZc3jvk7Wly1awjWMk+mYuu2hZl4w2b3PW13E11qCTVra7+RInuqbUNwVSyNn2gq2SFCRi924su11fOMMZpL/IlPulLqLzhWDZxDFif4n2e+zFPCVJ9Pe1fsO7WBU/ffQa5Da8fD7afvronWK+4IGKxOEtVS63PblFnamJaev7MgRXkf/lxPEKpW0ZLqJzZx/jlPvl2TAdZwfVWs7FCxeRLtJQHRt+grN1SQj1dqodtj2ACvI/wZeKnkWuZZ8AAAAASUVORK5CYII=
// @run-at       document-start
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      Apache-2.0
// @supportURL   https://github.com/eraycc/Universal-Translation-JavaScript-Plugin/issues
// @homepageURL  https://greasyfork.org/zh-CN/scripts/546362-%E6%99%BA%E8%83%BD%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B
// @require      https://unpkg.com/i18n-jsautotranslate@3.18.89/index.js
// @downloadURL https://update.greasyfork.org/scripts/546362/%E6%99%BA%E8%83%BD%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/546362/%E6%99%BA%E8%83%BD%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 尽早注入样式和创建悬浮球
    const earlyInit = () => {
        // 检测是否为移动设备
        const isMobile = () => {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                || window.innerWidth <= 768;
        };

        // 获取保存的配置
        const getConfig = () => {
            const defaultConfig = {
                enabled: true,
                localLanguage: 'english',
                targetLanguage: 'chinese_simplified',
                floatBallSize: isMobile() ? 45 : 50,
                floatBallPosition: { x: 20, y: 100 },
                floatBallOpacity: 0.8,
                autoTranslate: false,
                showFloatBall: true,
                translateService: 'client.edge',
                customServiceUrls: '',
                allowHalfBall: true,
                panelPosition: null,
                panelSize: isMobile() ? 0.9 : 1,
                panelOpacity: 1,
                ignoredClasses: '',
                ignoredIds: '',
                ignoredTags: [],
                customTerms: '',
                enableListener: true,
                enableCache: true,
                translateAttributes: ['title', 'alt', 'placeholder'],
                doubleClickToggle: false,
                enableOffline: false,
                enableSelectionTranslate: false
            };
            const saved = GM_getValue('translateConfig', null);
            return saved ? { ...defaultConfig, ...saved } : defaultConfig;
        };

        const config = getConfig();
        const mobile = isMobile();

        // 检测深色模式
        const isDarkMode = () => {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        };

        // 注入基础样式
        const baseStyles = `
            #translate-float-ball {
                position: fixed;
                width: ${config.floatBallSize}px;
                height: ${config.floatBallSize}px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                cursor: ${mobile ? 'pointer' : 'move'};
                z-index: 2147483647;
                display: ${config.showFloatBall ? 'flex' : 'none'};
                align-items: center;
                justify-content: center;
                opacity: ${config.floatBallOpacity};
                left: ${config.floatBallPosition.x}px;
                top: ${config.floatBallPosition.y}px;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                user-select: none;
                -webkit-user-select: none;
                touch-action: none;
            }
            #translate-float-ball svg {
                width: ${mobile ? '24px' : '28px'};
                height: ${mobile ? '24px' : '28px'};
                fill: white;
                pointer-events: none;
            }
        `;

        // 创建style标签
        const style = document.createElement('style');
        style.textContent = baseStyles;
        
        // 创建悬浮球
        const ball = document.createElement('div');
        ball.id = 'translate-float-ball';
        ball.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
            </svg>
        `;

        // 等待DOM准备好
        if (document.head) {
            document.head.appendChild(style);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.head.appendChild(style);
            });
        }

        if (document.body) {
            document.body.appendChild(ball);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(ball);
            });
        }
    };

    // 立即执行早期初始化
    earlyInit();

    // 主要功能代码
    (() => {
        // 配置管理器
        class ConfigManager {
            constructor() {
                this.defaultConfig = {
                    enabled: true,
                    localLanguage: 'english',
                    targetLanguage: 'chinese_simplified',
                    floatBallSize: isMobile() ? 45 : 50,
                    floatBallPosition: { x: 20, y: 100 },
                    floatBallOpacity: 0.8,
                    autoTranslate: false,
                    showFloatBall: true,
                    translateService: 'client.edge',
                    customServiceUrls: '',
                    allowHalfBall: true,
                    panelPosition: null,
                    panelSize: isMobile() ? 0.9 : 1,
                    panelOpacity: 1,
                    ignoredClasses: '',
                    ignoredIds: '',
                    ignoredTags: [],
                    customTerms: '',
                    enableListener: true,
                    enableCache: true,
                    translateAttributes: ['title', 'alt', 'placeholder'],
                    doubleClickToggle: false,
                    enableOffline: false,
                    enableSelectionTranslate: false
                };
                this.config = this.loadConfig();
            }

            loadConfig() {
                const saved = GM_getValue('translateConfig', null);
                return saved ? { ...this.defaultConfig, ...saved } : this.defaultConfig;
            }

            saveConfig() {
                GM_setValue('translateConfig', this.config);
            }

            get(key) {
                return this.config[key];
            }

            set(key, value) {
                this.config[key] = value;
                this.saveConfig();
            }

            reset() {
                GM_deleteValue('translateConfig');
                this.config = { ...this.defaultConfig };
            }

            clearCache() {
                // 清除translate.js的缓存
                if (typeof translate !== 'undefined') {
                    try {
                        translate.storage.clear();
                    } catch (e) {
                        console.log('清除translate.js缓存失败:', e);
                    }
                }
                
                // 清除localStorage中的翻译缓存
                const keys = Object.keys(localStorage);
                let cleared = 0;
                keys.forEach(key => {
                    if (key.includes('translate_') || key.includes('hash_')) {
                        localStorage.removeItem(key);
                        cleared++;
                    }
                });
                
                return cleared;
            }
        }

        // 翻译管理器
        class TranslateManager {
            constructor(configManager) {
                this.configManager = configManager;
                this.initialized = false;
                this.listenerStarted = false;
                this.currentLanguage = null;
                this.isTranslating = false;
                this.observer = null;
            }

            init() {
                if (this.initialized || typeof translate === 'undefined') return;
                
                try {
                    // 配置translate.js
                    translate.language.setLocal(this.configManager.get('localLanguage'));
                    
                    // 设置翻译服务
                    const service = this.configManager.get('translateService');
                    translate.service.use(service);
                    
                    // 如果是自定义服务,设置API地址
                    if (service === 'translate.service') {
                        const customUrls = this.configManager.get('customServiceUrls');
                        if (customUrls) {
                            const urls = customUrls.split(',').map(url => url.trim()).filter(url => url);
                            if (urls.length > 0) {
                                translate.request.api.host = urls.length === 1 ? urls[0] : urls;
                            }
                        }
                    }
                    
                    translate.selectLanguageTag.show = false;
                    
                    // 设置忽略的类和ID
                    this.applyIgnoreSettings();
                    
                    // 设置自定义术语
                    this.applyCustomTerms();

                    // 设置要翻译的属性
                    const translateAttributes = this.configManager.get('translateAttributes');
                    if (translateAttributes.length > 0) {
                        translate.translateAttributes = translateAttributes;
                    }

                    this.initialized = true;
                    console.log('翻译管理器初始化完成');
                } catch (error) {
                    console.error('翻译初始化失败:', error);
                }
            }

            applyIgnoreSettings() {
                if (typeof translate === 'undefined') return;
                
                // 清空现有设置
                translate.ignore.class = [];
                translate.ignore.id = [];
                
                // 应用忽略的Class
                const ignoredClasses = this.configManager.get('ignoredClasses');
                if (ignoredClasses) {
                    const classes = ignoredClasses.split(',').map(c => c.trim()).filter(c => c);
                    classes.forEach(cls => {
                        translate.ignore.class.push(cls);
                    });
                }
                
                // 应用忽略的ID
                const ignoredIds = this.configManager.get('ignoredIds');
                if (ignoredIds) {
                    const ids = ignoredIds.split(',').map(id => id.trim()).filter(id => id);
                    ids.forEach(id => {
                        translate.ignore.id.push(id);
                    });
                }
            }

            applyCustomTerms() {
                if (typeof translate === 'undefined') return;
                
                const customTerms = this.configManager.get('customTerms');
                if (!customTerms) return;
                
                const localLang = this.configManager.get('localLanguage');
                const targetLang = this.configManager.get('targetLanguage');
                
                // 直接使用用户输入的格式
                translate.nomenclature.append(localLang, targetLang, customTerms);
            }

            startListener() {
                if (!this.listenerStarted && typeof translate !== 'undefined') {
                    try {
                        if (this.configManager.get('enableListener')) {
                            translate.listener.start();
                            this.listenerStarted = true;
                            console.log('动态内容监听已启动');
                        }
                    } catch (error) {
                        if (!error.message?.includes('已经启动')) {
                            console.error('启动监听失败:', error);
                        }
                    }
                }
            }

            changeLanguage(targetLang) {
                if (!this.initialized) this.init();
                if (typeof translate === 'undefined') return;
                
                try {
                    // 避免重复翻译到相同语言
                    if (this.currentLanguage === targetLang && this.isTranslating) {
                        return;
                    }
                    
                    this.currentLanguage = targetLang;
                    this.isTranslating = true;
                    
                    // 重新应用忽略设置和自定义术语
                    this.applyIgnoreSettings();
                    this.applyCustomTerms();
                    
                    // 确保监听器已启动
                    this.startListener();
                    
                    translate.changeLanguage(targetLang);
                    
                    // 翻译完成后重置状态
                    setTimeout(() => {
                        this.isTranslating = false;
                    }, 1000);
                } catch (error) {
                    console.error('切换语言失败:', error);
                    this.isTranslating = false;
                }
            }

            toggle(enabled) {
                if (enabled && !this.initialized) {
                    this.init();
                    this.startListener();
                    if (this.configManager.get('autoTranslate')) {
                        setTimeout(() => {
                            this.changeLanguage(this.configManager.get('targetLanguage'));
                        }, 100);
                    }
                } else if (!enabled && this.initialized) {
                    this.isTranslating = false;
                    this.changeLanguage(this.configManager.get('localLanguage'));
                }
            }

            execute() {
                if (!this.initialized) this.init();
                if (typeof translate !== 'undefined') {
                    try {
                        // 重新应用设置
                        this.applyIgnoreSettings();
                        this.applyCustomTerms();
                        
                        this.startListener();
                        translate.execute();
                    } catch (error) {
                        console.error('执行翻译失败:', error);
                    }
                }
            }

            startSelectionTranslate() {
                if (!this.initialized) this.init();
                if (typeof translate !== 'undefined') {
                    try {
                        translate.language.setDefaultTo(this.configManager.get('targetLanguage'));
                        translate.selectionTranslate.start();
                        console.log('鼠标划词翻译已启动');
                    } catch (error) {
                        console.error('启动划词翻译失败:', error);
                    }
                }
            }

            stopSelectionTranslate() {
                if (typeof translate !== 'undefined' && translate.selectionTranslate) {
                    try {
                        translate.selectionTranslate.stop();
                        console.log('鼠标划词翻译已停止');
                    } catch (error) {
                        console.error('停止划词翻译失败:', error);
                    }
                }
            }
        }

        // 提示管理器
        class ToastManager {
            constructor() {
                this.container = null;
                this.init();
            }

            init() {
                this.container = document.createElement('div');
                this.container.id = 'translate-toast-container';
                this.container.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 2147483647;
                    pointer-events: none;
                `;
                document.body.appendChild(this.container);
            }

            show(message, type = 'success', duration = 2000) {
                const toast = document.createElement('div');
                const bgColor = type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3';
                
                toast.style.cssText = `
                    background: ${bgColor};
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    margin-bottom: 10px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    animation: slideInRight 0.3s ease;
                    pointer-events: auto;
                    font-size: 14px;
                `;
                
                toast.textContent = message;
                this.container.appendChild(toast);

                setTimeout(() => {
                    toast.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => {
                        this.container.removeChild(toast);
                    }, 300);
                }, duration);
            }
        }

        // UI管理器
        class UIManager {
            constructor(configManager, translateManager) {
                this.configManager = configManager;
                this.translateManager = translateManager;
                this.floatBall = document.getElementById('translate-float-ball');
                this.panel = null;
                this.toast = new ToastManager();
                this.isDragging = false;
                this.isPanelDragging = false;
                this.dragOffset = { x: 0, y: 0 };
                this.panelDragOffset = { x: 0, y: 0 };
                this.touchStartPos = { x: 0, y: 0 };
                this.touchStartTime = 0;
                this.lastClickTime = 0;
                this.clickCount = 0;
                this.clickTimer = null;
                
                this.init();
            }

            init() {
                this.injectStyles();
                this.setupFloatBall();
                this.createPanel();
                this.bindEvents();
                
                // 初始化翻译
                if (this.configManager.get('enabled')) {
                    setTimeout(() => {
                        this.translateManager.toggle(true);
                    }, 1000);
                }
                
                // 初始化鼠标划词翻译
                if (this.configManager.get('enableSelectionTranslate') && !isMobile()) {
                    setTimeout(() => {
                        this.translateManager.startSelectionTranslate();
                    }, 1500);
                }
            }

            injectStyles() {
                const mobile = isMobile();
                const darkMode = isDarkMode();
                
                GM_addStyle(`
                    /* 动画定义 */
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    
                    @keyframes slideOutRight {
                        from {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                    }
                    
                    /* 深色模式支持 */
                    ${darkMode ? `
                        #translate-panel {
                            background: #1e1e1e !important;
                            color: #e0e0e0 !important;
                        }
                        
                        .translate-panel-header {
                            background: linear-gradient(135deg, #4a5eb7 0%, #5a3d7a 100%) !important;
                        }
                        
                        .translate-control-label {
                            color: #e0e0e0 !important;
                        }
                        
                        .translate-select, .translate-input, .translate-textarea {
                            background: #2d2d2d !important;
                            color: #e0e0e0 !important;
                            border-color: #444 !important;
                        }
                        
                        .translate-select:focus, .translate-input:focus, .translate-textarea:focus {
                            border-color: #667eea !important;
                        }
                        
                        .translate-select option {
                            background: #2d2d2d !important;
                            color: #e0e0e0 !important;
                        }
                        
                        .translate-slider {
                            background: #444 !important;
                        }
                        
                        .translate-slider-value {
                            color: #b0b0b0 !important;
                        }
                        
                        .translate-section-title {
                            color: #e0e0e0 !important;
                            border-bottom-color: #444 !important;
                        }
                        
                        .translate-info {
                            background: #2d2d2d !important;
                            color: #b0b0b0 !important;
                        }
                        
                        .translate-description {
                            color: #999 !important;
                        }
                    ` : ''}
                    
                    /* 悬浮球动画样式 */
                    #translate-float-ball:active {
                        transform: scale(0.95);
                    }

                    #translate-float-ball.dragging {
                        transition: none !important;
                        transform: scale(1.1);
                        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
                    }

                    #translate-float-ball:hover {
                        transform: scale(1.05);
                        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
                    }

                    /* 控制面板样式 */
                    #translate-panel {
                        position: fixed;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                        z-index: 2147483646;
                        display: none;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        overflow: hidden;
                        touch-action: none;
                        user-select: none;
                        -webkit-user-select: none;
                    }

                    #translate-panel.show {
                        display: block;
                        animation: slideIn 0.3s ease;
                    }

                    #translate-panel.dragging {
                        transition: none !important;
                        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
                    }

                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .translate-panel-header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: ${mobile ? '15px' : '20px'};
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        cursor: move;
                    }

                    .translate-panel-title {
                        font-size: ${mobile ? '16px' : '18px'};
                        font-weight: 600;
                        user-select: none;
                    }

                    .translate-panel-close {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.2);
                        border: none;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: background 0.3s;
                        font-size: 18px;
                        color: white;
                    }

                    .translate-panel-close:hover {
                        background: rgba(255, 255, 255, 0.3);
                    }

                    .translate-panel-close:active {
                        transform: scale(0.95);
                    }

                    .translate-panel-body {
                        padding: ${mobile ? '15px' : '20px'};
                        max-height: ${mobile ? '60vh' : '500px'};
                        overflow-y: auto;
                        -webkit-overflow-scrolling: touch;
                        cursor: default;
                    }

                    .translate-panel-body::-webkit-scrollbar {
                        width: 6px;
                    }

                    .translate-panel-body::-webkit-scrollbar-thumb {
                        background: rgba(0,0,0,0.2);
                        border-radius: 3px;
                    }

                    .translate-panel-body::-webkit-scrollbar-track {
                        background: transparent;
                    }

                    .translate-control-group {
                        margin-bottom: ${mobile ? '15px' : '20px'};
                    }

                    .translate-control-label {
                        display: block;
                        margin-bottom: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        color: #333;
                    }

                    .translate-description {
                        font-size: 12px;
                        color: #666;
                        margin-top: 4px;
                        font-weight: normal;
                    }

                    .translate-switch {
                        position: relative;
                        display: inline-block;
                        width: 50px;
                        height: 24px;
                    }

                    .translate-switch input {
                        opacity: 0;
                        width: 0;
                        height: 0;
                    }

                    .translate-switch-slider {
                        position: absolute;
                        cursor: pointer;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: #ccc;
                        transition: .4s;
                        border-radius: 24px;
                    }

                    .translate-switch-slider:before {
                        position: absolute;
                        content: "";
                        height: 18px;
                        width: 18px;
                        left: 3px;
                        bottom: 3px;
                        background-color: white;
                        transition: .4s;
                        border-radius: 50%;
                    }

                    .translate-switch input:checked + .translate-switch-slider {
                        background-color: #667eea;
                    }

                    .translate-switch input:checked + .translate-switch-slider:before {
                        transform: translateX(26px);
                    }

                    .translate-select, .translate-input {
                        width: 100%;
                        padding: ${mobile ? '12px' : '10px'};
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        font-size: ${mobile ? '16px' : '14px'};
                        background: white;
                        cursor: pointer;
                        transition: border-color 0.3s;
                        color: #333;
                        box-sizing: border-box;
                    }

                    .translate-select:focus, .translate-input:focus {
                        outline: none;
                        border-color: #667eea;
                    }

                    .translate-textarea {
                        width: 100%;
                        min-height: 100px;
                        padding: ${mobile ? '12px' : '10px'};
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        font-size: ${mobile ? '14px' : '13px'};
                        background: white;
                        transition: border-color 0.3s;
                        color: #333;
                        box-sizing: border-box;
                        resize: vertical;
                        font-family: monospace;
                        line-height: 1.5;
                    }

                    .translate-textarea:focus {
                        outline: none;
                        border-color: #667eea;
                    }

                    .translate-slider-container {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .translate-slider {
                        flex: 1;
                        -webkit-appearance: none;
                        height: 6px;
                        border-radius: 3px;
                        background: #ddd;
                        outline: none;
                    }

                    .translate-slider::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: #667eea;
                        cursor: pointer;
                    }

                    .translate-slider::-moz-range-thumb {
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: #667eea;
                        cursor: pointer;
                        border: none;
                    }

                    .translate-slider-value {
                        min-width: 45px;
                        text-align: center;
                        font-size: 14px;
                        color: #666;
                    }

                    .translate-button {
                        width: 100%;
                        padding: ${mobile ? '14px' : '12px'};
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: ${mobile ? '16px' : '14px'};
                        font-weight: 500;
                        cursor: pointer;
                        transition: transform 0.3s, box-shadow 0.3s;
                        -webkit-tap-highlight-color: transparent;
                    }

                    .translate-button:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                    }

                    .translate-button:active {
                        transform: scale(0.98);
                    }

                    .translate-button-group {
                        display: flex;
                        gap: 10px;
                        margin-bottom: ${mobile ? '15px' : '20px'};
                    }

                    .translate-button-group .translate-button {
                        flex: 1;
                    }

                    .translate-section-title {
                        font-size: ${mobile ? '15px' : '16px'};
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 15px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #f0f0f0;
                    }

                    .translate-info {
                        background: #f8f9fa;
                        padding: 12px;
                        border-radius: 8px;
                        font-size: ${mobile ? '12px' : '13px'};
                        color: #666;
                        margin-top: 10px;
                        line-height: 1.5;
                    }

                    /* 响应式优化 */
                    @media (max-width: 768px) {
                        .translate-control-group {
                            margin-bottom: 15px;
                        }
                    }
                `);
            }

            setupFloatBall() {
                if (!this.floatBall) return;
                
                const size = this.configManager.get('floatBallSize');
                const position = this.configManager.get('floatBallPosition');
                const opacity = this.configManager.get('floatBallOpacity');
                
                this.floatBall.style.width = `${size}px`;
                this.floatBall.style.height = `${size}px`;
                this.floatBall.style.opacity = opacity;
                
                // 确保在可视区域内
                this.ensureInViewport();
            }

            createPanel() {
                const panel = document.createElement('div');
                panel.id = 'translate-panel';
                
                // 获取支持的语言列表
                const languages = this.getSupportedLanguages();
                
                // 获取翻译服务列表
                const services = [
                    { value: 'client.edge', name: 'Microsoft Edge' },
                    { value: 'giteeai', name: 'gitee AI' },
                    { value: 'siliconflow', name: 'SiliconFlow AI' },
                    { value: 'translate.service', name: '自定义服务' }
                ];

                const mobile = isMobile();
                const config = this.configManager.config;

                panel.innerHTML = `
                    <div class="translate-panel-header">
                        <div class="translate-panel-title">🌐 智能翻译助手</div>
                        <button class="translate-panel-close" id="translate-panel-close">✕</button>
                    </div>
                    <div class="translate-panel-body">
                        <!-- 立即翻译按钮 - 放在最上面 -->
                        <div class="translate-control-group">
                            <button class="translate-button" id="translate-now-btn">🚀 立即翻译</button>
                        </div>

                        <!-- 基础设置 -->
                        <div class="translate-section-title">基础设置</div>
                        
                        <div class="translate-control-group">
                            <label class="translate-control-label">
                                源语言
                                <div class="translate-description">当前页面的语言</div>
                            </label>
                            <select class="translate-select" id="translate-local-lang">
                                ${languages.map(lang => `
                                    <option value="${lang.value}" ${config.localLanguage === lang.value ? 'selected' : ''}>
                                        ${lang.name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">
                                目标语言
                                <div class="translate-description">要翻译成什么语言</div>
                            </label>
                            <select class="translate-select" id="translate-target-lang">
                                ${languages.map(lang => `
                                    <option value="${lang.value}" ${config.targetLanguage === lang.value ? 'selected' : ''}>
                                        ${lang.name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">启用翻译</label>
                            <label class="translate-switch">
                                <input type="checkbox" id="translate-enable" ${config.enabled ? 'checked' : ''}>
                                <span class="translate-switch-slider"></span>
                            </label>
                        </div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">
                                自动翻译
                                <div class="translate-description">页面加载时自动翻译</div>
                            </label>
                            <label class="translate-switch">
                                <input type="checkbox" id="translate-auto" ${config.autoTranslate ? 'checked' : ''}>
                                <span class="translate-switch-slider"></span>
                            </label>
                        </div>

                        <!-- 界面设置 -->
                        <div class="translate-section-title" style="margin-top: 25px;">界面设置</div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">显示悬浮球</label>
                            <label class="translate-switch">
                                <input type="checkbox" id="translate-show-ball" ${config.showFloatBall ? 'checked' : ''}>
                                <span class="translate-switch-slider"></span>
                            </label>
                        </div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">
                                允许悬浮球超出边缘
                                <div class="translate-description">允许悬浮球一半超出屏幕边缘</div>
                            </label>
                            <label class="translate-switch">
                                <input type="checkbox" id="translate-allow-half" ${config.allowHalfBall ? 'checked' : ''}>
                                <span class="translate-switch-slider"></span>
                            </label>
                        </div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">
                                双击悬浮球开关翻译
                                <div class="translate-description">快速双击悬浮球开启/关闭翻译</div>
                            </label>
                            <label class="translate-switch">
                                <input type="checkbox" id="translate-double-click" ${config.doubleClickToggle ? 'checked' : ''}>
                                <span class="translate-switch-slider"></span>
                            </label>
                        </div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">悬浮球大小</label>
                            <div class="translate-slider-container">
                                <input type="range" class="translate-slider" id="translate-ball-size" 
                                    min="30" max="80" value="${config.floatBallSize}">
                                <span class="translate-slider-value">${config.floatBallSize}px</span>
                            </div>
                        </div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">悬浮球透明度</label>
                            <div class="translate-slider-container">
                                <input type="range" class="translate-slider" id="translate-ball-opacity" 
                                    min="30" max="100" value="${config.floatBallOpacity * 100}">
                                <span class="translate-slider-value">${Math.round(config.floatBallOpacity * 100)}%</span>
                            </div>
                        </div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">控制面板大小</label>
                            <div class="translate-slider-container">
                                <input type="range" class="translate-slider" id="translate-panel-size" 
                                    min="50" max="120" value="${config.panelSize * 100}">
                                <span class="translate-slider-value">${Math.round(config.panelSize * 100)}%</span>
                            </div>
                        </div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">控制面板透明度</label>
                            <div class="translate-slider-container">
                                <input type="range" class="translate-slider" id="translate-panel-opacity" 
                                    min="50" max="100" value="${config.panelOpacity * 100}">
                                <span class="translate-slider-value">${Math.round(config.panelOpacity * 100)}%</span>
                            </div>
                        </div>

                        <div class="translate-button-group">
                            <button class="translate-button" id="translate-reset-ball-btn" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                                重置悬浮球位置
                            </button>
                            <button class="translate-button" id="translate-reset-panel-btn" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                                重置面板位置
                            </button>
                        </div>

                        <!-- 高级设置 -->
                        <div class="translate-section-title" style="margin-top: 25px;">高级设置</div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">
                                翻译服务
                                <div class="translate-description">选择翻译服务通道</div>
                            </label>
                            <select class="translate-select" id="translate-service">
                                ${services.map(service => `
                                    <option value="${service.value}" ${config.translateService === service.value ? 'selected' : ''}>
                                        ${service.name}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="translate-control-group" id="custom-service-group" style="display: ${config.translateService === 'translate.service' ? 'block' : 'none'};">
                            <label class="translate-control-label">
                                自定义翻译接口地址
                                <div class="translate-description">支持多个地址,用英文逗号分隔</div>
                            </label>
                            <input type="text" class="translate-input" id="custom-service-urls" 
                                placeholder="例如: https://api1.com/,https://api2.com/" 
                                value="${config.customServiceUrls}">
                            <button class="translate-button" id="save-custom-service" style="margin-top: 8px;">保存接口地址</button>
                        </div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">
                                忽略的Class
                                <div class="translate-description">添加不需要翻译的CSS类名,用英文逗号分隔</div>
                            </label>
                            <input type="text" class="translate-input" id="ignore-class-input" 
                                placeholder="例如: class1,class2,class3" 
                                value="${config.ignoredClasses}">
                            <button class="translate-button" id="save-ignore-class" style="margin-top: 8px;">保存Class设置</button>
                        </div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">
                                忽略的ID
                                <div class="translate-description">添加不需要翻译的元素ID,用英文逗号分隔</div>
                            </label>
                            <input type="text" class="translate-input" id="ignore-id-input" 
                                placeholder="例如: id1,id2,id3" 
                                value="${config.ignoredIds}">
                            <button class="translate-button" id="save-ignore-id" style="margin-top: 8px;">保存ID设置</button>
                        </div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">
                                自定义术语
                                <div class="translate-description">每行一个术语,格式: 原文=翻译</div>
                            </label>
                            <textarea class="translate-textarea" id="custom-terms-input" 
                                placeholder="例如:&#10;网市场云建站系统=wangmarket CMS&#10;国际化=GuoJiHua">${config.customTerms}</textarea>
                            <button class="translate-button" id="save-custom-terms" style="margin-top: 8px;">保存术语设置</button>
                        </div>

                        ${!mobile ? `
                        <div class="translate-control-group">
                            <label class="translate-control-label">
                                鼠标划词翻译
                                <div class="translate-description">选中文字自动显示翻译(仅PC端)</div>
                            </label>
                            <label class="translate-switch">
                                <input type="checkbox" id="translate-selection" ${config.enableSelectionTranslate ? 'checked' : ''}>
                                <span class="translate-switch-slider"></span>
                            </label>
                        </div>
                        ` : ''}

                        <!-- 性能优化 -->
                        <div class="translate-section-title" style="margin-top: 25px;">性能优化</div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">
                                动态内容监听
                                <div class="translate-description">自动翻译动态加载的内容</div>
                            </label>
                            <label class="translate-switch">
                                <input type="checkbox" id="translate-listener" ${config.enableListener ? 'checked' : ''}>
                                <span class="translate-switch-slider"></span>
                            </label>
                        </div>

                        <div class="translate-control-group">
                            <label class="translate-control-label">
                                缓存优化
                                <div class="translate-description">缓存翻译结果,提升响应速度</div>
                            </label>
                            <label class="translate-switch">
                                <input type="checkbox" id="translate-cache" ${config.enableCache ? 'checked' : ''}>
                                <span class="translate-switch-slider"></span>
                            </label>
                        </div>

                        <div class="translate-button-group">
                            <button class="translate-button" id="translate-clear-cache" style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);">
                                清除翻译缓存
                            </button>
                            <button class="translate-button" id="translate-reset-all" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);">
                                重置所有设置
                            </button>
                        </div>

                        <div class="translate-info">
                            💡 提示:${mobile ? '长按' : '拖动'}悬浮球或面板标题栏可调整位置,设置会自动保存<br><br>
                            🚀 支持100+种语言互译,采用AI翻译引擎,翻译质量更优<br>
                            ⚡ 内置多层缓存机制,二次访问毫秒级响应<br>
                            🔒 完全本地运行,保护您的隐私安全
                        </div>
                    </div>
                `;
                
                document.body.appendChild(panel);
                this.panel = panel;

                // 设置面板初始大小和透明度
                this.updatePanelSize();
                this.panel.style.opacity = config.panelOpacity;

                // 恢复面板位置
                if (config.panelPosition) {
                    this.panel.style.left = `${config.panelPosition.x}px`;
                    this.panel.style.top = `${config.panelPosition.y}px`;
                }
            }

            getSupportedLanguages() {
                return [
                    { value: 'chinese_simplified', name: '简体中文' },
                    { value: 'chinese_traditional', name: '繁體中文' },
                    { value: 'english', name: 'English' },
                    { value: 'spanish', name: 'Español' },
                    { value: 'hindi', name: 'हिन्दी' },
                    { value: 'arabic', name: 'العربية' },
                    { value: 'french', name: 'Français' },
                    { value: 'russian', name: 'Русский' },
                    { value: 'portuguese', name: 'Português' },
                    { value: 'bengali', name: 'বাংলা' },
                    { value: 'german', name: 'Deutsch' },
                    { value: 'japanese', name: '日本語' },
                    { value: 'vietnamese', name: 'Tiếng Việt' },
                    { value: 'korean', name: '한국어' },
                    { value: 'turkish', name: 'Türkçe' },
                    { value: 'italian', name: 'Italiano' },
                    { value: 'persian', name: 'فارسی' },
                    { value: 'urdu', name: 'اردو' },
                    { value: 'polish', name: 'Polski' },
                    { value: 'dutch', name: 'Nederlands' },
                    { value: 'thai', name: 'ไทย' },
                    { value: 'indonesian', name: 'Bahasa Indonesia' },
                    { value: 'hebrew', name: 'עברית' },
                    { value: 'ukrainian', name: 'Українська' },
                    { value: 'malay', name: 'Bahasa Melayu' },
                    { value: 'romanian', name: 'Română' },
                    { value: 'swahili', name: 'Kiswahili' },
                    { value: 'filipino', name: 'Filipino' },
                    { value: 'czech', name: 'Český' },
                    { value: 'greek', name: 'Ελληνικά' },
                    { value: 'swedish', name: 'Svenska' },
                    { value: 'hungarian', name: 'Magyar' },
                    { value: 'bulgarian', name: 'Български' },
                    { value: 'danish', name: 'Dansk' },
                    { value: 'finnish', name: 'Suomi' },
                    { value: 'slovak', name: 'Slovenčina' },
                    { value: 'norwegian', name: 'Norsk' },
                    { value: 'tamil', name: 'தமிழ்' },
                    { value: 'telugu', name: 'తెలుగు' },
                    { value: 'marathi', name: 'मराठी' },
                    { value: 'gujarati', name: 'ગુજરાતી' },
                    { value: 'punjabi', name: 'ਪੰਜਾਬੀ' },
                    { value: 'kannada', name: 'ಕನ್ನಡ' },
                    { value: 'malayalam', name: 'മലയാളം' },
                    { value: 'croatian', name: 'Hrvatski' },
                    { value: 'catalan', name: 'Català' },
                    { value: 'lithuanian', name: 'Lietuvių' },
                    { value: 'slovene', name: 'Slovenščina' },
                    { value: 'latvian', name: 'Latviešu' },
                    { value: 'estonian', name: 'Eesti' },
                    { value: 'afrikaans', name: 'Afrikaans' },
                    { value: 'albanian', name: 'Shqip' },
                    { value: 'armenian', name: 'Հայերեն' },
                    { value: 'azerbaijani', name: 'Azərbaycanca' },
                    { value: 'bosnian', name: 'Bosanski' },
                    { value: 'haitian_creole', name: 'Kreyòl Ayisyen' },
                    { value: 'icelandic', name: 'Íslenska' },
                    { value: 'irish', name: 'Gaeilge' },
                    { value: 'kurdish', name: 'Kurdî' },
                    { value: 'lao', name: 'ພາສາລາວ' },
                    { value: 'maltese', name: 'Malti' },
                    { value: 'maori', name: 'Māori' },
                    { value: 'nepali', name: 'नेपाली' },
                    { value: 'pashto', name: 'پښتو' },
                    { value: 'welsh', name: 'Cymraeg' },
                    { value: 'amharic', name: 'አማርኛ' },
                    { value: 'burmese', name: 'မြန်မာစာ' },
                    { value: 'khmer', name: 'ភាសាខ្មែរ' },
                    { value: 'malagasy', name: 'Malagasy' },
                    { value: 'oriya', name: 'ଓଡ଼ିଆ' },
                    { value: 'samoan', name: 'Gagana Samoa' },
                    { value: 'tongan', name: 'Lea faka-Tonga' },
                    { value: 'inuktitut', name: 'ᐃᓄᒃᑎᑐᑦ' }
                ];
            }

            updatePanelSize() {
                const mobile = isMobile();
                const size = this.configManager.get('panelSize');
                const baseWidth = mobile ? window.innerWidth * 0.9 : 420;
                const baseHeight = mobile ? window.innerHeight * 0.8 : 650;
                
                const width = Math.min(baseWidth * size, mobile ? window.innerWidth * 0.95 : 650);
                const maxHeight = baseHeight * size;
                
                this.panel.style.width = `${width}px`;
                this.panel.style.maxHeight = `${maxHeight}px`;
                
                // 更新body的最大高度
                const body = this.panel.querySelector('.translate-panel-body');
                if (body) {
                    body.style.maxHeight = `${maxHeight - 60}px`;
                }
            }

            bindEvents() {
                const mobile = isMobile();

                if (mobile) {
                    this.bindMobileEvents();
                } else {
                    this.bindDesktopEvents();
                }

                this.bindCommonEvents();
                this.bindPanelDragEvents();
            }

            bindPanelDragEvents() {
                const header = this.panel.querySelector('.translate-panel-header');
                const mobile = isMobile();

                if (mobile) {
                    // 移动端面板拖动
                    let isDragging = false;
                    let startX, startY, initialX, initialY;
                    let longPressTimer = null;

                    header.addEventListener('touchstart', (e) => {
                        if (e.target.id === 'translate-panel-close') return;
                        
                        const touch = e.touches[0];
                        startX = touch.clientX;
                        startY = touch.clientY;
                        initialX = this.panel.offsetLeft;
                        initialY = this.panel.offsetTop;
                        
                        longPressTimer = setTimeout(() => {
                            isDragging = true;
                            this.panel.classList.add('dragging');
                            if (navigator.vibrate) {
                                navigator.vibrate(50);
                            }
                        }, 300);
                        
                        e.preventDefault();
                    });

                    header.addEventListener('touchmove', (e) => {
                        if (!isDragging) {
                            if (longPressTimer) {
                                const touch = e.touches[0];
                                const moveDistance = Math.sqrt(
                                    Math.pow(touch.clientX - startX, 2) + 
                                    Math.pow(touch.clientY - startY, 2)
                                );
                                if (moveDistance > 10) {
                                    clearTimeout(longPressTimer);
                                    longPressTimer = null;
                                }
                            }
                            return;
                        }
                        
                        const touch = e.touches[0];
                        const dx = touch.clientX - startX;
                        const dy = touch.clientY - startY;
                        
                        let newX = initialX + dx;
                        let newY = initialY + dy;
                        
                        const maxX = window.innerWidth - this.panel.offsetWidth;
                        const maxY = window.innerHeight - this.panel.offsetHeight;
                        
                        newX = Math.max(0, Math.min(newX, maxX));
                        newY = Math.max(0, Math.min(newY, maxY));
                        
                        this.panel.style.left = `${newX}px`;
                        this.panel.style.top = `${newY}px`;
                        
                        e.preventDefault();
                    });

                    header.addEventListener('touchend', () => {
                        if (longPressTimer) {
                            clearTimeout(longPressTimer);
                            longPressTimer = null;
                        }
                        
                        if (isDragging) {
                            isDragging = false;
                            this.panel.classList.remove('dragging');
                            
                            this.configManager.set('panelPosition', {
                                x: parseInt(this.panel.style.left),
                                y: parseInt(this.panel.style.top)
                            });
                        }
                    });
                } else {
                    // PC端面板拖动
                    let isDragging = false;
                    let startX, startY, initialX, initialY;

                    header.addEventListener('mousedown', (e) => {
                        if (e.target.id === 'translate-panel-close') return;
                        
                        isDragging = true;
                        startX = e.clientX;
                        startY = e.clientY;
                        initialX = this.panel.offsetLeft;
                        initialY = this.panel.offsetTop;
                        
                        this.panel.classList.add('dragging');
                        e.preventDefault();
                    });

                    document.addEventListener('mousemove', (e) => {
                        if (!isDragging) return;
                        
                        const dx = e.clientX - startX;
                        const dy = e.clientY - startY;
                        
                        let newX = initialX + dx;
                        let newY = initialY + dy;
                        
                        const maxX = window.innerWidth - this.panel.offsetWidth;
                        const maxY = window.innerHeight - this.panel.offsetHeight;
                        
                        newX = Math.max(0, Math.min(newX, maxX));
                        newY = Math.max(0, Math.min(newY, maxY));
                        
                        this.panel.style.left = `${newX}px`;
                        this.panel.style.top = `${newY}px`;
                    });

                    document.addEventListener('mouseup', () => {
                        if (isDragging) {
                            isDragging = false;
                            this.panel.classList.remove('dragging');
                            
                            this.configManager.set('panelPosition', {
                                x: parseInt(this.panel.style.left),
                                y: parseInt(this.panel.style.top)
                            });
                        }
                    });
                }
            }

            bindMobileEvents() {
                let longPressTimer = null;
                let isDragging = false;
                let hasMoved = false;

                this.floatBall.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    this.touchStartPos = { x: touch.clientX, y: touch.clientY };
                    this.touchStartTime = Date.now();
                    hasMoved = false;
                    
                    longPressTimer = setTimeout(() => {
                        isDragging = true;
                        this.floatBall.classList.add('dragging');
                        if (navigator.vibrate) {
                            navigator.vibrate(50);
                        }
                    }, 300);

                    this.dragOffset.x = touch.clientX - this.floatBall.offsetLeft;
                    this.dragOffset.y = touch.clientY - this.floatBall.offsetTop;
                });

                this.floatBall.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    const touch = e.touches[0];
                    
                    const moveDistance = Math.sqrt(
                        Math.pow(touch.clientX - this.touchStartPos.x, 2) + 
                        Math.pow(touch.clientY - this.touchStartPos.y, 2)
                    );
                    
                    if (moveDistance > 10) {
                        hasMoved = true;
                        if (longPressTimer) {
                            clearTimeout(longPressTimer);
                            longPressTimer = null;
                        }
                    }

                    if (isDragging) {
                        let newX = touch.clientX - this.dragOffset.x;
                        let newY = touch.clientY - this.dragOffset.y;
                        
                        if (!this.configManager.get('allowHalfBall')) {
                            const maxX = window.innerWidth - this.floatBall.offsetWidth;
                            const maxY = window.innerHeight - this.floatBall.offsetHeight;
                            newX = Math.max(0, Math.min(newX, maxX));
                            newY = Math.max(0, Math.min(newY, maxY));
                        } else {
                            const halfSize = this.floatBall.offsetWidth / 2;
                            const maxX = window.innerWidth - halfSize;
                            const maxY = window.innerHeight - halfSize;
                            newX = Math.max(-halfSize, Math.min(newX, maxX));
                            newY = Math.max(-halfSize, Math.min(newY, maxY));
                        }
                        
                        this.floatBall.style.left = `${newX}px`;
                        this.floatBall.style.top = `${newY}px`;
                    }
                });

                this.floatBall.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    
                    if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        longPressTimer = null;
                    }

                    this.floatBall.classList.remove('dragging');

                    if (isDragging) {
                        this.configManager.set('floatBallPosition', {
                            x: parseInt(this.floatBall.style.left),
                            y: parseInt(this.floatBall.style.top)
                        });
                    } else if (!hasMoved) {
                        this.handleBallClick();
                    }

                    isDragging = false;
                    hasMoved = false;
                });
            }

            bindDesktopEvents() {
                this.floatBall.addEventListener('click', (e) => {
                    if (!this.isDragging) {
                        this.handleBallClick();
                    }
                });

                this.floatBall.addEventListener('mousedown', (e) => {
                    this.isDragging = false;
                    this.dragOffset.x = e.clientX - this.floatBall.offsetLeft;
                    this.dragOffset.y = e.clientY - this.floatBall.offsetTop;
                    this.floatBall.classList.add('dragging');
                    
                    const mouseMoveHandler = (e) => {
                        this.isDragging = true;
                        let newX = e.clientX - this.dragOffset.x;
                        let newY = e.clientY - this.dragOffset.y;
                        
                        if (!this.configManager.get('allowHalfBall')) {
                            const maxX = window.innerWidth - this.floatBall.offsetWidth;
                            const maxY = window.innerHeight - this.floatBall.offsetHeight;
                            newX = Math.max(0, Math.min(newX, maxX));
                            newY = Math.max(0, Math.min(newY, maxY));
                        } else {
                            const halfSize = this.floatBall.offsetWidth / 2;
                            const maxX = window.innerWidth - halfSize;
                            const maxY = window.innerHeight - halfSize;
                            newX = Math.max(-halfSize, Math.min(newX, maxX));
                            newY = Math.max(-halfSize, Math.min(newY, maxY));
                        }
                        
                        this.floatBall.style.left = `${newX}px`;
                        this.floatBall.style.top = `${newY}px`;
                    };
                    
                    const mouseUpHandler = () => {
                        document.removeEventListener('mousemove', mouseMoveHandler);
                        document.removeEventListener('mouseup', mouseUpHandler);
                        this.floatBall.classList.remove('dragging');
                        
                        if (this.isDragging) {
                            this.configManager.set('floatBallPosition', {
                                x: parseInt(this.floatBall.style.left),
                                y: parseInt(this.floatBall.style.top)
                            });
                        }
                        
                        setTimeout(() => {
                            this.isDragging = false;
                        }, 100);
                    };
                    
                    document.addEventListener('mousemove', mouseMoveHandler);
                    document.addEventListener('mouseup', mouseUpHandler);
                });
            }

            handleBallClick() {
                const doubleClickEnabled = this.configManager.get('doubleClickToggle');
                const currentTime = Date.now();
                
                if (doubleClickEnabled) {
                    this.clickCount++;
                    
                    if (this.clickCount === 1) {
                        // 第一次点击,等待第二次点击
                        this.clickTimer = setTimeout(() => {
                            // 超时,只是单击,打开设置面板
                            this.togglePanel();
                            this.clickCount = 0;
                        }, 300);
                    } else if (this.clickCount === 2) {
                        // 第二次点击,是双击
                        clearTimeout(this.clickTimer);
                        this.clickCount = 0;
                        
                        // 执行双击开关翻译
                        const enabled = this.configManager.get('enabled');
                        if (!enabled) {
                            // 当前未启用,开启翻译(执行立即翻译)
                            this.configManager.set('enabled', true);
                            this.translateManager.toggle(true);
                            const targetLang = this.configManager.get('targetLanguage');
                            this.translateManager.changeLanguage(targetLang);
                            this.updateUI();
                            this.toast.show('✅ 翻译已开启');
                        } else {
                            // 当前已启用,关闭翻译
                            this.configManager.set('enabled', false);
                            this.translateManager.toggle(false);
                            this.updateUI();
                            this.toast.show('❌ 翻译已关闭');
                        }
                    }
                } else {
                    // 未启用双击功能,直接打开设置面板
                    this.togglePanel();
                }
            }

            bindCommonEvents() {
                // 面板关闭按钮
                document.getElementById('translate-panel-close').addEventListener('click', () => {
                    this.togglePanel();
                });

                // 立即翻译按钮
                document.getElementById('translate-now-btn').addEventListener('click', () => {
                    const targetLang = this.configManager.get('targetLanguage');
                    this.translateManager.changeLanguage(targetLang);
                    this.toast.show('🚀 正在翻译...');
                    this.togglePanel();
                });

                // 启用翻译开关
                document.getElementById('translate-enable').addEventListener('change', (e) => {
                    this.configManager.set('enabled', e.target.checked);
                    this.translateManager.toggle(e.target.checked);
                    this.updateUI();
                    this.toast.show(e.target.checked ? '✅ 翻译已启用' : '❌ 翻译已禁用');
                });

                // 自动翻译开关
                document.getElementById('translate-auto').addEventListener('change', (e) => {
                    this.configManager.set('autoTranslate', e.target.checked);
                    this.toast.show(e.target.checked ? '✅ 自动翻译已启用' : '❌ 自动翻译已禁用');
                });

                // 本地语言选择
                document.getElementById('translate-local-lang').addEventListener('change', (e) => {
                    this.configManager.set('localLanguage', e.target.value);
                    if (typeof translate !== 'undefined') {
                        translate.language.setLocal(e.target.value);
                    }
                    this.toast.show('✅ 源语言已更新');
                });

                // 目标语言选择
                document.getElementById('translate-target-lang').addEventListener('change', (e) => {
                    this.configManager.set('targetLanguage', e.target.value);
                    this.toast.show('✅ 目标语言已更新');
                });

                // 显示悬浮球开关
                document.getElementById('translate-show-ball').addEventListener('change', (e) => {
                    this.configManager.set('showFloatBall', e.target.checked);
                    this.floatBall.style.display = e.target.checked ? 'flex' : 'none';
                    this.toast.show(e.target.checked ? '✅ 悬浮球已显示' : '❌ 悬浮球已隐藏');
                });

                // 允许悬浮球超出边缘
                document.getElementById('translate-allow-half').addEventListener('change', (e) => {
                    this.configManager.set('allowHalfBall', e.target.checked);
                    this.ensureInViewport();
                    this.toast.show(e.target.checked ? '✅ 允许超出边缘' : '❌ 禁止超出边缘');
                });

                // 双击开关翻译
                document.getElementById('translate-double-click').addEventListener('change', (e) => {
                    this.configManager.set('doubleClickToggle', e.target.checked);
                    this.toast.show(e.target.checked ? '✅ 双击开关翻译已启用' : '❌ 双击开关翻译已禁用');
                });

                // 悬浮球大小滑块
                const sizeSlider = document.getElementById('translate-ball-size');
                if (sizeSlider) {
                    sizeSlider.addEventListener('input', (e) => {
                        const size = parseInt(e.target.value);
                        this.configManager.set('floatBallSize', size);
                        this.floatBall.style.width = `${size}px`;
                        this.floatBall.style.height = `${size}px`;
                        e.target.nextElementSibling.textContent = `${size}px`;
                        this.ensureInViewport();
                    });
                }

                // 悬浮球透明度滑块
                const opacitySlider = document.getElementById('translate-ball-opacity');
                if (opacitySlider) {
                    opacitySlider.addEventListener('input', (e) => {
                        const opacity = parseInt(e.target.value) / 100;
                        this.configManager.set('floatBallOpacity', opacity);
                        this.floatBall.style.opacity = opacity;
                        e.target.nextElementSibling.textContent = `${e.target.value}%`;
                    });
                }

                // 控制面板大小滑块
                const panelSizeSlider = document.getElementById('translate-panel-size');
                if (panelSizeSlider) {
                    panelSizeSlider.addEventListener('input', (e) => {
                        const size = parseInt(e.target.value) / 100;
                        this.configManager.set('panelSize', size);
                        this.updatePanelSize();
                        e.target.nextElementSibling.textContent = `${e.target.value}%`;
                        this.ensurePanelInViewport();
                    });
                }

                // 控制面板透明度滑块
                const panelOpacitySlider = document.getElementById('translate-panel-opacity');
                if (panelOpacitySlider) {
                    panelOpacitySlider.addEventListener('input', (e) => {
                        const opacity = parseInt(e.target.value) / 100;
                        this.configManager.set('panelOpacity', opacity);
                        this.panel.style.opacity = opacity;
                        e.target.nextElementSibling.textContent = `${e.target.value}%`;
                    });
                }

                // 翻译服务选择
                document.getElementById('translate-service').addEventListener('change', (e) => {
                    this.configManager.set('translateService', e.target.value);
                    if (typeof translate !== 'undefined') {
                        translate.service.use(e.target.value);
                    }
                    
                    // 显示/隐藏自定义服务地址输入框
                    const customServiceGroup = document.getElementById('custom-service-group');
                    if (customServiceGroup) {
                        customServiceGroup.style.display = e.target.value === 'translate.service' ? 'block' : 'none';
                    }
                    
                    this.toast.show('✅ 翻译服务已更新');
                });

                // 保存自定义服务地址
                document.getElementById('save-custom-service').addEventListener('click', () => {
                    const input = document.getElementById('custom-service-urls');
                    const value = input.value.trim();
                    this.configManager.set('customServiceUrls', value);
                    
                    // 立即应用设置
                    if (value && typeof translate !== 'undefined') {
                        const urls = value.split(',').map(url => url.trim()).filter(url => url);
                        if (urls.length > 0) {
                            translate.request.api.host = urls.length === 1 ? urls[0] : urls;
                        }
                    }
                    
                    this.toast.show('✅ 自定义服务地址已保存');
                });

                // 保存忽略的Class
                document.getElementById('save-ignore-class').addEventListener('click', () => {
                    const input = document.getElementById('ignore-class-input');
                    const value = input.value.trim();
                    this.configManager.set('ignoredClasses', value);
                    this.translateManager.applyIgnoreSettings();
                    this.toast.show('✅ 忽略Class设置已保存');
                });

                // 保存忽略的ID
                document.getElementById('save-ignore-id').addEventListener('click', () => {
                    const input = document.getElementById('ignore-id-input');
                    const value = input.value.trim();
                    this.configManager.set('ignoredIds', value);
                    this.translateManager.applyIgnoreSettings();
                    this.toast.show('✅ 忽略ID设置已保存');
                });

                // 保存自定义术语
                document.getElementById('save-custom-terms').addEventListener('click', () => {
                    const input = document.getElementById('custom-terms-input');
                    const value = input.value.trim();
                    this.configManager.set('customTerms', value);
                    this.translateManager.applyCustomTerms();
                    this.toast.show('✅ 自定义术语已保存');
                });

                // 鼠标划词翻译(仅PC端)
                const selectionToggle = document.getElementById('translate-selection');
                if (selectionToggle) {
                    selectionToggle.addEventListener('change', (e) => {
                        this.configManager.set('enableSelectionTranslate', e.target.checked);
                        if (e.target.checked) {
                            this.translateManager.startSelectionTranslate();
                            this.toast.show('✅ 鼠标划词翻译已启用');
                        } else {
                            this.translateManager.stopSelectionTranslate();
                            this.toast.show('❌ 鼠标划词翻译已禁用');
                        }
                    });
                }

                // 动态内容监听
                document.getElementById('translate-listener').addEventListener('change', (e) => {
                    this.configManager.set('enableListener', e.target.checked);
                    if (e.target.checked && !this.translateManager.listenerStarted) {
                        this.translateManager.startListener();
                    }
                    this.toast.show(e.target.checked ? '✅ 动态内容监听已启用' : '❌ 动态内容监听已禁用');
                });

                // 缓存优化
                document.getElementById('translate-cache').addEventListener('change', (e) => {
                    this.configManager.set('enableCache', e.target.checked);
                    if (typeof translate !== 'undefined' && translate.storage) {
                        if (e.target.checked) {
                            translate.storage.enable();
                        } else {
                            translate.storage.disable();
                        }
                    }
                    this.toast.show(e.target.checked ? '✅ 缓存优化已启用' : '❌ 缓存优化已禁用');
                });

                // 重置悬浮球位置按钮
                document.getElementById('translate-reset-ball-btn').addEventListener('click', () => {
                    const defaultPosition = { x: 20, y: 100 };
                    this.floatBall.style.left = `${defaultPosition.x}px`;
                    this.floatBall.style.top = `${defaultPosition.y}px`;
                    this.configManager.set('floatBallPosition', defaultPosition);
                    this.toast.show('✅ 悬浮球位置已重置');
                });

                // 重置面板位置按钮
                document.getElementById('translate-reset-panel-btn').addEventListener('click', () => {
                    this.configManager.set('panelPosition', null);
                    this.positionPanel();
                    this.toast.show('✅ 面板位置已重置');
                });

                // 清除缓存按钮
                document.getElementById('translate-clear-cache').addEventListener('click', () => {
                    const cleared = this.configManager.clearCache();
                    this.toast.show(`✅ 已清除 ${cleared} 个翻译缓存项`);
                });

                // 重置所有设置按钮
                document.getElementById('translate-reset-all').addEventListener('click', () => {
                    if (confirm('确定要重置所有设置吗?此操作不可撤销。')) {
                        this.configManager.reset();
                        this.toast.show('✅ 所有设置已重置,即将刷新页面...', 'success', 1500);
                        setTimeout(() => {
                            location.reload();
                        }, 1500);
                    }
                });

                // 监听窗口大小变化
                window.addEventListener('resize', () => {
                    this.ensureInViewport();
                    this.ensurePanelInViewport();
                });

                // 监听方向变化
                window.addEventListener('orientationchange', () => {
                    setTimeout(() => {
                        this.ensureInViewport();
                        this.ensurePanelInViewport();
                        this.updatePanelSize();
                    }, 300);
                });
            }

            updateUI() {
                const enabled = this.configManager.get('enabled');
                const enableCheckbox = document.getElementById('translate-enable');
                if (enableCheckbox) {
                    enableCheckbox.checked = enabled;
                }
            }

            togglePanel() {
                if (this.panel.classList.contains('show')) {
                    this.panel.classList.remove('show');
                } else {
                    this.panel.classList.add('show');
                    const savedPosition = this.configManager.get('panelPosition');
                    if (!savedPosition) {
                        this.positionPanel();
                    } else {
                        this.ensurePanelInViewport();
                    }
                }
            }

            positionPanel() {
                const mobile = isMobile();
                
                if (mobile) {
                    // 移动端居中显示
                    const panelWidth = this.panel.offsetWidth;
                    const panelHeight = this.panel.offsetHeight;
                    
                    const left = (window.innerWidth - panelWidth) / 2;
                    const top = (window.innerHeight - panelHeight) / 2;
                    
                    this.panel.style.left = `${left}px`;
                    this.panel.style.top = `${top}px`;
                } else {
                    // PC端根据悬浮球位置定位
                    const ballRect = this.floatBall.getBoundingClientRect();
                    const panelWidth = this.panel.offsetWidth;
                    const panelHeight = this.panel.offsetHeight;
                    
                    let left = ballRect.right + 10;
                    let top = ballRect.top;
                    
                    if (left + panelWidth > window.innerWidth) {
                        left = ballRect.left - panelWidth - 10;
                    }
                    
                    if (left < 0) {
                        left = (window.innerWidth - panelWidth) / 2;
                    }
                    
                    if (top < 10) {
                        top = 10;
                    }
                    
                    if (top + panelHeight > window.innerHeight - 10) {
                        top = window.innerHeight - panelHeight - 10;
                    }
                    
                    this.panel.style.left = `${left}px`;
                    this.panel.style.top = `${top}px`;
                }
            }

            ensureInViewport() {
                const position = this.configManager.get('floatBallPosition');
                const size = this.configManager.get('floatBallSize');
                const allowHalf = this.configManager.get('allowHalfBall');
                
                let x = position.x;
                let y = position.y;
                
                if (allowHalf) {
                    const halfSize = size / 2;
                    const maxX = window.innerWidth - halfSize;
                    const maxY = window.innerHeight - halfSize;
                    x = Math.max(-halfSize, Math.min(x, maxX));
                    y = Math.max(-halfSize, Math.min(y, maxY));
                } else {
                    const maxX = window.innerWidth - size;
                    const maxY = window.innerHeight - size;
                    x = Math.max(0, Math.min(x, maxX));
                    y = Math.max(0, Math.min(y, maxY));
                }
                
                this.floatBall.style.left = `${x}px`;
                this.floatBall.style.top = `${y}px`;
                
                if (x !== position.x || y !== position.y) {
                    this.configManager.set('floatBallPosition', { x, y });
                }
            }

            ensurePanelInViewport() {
                if (!this.panel.classList.contains('show')) return;
                
                const position = this.configManager.get('panelPosition');
                if (!position) return;
                
                const panelWidth = this.panel.offsetWidth;
                const panelHeight = this.panel.offsetHeight;
                
                let x = position.x;
                let y = position.y;
                
                const maxX = window.innerWidth - panelWidth;
                const maxY = window.innerHeight - panelHeight;
                
                x = Math.max(0, Math.min(x, maxX));
                y = Math.max(0, Math.min(y, maxY));
                
                this.panel.style.left = `${x}px`;
                this.panel.style.top = `${y}px`;
                
                if (x !== position.x || y !== position.y) {
                    this.configManager.set('panelPosition', { x, y });
                }
            }
        }

        // 工具函数
        function isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                || window.innerWidth <= 768;
        }

        function isDarkMode() {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        // 初始化
        async function init() {
            // 等待DOM加载
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            try {
                // 检查是否已加载translate.js
                if (typeof translate === 'undefined') {
                    console.error('translate.js未加载,请检查@require配置');
                    return;
                }
                
                // 初始化组件
                const configManager = new ConfigManager();
                const translateManager = new TranslateManager(configManager);
                const uiManager = new UIManager(configManager, translateManager);

                // 注册菜单命令
                GM_registerMenuCommand('打开翻译设置', () => {
                    uiManager.togglePanel();
                });

                // 全局对象
                window.translateHelper = {
                    config: configManager,
                    translate: translateManager,
                    ui: uiManager
                };

                console.log('智能翻译助手已加载完成');
                console.log('使用说明:');
                console.log('- 单击悬浮球打开设置面板');
                console.log('- 拖拽悬浮球调整位置');
                console.log('- 支持100+种语言互译');
                console.log('- 可通过window.translateHelper访问API');
            } catch (error) {
                console.error('翻译脚本初始化失败:', error);
            }
        }

        // 延迟初始化主功能,确保悬浮球已显示
        setTimeout(init, 100);
    })();
})();
