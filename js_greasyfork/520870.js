// ==UserScript==
// @name         BAIDU IMAGEBNAM PIC
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.3.3
// @description  BAIDU IMAGEBNAM
// @author       greasyfork_baiduimage
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.js
// @match        *://www.imagebam.com/*
// @match        *://tieba.baidu.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAIu0lEQVR4AeVb+XMURRTOT/wvBhSFcEMEApIIGiBiuISigooglwSIEKxQIJSFFIiEcCogglAgJJxyRKMIAuIBJJyi7JmTZI9ssjn2Wd+Szs7Mds/07A6pQLpqqud63f2+ft3v6O6EBE0iokQi2kBEpUTko2c/gQfwAp4SNexGHomoGxHlE1Hrs8+zkAPwBh67RThPSEhoY/6CkOz5+wBeIyC0ofL8sanPUX5YCtrG/PMs9iIYwHMixB+Tg2WpoSFE27/yUHqmm14ZaKfBIxy0KKea7txrkqrjxq0gzcuuooEpjjD9+Elu2r3PS01y5FJ1KH7aAAAwQ1qSnO4WGp3hohd6PYq6XuxroxOn63XrOXjER92TbFG0KG/cRDdVVVsuqKUAwBJVhx5KG8dnngECEP571MwFoex2EyX25jPP6DMmu6nVWgx8AMCSBDFlDdXLFy+v5tY3a36lFP3hY34ufawvLQHA7w/RgOEOKQYg4ja7Wgpu322SogWww9KcFAzGym40nSUAnDxTL80AmMD/yoSxryc12m8lFxuU5HHdWwLAqs8em2JgU0GdqtFr1pmj/yJfTa8qzOSDJQDMWVhlCoBFH6vngffnyo1/Jgk5K9T0JnlW/W4JAO99aI6BZXk1qkbMzTYJYE4nAwA9ynpHJl+3sVYFwCera0zR5336WEUfz4MlErBzj5wKZODs/daranP+No8pADBpWpUsAeDefXk1BhC0arDsjjw91KjT1WIV/2QJAGhN1my5eWDC1HJu49PG6luRTHoWLKni0sf6UgqAv28GCRNV/6F2gjmbmu6irbs81KSwZ+yOZuqTbDcU5bMXAty2Hin0G9LCQaqqitjCjY0hgkod+YaTevSxhR0oOF6QKNlkCABMXJGDkjmtnHy+UHtd8OTg/bHe0uYbNuvrbz17AhYghhpLtbWtYY9TWweeX+pno0OS84QuAD+cDwiZYRVnL1OrJACyeVsdZUxxh83jISMdNGteJV28JGe9XfgpQDPnVNKgFEe4RwEy3Ov6QARogIAyWRt4OTpNpk4hAKGQsXfHKv7rhoXGOetinRyMsbr18remuHVKefJJCMC5YuPeZ5WjxzoyTZxeLgUA2nf5aqNu04QAmDFuXh5gU02IujXG+RFDTDQnsQ5R5kZGkxAAjD1lQUb31//URzpOvtvJS36RE3/W3qwPKtppeTdCAKByWCEy+amzaheXVxne3SoLErQB1NW0dysIk+imLXV0VzHDi2jxHrO7THvYP6PSXXrFiQ0hBDRZITK5SL+z2sH41KwK3TJnzKqg+w8iqo7RKnMZe0HZ3uTXHEryqHuhBMDYURZkdF9cwjdwUCMa3bO/fryPld97kJ30pKnwpLngi5EmEAKwPM+ch1ZewbfPDx81tvAY88r8zDn+kHrwsNlUx6xdr/Y8tSIgBAAiKzvbwujhpZulQemeVzKP+6TBdrr/D384YFxr/+c9wyJ8+K/CXuc0UggA/pX102EuaxPU1YgxTqmG8hqPd2MyXAR7X5u+3FonVa427qAtB8+6AMDeNkJ78oxyauFIP2Z3EWNm3vP0OEDBQoleOW9OcFN9fTR4WhB0AcDPNY9bCS6odtECz0tyq7mVHDse27gXMXT+x+gJts7TSvMXR4fSMGyX5laTV+GkaZlWPhsCwH6Gu3u0yE/fHPBR4Qk/YRmMl3672kiwDEXMxPIe8wFccl5CcKW9XSfrySVoF48W76QBEBWgfA+nCGpMy+T4Sa5wFAiNxbVxc23UP1oa7TNiEbILrMo2Gd1bBsCVa43U99Vo5sFI5nS1lti9z1wMkIEB61QkCUaMir5bAsDxU/XUs59Y7K0CAEDAQuXNCSIGjd7HDcCW7ca9aSUAAAETHU/1GjHL+x4zAIGGEH2UI6fqrAaADYnclTVxb5yICQBoBOhZ1hBe3qMPYnNPrney1JFg5RwwYLidUtOd7RfotOWNGONo/z4sTe2lwtavqORrJF6Pa9+ZBqC0LBiO12kbiec5Cyvp518DBB2tl5QA7NrjUf06NFXNIMp1uCLm7M3SxiiAhqY6CT5CLMkUALDNefsAoKJOnJbfuGA1AAApeZSDIJlmkzQAGPOixYtLV+QivqxxTwMAgADzWLlWwerTy6UBWC3YA5C7Uh0WR2X3HgTpaJGPvjvsDV/nitWu7dMCACCY3TsgBQD8AVFAQzk+wTzPypuoYwhZMQeAcXYlDbFz/RORFEgBgIUJVoEyT3ldHW4qvR3k/teRAKB9Bw7Jrx5LATB7QbTXhYq0+n3vfv4yeUcDAG9QNkkBMGI0P7CR/rY64opxr5QQdt/RAIzNVPseemBIASBa8EwaYqOWlkjQoba2hfoPi3aIzACAlV4GHMuV8wzPDmD/sRzaSjZJASDa/ooKL2tUIGKJE6a6qXtSZGLSA2DbLvWK8co10cFYswBg6Uw2SQEwbaY4nj8200XNzREpYBUHm0Lk97eGr0BAbRkq1SBPjYLO641cIazUtiUZCcCcJZukACjYwdcCTOQKdqp70ahyJQDQJA0NaoD06GUAwGQsm6QAwLIVY1aUz8uupMoqOadECQDKW55XzY3+8piQAcDMHiIpANAQo2UtMNI32UZLV1TT/oNewsJGcQn/gthrgcTkt35TLR0p9AnpUJ4WPG052HRtJkkDgDU77A/SVtiZnhGMNesQSQMAVLFVXRse7ywAoHNOS65QKyUEAMjbjURUdKqeYG93FsbRDrjj54uj1w6UjAruwwcmTB+ZcZe3EPb7ihwkLTgpo520cGkV7fjaQ9gEheAFJkwsXiCag+EFBrD1DueFEODQlsF77jXITlg5iuMoTfjITMyHpjzeVsJOMmx4wDriilU1tPbzWirY6SGsDv3+R6NhdEjQM4RluWvXG+n7Ij9BDWNLPcpHPXB5ARgOasSZwoemcFRWXhHHWWMnIgfPT47SdumDkzg92eWPzipA6JqHp5UnqduO0naZ4/P/AwCLllXQemY/AAAAAElFTkSuQmCC
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/520870/BAIDU%20IMAGEBNAM%20PIC.user.js
// @updateURL https://update.greasyfork.org/scripts/520870/BAIDU%20IMAGEBNAM%20PIC.meta.js
// ==/UserScript==

