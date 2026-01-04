// ==UserScript==
// @name         seo-task auto watch video earn ruble
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  seo-task auto watch video unlimited ruble work via browser
// @author       aligood2023
// @match        *://*.blogspot.com/*
// @match        https://seo-task.com/job_youtube?area=view
// @match        https://seo-task.com/users_statistics
// @match        *://*.youtube.com/*
// @grant        window.close
// @grant        window.open
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/542144/seo-task%20auto%20watch%20video%20earn%20ruble.user.js
// @updateURL https://update.greasyfork.org/scripts/542144/seo-task%20auto%20watch%20video%20earn%20ruble.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 0. إضافة زر Auto Watch في صفحة الإحصائيات
    function addAutoWatchButton() {
        if (window.location.href !== "https://seo-task.com/users_statistics") return;

        // تصميم الزر
        GM_addStyle(`
            .auto-watch-btn {
                background-color: #4CAF50;
                border: none;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 10px 2px;
                cursor: pointer;
                border-radius: 5px;
                font-weight: bold;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            }
            .auto-watch-btn:hover {
                background-color: #45a049;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            .auto-watch-btn:active {
                transform: translateY(0);
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
        `);

        // إنشاء الزر وإضافته إلى الصفحة
        const btn = document.createElement('button');
        btn.className = 'auto-watch-btn';
        btn.textContent = 'click to Auto Watch';
        btn.onclick = function() {
            window.location.href = 'https://seo-task.com/job_youtube?area=view';
        };

        // البحث عن مكان مناسب لوضع الزر (مثلاً بعد عنصر h2)
        const header = document.querySelector('h2');
        if (header) {
            header.parentNode.insertBefore(btn, header.nextSibling);
        } else {
            // إذا لم يتم العثور على العنصر المطلوب، نضيف الزر في بداية body
            document.body.insertBefore(btn, document.body.firstChild);
        }
    }

    // 1. تسريع الوقت (لصفحات Blogspot فقط)
    function initSpeedUpTime() {
        if (!window.location.hostname.includes('blogspot.com')) return;

        let isScriptActive = true;
        const speedFactor = 5;

        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;

        window.setTimeout = function(callback, delay, ...args) {
            if (!isScriptActive) {
                return originalSetTimeout(callback, delay, ...args);
            }
            return originalSetTimeout(callback, delay / speedFactor, ...args);
        };

        window.setInterval = function(callback, delay, ...args) {
            if (!isScriptActive) {
                return originalSetInterval(callback, delay, ...args);
            }
            return originalSetInterval(callback, delay / speedFactor, ...args);
        };

        function checkTimerAndToggle() {
            const timerElement = document.getElementById('timer');
            if (timerElement) {
                const timerValue = parseInt(timerElement.textContent, 10);
                if (!isNaN(timerValue)) {
                    if (timerValue > 10 && isScriptActive) {
                        isScriptActive = false;
                        console.log('تم تعطيل تسريع الوقت - المؤقت > 10');
                    } else if (timerValue <= 10 && !isScriptActive) {
                        isScriptActive = true;
                        console.log('تم تفعيل تسريع الوقت - المؤقت <= 10');
                    }
                }
            }
        }

        setInterval(checkTimerAndToggle, 1000);
    }

    // 2. فتح نافذة جديدة وإغلاق الحالية (لصفحات Blogspot فقط)
    function initOpenNewTab() {
        if (!window.location.hostname.includes('blogspot.com')) return;

        let executed = false;
        const targetUrl = "https://seo-task.com/job_youtube?area=view";
        const targetText = "Вам начислено";

        function executeActions() {
            if (!executed && document.body.innerText.includes(targetText)) {
                executed = true;
                window.open(targetUrl, '_blank');
                setTimeout(() => {
                    try {
                        window.close();
                    } catch (e) {
                        console.log('لم يتم إغلاق النافذة تلقائياً');
                    }
                }, 70);
            }
        }

        executeActions();
        
        const observer = new MutationObserver(executeActions);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        setInterval(executeActions, 1000);
    }

    // 3. النقر التلقائي مع التحقق من النص (لصفحة seo-task فقط)
    function initAutoClick() {
        if (window.location.href !== "https://seo-task.com/job_youtube?area=view") return;

        const MAX_RETRIES = 3;
        const RETRY_DELAY = 2000;
        const VERIFICATION_TEXT = "ОТПРАВИТЬ НА ПРОВЕРКУ";
        const VERIFICATION_TEXT_2 = "Для продолжения пройдите проверку внутри страницы";
        let retryCount = 0;
        let originalWindowCount = window.frames.length;

        function shouldCloseTab() {
            // إذا ظهر نص التحقق، لا تغلق الصفحة
            if (document.body.innerText.includes(VERIFICATION_TEXT) || 
                document.body.innerText.includes(VERIFICATION_TEXT_2)) {
                console.log('تم اكتشاف نص التحقق، لن يتم إغلاق الصفحة');
                return false;
            }
            return true;
        }

        function executeActions() {
            setTimeout(() => {
                const button = document.querySelector('.list-name');
                
                if (button) {
                    console.log(`النقر على الزر (المحاولة ${retryCount + 1}/${MAX_RETRIES})`);
                    button.click();
                    
                    setTimeout(() => {
                        if (window.frames.length <= originalWindowCount) {
                            retryCount++;
                            
                            if (retryCount < MAX_RETRIES) {
                                console.log('إعادة المحاولة...');
                                setTimeout(executeActions, RETRY_DELAY);
                            } else if (shouldCloseTab()) {
                                console.log('الحد الأقصى للمحاولات، إغلاق الصفحة');
                                closeTab();
                            }
                        } else if (shouldCloseTab()) {
                            console.log('تم فتح نافذة جديدة، إغلاق الصفحة الأصلية');
                            closeTab();
                        }
                    }, 1000);
                } else if (shouldCloseTab()) {
                    console.error('الزر غير موجود، إغلاق الصفحة');
                    closeTab();
                }
            }, 2000);
        }

        function closeTab() {
            try {
                window.close();
            } catch (e) {
                console.error('خطأ في الإغلاق التلقائي:', e);
                window.location.href = 'about:blank';
            }
        }

        if (document.readyState === 'complete') {
            executeActions();
        } else {
            window.addEventListener('load', executeActions);
        }

        // مراقبة ظهور نص التحقق
        const verificationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.innerText.includes(VERIFICATION_TEXT) || 
                    mutation.target.innerText.includes(VERIFICATION_TEXT_2)) {
                    console.log('تم اكتشاف نص التحقق أثناء المراقبة');
                }
            });
        });

        verificationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    function playvideo() {
        const config = {
            delay: 1500,            // تأخير بدء التشغيل (ميلي ثانية)
            maxAttempts: 5,         // أقصى عدد من المحاولات
            attemptInterval: 3000,   // الفترة بين المحاولات (ميلي ثانية)
            muteVideos: true,        // تشغيل الفيديوهات بدون صوت لتجاوز القيود
            debug: false            // وضع تصحيح الأخطاء
        };

        let attempts = 0;
        let processedVideos = new WeakSet();

        // دالة تسجيل الأخطاء والتنبيهات
        function log(message) {
            if (config.debug) {
                console.log(`[YT Autoplay] ${message}`);
            }
        }

        // دالة تشغيل فيديو اليوتيوب المضمن
        function playYouTubeIframe(iframe) {
            if (processedVideos.has(iframe)) return;

            try {
                let src = iframe.src.split('#')[0].split('?')[0];
                const params = new URLSearchParams(iframe.src.split('?')[1] || '');

                // إضافة/تعديل المعلمات المطلوبة
                params.set('autoplay', '1');
                if (config.muteVideos) params.set('mute', '1');
                params.set('enablejsapi', '1');
                params.set('playsinline', '1');

                const newSrc = `${src}?${params.toString()}`;
                if (iframe.src !== newSrc) {
                    iframe.src = newSrc;
                    log(`تم تعديل iframe اليوتيوب: ${newSrc}`);
                }

                // طريقة بديلة باستخدام postMessage
                setTimeout(() => {
                    try {
                        iframe.contentWindow.postMessage(JSON.stringify({
                            event: 'command',
                            func: 'playVideo',
                            args: []
                        }), '*');
                    } catch (e) {
                        log(`خطأ في postMessage: ${e.message}`);
                    }
                }, 500);

                processedVideos.add(iframe);
                return true;
            } catch (e) {
                log(`خطأ في معالجة iframe: ${e.message}`);
                return false;
            }
        }

        // دالة تشغيل عناصر الفيديو العادية
        function playHTML5Video(video) {
            if (processedVideos.has(video)) return;

            try {
                if (config.muteVideos) {
                    video.muted = true;
                }

                const playPromise = video.play();

                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        log(`خطأ في تشغيل الفيديو: ${e.message}`);
                        // إعادة المحاولة مع mute إجباري إذا فشلت المحاولة الأولى
                        video.muted = true;
                        video.play().catch(e => log(`فشل التشغيل بعد المحاولة الثانية: ${e.message}`));
                    });
                }

                processedVideos.add(video);
                return true;
            } catch (e) {
                log(`خطأ في معالجة الفيديو: ${e.message}`);
                return false;
            }
        }

        // الدالة الرئيسية للبحث والتشغيل
        function findAndPlayVideos() {
            if (attempts >= config.maxAttempts) {
                log(`توقف المحاولات بعد ${config.maxAttempts} محاولات`);
                return;
            }

            attempts++;
            log(`المحاولة رقم ${attempts}`);

            // البحث عن iframes اليوتيوب
            const youtubeIframes = document.querySelectorAll('iframe[src*="youtube.com/embed"], iframe[src*="youtube-nocookie.com/embed"]');
            youtubeIframes.forEach(playYouTubeIframe);

            // البحث عن عناصر الفيديو العادية
            const html5Videos = document.querySelectorAll('video:not([autoplay])');
            html5Videos.forEach(playHTML5Video);

            // إذا لم يتم العثور على أي فيديو، نعيد المحاولة بعد فترة
            if (youtubeIframes.length === 0 && html5Videos.length === 0) {
                setTimeout(findAndPlayVideos, config.attemptInterval);
            }
        }

        // بدء التشغيل بعد تأخير مبدئي
        setTimeout(findAndPlayVideos, config.delay);

        // مراقبة DOM لاكتشاف الفيديوهات التي يتم تحميلها ديناميكياً
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    log('تم اكتشاف تغييرات في DOM، البحث عن فيديوهات جديدة');
                    setTimeout(findAndPlayVideos, 500);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // مراقبة تغييرات السمة src لاكتشاف التغييرات على الفيديوهات الموجودة
        const srcObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'src' && mutation.target.tagName === 'IFRAME') {
                    if (mutation.target.src.includes('youtube.com') && !processedVideos.has(mutation.target)) {
                        log('تم تغيير src لـ iframe اليوتيوب، معالجته');
                        setTimeout(() => playYouTubeIframe(mutation.target), 500);
                    }
                }
            });
        });

        // تطبيق المراقبة على جميع iframes الموجودة والمستقبلية
        document.querySelectorAll('iframe').forEach(iframe => {
            srcObserver.observe(iframe, { attributes: true });
        });

        // مراقبة iframes الجديدة
        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IFRAME') {
                        srcObserver.observe(node, { attributes: true });
                    }
                });
            });
        }).observe(document.body, { childList: true, subtree: true });

        log('تم تحميل السكريبت بنجاح، جاهز لتشغيل الفيديوهات');
    }

    playvideo();

    // تشغيل الوظائف المناسبة حسب الصفحة الحالية
    if (window.location.hostname.includes('blogspot.com')) {
        initSpeedUpTime();
        initOpenNewTab();
    } else if (window.location.href === "https://seo-task.com/job_youtube?area=view") {
        initAutoClick();
    } else if (window.location.href === "https://seo-task.com/users_statistics") {
        addAutoWatchButton();
    }
})();