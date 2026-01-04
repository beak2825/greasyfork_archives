// ==UserScript==
// @name             OpenAI TTS Text Reader (gpt-4o-mini-tts)
// @namespace        http://tampermonkey.net/
// @version          2.6.6 // Version incremented due to model change
// @description      Read selected text with OpenAI's TTS API (gpt-4o-mini-tts model) and adjustable volume and speed. Please enter the apikey before using.
// @description:ar   قراءة النص المحدد باستخدام واجهة برمجة تطبيقات تحويل النص إلى كلام من OpenAI (نموذج gpt-4o-mini-tts) مع إمكانية ضبط مستوى الصوت والسرعة. يرجى إدخال مفتاح الواجهة البرمجية (apikey) قبل الاستخدام.
// @include          *
// @author           wkf16 (Modified by AI assistant for Bahattab)
// @license          MIT
// @grant            GM_xmlhttpRequest
// @connect          api.openai.com
// @antifeature cross-domain This script makes cross-domain API calls to OpenAI's TTS service, which may have implications for data security and privacy.
// @downloadURL https://update.greasyfork.org/scripts/534559/OpenAI%20TTS%20Text%20Reader%20%28gpt-4o-mini-tts%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534559/OpenAI%20TTS%20Text%20Reader%20%28gpt-4o-mini-tts%29.meta.js
// ==/UserScript==
var YOUR_API_KEY = "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"; // استخدم مفتاح الواجهة البرمجية الخاص بك
(function() {
    'use strict';
    var currentSource = null;
    var isPlaying = false;
    var audioContext = new AudioContext();
    var gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    var playbackRate = 1;

    // إنشاء الزر
    var readButton = document.createElement("button");
    styleButton(readButton);
    document.body.appendChild(readButton);

    // إنشاء وإضافة نص الزر
    var buttonText = document.createElement("span");
    buttonText.textContent = ">";
    styleButtonText(buttonText);
    readButton.appendChild(buttonText);

    // إنشاء لوحة التحكم
    var controlPanel = document.createElement("div");
    styleControlPanel(controlPanel);
    document.body.appendChild(controlPanel);

    // إنشاء وإضافة منزلقات مستوى الصوت والسرعة إلى لوحة التحكم
    var volumeControl = createSlider("الصوت", 0, 1, 0.5, 0.01, function(value) {
        gainNode.gain.value = value;
    });
    controlPanel.appendChild(volumeControl.wrapper);
    volumeControl.slider.value = 0.5;
    var speedControl = createSlider("السرعة", 0.5, 1.5, 1, 0.05, function(value) { playbackRate = value; });
    controlPanel.appendChild(speedControl.wrapper);
    speedControl.slider.value = 1;

    // حدث النقر على الزر
    readButton.addEventListener('click', function() {
        var selectedText = window.getSelection().toString();
        console.log("Setting gainNode.gain.value to: ", gainNode.gain.value);
        if (isPlaying) {
            if (currentSource) {
                currentSource.stop(); // إيقاف الصوت قيد التشغيل حاليًا
            }
            HideSpinner(buttonText); // Reset button to play state
            isPlaying = false; // Ensure state is updated
        } else{
            if (selectedText) {
                textToSpeech(selectedText);
            } else {
                alert("رجاءً، قم بتحديد بعض النص أولاً.");
            }
       }
    });

    // إنشاء وتنسيق لوحة التحكم والمنزلقات
    function createSlider(labelText, min, max, value, step, onChange) {
        var wrapper = document.createElement("div");
        var label = document.createElement("label");
        label.textContent = labelText;
        label.style.color = "white";
        label.style.textAlign = "right";
        label.style.flex = "1";

        var slider = document.createElement("input");
        slider.type = "range";
        slider.min = min;
        slider.max = max;
        slider.step = step;

        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.padding = '8px';

        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
        input[type='range'] {
            -webkit-appearance: none; appearance: none;
            width: 90%; height: 8px; border-radius: 8px;
            background: rgba(255, 255, 255, 0.2); outline: none;
            margin-right: 10px; margin-left: 0;
        }
        input[type='range']::-webkit-slider-thumb {
            -webkit-appearance: none; appearance: none;
            width: 16px; height: 16px; border-radius: 50%;
            background: #4CAF50; cursor: pointer; box-shadow: 0 0 2px #888;
        }
        input[type='range']:focus::-webkit-slider-thumb { background: #ccc; }
        `;
        document.head.appendChild(styleSheet);

        slider.oninput = function() { onChange(this.value); };
        wrapper.appendChild(label);
        wrapper.appendChild(slider);
        return { wrapper: wrapper, slider: slider };
    }
    // تعيين نمط لوحة التحكم
    function styleControlPanel(panel) {
        panel.style.position = 'fixed'; panel.style.bottom = '20px';
        panel.style.right = '80px'; panel.style.width = '200px';
        panel.style.background = 'rgba(0, 0, 0, 0.7)'; panel.style.borderRadius = '10px';
        panel.style.padding = '10px'; panel.style.boxSizing = 'border-box';
        panel.style.visibility = 'hidden'; panel.style.opacity = 0;
        panel.style.transition = 'opacity 0.5s, visibility 0.5s';
        panel.style.display = 'flex'; panel.style.flexDirection = 'column';
        panel.style.zIndex = '10000';
    }

    // تعيين نمط الزر
    function styleButton(button) {
        button.style.position = 'fixed'; button.style.bottom = '80px';
        button.style.right = '20px'; button.style.zIndex = '1000';
        button.style.width = '40px'; button.style.height = '40px';
        button.style.borderRadius = '50%'; button.style.backgroundColor = '#4CAF50';
        button.style.border = 'none'; button.style.outline = 'none';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s, opacity 0.4s ease';
    }

    function styleButtonText(text) {
        text.style.transition = 'opacity 0.4s ease'; text.style.opacity = '1';
        text.style.fontSize = "20px"; text.style.textAlign = "center";
        text.style.lineHeight = "40px";
    }

    function createVoiceSelect() {
        var selectWrapper = document.createElement("div");
        var select = document.createElement("select");
        var voices = ["nova", "onyx", "alloy", "echo", "fable", "shimmer"];
        var voiceLabel = document.createElement("label");
        voiceLabel.textContent = "الصوت:";
        voiceLabel.style.color = "white"; voiceLabel.style.marginRight = "5px";
        selectWrapper.appendChild(voiceLabel);

        for (var i = 0; i < voices.length; i++) {
            var option = document.createElement("option");
            option.value = voices[i];
            option.textContent = voices[i].charAt(0).toUpperCase() + voices[i].slice(1);
            select.appendChild(option);
        }
        selectWrapper.appendChild(select);
        styleSelect(selectWrapper, select);
        return { wrapper: selectWrapper, select: select };
    }

    // تنسيق القائمة المنسدلة
    function styleSelect(wrapper, select) {
        wrapper.style.padding = '5px'; wrapper.style.marginBottom = '10px';
        wrapper.style.display = 'flex'; wrapper.style.alignItems = 'center';

        select.style.flexGrow = '1'; select.style.padding = '8px 10px';
        select.style.borderRadius = '8px'; select.style.background = 'rgba(0, 0, 0, 0.7)';
        select.style.border = '2px solid #4CAF50'; select.style.color = 'white';
        select.style.fontFamily = 'Arial, sans-serif'; select.style.fontSize = '14px';
        select.style.direction = 'ltr';

        select.onmouseover = function() { this.style.backgroundColor = 'rgba(50, 50, 50, 0.5)'; };
        select.onmouseout = function() { this.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; };
        select.onfocus = function() { this.style.outline = 'none'; this.style.boxShadow = '0 0 5px rgba(81, 203, 238, 1)'; };

        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
        select option { background: rgba(0, 0, 0, 0.9); color: white; }
        select option:checked { background: #4CAF50; color: white; }
        select option:hover { background: rgba(50, 50, 50, 0.8); color: white; }
        `;
        document.head.appendChild(styleSheet);
    }

    // إضافة القائمة المنسدلة لاختيار الصوت إلى لوحة التحكم
    var voiceSelect = createVoiceSelect();
    controlPanel.appendChild(voiceSelect.wrapper);

    function textToSpeech(s) {
        // ----- السطر الذي تم تعديله -----
        var sModelId = "gpt-4o-mini-tts"; // Changed from "tts-1" to "gpt-4o-mini-tts" for higher quality
        // ----- نهاية السطر المعدل -----
        var sVoiceId = voiceSelect.select.value;
        var API_KEY = YOUR_API_KEY; // Make sure this is set correctly at the top

        // Ensure API Key is present
         if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE" || API_KEY.length < 10) {
            alert("يرجى إدخال مفتاح واجهة برمجة تطبيقات OpenAI صالح في بداية البرنامج النصي.");
            HideSpinner(buttonText);
            return;
        }


        ShowSpinner(buttonText); // إظهار مؤشر التحميل

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.openai.com/v1/audio/speech",
            headers: {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + API_KEY
            },
            data: JSON.stringify({
                model: sModelId, // Now uses "gpt-4o-mini-tts"
                input: s,
                voice: sVoiceId,
                speed: playbackRate
            }),
            responseType: "arraybuffer",

            onload: function(response) {
                if (response.status === 200) {
                    // Hide spinner isn't needed here, StopSpinner handles the transition
                    audioContext.decodeAudioData(response.response, function(buffer) {
                        var source = audioContext.createBufferSource();
                        source.buffer = buffer;
                        source.connect(gainNode);
                        source.start(0);
                        currentSource = source; // حفظ مصدر الصوت الجديد
                        isPlaying = true;
                        StopSpinner(buttonText); // تحديث نص الزر إلى حالة الإيقاف المؤقت

                        // الاستماع لحدث انتهاء الصوت
                        source.onended = function() {
                            isPlaying = false;
                            currentSource = null; // Clear the source
                            HideSpinner(buttonText); // تحديث نص الزر إلى حالة التشغيل
                        }
                    }, function(e) {
                        console.error("Error decoding audio data: ", e);
                        HideSpinner(buttonText); // Ensure spinner hides on decode error
                        alert("حدث خطأ أثناء معالجة الصوت.");
                    });
                } else {
                    HideSpinner(buttonText);
                    console.error("Error loading TTS: ", response.status, response.statusText, response.response);
                    try {
                        var errorResponse = JSON.parse(new TextDecoder("utf-8").decode(response.response));
                        console.error("OpenAI Error:", errorResponse);
                         // Check for specific common errors
                        if (response.status === 401) {
                             alert("خطأ في المصادقة (401). يرجى التحقق من مفتاح الواجهة البرمجية (API Key).");
                        } else if (errorResponse.error?.message) {
                             alert("خطأ من OpenAI: " + errorResponse.error.message);
                        } else {
                             alert("حدث خطأ أثناء الاتصال بخدمة تحويل النص إلى كلام. الرمز: " + response.status);
                        }
                    } catch (e) {
                         alert("حدث خطأ أثناء الاتصال بخدمة تحويل النص إلى كلام. الرمز: " + response.status);
                    }
                }
            },
            onerror: function(error) {
                HideSpinner(buttonText);
                console.error("GM_xmlhttpRequest error: ", error);
                alert("حدث خطأ في الشبكة أو في طلب الواجهة البرمجية.");
            }
        });
    }

    // تأخير عرض وإخفاء لوحة التحكم
    var panelDisplayDelay = 700;
    var panelHideDelay = 500;
    var showPanelTimeout, hidePanelTimeout;

    readButton.addEventListener('mouseenter', function() {
        readButton.style.backgroundColor = '#45a049';
        clearTimeout(hidePanelTimeout);
        showPanelTimeout = setTimeout(function() {
            controlPanel.style.visibility = 'visible';
            controlPanel.style.opacity = 1;
        }, panelDisplayDelay);
    });

    readButton.addEventListener('mouseleave', function() {
        readButton.style.backgroundColor = '#4CAF50';
        clearTimeout(showPanelTimeout);
        hidePanelTimeout = setTimeout(function() {
            if (!controlPanel.matches(':hover')) {
                 controlPanel.style.visibility = 'hidden';
                 controlPanel.style.opacity = 0;
            }
        }, panelHideDelay);
    });

    controlPanel.addEventListener('mouseenter', function() {
        clearTimeout(hidePanelTimeout);
        controlPanel.style.visibility = 'visible';
        controlPanel.style.opacity = 1;
    });

    controlPanel.addEventListener('mouseleave', function() {
        hidePanelTimeout = setTimeout(function() {
            controlPanel.style.visibility = 'hidden';
            controlPanel.style.opacity = 0;
        }, panelHideDelay);
    });
    speedControl.slider.addEventListener('input', function() {
        playbackRate = this.value;
    });

    function ShowSpinner(text) {
        text.style.opacity = '0';
        setTimeout(function() {
            text.textContent = "...";
            text.style.opacity = '1';
        }, 400);
        readButton.disabled = true;
    }

    function HideSpinner(text) { // Resets button to 'Play' state
        text.style.opacity = '0';
        setTimeout(function() {
            text.textContent = ">";
            text.style.opacity = '1';
        }, 400);
        readButton.disabled = false;
    }
    function StopSpinner(text) { // Sets button to 'Stop' state
        text.style.opacity = '0';
        setTimeout(function() {
            text.textContent = "❚❚";
            text.style.opacity = '1';
        }, 400);
        readButton.disabled = false; // Keep button enabled to allow stopping
    }
})();