const cArr = "零一二三戏五六七八久诶哔嘻哒呃吩嘎哼哎叫咔啦吗嗯哦噗哐啊嘶吐哟味哇啸呀咋欸毕熙达额辅尬恒爱洁楷辣麻恩偶匹库阿思提优位瓦笑亚杂加杠等";
const bArr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/=";
const regex = /💠▶️([零一二三戏五六七八久诶哔嘻哒呃吩嘎哼哎叫咔啦吗嗯哦噗哐啊嘶吐哟味哇啸呀咋欸毕熙达额辅尬恒爱洁楷辣麻恩偶匹库阿思提优位瓦笑亚杂加杠等]+)◀️💠/g;
const pattern = /💠▶️([0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/=]+)◀️💠/g;
let pics = [];
let origins = [];
let originCount = 0;
let originTotal = 0;

const key = CryptoJS.enc.Utf8.parse('1234567890123456'); // 16字节密钥
const iv = CryptoJS.enc.Utf8.parse('abcdefabcdefabcd'); // 16字节IV

(async function() {
    'use strict';
    const href = window.location.href.toLowerCase();

    if (href === 'https://www.imagebam.com/') {
        let date = new Date();
        date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
        const expires = "; expires=" + date.toUTCString();
        document.cookie = "nsfw_inter=1" + expires + "; path=/";

        document.querySelector('.dz-hidden-input').addEventListener('change',function (){
            document.querySelector("[value='nsfw']").click();
            document.querySelector(".btn").click();
        });

    } else if (href.startsWith('https://www.imagebam.com/upload/complete')) {
        const showcase = document.querySelector("div.card-body > div > div:nth-child(1) > div > input[type=text]").value;
        const showcases = showcase.split(' ');
        showcases.forEach(s => {
            if (s.startsWith('https://')) {
                console.log(s);
                originHref(s, originTotal);
                originTotal++;
            }
        });
        //await originHref(showcase);
    } else if (href.startsWith('https://tieba.baidu.com')) {
        if (isMobile()) {
            wipeMobile();
        } else {
            wipePC();
        }

        if (href.startsWith('https://tieba.baidu.com/p/')) decodeToImage();
    }
})();

