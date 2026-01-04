// ==UserScript==
// @name          2ch.hk: переименовать картинку при заливке
// @description   Плюсы: анонимность названий
// @author        Moro
// @include       /^https:\/\/2ch\.(hk|pm)\/(\w|\d)+((|\/)$|\/(index|(res|arch)\/).*\.html($|\?.*))/
// @compatible    Chrome
// @run-at        document-idle
// @grant         GM_registerMenuCommand
// @grant         GM_getValue
// @grant         GM_setValue
// @noframes
// @version 0.0.1.20210419093638
// @namespace https://greasyfork.org/users/762150
// @downloadURL https://update.greasyfork.org/scripts/425233/2chhk%3A%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B8%D0%BC%D0%B5%D0%BD%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D1%83%20%D0%BF%D1%80%D0%B8%20%D0%B7%D0%B0%D0%BB%D0%B8%D0%B2%D0%BA%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/425233/2chhk%3A%20%D0%BF%D0%B5%D1%80%D0%B5%D0%B8%D0%BC%D0%B5%D0%BD%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BA%D1%83%20%D0%BF%D1%80%D0%B8%20%D0%B7%D0%B0%D0%BB%D0%B8%D0%B2%D0%BA%D0%B5.meta.js
// ==/UserScript==

//ПИШЕМ FILE RENAMER ВСЕМ ДВАЧЕМ -- что примечательно без jquery
//Как аналог DataTransfer -- https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData
// Двач, хочу переименовывать файлы перед загрузкой в треды автоматически давая имя типа unix timestamp.
// Идея такова: подписываюсь на событие change у всех инпутов типа file. Поскольку коллекция e.target.files - readonly, ее нужно заменять своей. Создаю ее через DataTransfer, делаю новые файлы через cloneFile, заменяю. По идее дальше все оставшиеся event listener'ы на инпут должны работать с новой коллекцией, но Абу выдает ошибку, что files is undefined, хотя по логам всё на месте.
// Что я делаю не так?

async function init() {
    const cloneFile = (file) => {
        const fileExtension = file.name.match(/.+\.(.+)/)[1] || 'jpg';
        const randomFileName = `${Date.now() - Math.round(Math.random() * 15768e5)}0.${fileExtension}`;
        const clonedFile = new File([file], randomFileName, { type: file.type });

        return clonedFile;
    };

    function run() {
        document.querySelectorAll('input[type=file]').forEach(
            f => f.addEventListener('change', async (e) => {
                console.log('before', e.target.files[0], e);

                const clonedFiles = new DataTransfer();
                Array.from(e.target.files).forEach(file => {
                    clonedFiles.items.add(cloneFile(file));
                });

                e.target.files = clonedFiles.files;

                console.log('done', e.target.files[0]);
            }, { capture: true })
        );

        console.log('Imageboard File Renamer Loaded');
    }

    run();
}

init();