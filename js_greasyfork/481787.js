// ==UserScript==
// @name         虎扑帖子界面直接显示声望
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  在虎扑帖子界面直接显示声望
// @author       Amamiya
// @icon         https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @match        https://bbs.hupu.com/*
// @connect      my.hupu.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481787/%E8%99%8E%E6%89%91%E5%B8%96%E5%AD%90%E7%95%8C%E9%9D%A2%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E5%A3%B0%E6%9C%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/481787/%E8%99%8E%E6%89%91%E5%B8%96%E5%AD%90%E7%95%8C%E9%9D%A2%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E5%A3%B0%E6%9C%9B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var currentURL = window.location.href;
    if (currentURL.includes('.html')) {
        setTimeout(function () {
            const users = document.querySelectorAll('.user-base-info');
            const op = document.querySelector('.post-user_user-base-info__AxpCI');
            getUserReputation(op)
            users.forEach(user => {
                getUserReputation( user);

            });
        }, 1500);
    }


function getUserReputation(user) {
    setTimeout(function() {
        var url = user.querySelector('a').getAttribute('href');
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                var reputationValue = response.responseText.match(/\"value\":(-?\d+)/)[1];
                var tagItemSpan = document.createElement('span');
                var img = document.createElement('img');
                img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAiCAYAAAA+stv/AAAD+ElEQVRYR+2We0zVZRjHPy+/c+BwDbkcNYg5S1vlZS1BULClmetCbMzhyNpIl1nZZhjVmluU1frDpMXasKl4kNtkXlZuLPEPkzDOMDcIoguDPIEkyEXPOZxzOJe3HYIBdfBcbLA23z9/7/d5vp/3ed7LTzDHQ8yxP3cA/v8VePLzgaihyLuqFEV53GUb6XUYr5cM1e0v6qgttvmyv267Amt08pMgFW9vSoJfh6DLCA6z6fIN/VfZ7Ye3XvEGcVsAKSWDuUIVdvShBSHBh58Gpwuqf4Ivf4RRs6Xrur5iXcehl7pvBREQwI6DUt0ezqd2s/l1qahISwqhaOOkTV0nfNgIdoulIfGbM4/W1OQ4Z4LwG2C9TibY1dSsiCHNcM1In01hsTaMyqzpFroWONQKjuGBvY2vxX30nwCsOy7XB0uqtBq0xRuhuN5MbacTdVQUJ7MgPnzSxt2OXWehtR+rvbNlib5wpcdW+FYBKUVGBe8siWbf3rUoNie8chZsNhfWwW7CFyTxxsOQ/cD0dbb1w846sJuMB/UvR+30VAWvAItKZfQ9anSb7+PZHY9Aax983Aj9VpASLH9eQROTyKJYhbJnQAmabrPnHOh7pKXn9Ad3/366cPifELcEeOyYXBkZxomCVdybmgClzVD28/QUdrMFh9VEaGw8b62CzKXT5891wfvfg/G3S9ubC5OP+AyQWi2zV8dQ/u4aQh1O2HcRWgf/XcSxKvR1o4leSHSEQulToJ2yF4YtkHkKbNf+0DXlJ+X5BLC2XKYKwYX3UlG7JHz2AxgdM59m5+j4XtAmsSwODmyAUPWkPusE9Hb3NDbtTkzzCSCjUtZLSbq3W2zqvMM0gsNqRBM3n2QtFGZAVMjfis2nwGC4eqlpd0KyV4DVlXK+StIr8P+ptptHcFnNBMfEkxAO25bDvFDYc36sBaVN+UnbvAJk6GSKVKH3Z/VTtS67xGkeQtFEEaRRjU25HJhuNJ9JbzuQ2ewVYINOLrWp+CVQAHecAJPTYq2y3Oy/rFZpVMZR09ftby72+DB5OIZjl45BQqK/EFLQ6hKUuJwc0z8vbvoS7/EeSK+UryL5wpcE45qTKjVF53PEd37EjEk9X0RSivRKdMALviRUgsj/NlcU+aL1ugemCtKq5HbFRQFw//h3q4AWCSlTdVKQ1/CccAP7Pby+Be6MT5RJ7YhCROQ8empDcaZfxQAsnHCTdpY15Ik2v91nbIGXTBnlsloKtkzIgoIouJAr9s8eQIXcJaF4wlDA0fqt4sVZA3jwuIyItXNRwnIBZlRsqt8iGmYNwG3k/i9sjmDFgBpDR47oD8R85mMYaLYA4nw6BQHk9TnkDsCcV+AvelJzMs76M6EAAAAASUVORK5CYII=';
                img.style.width = '17px';
                img.style.height = '17px';
                img.style.verticalAlign = 'text-bottom';
                tagItemSpan.style.display = 'inline-block';
                tagItemSpan.style.verticalAlign = 'middle';
                tagItemSpan.style.height = '20px';
                tagItemSpan.style.background = '#f5f5f5';
                tagItemSpan.style.borderRadius = '10px';
                tagItemSpan.style.marginRight = '10px';
                tagItemSpan.style.padding = '0 5px';
                var valueSpan = document.createElement('span');
                valueSpan.innerText = reputationValue;
                tagItemSpan.appendChild(img);
                tagItemSpan.appendChild(valueSpan);
                user.insertBefore(tagItemSpan, user.childNodes[1]);
            }
        });
    }, 100);
}


})();
