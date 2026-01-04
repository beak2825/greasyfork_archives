// ==UserScript==
// @name        Aptoide下载器
// @namespace   Violentmonkey Scripts
// @match       *://*.aptoide.com/*
// @grant       none
// @version     1.02
// @author      heham
// @description Aptoide网站直接下载APK及OBB数据，屏蔽网站的欺骗性下载按钮
// @downloadURL https://update.greasyfork.org/scripts/398312/Aptoide%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/398312/Aptoide%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

function displayButton(apkUrl) {
    let a = document.createElement('a');
    a.href = apkUrl;
    a.className = "gradient-button__GradientButton-gcc0dg-0 kZgKIA";
    let div = document.createElement('div');
    a.appendChild(div);
    let span = document.createElement('span');
    span.appendChild(document.createTextNode('直接下载APK'));
    div.appendChild(span);
    let prevButton = document.getElementsByClassName('gradient-button__GradientButton-gcc0dg-0 kZgKIA')[0];
    prevButton.parentNode.insertBefore(a, prevButton.nextElementSibling);
}
function displayObbButton(fileUrl) {
    let a = document.createElement('a');
    a.href = fileUrl;
    a.className = "gradient-button__GradientButton-gcc0dg-0 kZgKIA";
    let div = document.createElement('div');
    a.appendChild(div);
    let span = document.createElement('span');
    span.appendChild(
        document.createTextNode('直接下载OBB')
    );
    div.appendChild(span);
    let prevButton = Array.from(document.getElementsByClassName('gradient-button__GradientButton-gcc0dg-0 kZgKIA')).pop();
    prevButton.parentNode.insertBefore(a, prevButton.nextElementSibling);
    prevButton.parentNode.insertBefore(document.createElement('p'), prevButton.nextElementSibling);
}

(function () {
    if (!document.querySelector('script[id="__NEXT_DATA__"]')) {
        return;
    }
    var txt = document.querySelector('script[id="__NEXT_DATA__"]').textContent;
    var json = JSON.parse(txt);
    let apkPackage = json.props.pageProps.app.package;
    let xhr = new XMLHttpRequest();
    let url = 'https://ws2.aptoide.com/api/7/app/getMeta/package_name=' + apkPackage;
    xhr.responseText = 'text';
    xhr.open('GET', url);
    xhr.onload = function () {
        if (xhr.status === 200) {
            let responseData = JSON.parse(xhr.responseText);
            displayButton(responseData.data.file.path);
            document.getElementsByClassName('gradient-button__GradientButton-gcc0dg-0 kZgKIA')[0].style.display="none";
            if (!responseData.data.obb) {
                return;
            }
            else {
                displayObbButton(responseData.data.obb.main.path);
            }
        } else {
            console.log('Incomplete status during request to ' + url, xhr.statusText);
        }
    };
    xhr.onerror = function () {
        console.log('Error during request to ' + url, xhr.statusText);
    };
    xhr.send();
})();
