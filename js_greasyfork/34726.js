// ==UserScript==
// @namespace         https://github.com/eleflea
// @name              NEU AAO Captcha filler
// @name:en           NEU AAO Captcha filler
// @name:zh           东北大学教务处验证码填充
// @name:zh-CN        东北大学教务处验证码填充
// @description       自动填充东北大学教务处验证码
// @description:en    Automatically fill the Northeastern University's aao website captcha
// @description:zh    自动填充东北大学教务处验证码
// @description:zh-CN 自动填充东北大学教务处验证码
// @include           *://aao.qianhao.aiursoft.com/*
// @include           *://202.118.31.197/*
// @include           *://aao.neu.edu.cn/*
// @include           *://zhjw.neu.edu.cn/*
// @supportURL        https://github.com/eleflea/neu_filler/
// @version           0.2.3
// @author            eleflea
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/34726/NEU%20AAO%20Captcha%20filler.user.js
// @updateURL https://update.greasyfork.org/scripts/34726/NEU%20AAO%20Captcha%20filler.meta.js
// ==/UserScript==

"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var aaoCaptcha = function aaoCaptcha(imgElement) {
    var token = {
        "*": "101111100011111010111",
        "+": "111101111000011111011",
        "1": "1011110000000011111111111111",
        "2": "1011100011101000101101111111",
        "3": "1011101011011010010001111111",
        "4": "1111011101101100000001111111",
        "5": "0000110010111001001101111111",
        "6": "1110001101011011100101111111",
        "7": "0111111011110001001110111111"
    };
    var box = [[7, 2, 17, 16], [19, 2, 27, 16], [33, 2, 43, 16]];

    function digit(box, threshold) {
        var min = 30;
        var num = 0;
        for (var i = 1; i < 8; i++) {
            var score = grayImg.compare.apply(grayImg, _toConsumableArray(box).concat([token[i.toString()]]));
            if (score < threshold) {
                return i;
            }
            if (score < min) {
                min = score;
                num = i;
            }
        }
        return num;
    }

    function operator(box, threshold) {
        var scorePlus = grayImg.compare.apply(grayImg, _toConsumableArray(box).concat([token["+"]]));
        var scoreMul = grayImg.compare.apply(grayImg, _toConsumableArray(box).concat([token["*"]]));
        if (scoreMul > scorePlus) {
            return 0;
        }
        return 1;
    }

    function identify(threshold) {
        var num1 = digit(box[0], threshold);
        var num2 = digit(box[2], threshold);
        var op = operator(box[1], threshold);
        return op ? num1 * num2 : num1 + num2;
    }

    function removeNoise() {
        for (var y = 1; y < height - 1; y++) {
            for (var x = 1; x < height - 1; x++) {
                if (!grayImg.at(x, y) && grayImg.at(x - 1, y) && grayImg.at(x, y - 1) && grayImg.at(x + 1, y) && grayImg.at(x, y + 1)) {
                    grayImg.set(x, y, 1);
                }
            }
        }
    }

    // get imgData
    var canvasElement = document.createElement('canvas');
    var height = imgElement.height;
    var width = imgElement.width;
    canvasElement.height = height;
    canvasElement.width = width;
    var ctx = canvasElement.getContext('2d');
    ctx.drawImage(imgElement, 0, 0);
    var imgData = ctx.getImageData(0, 0, imgElement.width, imgElement.height).data;
    // check imgData, alpha must be 255
    if (imgData[3] == 0) {
        return;
    }

    // convert to gray level with 140 threshold
    var grayImgData = [];
    for (var i = 0; i < 4 * height * width; i += 4) {
        var lum = 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
        grayImgData.push(lum > 140 ? 1 : 0);
    }

    // grayImg obj
    var grayImg = {
        width: width,
        height: height,
        grayImgData: grayImgData,
        at: function at(x, y) {
            return this.grayImgData[x + this.width * y];
        },
        set: function set(x, y, color) {
            this.grayImgData[x + this.width * y] = color;
        },
        compare: function compare(x1, y1, x2, y2, template) {
            var score = 0;
            var count = 0;
            for (var x = x1; x < x2; x += 3) {
                for (var y = y1; y < y2; y += 2) {
                    score += this.at(x, y) != template[count];
                    count++;
                }
            }
            return score;
        }

        // remove noise and identify
    };removeNoise();
    var result = identify(2);

    // set input element with the result
    document.getElementsByName('Agnomen')[0].value = result.toString();
};

// test existence first
var imgElement = document.querySelector('img[width="55"][height="20"]');
if (imgElement !== null) {
    // wait for captcha loaded
    aaoCaptcha(imgElement);
    imgElement.addEventListener("load", function () {
        aaoCaptcha(imgElement);
    });
}