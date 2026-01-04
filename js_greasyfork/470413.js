// ==UserScript==
// @name         Kick.com - Dodawanie emotek u streamerów
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Łatwy sposób na rozpierdalanie kanałów własnymi emotkami
// @author       @adamcy
// @match        https://kick.com/dashboard/community/emotes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470413/Kickcom%20-%20Dodawanie%20emotek%20u%20streamer%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/470413/Kickcom%20-%20Dodawanie%20emotek%20u%20streamer%C3%B3w.meta.js
// ==/UserScript==

(function() {
    'use strict';
let Module = function () {
    let mainView = null;
    let emoteViews = null;
    Module.Views = {
        EmoteController: function () {
            let view = createView();
            let emote = null;
            let emoteName = view.querySelector('[data-test="emote-name"]');
            let image = view.querySelector('img')
            let delete_emote = view.querySelector('[data-test="delete-emote"]')

            emoteName.addEventListener("focus", function () {
                emoteName.select();
            });

            emoteName.addEventListener("focusout", function () {
                emote.name = Module.Utility.ensureStringLength(emoteName.value, 15);
            });

            image.onload = () => {
                URL.revokeObjectURL(image.src);
            }

            delete_emote.onclick = function () {
                Module.EmoteListController.deleteEmote(emote).then(() => {
                    deleteEmote();
                });
            }

            mainView.addEventListener('EMOTE_UPLOADED', e => {
                if (e.detail.emote === emote) {
                    update(emote);
                }
            })

            mainView.addEventListener('EMOTE_DELETED', e => {
                if (e.detail.emote === emote) {
                    deleteEmote();
                }
            })

            function deleteEmote() {
                update(null);
                let parent = view.parentNode;
                view.remove();
                parent.appendChild(view);
            }

            function createView() {
                return Module.Utility.htmlToElement(`
                    <li class="item w-16 image-file-item box">
                        <button data-test="delete-emote" class="flex justify-center items-center">
                            <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-4 text-white flex justify-center items-center">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                        <div class="image-holder relative aspect-square cursor-pointer border border-dashed border-secondary-lightest hover:bg-secondary-lighter">
                            <img style="height: 60px">
                        </div>
                        <input data-test="emote-name" maxlength="15" minlength="1" class="input input-sm my-2" style="">
                    </li>
            `)
            }

            view.disabled = true;

            function getView() {
                return view;
            }

            function getEmote() {
                return emote;
            }

            function setIndex(index) {
                view.dataset.index = index;
            }

            function update($emote) {
                emoteName.value = $emote?.name || "";
                if (!$emote?.source) {
                    image.removeAttribute('src');
                } else {
                    if ($emote !== emote) {
                        image.src = $emote?.source;
                    }
                }
                view.setAttribute('uploaded', $emote?.uploaded || false);
                view.setAttribute('empty', $emote === null);
                emote = $emote;
                emoteName.disabled = !$emote || $emote.uploaded;
            }

            return {
                update: update, getView: getView, getEmote: getEmote, setIndex: setIndex
            }
        }, MainView: function () {
            return Module.Utility.htmlToElement(`
        <div id="headlessui-portal-root">
            <style>
                .image-file-list {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
                    width: 100%;
                    overflow: scroll;

                 }

                 .image-file-item {
                    position:relative;
                 }
                .image-file-item  input{
                    font-size: 8px;
                    BACKGROUND: transparent;
                    padding: 0px !important;
                    border: none !important;
                    border-radius: 0 !important;
                    text-align: center;
                    margin: 0px !important;
                }

                #headlessui-portal-root[disabled] .popup-box {
                    pointer-events: none;
                    opacity: 0.2;
                }

                [data-test="delete-emote"] {
                        font-weight: bolder;
                        position: absolute;
                        background-color: rgba(0,0,0,0.8);
                        border-radius: 50px;
                        width: 20px;
                        height: 20px;
                        font-size: 12px;
                        top: 5px;
                        right: 5px;
                        z-index: 10000;
                        opacity: 0;
                }

                div, img {
                    cursor: default !important;
                }

                .image-file-item[uploaded=true] {
                    opacity: 0.7;
                }
                .image-file-item[empty=false]:hover [data-test="delete-emote"] {
                    opacity: 1;
                }

                .drop-zone.active .drop-zone-graphic {
                    opacity: 1;
                    transition: all 250ms ease;
                }
                .drop-zone-graphic {
                    pointer-events: none;
                    opacity: 0;
                    transition: all 250ms ease;
                }
            </style>
            <div>
                <div class="fixed inset-0 z-50 overflow-y-auto" id="headlessui-dialog-22" role="dialog" aria-modal="true">
                    <div class="flex min-h-screen items-end justify-center text-center">
                        <div id="headlessui-dialog-overlay-24" aria-hidden="true"
                             class="fixed inset-0 bg-black/60 transition-opacity"></div>
                        <div class="absolute left-1/2 inline-block h-screen w-screen -translate-x-1/2 text-left">
                            <div class="flex h-screen w-screen overflow-y-auto overflow-x-hidden p-3">
                                <div class="my-auto mx-auto ">
                                    <div class="relative inline-block text-left">
                                        <div class="text-right">
                                            <button data-test="close" type="button" class="btn z-50 -mr-4 focus:ring-0" tabindex="0">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     stroke-width="1.5"
                                                     stroke="currentColor" aria-hidden="true" class="w-6 text-white">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                          d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            </button>
                                        </div>
                                        <div class="rounded bg-secondary shadow overflow-hidden">
                                            <div class="p-4 popup-box">
                                                <div class="text-xl font-semibold"><span>Dodawanie emotek własnych na innych kanałach</span></div>
                                                <!---->
                                                <div style="margin-top: 10px">
                                                    <input type="file" data-test="files" multiple=""
                                                           accept="image/gif, image/png" style="display:none">
                                                    <button href="#" class="btn btn-primary" data-test="select-files">Wybierz aby wybrać plik
                                                    </button>
                                                    <button href="#" class="btn bg-red-600 !text-white"
                                                            data-test="delete-all-emotes">Usuń wszystkie dodane emotki
                                                    </button>
                                                </div>
                                                <div class="mt-4 rounded" style="position: relative">
                                                    <div class="drop-zone" style="position: relative">
                                                        <div style="max-height: 700px" class="flex flex-col">
                                                        <div class="drop-zone-graphic" style="
                                                            height: 100%;
                                                            width: 100%;
                                                            background: #191b1fd9;
                                                            position: absolute;
                                                            z-index: 50000;
                                                            border-radius: 0.25em;
                                                            border: #03a9f4 dashed;
                                                        ">
                                                            <span style="
                                                            width:  100%;
                                                            height: 100%;
                                                            display: flex;
                                                            text-align: center;
                                                            align-content: center;
                                                            align-items: center;
                                                            justify-content: center;
                                                            color: #2196f3;
                                                        ">
                                                                Drop Files
                                                            </span>
                                                        </div>
                                                        <ol class="box image-file-list my-4 flex grow items-start justify-center gap-0  ">
                                                        </ol>
                                                        </div>
                                                        <div class="mt-3 block text-center text-sm leading-tight opacity-60">
                                                            Prześlij kwadratowy plik PNG lub GIF. Rozmiar obrazu nie może przekraczać 70 x 70 px i nie może
                                                            przekraczać 1MB.
                                                            Najlepiej jest ustawić 70x70 z wybranego GIF na tej stronie https://ezgif.com/resize - następnie zapisujemy i wpierdalamy. Miłego, jebać rudą kurwe
                                                        </div>
                                                    </div>
                                                    <div class="mt-4">
                                                        <div class="flex"><!---->
                                                            <div class="relative ml-auto"><!---->
                                                                <button data-test="upload" class="btn btn-primary" type="button"
                                                                        >
                                                                    Upload
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>
            </div>
        </div>
        `)
        }
    }


    Module.Utility = {
        htmlToElement: function (html) {
            const template = document.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        }, randomUUID: function (segments = 8) {
            let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXWZ";
            let numbers = "0123456789";

            let result = "";
            for (let i = 0; i < segments; i++) {
                let a = alphabet.charAt(alphabet.length * Math.random());
                let b = numbers.charAt(numbers.length * Math.random());
                result += a + b;
                if (i !== segments - 1) {
                    result += "-";
                }
            }
            return result;
        }, getEmoteURL(id) {
            return `https://d2egosedh0nm8l.cloudfront.net/emotes/${id}/fullsize`;
        }, ensureStringLength(string, length) {
            let result = string;
            if (string.length > 15) {
                result = string.substring(0, 15);
            }
            return result;
        },isValidFileExtension(fileName) {
            let extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
            return ['.png', '.gif'].indexOf(extension) !== -1;
        }

    }


    mainView = Module.Views.MainView();
    document.body.appendChild(mainView);

    let Emote = function () {
        this.name = "";
        this.uploaded = true;
        this.source = null;
        this.type = null;
        this.id = Module.Utility.randomUUID();
        this.file = null;
    }

    Module.Initialize = function () {
        Module.EmoteListController.initialize();
    }

    Module.MainController = new function () {
        const Button_SelectFile = document.querySelector('[data-test=select-files]');
        const Input_Files = document.querySelector('[data-test=files]');
        const Button_DeleteEmotes = document.querySelector('[data-test=delete-all-emotes]')
        const Button_Close = document.querySelector('[data-test="close"]');
        const Button_Upload = document.querySelector('[data-test="upload"]');
        emoteViews = document.querySelector('.image-file-list').children;

        Button_Close.onclick = () => {
            mainView.remove();
        }

        Button_Upload.onclick = () => {
            disable()
            Module.EmoteManager.uploadEmotes().then(e => {
                enable();
            });
        }

        Button_DeleteEmotes.onclick = () => {
            if (!window.confirm("are you sure you want to delete all uploaded emotes?")) return;
            disable()
            Module.EmoteManager.deleteAllEmotes().then(() => {
                enable()
            });
        }

        function enable() {
            mainView.removeAttribute('disabled');

        }

        function disable() {
            mainView.setAttribute('disabled', '');
        }


        Button_SelectFile.addEventListener("click", (e) => {
            if (Input_Files) {
                Input_Files.click();
            }
            e.preventDefault();
        }, false);


        Input_Files.addEventListener("change", e => {
            onFilesSelected(e.target.files);
        }, false);


        setupDragDrop();
        function setupDragDrop() {
            let dropZone = mainView.querySelector('.drop-zone');

            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, highlight, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, unhighlight, false);
            });

            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, e => {
                    e.preventDefault();
                    e.stopPropagation();
                }, false)
            });


            dropZone.addEventListener('drop', handleDrop, false)

            function handleDrop(e) {
                let dt = e.dataTransfer;
                let files = dt.files;
                onFilesSelected(files);
            }


            function highlight(e) {
                if (e.dataTransfer.types.indexOf('Files') === -1) return;
                dropZone.classList.add('active');
            }

            function unhighlight() {
                dropZone.classList.remove('active')
            }
        }

        function onFilesSelected(files) {
            let filesToBeUploaded = [];
            for (let file of files) {
                filesToBeUploaded.push(file)
            }

            if (filesToBeUploaded.length !== 0) {
                for (let i = 0; i < filesToBeUploaded.length; i++) {
                    let file = filesToBeUploaded[i];

                    if (file.size >= (1024 * 1024) || !Module.Utility.isValidFileExtension(file.name)) {
                        continue
                    }

                    let emote = new Emote();
                    emote.name = Module.Utility.ensureStringLength(file.name.replace('.png', '').replace('.gif', ''), 15);
                    emote.source = URL.createObjectURL(file);
                    emote.type = file.name.replace(/.*?\./, "").toLowerCase();
                    emote.uploaded = false;
                    emote.file = file;
                    if (!Module.EmoteListController.addEmote(emote)) {
                        break;
                    }

                }
            }
        }

        this.updateUploadButton = function (text) {
            Button_Upload.innerText = text;
        }

        this.updatesDeleteEmotesButton = function (text) {
            Button_DeleteEmotes.innerText = text;
        }

    }


    Module.EmoteListController = new function () {
        let emotes = [];
        let controllers = [];
        let reference = this;

        this.initialize = function () {
            let imageFileList = document.querySelector('.image-file-list')
            console.log(imageFileList)
            for (let i = 0; i <= 60; i++) {
                let controller = new Module.Views.EmoteController();
                controller.setIndex(i);
                controllers.push(controller)
                imageFileList.appendChild(controller.getView());
            }

            Module.EmoteManager.retrieveUploadedEmotes().then(emotes => {
                for (let emote of emotes) {
                    reference.addEmote(emote)
                }
            })
        }

        this.addEmote = function (emote) {
            let controller = getNextAvailableController();
            if (!controller) return false;
            controller.update(emote);
            emotes.push(emote);
            return true;
        }

        this.deleteEmote = async function (emote) {
            if (emote.uploaded === true) {
                await Module.EmoteManager.deleteEmote(emote).then();
            }
            emotes.splice(emotes.indexOf(emote));
        }

        function getNextAvailableController() {
            for (let i = 0; i < emoteViews.length; i++) {
                let emoteView = emoteViews[i];
                let controller = controllers[emoteView.dataset.index];
                if (!controller.getEmote()) {
                    return controller;
                }
            }
        }

        this.getEmotes = function () {
            return emotes;
        }
    }

    Module.EmoteManager = new function () {
        async function deleteAllEmotes() {
            console.log("deleting emotes...")
            mainView.disabled = true;
            let emotesToBeRemoved = Module.EmoteListController.getEmotes().filter(emote => {
                return emote.uploaded === true;
            });

            for (let i = 0; i < Module.EmoteListController.getEmotes().length; i++) {
                let emote = emotesToBeRemoved[i];
                Module.MainController.updatesDeleteEmotesButton(`deleting ${i + 1}/${emotesToBeRemoved.length}`)
                await deleteEmote(emote);
                mainView.dispatchEvent(new CustomEvent('EMOTE_DELETED', {detail: {emote}}));
                console.log(`deleted {${emote.name}}`)
            }
            Module.MainController.updatesDeleteEmotesButton('Delete all uploaded emotes');
            mainView.disabled = false;
            console.log("deleting complete...")
        }

        async function deleteEmote(emote) {
            await fetch(`https://kick.com/emotes/${emote.id}`, {
                method: 'DELETE', headers: getHeaders()
            });
        }

        async function retrieveUploadedEmotes() {
            let response = await fetch('https://kick.com/emotes', {
                method: 'GET', headers: getHeaders()
            })
            let json = await response.json();
            let _emotes = json['emotes'];
            let emotes = [];
            for (let _emote of _emotes) {
                let emote = new Emote();
                emote.id = _emote.id;
                emote.name = _emote.name;
                emote.uploaded = true;
                emote.source = Module.Utility.getEmoteURL(emote.id);
                emotes.push(emote);
            }
            return emotes;
        }

        async function uploadEmotes() {
            console.log(Module.EmoteListController.getEmotes())
            let emotesToBeUploaded = Module.EmoteListController.getEmotes().filter(emote => {
                return emote.uploaded === false;
            })

            console.log(`Uploading ${emotesToBeUploaded.length} emotes`)
            for (let i = 0; i < emotesToBeUploaded.length; i++) {
                let emote = emotesToBeUploaded[i];
                let progressText = `Uploading ${i + 1}/${emotesToBeUploaded.length}`;
                Module.MainController.updateUploadButton(progressText)
                await uploadEmote(emote);
            }
            Module.MainController.updateUploadButton('Upload')
        }

        async function uploadEmote(emote) {
            let uploadData = await getUploadData();

            await new Promise(function (resolve, reject) {
                let xhr = new XMLHttpRequest();
                xhr.open('PUT', uploadData.url, true);
                let headers = uploadData.headers;

                for (let key in headers) {
                    if (key.toLowerCase() === 'host') continue;
                    xhr.setRequestHeader(key, headers[key]);
                }

                xhr.onload = function (e) {
                    resolve()
                }
                xhr.send(emote.file);
            })


            let response = await fetch('https://kick.com/emotes', {
                method: 'POST', body: JSON.stringify({
                    "uuid": uploadData.uuid, "key": uploadData.key, "name": emote.name, "subscribers_only": 1
                }), headers: getHeaders()
            })

            let json = await response.json();
            console.log(json)
            if (json && json['id']) {
                emote.id = json['id'];
                emote.uploaded = true;
            }
            mainView.dispatchEvent(new CustomEvent('EMOTE_UPLOADED', {detail: {emote}}));
        }


        function getHeaders(accept, contentType) {
            return ({
                'Accept': accept || 'application/json, text/plain, */*',
                'Content-Type': contentType || 'application/json',
                'Accept-Encoding': 'gzip',
                "X-XSRF-TOKEN": getCookie('XSRF-TOKEN')
            })
        }

        async function getUploadData() {
            let response = await fetch('/vapor/signed-storage-url', {
                method: 'POST', headers: getHeaders(), body: JSON.stringify({
                    "bucket": "", "content_type": "image/gif", "expires": "", "visibility": "public-read"
                })
            });
            return await response.json();
        }

        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());

        }


        this.uploadEmotes = uploadEmotes;
        this.uploadEmote = uploadEmote;
        this.deleteAllEmotes = deleteAllEmotes;
        this.deleteEmote = deleteEmote;
        this.retrieveUploadedEmotes = retrieveUploadedEmotes;
    }
    Module.Initialize();
}


setTimeout(e => {
    new Module();
}, 2000)
})();