// ==UserScript==
// @name        pochta scripts
// @namespace   Violentmonkey Scripts
// @match       https://otpravka.pochta.ru/*
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @version     1.2
// @author      -
// @license     MIT
// @description 2024-03-04
// @downloadURL https://update.greasyfork.org/scripts/489735/pochta%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/489735/pochta%20scripts.meta.js
// ==/UserScript==

const typeNames = {
    parcelTracked: 'Бандероль заказная',
    letterTracked: 'Письмо заказное',
};

const useStorage = (key, defaultValue = undefined) => ({
    get: () => localStorage.getItem(key) || defaultValue,
    set: (val) => localStorage.setItem(key, val),
});

/**
 * @param {HTMLInputElement} input
 */
const useStorageForInput = (input) => ({
    value: useStorage(`pochta-scripts:${input.id}:value`, ''),
    position: useStorage(`pochta-scripts:${input.id}:position`, 0),
});

/**
 * @param {HTMLInputElement} input
 */
const usePersistedInput = (input) => {
    const { value, position } = useStorageForInput(input);

    input.value ||= value.get();
    $(input).trigger('change');

    input.addEventListener('input', (e) => value.set(e.currentTarget.value));

    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/selectionStart
    if (!input.type || input.type === 'text') {
        const preservePosition = (e) => position.set(e.currentTarget.selectionStart);
        input.addEventListener('selectionchange', preservePosition);
        input.addEventListener('input', preservePosition);
        input.addEventListener('focus', (e) => e.currentTarget.setSelectionRange(position.get(), position.get()));
    }
};

const focusMassField = (popup) => popup.querySelector('#mass-field').focus();

function letterTracked(popup) {
    const massField = popup.querySelector('#mass-field');
    const orderNum = popup.querySelector('input[name="orderNum"]');

    usePersistedInput(massField);
    usePersistedInput(orderNum);

    orderNum.focus();
}


const waitForPopupReady = () => new Promise((resolve) => {
    VM.observe(document.body, () => {
        if (!document.querySelector('.popup')) {
            return;
        }

        const node = document.querySelector('[name="mailType"]');
        const massField = document.querySelector('#mass-field');
        const orderNum = document.querySelector('input[name="orderNum"]');
        const mailSuggestItem = document.querySelector('.input__suggest-item');

        if (!node || !massField || !orderNum || !mailSuggestItem) {
            return;
        }

        const popup = node.closest('.popup');
        resolve(popup);

        return true;
    });
});

const openPopup = async () => {
    $('#create-item').click();
    return await waitForPopupReady();
};

const registerShortcut = (shortcut, templateName, description, callback) => {
    VM.shortcut.register(shortcut, async () => {
        const popup = await openPopup();

        [...popup.querySelectorAll('.input__suggest-item')]
            ?.find((x) => x.innerHTML.includes(templateName))
            .click();

        await waitForPopupReady();
        callback(popup);
    });

    console.log('shortcut:', shortcut, `${templateName} — ${description}`);
};

function activate() {
    VM.shortcut.register('Esc', () => document.querySelector('#close-button')?.click());
    console.log('shortcut: Esc — закрыть окно');

    registerShortcut(
        'c-з',
        typeNames.letterTracked,
        'проставить поля как в прошлый раз, фокус на "Внутренний номер отправления"',
        letterTracked,
    );

    registerShortcut('c-г', typeNames.letterTracked, 'фокус на вес', focusMassField);
    registerShortcut('c-ш', typeNames.parcelTracked, 'фокус на вес', focusMassField);

}

activate();
