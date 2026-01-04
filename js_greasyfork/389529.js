// ==UserScript==
// @name         Change webpages' background(改变网页的背景)
// @version      4.1
// @description  Change webpages' background to the picture you choose. Press F2 to change background to the online picture, F7 to change background to the local picture, F4 to change the opacity of the foreground elements.(根据你选择的图片更换网页的背景，按F2更换背景为网络图片，按F7更换背景为本地图片，按F4改变前景元素的透明度。)
// @author       Jeremy Yuan QQ:1223962053
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match        http://*/*
// @match        https://*/*
// @match        file:///*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @noframes

// @namespace https://github.com/ZimingYuan/Change-webpages-background
// @downloadURL https://update.greasyfork.org/scripts/389529/Change%20webpages%27%20background%28%E6%94%B9%E5%8F%98%E7%BD%91%E9%A1%B5%E7%9A%84%E8%83%8C%E6%99%AF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/389529/Change%20webpages%27%20background%28%E6%94%B9%E5%8F%98%E7%BD%91%E9%A1%B5%E7%9A%84%E8%83%8C%E6%99%AF%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url = GM_getValue('url');
    let opacity = GM_getValue('opacity');
    if (opacity == undefined) opacity = '0.8';

    function ChangeOpacity() {
        $('body').children('#GM_Background').css('opacity', (1 - parseFloat(opacity)).toString());
    }

    function AddValuebar() {
        GM_addStyle('#GM_ValuebarContainer { position: fixed; top: 40px; left: 45%; width: 15%; height: 20px; background-color: #66cccc; display: none; border: 0.5px solid; border-radius: 8px; z-index: 10000; }');
        GM_addStyle('#GM_Valuebar { -webkit-appearance: none; transform: translateX(5%); width: 91%; height: 100%; background-color: #0000; }');
        GM_addStyle('#GM_Valuebar::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; transform: translateY(-3px); border-radius: 7px; border: 0.5px solid #000; background-color: #ff99cc; }');
        GM_addStyle('#GM_Valuebar::-webkit-slider-runnable-track { -webkit-appearance: none; height: 8px; border-radius: 4px; border: 0.5px solid #000; background-color: #ccff66; }');
        GM_addStyle('#GM_Background { position: fixed; top: 0; left: 0; z-index: 9999; pointer-events:none; }');
        let valuebar = '<div id="GM_ValuebarContainer"><input type="range" id="GM_Valuebar" min="0.0" max="1.0" step="0.05" value="' + opacity + '"></div>';
        $('body').append(valuebar);
        $('#GM_Valuebar').change(() => {
            opacity = document.getElementById('GM_Valuebar').value.toString();
            GM_setValue('opacity', opacity);
            ChangeOpacity(opacity);
        });
        $(document).keydown((event) => {
            if (event.which == 115) {
                let tag = $('#GM_ValuebarContainer');
                if (tag.css('display') == 'none') tag.css('display', 'block'); else tag.css('display', 'none');
            }
        });
    }

    function DrawBackground(url) {
        let canvas = $('#GM_Background')[0];
        let scale = window.devicePixelRatio / 1.25;
        canvas.width = screen.width / scale;
        canvas.height = screen.height / scale;
        let ctx = canvas.getContext('2d');
        let img = new Image(); img.src = url;
        img.onload = () => {
            let midx = img.width / 2, midy = img.height / 2;
            let imgscale = Math.max(canvas.width / 2 / midx,
                                    canvas.width / 2 / (img.width - midx),
                                    canvas.height / 2 / midy,
                                    canvas.height / 2 / (img.height - midy));
            ctx.scale(imgscale, imgscale);
            ctx.drawImage(img, canvas.width / 2 - midx * imgscale, canvas.height / 2 - midy * imgscale);
        };
    }

    function AddBackground() {
        let background = '<canvas id="GM_Background"></canvas>';
        $('body').append(background);
        DrawBackground(url);
        ChangeOpacity(opacity);
        AddValuebar();
    }

    if (url != undefined) {
        AddBackground();
    }

    $(document).keydown((event) => {
        if (event.which == 113) {
            var geturl = prompt('请输入图片的网址，按确定生效。\nPlease input the url of the image, press OK to take effect.');
            if (geturl != null) {
                GM_setValue('url', geturl);
                if (url == undefined) { url = geturl; AddBackground(); }
                else { url = geturl; DrawBackground(url); }
            }
        }
    });

    $(document).keydown((event) => {
        if (event.which == 118) {
            if ($('#GM_ImageUpload').length == 0) {
                $('body').append('<input type="file" id="GM_ImageUpload" style="display: none"></input>');
                $('#GM_ImageUpload').change(function () {
                    let file = this.files[0];
                    if (! /image\/\w+/.test(file.type)) {
                        alert("请确保文件为图像类型\nMake sure the file type is image.");
                        return false;
                    }
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function() {
                        GM_setValue('url', this.result);
                        if (url == undefined) { url = this.result; AddBackground(); }
                        else { url = this.result; DrawBackground(url); }
                    }
                });
            }
            $('#GM_ImageUpload').click();
        }
    });
})();
