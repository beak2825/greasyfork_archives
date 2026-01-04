// ==UserScript==
// @name         DLSite Product Information Injector
// @description  Inject the information of a DLSite product to your restaurant.
// @namespace    dl_injecter
// @version      2.0.0
// @grant        GM_xmlhttpRequest
// @match        https://arca.live/b/simya/*
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/433939/DLSite%20Product%20Information%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/433939/DLSite%20Product%20Information%20Injector.meta.js
// ==/UserScript==
var fullRegexs = [/(RJ)[0-9]{6}\b|(RJ)[0-9]{8}\b/gi, /(VJ)[0-9]{6}\b|(VJ)[0-9]{8}\b/gi];

var partialRegexs = [/[0-9]{8}|[0-9]{6}/gi];

var languageRegexs = [/(거|퍼)[0-9]{6}\b|(거|퍼)[0-9]{8}\b/gi];

var defaultPrefix = 'RJ';
var default2Prefix = 'VJ';

// Get matched products from text.
function getMatchedProducts(text) {
    // Preprocess the inputted text.
    text = String(text);
    text = text.replace(/https?:\/\/(arca.live\/b\/simya\/)[0-9]*/g, ""); // Ignore arca live post url.

    // Get matches from the text with regexs.
    var matches = [];

    for (let i = 0; i < fullRegexs.length; i++) {
        let tempArr = [];
        tempArr = text.match(fullRegexs[i]);

        if (tempArr == null) {
            continue;
        }

        for (let j = 0; j < tempArr.length; j++) {
            if (tempArr[j] != null) {
                matches.push(tempArr[j].toUpperCase());
            }
        }
    }

    for (let i = 0; i < languageRegexs.length; i++) {
        let tempArr = [];
        tempArr = text.match(languageRegexs[i]);

        if (tempArr == null) {
            continue;
        }

        for (let j = 0; j < tempArr.length; j++) {
            if (tempArr[j] != null) {
                // If the product code is already exist, ignore current index.
                var text_check = tempArr[j].substr(0, 1);
                tempArr[j] = tempArr[j].substr(1);

                if ("거" == text_check) {
                    matches.push(defaultPrefix.toUpperCase() + tempArr[j]);
                }

                if ("퍼" == text_check) {
                    matches.push(default2Prefix.toUpperCase() + tempArr[j]);
                }
            }
        }
    }

    for (let i = 0; i < partialRegexs.length; i++) {
        let tempArr = [];
        tempArr = text.match(partialRegexs[i]);

        if (tempArr == null) {
            continue;
        }

        for (let j = 0; j < tempArr.length; j++) {
            if (tempArr[j] != null) {
                // If the product code is already exist, ignore current index.
                if (matches.includes("RJ" + tempArr[j]) || matches.includes("VJ" + tempArr[j])) {
                    break;
                }
                if (matches.includes("거" + tempArr[j]) || matches.includes("퍼" + tempArr[j])) {
                    break;
                }

                matches.push(defaultPrefix.toUpperCase() + tempArr[j]);
            }
        }
    }

    // Remove duplicated elements.
    var result = [];

    matches.forEach((element) => {
        if (!result.includes(element)) {
            result.push(element);
        }
    });

    return result;
}

// Provide Fetch feature.
function doFetch(url, options = {
    method: 'GET',
    responseType: 'document'
}, silent = false) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: url,
            method: options.method,
            responseType: options.responseType,
            headers: options.headers,
            data: options.data,
            onload: result => {
                console.debug(result)
                if (result.status == 200) {
                    resolve(result.response);
                } else {
                    if (!silent) {
                        console.log(result)
                        alert("알 수 없는 오류로 인해 데이터를 불러오지 못했습니다. " + url)
                        reject(result.status);
                    } else {
                        console.debug(result)
                        reject(result.status);
                    }
                }
            }
        });
    });
}

// Format number as bytes string.
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
        return '-';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


