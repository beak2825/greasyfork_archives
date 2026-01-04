// ==UserScript==
// @name         GlyphWiki SVG 下載器
// @name:en      GlyphWiki SVG Downloader
// @name:zh-CN   GlyphWiki SVG 下载器
// @name:ja      GlyphWiki SVG ダウンローダー
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  從 GlyphWiki editor 下載 SVG 的腳本
// @description:en A script to download SVG code from GlyphWiki editor
// @description:zh-CN 从 GlyphWiki editor 下载 SVG 的脚本
// @description:ja GlyphWikiエディタからSVGをダウンロードするスクリプト
// @author       SoizoKtantas & ChatGPT
// @match        https://glyphwiki.org/kage-editor/*
// @grant        none
// @icon         https://glyphwiki.org/kage-editor/favicon.ico
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/501188/GlyphWiki%20SVG%20%E4%B8%8B%E8%BC%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/501188/GlyphWiki%20SVG%20%E4%B8%8B%E8%BC%89%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 翻译内容
    var translations = {
        en: {
            saveSVG: "Save as SVG",
            enterFileName: "File name:",
            fileNameEmpty: "File name invalid",
            svgNotFound: "SVG not found",
            elementNotFound: "Element not found",
        },
        'zh-Hans': {
            saveSVG: "保存SVG图像",
            enterFileName: "输入文件名：",
            fileNameEmpty: "文件名不可空",
            svgNotFound: "找不到SVG图像",
            elementNotFound: "找不到目标元素",
        },
        'zh-Hant': {
            saveSVG: "保存SVG圖像",
            enterFileName: "輸入文件名：",
            fileNameEmpty: "文件名不可空",
            svgNotFound: "找不到SVG圖像",
            elementNotFound: "找不到目標元素",
        },
        ja: {
            saveSVG: "SVG保存",
            enterFileName: "ファイル名:",
            fileNameEmpty: "ファイル名は必須です",
            svgNotFound: "SVGが見つかりません",
            elementNotFound: "要素が見つかりません",
        },
        ko: {
            saveSVG: "SVG 저장",
            enterFileName: "파일명:",
            fileNameEmpty: "파일명이 필요합니다",
            svgNotFound: "SVG를 찾을 수 없습니다",
            elementNotFound: "요소를 찾을 수 없습니다",
        }
    };

    // 获取当前语言
    function getCurrentLang() {
        var appElement = document.querySelector('#root > div.App');
        if (appElement) {
            return appElement.getAttribute('lang') || 'en'; // 默认返回 'en'
        }
        return 'en'; // 如果找不到元素，也返回 'en'
    }

    // 获取翻译
    function getTranslation(key) {
        var langKey = getCurrentLang();
        var translation = translations[langKey];
        return translation ? translation[key] : translations.en[key];
    }

    window.addEventListener("load", function () {
        var parentElement = document.querySelector(
            "#root > div > div.editor-controls > div.preview"
        );

        if (parentElement) {
            var saveButtonText = getTranslation("saveSVG");
            var existingButton = Array.from(parentElement.querySelectorAll('button')).find(button => button.textContent === saveButtonText);

            if (!existingButton) {
                var downloadButton = document.createElement("button");
                downloadButton.textContent = saveButtonText;

                downloadButton.onclick = function () {
                    var svgElement = document.querySelector(
                        "#root > div > div.editor-controls > div.preview > svg"
                    );

                    if (svgElement) {
                        svgElement.setAttribute(
                            "xmlns",
                            "http://www.w3.org/2000/svg"
                        );
                        svgElement.setAttribute("version", "1.1");

                        var fileName = prompt(
                            getTranslation("enterFileName"),
                            "glyphwiki"
                        );
                        if (!fileName) {
                            alert(getTranslation("fileNameEmpty"));
                            return;
                        }

                        var svgData = new Blob([svgElement.outerHTML], {
                            type: "image/svg+xml;charset=utf-8",
                        });
                        var svgUrl = URL.createObjectURL(svgData);

                        var downloadLink = document.createElement("a");
                        downloadLink.href = svgUrl;
                        downloadLink.download = fileName + ".svg";

                        document.body.appendChild(downloadLink);
                        downloadLink.click();

                        document.body.removeChild(downloadLink);
                        URL.revokeObjectURL(svgUrl);
                    } else {
                        alert(getTranslation("svgNotFound"));
                    }
                };

                parentElement.appendChild(downloadButton);

                // 监听语言变化
                var appElement = document.querySelector('#root > div.App');
                if (appElement) {
                    var observer = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            if (mutation.attributeName === 'lang') {
                                downloadButton.textContent = getTranslation("saveSVG");
                            }
                        });
                    });
                    observer.observe(appElement, { attributes: true, attributeFilter: ['lang'] });
                }
            }
        } else {
            alert(getTranslation("elementNotFound"));
        }
    });
})();