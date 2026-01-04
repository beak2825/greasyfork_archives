// ==UserScript==
// @name         Dota2.ru Image Upload
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Выгрузка изображений на Imgur на dota2.ru и esportgames.ru
// @author       Руна Дегенерации
// @match        https://dota2.ru/*
// @match        https://esportsgames.ru/*
// @icon         https://www.google.com/s2/favicons?domain=dota2.ru
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436010/Dota2ru%20Image%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/436010/Dota2ru%20Image%20Upload.meta.js
// ==/UserScript==

window.host = "https://anime2ru-script.herokuapp.com";

window.createHttpRequest = function(opt){
    if (typeof opt !== 'object') {
        console.trace('Некорректная форма отправки запроса');
        return;
    }
    if (!opt || !opt.link) {
        console.error('Link required!');
        return;
    }
    let request_options = {
        method: opt.method || "GET",
        link: opt.link,
        body: opt.body || {},
        success: opt.success || function(){},
        error: opt.error || function(){},
        stringify: opt.stringify || true,
        anime: opt.anime || false,
        contentType: opt.contentType || "application/json"
    }
    if (opt.method != 'GET' && opt.anime) {
        request_options.body.token = localStorage.getItem('anime_token');
        request_options.body.mode = script_mode;
    }
    let http = new XMLHttpRequest();
    http.open(request_options.method, request_options.link);
    http.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    http.setRequestHeader("Content-Type", request_options.contentType);
    request_options.stringify ? http.send(JSON.stringify(request_options.body)) : http.send(request_options.body)
    http.onreadystatechange = function(){
        if (http.readyState != 4) return;
        http.status == 200 ? request_options.success(http) : request_options.error(http);
    }
};

document.addEventListener('DOMContentLoaded', function(){

    let style = document.createElement('style');
    style.innerHTML = `
    .custom-image-upload{
        width: 100% !important;
        height: 60px !important;
        border: 2px #acacacac dashed !important;
        color: #858585bd !important;
        cursor: pointer !important;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .custom-image-upload input[type='file']{
        display: none;
    }
    
    .custom-image-upload p{
        text-align: center !important;
        line-height: 100% !important;
    }
    `;
    document.head.append(style)

    window.initUploadImage = function(frame){
        if (!frame) return;
        if (frame.parentElement.parentElement.parentElement.querySelector('.custom-image-upload')) return;
        let label = document.createElement('label');
        label.classList.add('custom-image-upload');
        label.innerHTML = `
        <p>Выберите или бросьте сюда изображение...<br>
        Поле для ввода поддерживает вставку картинок с помощью Ctrl + V</p>
        <input type="file" class="custom-image-upload-input" accept="image/*">`;
        frame.parentElement.parentElement.parentElement.append(label);
        let uploader = function(file){
            if (!file || !file.type.includes('image')){
                label.children[0].innerText = 'Это не изображение! Выберите или бросьте другое изображение...';
                return;
            }
            if (file.size > 10485760){
                label.children[0].innerText = 'Это изображение слишком большое! Выберите или бросьте другое...';
                return;
            }
            window.fastUploadImageToEditor(file, function(){
                label.children[0].innerText = 'Выберите или бросьте другое изображение...';
            }, function(http){
                label.children[0].innerText = 'Произошла ошибка загрузки...';
            });
            label.children[0].innerText = 'Изображение загружается. Выберите или бросьте другое изображение...';
        }
        label.children[1].oninput = function(){
            uploader(label.children[1].files[0]);
        }
        frame.contentDocument.getElementById('tinymce').onpaste = function(e){
            uploader(e.clipboardData.files[0])
        }
        label.ondragover = function(e){
            e.preventDefault();
        }
        label.ondrop = function(e){
            e.preventDefault();
            uploader(e.dataTransfer.files[0])
        }
    }
    
    window.fastUploadImageToEditor = function(file, callback, error){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function(){
            createHttpRequest({
                method: 'POST',
                link: host + '/uploadImage',
                body: {
                    data: reader.result
                },
                success: function(http){
                    let img = new Image();
                    img.src = http.responseText;
                    tinyMCE.activeEditor.insertContent(img.outerHTML);
                    if (callback) callback()
                },
                error: function(){
                    if (error) error()
                }
            })
        }
    
    }
    
    window.initPasteInEditors = function(){
        setTimeout(function(){
            document.querySelectorAll('iframe:not([src])').forEach(function(frame){
                window.initUploadImage(frame);
            })
        }, 750)
    }
    
    if (window.Conversation){
        var original_open_editor = window.Conversation.editMessageEditor;
        window.Conversation.editMessageEditor = function(){
            original_open_editor.apply(this, arguments);
            initPasteInEditors();
        }
    }
    if (window.Topic){
        var original_topic_editor = window.Topic.openPostEditor;
        window.Topic.openPostEditor = function(){
            original_topic_editor.apply(this, arguments);
            initPasteInEditors();
        }
    }

    var main_input_container = document.querySelector('.forum-theme__bottom-block') || document.querySelector('.forum-theme__create-thread') || null
    if (main_input_container){
        console.log(main_input_container)
        let limit = 20;
        let checker = function(){
            if (!--limit) return;
            let frame = main_input_container.getElementsByTagName('iframe')[0];
            if (frame) {
                console.log(frame)
                window.initUploadImage(frame);
            }
            else setTimeout(checker, 200);
        }
        checker()
    }
})