// Convert a array to a string.
function arr2str(arr, opt = ", ") {
    let idx = arr.indexOf("")

    while (idx > -1) {
        arr.splice(idx, 1)
        idx = arr.indexOf("")
    }

    return String(arr).replace(/"/g, '').replace('[', "").replace(']', "").replace(/,/g, opt)
}

// Get a product information from DLSite.
function getProductInformation(productCode) {
    return new Promise((resolve, reject) => {
        const url = `https://www.dlsite.com/maniax/api/=/product.json?workno=${productCode}&locale=ko-KR`
        doFetch(url, {
                method: 'GET',
                responseType: 'application/json'
            })
            .then(result => {
                const json = JSON.parse(result)[0];

                if (json) {
                    const processedJson = Object()

                    processedJson.thumbnailImage = [`<img width='180' height='120' src='https:${json.image_main.url}' alt='이미지'>`]

                    processedJson.workType = [`${json.work_type} / ${json.work_type_string}`]
                    processedJson.title = [`<a target='_blank' href='https://www.dlsite.com/home/work/=/product_id/${productCode}.html'>${json.work_name}</a>`]
                    processedJson.intro = [json.intro_s]
                    processedJson.maker = [json.maker_name]

                    if (json.genres) {
                        processedJson.genres = []

                        json.genres.forEach(genre => {
                            processedJson.genres.push(genre.name)
                        })

                        processedJson.genres = [arr2str(processedJson.genres)]
                    }

                    processedJson.fileInfo = [`${json.file_type}(${formatBytes(json.contents_file_size)})`]

                    processedJson.workUrl = [`<a target='_blank' href='https://www.dlsite.com/home/work/=/product_id/${productCode}.html'>${productCode}</a>`]

                    processedJson.circleUrl = [`<a target='_blank' href='https://www.dlsite.com/home/circle/profile/=/maker_id/${json.circle_id}.html'>${processedJson.maker}</a>`]

                    resolve(processedJson);
                } else {
                    reject(new Error("Request is failed."));
                }
            })
    });
}

function createProductElement(productCode) {
    return new Promise((resolve, reject) => {
        getProductInformation(productCode).then(function(data) {
            var html = '<table width="100%" border="0">' +
                '<tbody>' +
                '<tr><!-- 첫번째 줄 시작 -->' +
                `<td style="width: 1px; white-space: nowrap;" rowspan="2">${data.thumbnailImage}</td>` +
                '<td valign="center">' +
                '<div>' +
                `<div><span class="badge badge-success" style="display:inline-block; margin:0px 0px 0px 10px">${data.workUrl}</span><span class="badge badge-success" style="display:inline-block; margin:0px 4px 0px 4px">${data.workType}</span>${data.title}</div>` +
                `<div style="display:block; margin:0px 0px 0px 16px; font-size: 0.8375em; opacity: 0.8;"><li>설명 : ${data.intro}</li></div>` +
                `<div style="display:block; margin:0px 0px 0px 16px; font-size: 0.8375em; opacity: 0.8;"><li>서클 : ${data.circleUrl}</li></div>` +
                `<div style="display:block; margin:0px 0px 0px 16px; font-size: 0.8375em; opacity: 0.8;"><li>태그 : ${data.genres}</li></div>` +
                `<div style="display:block; margin:0px 0px 0px 16px; font-size: 0.8375em; opacity: 0.8;"><li>파일(용량) : ${data.fileInfo}</li></div>` +
                `<div></div>` +
                '</div>' +
                '</td>' +
                '</tr><!-- 첫번째 줄 끝 -->' +
                '</tbody>' +
                '</table>';

            resolve(html);
        });
    });
}

(function() {
    'use strict';

    // Get article wrapper element.
    let articleView = document.getElementsByClassName("article-view")[0];
    let articleWrapper = document.getElementsByClassName("article-wrapper")[0];

    // Add the headline.
    let contentsElement = document.createElement('p');
    contentsElement.innerHTML = '<span class="ion-android-archive" style="display:inline-block; width:20px; margin:4px 0px 0px 12px;"></span>게시글에서 언급된 게임 목록';

    articleView.insertBefore(contentsElement, articleWrapper);

    // Get product codes in article.
    var products = [];
    products = getMatchedProducts(articleWrapper.innerText);

    console.log(products);

    if (products.length > 0) {
        // Insert elements into article-view element.
        for (var i = 0; i < products.length; i++) {
            createProductElement(products[i]).then(function(html) {
                let contentsElement = document.createElement('div');
                contentsElement.setAttribute("class", "alert alert-info");
                contentsElement.innerHTML = html;

                articleView.insertBefore(contentsElement, articleWrapper);
            });
        }
    }
})();