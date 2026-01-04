// ==UserScript==
// @name Дуэль куки
// @namespace https://www.bestmafia.com/
// @version 1.1
// @description Сохранение состояния бота.
// @author Лёшенька
// @match https://www.bestmafia.com/*
// @match http://www.bestmafia.com/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510609/%D0%94%D1%83%D1%8D%D0%BB%D1%8C%20%D0%BA%D1%83%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/510609/%D0%94%D1%83%D1%8D%D0%BB%D1%8C%20%D0%BA%D1%83%D0%BA%D0%B8.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    window.addEventListener('message', function(event) {
        const data = event.data;
        
        switch (data.message) {
            case 'updateActiveTask':
                document.cookie = `activeTask${data.index}=${data.value}; path=/; max-age=10800`; // Сохранение на 3 часа
                break;
            
            case 'update':
                document.cookie = `${data.name}=${data.value}; path=/; max-age=7776000`;
                break;
        
            case 'getActiveTask':
                event.source.postMessage({ message: 'task', index: data.index, value: getTaskValue(data.index) }, event.origin);
                break;
            
            case 'get':
                event.source.postMessage({ message: data.name, value: getValue(data.name)}, event.origin)
                break;
            
            default:
                break;
        }
});

function getTaskValue(index) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === `activeTask${index}`) {
            return value === 'true';
        }
    }
    return undefined;
}

function getValue(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [nametmp, value] = cookie.split('=');
        if (nametmp === name) {
            return value;
        }
    }
    return '';
}


 
})();