let wipedPC = false;
async function wipePC() {
    const intervalId = setInterval(() => {
        const s = document.querySelector('#thread_list');
        if (s) {
            s.childNodes.forEach(n => {try{if (n.tagName === 'DIV') {n.remove(); wipedPC = true; console.log('wiped');}}catch(e){}});
        }

        //if (wipedPC === true) {
            //clearInterval(intervalId); // 如果 tag 为 true，停止循环
        //}
    }, 2000); // 每秒执行一次
}

async function originHref(showcase, ind) {
    fetch(showcase).then(function (response) {
        return response.text();
    }).then(function (html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const origin = doc.querySelector('a.dropdown-item.text-capitalize').href;
        console.log(origin);
        origins[ind] = origin;
        originCount++;
        if (originCount == originTotal) pop();
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });
}

function funcA(imghref) {
    return "💠▶️" + BtoC(encrypt(imghref)) + "◀️💠";
}

// 创建并显示弹出框
function pop() {
    const imghref = origins.join(' ');
    // 创建弹出层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    // 创建弹出框内容
    const popupBox = document.createElement('div');
    popupBox.style.backgroundColor = '#333';
    popupBox.style.padding = '20px';
    popupBox.style.borderRadius = '10px';
    popupBox.style.display = 'flex';
    popupBox.style.flexDirection = 'column';
    popupBox.style.gap = '10px';
    popupBox.style.color = '#fff';

    // 第一行：显示imghref
    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.value = imghref;
    input1.style.width = '100%';
    input1.style.marginBottom = '10px';
    input1.readOnly = true;
    input1.addEventListener('click', () => {
        input1.select();
        document.execCommand('copy');
    });

    // 第二行：显示funcA(imghref)的结果
    const input2 = document.createElement('input');
    input2.type = 'text';
    input2.value = funcA(imghref);
    input2.style.width = '100%';
    input2.style.marginBottom = '10px';
    input2.readOnly = true;
    input2.addEventListener('click', () => {
        input2.select();
        document.execCommand('copy');
        if (isMobile()) {
            window.location.href = 'https://tieba.baidu.com/f?kw=%E4%BD%A0%E6%98%AF%E7%8B%97';
        } else {
            window.location.href = 'https://tieba.baidu.com/f?kw=%E4%BD%A0%E6%98%AF%E7%8B%97#sub';
        }
    });

    const tip = document.createElement('div');
    tip.innerHTML = '点击上方文字框即可复制';
    tip.style.width = '100%';
    tip.style.textAlign = 'center';

    // 将文字框加入弹出框
    popupBox.appendChild(input1);
    popupBox.appendChild(input2);
    popupBox.appendChild(tip);


    // 将弹出框加入到overlay中
    overlay.appendChild(popupBox);

    // 将overlay加入到页面中
    document.body.appendChild(overlay);

    // 点击overlay外部区域关闭弹出框
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

function wipeMobile() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // 判断某个特定的元素是否加载
                wipe();
            }
        });
    });

    // 配置 MutationObserver
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function wipe() {
        document.querySelectorAll('.swiper-content-first').forEach(element => {element.classList.remove('swiper-content-first');});
        document.querySelectorAll('.load-wrapper').forEach(element => {element.remove();});
        document.querySelectorAll('.wake-app-btn').forEach(element => {element.classList.remove('wake-app-btn');});
        document.querySelectorAll('.tb-backflow-defensive').forEach(element => {element.remove();});
        document.querySelectorAll('.recom-layout-container').forEach(element => {element.remove();});
        document.querySelectorAll('.tb-banner').forEach(element => {element.remove();});
    };
}

