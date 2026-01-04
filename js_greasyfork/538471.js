// ==UserScript==
// @name         NotificationSoundSettings
// @namespace    MeloniuM/LZT
// @version      1.4.1
// @description  Интерфейс изменения звука уведомлений.
// @author
// @match        *://lolz.live/*
// @match        *://zelenka.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538471/NotificationSoundSettings.user.js
// @updateURL https://update.greasyfork.org/scripts/538471/NotificationSoundSettings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $("<style/>").text(`
    input#sound-file::file-selector-button {
        border-radius: 6px;
        border-style: none;
    }
    .NotificationSoundSettings {
        position: absolute;
        cursor: pointer;
        right: 85px;
        top: 14px;
        font-size: 18px;
    }
    .NotificationSound--icon{
        color: #949494;
    }
    .NotificationSound--icon:hover{
        color: rgb(58, 169, 119);
    }
    #NSSuploaded-filename {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: #2b2b2b;
        border: 1px solid #444;
        border-radius: 4px;
        padding: 6px 12px;
        margin: 6px 0;
        font-size: 13px;
        color: #ccc;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    `).appendTo("head");

    const STORAGE_KEY = 'customNotificationSound';
    const MAX_FILE_SIZE = 500 * 1024;
    let audio = null;

    const OriginalAudio = window.Audio;
    let NotifAudio;
    let fix_notif_sound = true;

	window.Audio = function (src) {
		// Проверяем, нужно ли заменить источник
		if (src === Im.soundNotificationFile && Im.customSoundNotificationFile) {
			console.log('[Audio] Заменён src:', src, '→', Im.customSoundNotificationFile);
			src = Im.customSoundNotificationFile;
		}

		return new OriginalAudio(src);
	};

	window.Audio.prototype = OriginalAudio.prototype;

    $(window).on("load", function() {
        //фикс звука
        Im.soundNotificationFile = 'https://lolz.live/public/pm2.wav';
        Im.customSoundNotificationFile = Im.soundNotificationFile
        applyStoredSound();
        NotifAudio = new Audio(Im.soundNotificationFile);
        let Notification = $('html').data('Im.Notification');
        Notification.displayNotificationOld = Notification.displayNotification;
        Notification.displayNotification = (e) => {
            Notification.displayNotificationOld(e);
            if (!e.isSiteFocused && e.shouldPlayAudio && Im.soundNotificationsEnabled && fix_notif_sound) {
                try {
                    NotifAudio?.play();
                } catch (e) {};
            }
        };
    })

    $(document).bind('PopupMenuShow', function(e){
        let $menu = e.$menu
        if (!$menu.is('#AlertsMenu')) {
            return;
        }
        if ($menu.find('.NotificationSoundSettings').length) return;
        let $settings = createSoundSettingsUI();

        $menu.prepend($settings).xfActivate();
        prefillInputs();

        $('#NSSsound-mode').on('change', function () {
            updateModeUI(this.value);
        });

        $('#NSSsound-url').on('input', toggleApplyButton);
        $('#NSSsound-file').on('change', toggleApplyButton);
        $('#NSSsound-mode').on('change', toggleApplyButton);

        $('#fix_notif_sound').on('click', (e) => {
            e.stopPropagation();

            let val = localStorage.getItem(STORAGE_KEY);

            try {
                let parsed = {fix: fix_notif_sound};
                if (val) {
                    parsed = JSON.parse(val);
                }

                fix_notif_sound = $('#fix_notif_sound').prop('checked');
                parsed.fix = fix_notif_sound;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
            } catch (e) {
                console.warn('Ошибка применения сохранённого звука');
            }
        });


        $('#NSSapply-sound').on('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const urlInput = $('#NSSsound-url').val().trim();
            const fileInput = $('#NSSsound-file').get(0).files[0];

            if (urlInput) {
                if (!isValidURL(urlInput)) {
                    alert('Введите корректную ссылку на звук');
                    return;
                }
                const data = {
                    type: 'url',
                    value: urlInput,
                    fix: $('#fix_notif_sound').val()
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                Im.customSoundNotificationFile = urlInput;
                alert('Ссылка на звук сохранена');
            } else if (fileInput) {
                if (fileInput.size > MAX_FILE_SIZE) {
                    alert(`Файл слишком большой. Лимит: ${MAX_FILE_SIZE / 1024} КБ`);
                    return;
                }
                const reader = new FileReader();
                reader.onload = e => {
                    const data = {
                        type: 'file',
                        name: fileInput.name,
                        value: e.target.result,
                        fix: $('#fix_notif_sound').val()
                    };
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    Im.customSoundNotificationFile = data.value;
                    alert('Файл сохранён и применён');
                    NotifAudio = new Audio(Im.soundNotificationFile);
                };
                reader.readAsDataURL(fileInput);
            } else {
                alert('Введите ссылку или выберите файл');
            }
        });

        $('#NSSuploaded-filename').on('click', () => {
            e.stopPropagation();
            e.preventDefault();
            $('#NSSsound-file').click();
        });

        $('#NSSsound-file, #NSSsound-mode').on('click', (e) => {
            e.stopPropagation();
        });

        $('#NSSsound-file').on('change', function () {
            const file = this.files[0];
            updateFilenameDisplay(file?.name);
            $('#NSStest-sound').slideDown(200);
        });

        $('#NSSreset-sound').on('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            localStorage.removeItem(STORAGE_KEY);
            Im.customSoundNotificationFile = Im.soundNotificationFile;
            NotifAudio = new Audio(Im.soundNotificationFile);
            updateFilenameDisplay();
            $('#NSSsound-url').val('');
            $('#NSSsound-file').val('');
            $('#NSSapply-sound').slideUp(200);
        });

        $('#NSStest-sound').on('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            const urlInput = $('#NSSsound-url').val().trim();
            const fileInput = $('#NSSsound-file').get(0).files[0];

            if (urlInput) {
                playSound(urlInput);
            } else if (fileInput) {
                if (fileInput.size > MAX_FILE_SIZE) {
                    alert(`Файл слишком большой. Лимит: ${MAX_FILE_SIZE / 1024} КБ`);
                    return;
                }
                const reader = new FileReader();
                reader.onload = e => playSound(e.target.result);
                reader.readAsDataURL(fileInput);
            } else {
                playSound(Im.customSoundNotificationFile);
            }
        });

    });

    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }


    function createSoundSettingsUI() {
        return $(`
            <div class="NotificationSoundSettings navTab Popup PopupInPopup PopupClosed">
                <a rel="Menu" class="navLink NoPopupGadget">
                    <i class="fa fa-file-audio NotificationSound--icon Popup"></i>
                </a>
                <div class="Menu HeaderMenu Popup" style="left: 276.453px;top: 53px !important;position: fixed;padding: 10px;">
                    <div style="margin-bottom: 10px; font-size: 15px; font-weight: bold;">
                        Настройка звука уведомлений
                    </div>
                    <div style="margin-bottom: 8px;">
                        <label for="NSSsound-mode"><strong>Источник звука:</strong></label>
                        <select id="NSSsound-mode" style="margin-left: 8px; background: #2b2b2b; color: #fff; border: 1px solid #444; border-radius: 4px; padding: 4px;">
                            <option value="url">Ссылка</option>
                            <option value="file">Файл</option>
                        </select>
                        <label for="fix_notif_sound"><input type="checkbox" checked name="fix_notif_sound" id="fix_notif_sound" value="1">фикс звука</label>
                    </div>

                   <label style="display:block; margin-bottom: 6px;">
                        <span>Ссылка:</span>
                        <input type="text" id="NSSsound-url" placeholder="https://..." style="width:100%; box-sizing: border-box; padding:5px; background:#2b2b2b; color:#fff; border:1px solid #444; border-radius:4px;">
                    </label>
                    <label for="sound-file" style="display: none; margin-top: 6px;">
                        <input type="file" id="NSSsound-file" accept="audio/*" style="display: none;">
                        <div id="NSSuploaded-filename" class="button">
                            <span style="color: #ccc;">Выбран файл:</span>
                            <div style="color: #888;">Нажмите для выбора файла</div>
                        </div>
                    </label>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <button id="NSSapply-sound" style="display: none;background:#4caf50; color:white; padding:6px; border:none; border-radius:4px; cursor:pointer;">Применить</button>
                        <button id="NSStest-sound" style="background:#2196f3; color:white; padding:6px; border:none; border-radius:4px; cursor:pointer;">Тест</button>
                        <button id="NSSreset-sound" style="background:#f44336; color:white; padding:6px; border:none; border-radius:4px; cursor:pointer;">Сбросить</button>
                    </div>
                </div>
            </div>
        `);
    }


    function applyStoredSound() {
        const val = localStorage.getItem(STORAGE_KEY);
        if (!val) return;

        try {
            const parsed = JSON.parse(val);
            if (parsed && parsed.value) {
                Im.customSoundNotificationFile = parsed.value;
            }
            if (parsed?.fix) {
                fix_notif_sound = !!parsed?.fix;
            }
        } catch (e) {
            console.warn('Ошибка применения сохранённого звука');
        }
    }

    function toggleApplyButton() {
        const mode = $('#NSSsound-mode').val();
        const url = $('#NSSsound-url').val().trim();
        const file = $('#NSSsound-file').get(0).files[0];

        const shouldShow = (mode === 'url' && url) || (mode === 'file' && file);
        if (shouldShow) {
            $('#NSSapply-sound').slideDown(200);
        } else {
            $('#NSSapply-sound').slideUp(200);
        }
    }

    function playSound(src) {
        try {
            audio?.pause();
            audio = new Audio(src);
            audio.play().catch(err => {
                console.error('Ошибка воспроизведения:', err);
                alert('Не удалось воспроизвести звук.');
            });
        } catch {
            alert('Ошибка воспроизведения звука');
        }
    }

    function updateFilenameDisplay(name) {
        const MAX_LENGTH = 24;
        let displayName = name || 'Нажмите для выбора файла';

        if (name && name.length > MAX_LENGTH) {
            const start = name.slice(0, 6);
            const end = name.slice(-7);
            displayName = `${start}...${end}`;
        }

        $('#NSSuploaded-filename').html(`
            <span style="color: #ccc;">Выбран файл:</span>
            <div style="color: #ccc;">${displayName}</div>
        `);
    }


    function updateModeUI(mode) {
        if (mode === 'url') {
            $('#NSSsound-url').closest('label').show();
            $('#NSSuploaded-filename').closest('label').hide();
        } else if (mode === 'file') {
            $('#NSSsound-url').closest('label').hide();
            $('#NSSuploaded-filename').closest('label').show();
        }
    }

    function prefillInputs() {
        const val = localStorage.getItem(STORAGE_KEY);
        if (!val) return;

        try {
            const parsed = JSON.parse(val);

            if (parsed.type === 'url') {
                $('#NSSsound-url').val(parsed.value);
            } else if (parsed.type === 'file') {
                updateFilenameDisplay(parsed.name || '[без имени]');
            }
            $('#NSSsound-mode').val(parsed.type);
            if (parsed?.fix) {
                fix_notif_sound = !!parsed?.fix;
            }
            $('#fix_notif_sound').prop('checked', fix_notif_sound);
            updateModeUI(parsed.type);
            if (parsed.value) {
                Im.customSoundNotificationFile = parsed.value;
                $('#NSSapply-sound').show();
            }
        } catch (e) {
            console.warn('Ошибка чтения сохранённого звука');
        }
    }

})();