// ==UserScript==
// @name         弹琴吧曲谱下载
// @namespace    https://github.com/GZH2K19/tan8-downloader
// @version      1.0.1
// @description  下载弹琴吧网页端(VIP)曲谱图片
// @author       RepEater
// @license      MIT
// @match        *://www.tan8.com/yuepu*
// @grant        none
// @run-at       document-end
// @supportURL   https://github.com/GZH2K19/tan8-downloader
// @homepage     https://github.com/GZH2K19/tan8-downloader
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAApZJREFUaEPtWVF2wiAQDOhBEvQe1ZO0nqR6EvUk2nso5iKGsryQR9aEJVYl9sFfXyiZ2ZndsCvL3nyxN8efJQKxFUwKPEqBPM9zzvlnfd5XlmW5Uup4uVyWvndEU8AC1iAXjLFFH0jO+fJ0Oh37nr+EAICdTqd5VVUfFGAMNAqBOwGXSqlSq3F0Sb6UQG2LA/g3IDdKvW8H+6qq2pdlCX+bVRTFwdrqpQSEEN8awLoHvAGsAf34PI2DEJPAEMC2+tyQj0lgLaXcYDWI6mPzACxobBiVAHibqD6gEpTI0rXWWHIAwOFkbhK3S50xJnFQHmCbjUWBzhwIKK+jKaOJQPQq5EtUn5VSDoQkWtcedJVIOZByYKiVkoVG1g/83ySez+eL6/UKzU9Wd162GztyzvfwbAwd2Y0C0Aswxra+KUTUpp5KYvcLG1ogojY07lUCgTfXbNvMgzJ1zYfWstVWPpQAagfNS+tRCHRUe5j7OABaFtLqKBt1H6jZbPallNqG7DU5FColMXHoOqYhgEDtpJSrl17m7vEuKGEtBFVHqwPzIlCMnHcKIS62HdU2K9yZESZOKoAjDwAmk8kGZjs+77oEausBKFhgt1XfbAi9r5RSFj61Qgg00XBB4UPdKNfPWjnQlcR2EuEEAr4NMJm2i/wYhhBokk9bwrsfgWy9fODYMchqZBJj6Sk5hRBQPUwEGWOr8/lsZp921efhKHsLAFVkSAV8UXUPxxbyJZ8lopSCLzP8NtBMpvGg988EUAm8mfM4v6y4HyCyVFLAQp+TCnjuL12TN1NlKKuFggvZRxKAQ3qi3HW+t0SGABq6J4gATkLHuybicJ2AqwRO2qFg7tk/iMA9L3j2/yQCz44wdX5SgIrQs5//AhNVJE/V8z1UAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/510014/%E5%BC%B9%E7%90%B4%E5%90%A7%E6%9B%B2%E8%B0%B1%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/510014/%E5%BC%B9%E7%90%B4%E5%90%A7%E6%9B%B2%E8%B0%B1%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    "use strict";

    var titleElement = document.querySelector(".yuepu-text-info li:nth-child(2) p");
    var title = titleElement ? titleElement.textContent.trim() : "未知标题";

    var msgDiv = document.createElement("div");
    msgDiv.id = "msgDiv";
    msgDiv.style.position = "fixed";
    msgDiv.style.top = "50%";
    msgDiv.style.left = "50%";
    msgDiv.style.transform = "translate(-50%, -50%)";
    msgDiv.style.padding = "30px";
    msgDiv.style.fontSize = "20px";
    msgDiv.style.borderRadius = "5px";
    msgDiv.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    msgDiv.style.border = "2px solid #666";
    msgDiv.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
    msgDiv.style.zIndex = "10000";
    msgDiv.style.display = "none"; 
    document.body.appendChild(msgDiv);
    
    function info(msg) {
        msgDiv.innerHTML = msg;
        msgDiv.style.display = "block";
        setTimeout(() => {
            msgDiv.style.display = "none";
        }, 5000);
    }

    // if (window.location.href.includes("yuepu")) {}
    function createButton(text, bottom, color, onClick) {
        var button = document.createElement("button");
        button.innerHTML = text;
        button.style.position = "fixed";
        button.style.bottom = bottom;
        button.style.left = "20px";
        button.style.zIndex = "1000";
        button.style.padding = "10px 20px";
        button.style.backgroundColor = color;
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.onclick = onClick;
        return button;
    }

    async function fetchImages(base, typ) {
        var pageNum = 0;
        var typName = typ === "standard" ? "X" : "J";
        var fetchNext = async function() {
            var imageUrl = `${base}${pageNum}.png`;
            try {
                let res = await fetch(imageUrl);
                if (!res.ok) throw new Error(res.status);
                let blob = await res.blob();
                var link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `${title} [${typName}-${pageNum+1}].png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                pageNum++;
                fetchNext();
            } catch (error) {
                if (error.message.includes("404")) {
                    info(`成功下载${pageNum}张图片~`);
                } else {
                    info(`下载失败QAQ`);
                }
            }
        };
        fetchNext();
    }

    function analyzeImages(arr) {
        var url = arr.map(item => item.img[0])[0];
        var match = url.match(/(https:\/\/oss\.tan8\.com\/yuepuku\/\d+\/\d+\/)\d+_([a-z]+)_([a-z]+)\/+[^\/]+/);
        if (match) {
            var pre = match[1];
            var cid = match[2];
            var typ = match[3];
            var base = `${pre}${ypid}_${cid}_${typ}/${ypid}_${cid}.ypad.`;
            fetchImages(base, typ);
        } else {alert("URL解析失败");}
    }

    async function fetchAudio() {
        var audioElement = document.getElementById("myAudio");
        if (audioElement) {
            var audioUrl = audioElement.querySelector("source").src;
            try {
                let res = await fetch(audioUrl);
                if (!res.ok) throw new Error(res.status);
                let blob = await res.blob();
                var link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `${title} [preview].mp3`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                info(`成功下载预览音频~`);
            } catch (error) {
                info(`下载出现错误QAQ`);
            }
        } else {
            info(`未找到音频元素`);
        }
    }

    var audioButton = createButton("下载音频", "160px", "#900090", function() {fetchAudio();});
    var xianButton = createButton("下载线谱", "100px", "#007bff", function() {analyzeImages(yuepuArrXian);});
    var jianButton = createButton("下载简谱", "40px", "#28a545", function() {analyzeImages(yuepuArrJian);});
    document.body.appendChild(audioButton);
    document.body.appendChild(xianButton);
    document.body.appendChild(jianButton);
})();
