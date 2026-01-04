// ==UserScript==
// @name         Facebook Timestamper
// @namespace    http://wernercd.com/
// @version      0.2
// @description  Replace livetime ("1h") with timestamp on facebook
// @author       Chris Werner
// @match        https://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375113/Facebook%20Timestamper.user.js
// @updateURL https://update.greasyfork.org/scripts/375113/Facebook%20Timestamper.meta.js
// ==/UserScript==

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var year = a.getFullYear();
    //var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    //var month = months[a.getMonth() - 1];
    var month = a.getMonth()+1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = year + '/' + pad(month, 2) + '/' + pad(date, 2) + ' ' + pad(hour, 2) + ':' + pad(min, 2) + ':' + pad(sec, 2);
    return time;
}
function updateTimeStamps() {
    var slides = document.getElementsByClassName('livetimestamp');
    for(var i = 0; i < slides.length; i++)
    {
        let slide = slides[i];
        let timez = slides[i].getAttribute('data-utime');
        let converted = timeConverter(timez);
        let innertext = slide.innerHtml;
        let message = i + ": " + timez + " " + converted;
        slide.setAttribute('test-utime', converted);
        slide.textContent = converted;
    }
}

(function() {
    'use strict';

    window.addEventListener('load', () => {
        addButton('select read', updateTimeStamps)
    })

    function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {position: 'fixed', top: '1%', left:'1%', 'z-index': 30000}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    };

    setInterval(function(){
        updateTimeStamps();
    }, 5000);
})();