function decodeToImage(){
    // 用于在 div/span 中查找符合 regex 的文本并添加 img 标签的函数
    function processTextNode(n) {
        const leafNodes = getLeafNodes(n);
        leafNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {

                // 获取文本内容并匹配正则
                const matches = node.textContent.match(regex);
                if (matches) {
                    matches.forEach(match => {
                        //console.log(node);
                        const d = node.parentNode.closest('div');//;
                        if (d.getAttribute('id') ==='baidu_pastebin') return;
                        if (d.getAttribute('contenteditable')) return;
                        //console.log(d);


                        const m = match.slice(4, match.length - 4);
                        if (pics.indexOf(m) > -1) return;
                        pics.push(m);
                        //console.log(m);
                        const plainText = decrypt(CtoB(m));
                        const oris = plainText.trim().split(' ');
                        oris.forEach(o => {
                            console.log('pic ' + o);
                            if (o.startsWith('https://')) {
                                const img = document.createElement('img');
                                img.src = o;  // 假设匹配的文本就是图片的 URL
                                img.style.width = '100%';
                                node.parentNode.appendChild(document.createElement('br'));
                                node.parentNode.appendChild(img);
                            }
                        });

                    });
                }
            }
        });
    }

    // 创建一个 MutationObserver 来监听 div 和 span 元素的变化
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(mutation => {
            // 遍历新增的节点
            mutation.addedNodes.forEach(node => {
                // 如果是 div 或 span 元素，则遍历其所有的文本节点
                if (node.nodeType === Node.ELEMENT_NODE ) { //&& (node.tagName === 'DIV' || node.tagName === 'SPAN')
                    if (!(node.tagName === 'INPUT' || node.tagName === 'TEXTAREA'))
                        // 遍历该元素的所有子节点，找到文本节点
                        node.childNodes.forEach(processTextNode);
                }
            });
        });
    });

    // 配置观察器监听整个文档树的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载时遍历所有的 div 和 span 元素并处理已有的文本节点
    document.querySelectorAll('div, span').forEach(element => {//,
        element.childNodes.forEach(processTextNode);
    });
}

function getLeafNodes(node) {
    let leafNodes = [];

    // 检查当前节点是否有子节点
    if (node.hasChildNodes()) {
        // 遍历所有子节点
        node.childNodes.forEach(child => {
            // 递归查找子节点的叶子节点
            leafNodes = leafNodes.concat(getLeafNodes(child));
        });
    } else {
        // 如果当前节点没有子节点，则是叶子节点，添加到结果数组
        leafNodes.push(node);
    }

    return leafNodes;
}


function encrypt(text) {
    const encrypted = CryptoJS.AES.encrypt(text, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const cipherText = encrypted.toString();
    return cipherText;
}

// 解密方法
function decrypt(cipherText) {
    const decrypted = CryptoJS.AES.decrypt(cipherText, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    const plainText = decrypted.toString(CryptoJS.enc.Utf8);
    return plainText;
}

function CtoB(inputStr) {
    let outputStr = '';
    for (let i = 0; i < inputStr.length; i++) {
        const char = inputStr[i];
        const index = cArr.indexOf(char);
        if (index !== -1) {
            outputStr += bArr[index];
        } else {
            // 如果字符不在cArray中，则保留原字符
            outputStr += char;
        }
    }
    return outputStr;
}

function BtoC(inputStr) {
    let outputStr = '';
    for (let i = 0; i < inputStr.length; i++) {
        const char = inputStr[i];
        const index = bArr.indexOf(char);
        if (index !== -1) {
            outputStr += cArr[index];
        } else {
            // 如果字符不在bArr中，则保留原字符
            outputStr += char;
        }
    }
    return outputStr;
}

function isMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('iphone')) return true;
    if (userAgent.includes('ipod')) return true;
    if (userAgent.includes('ipad')) return true;
    if (userAgent.includes('android')) return true;
    if (userAgent.includes('blackberry')) return true;
    if (userAgent.includes('windows phone')) return true;
    if (userAgent.includes('mobile')) return true;
    if (userAgent.includes('opera mini')) return true;

    return false;
}