// ==UserScript==
// @name         BS_Library
// @namespace    https://bs.to
// @version      1.4.2
// @description  Bibliothek mit nützlichen Funktionen für BS Userscripte.
// @author       Asu_nyan
// @match        https://bs.to/*
// @grant        none
// ==/UserScript==
// jshint esversion: 6


window.BS = {};
window.BS.Global = {};
window.BS.Series = {};
window.BS.Audio = {};
window.BS.Image = {};
window.BS.Module = {};
window.BS.Helper = {};
window.BS.PN = {};
window.BS.Favorites = {};


// BS -> Global
window.BS.Global.SecurityToken = () => document.head.querySelector('meta[name="security_token"]').content;

// BS -> Series
window.BS.Series.ID = () => {
    if(window.location.href.includes('https://bs.to/serie/')) {
        let link = document.body.querySelector('img[alt="Cover"]').src;
        let id = link.split('/')[link.split('/').length-1].split('.')[0];
        return parseInt(id);
    }
};


// BS -> Audio
window.BS.Audio.Notification = 'https://board.bs.to/applications/core/interface/sounds/notification.mp3';


// BS -> Image
window.BS.Image.PN = 'https://d30y9cdsu7xlg0.cloudfront.net/png/23598-200.png';
window.BS.Image.Favicon = 'https://bs.to/favicon.ico';


// BS -> Module
window.BS.Module.Update = (selector) => {
    let x = document.querySelector(selector);
    if(selector.includes('new')) {
        x.children[0].children[0].innerHTML += " <small>aktualisieren...</small>";
    }
    fetch('https://bs.to').then(res => res.text()).then(text => {
        let div = document.createElement('div');
        div.innerHTML = text;
        x.innerHTML = div.querySelector(selector).innerHTML;
    });
};
window.BS.Module.MultiUpdate = (selector_list) => {
    let module_list = [];
    selector_list.forEach(selector => {
        let x = document.querySelector(selector);
        if(selector.includes('new')) {
            x.children[0].children[0].innerHTML += " <small>aktualisieren...</small>";
        }
        module_list.push(x);
    });
    fetch('https://bs.to').then(res => res.text()).then(text => {
        let div = document.createElement('div');
        div.innerHTML = text;
        module_list.forEach(module => {
            module.innerHTML = div.querySelector(`#${module.id}`).innerHTML;
        });
    });
};
window.BS.Module.Get = (selector) => {
    return document.querySelector(selector);
};


// BS -> Helper
window.BS.Helper.InjectCSS = (link, css) => {
    let cdn;
    if(link) {
        cdn = document.createElement('link');
        cdn.href = link;
        cdn.rel = 'stylesheet';
    }
    else if(css) {
        cdn = document.createElement('style');
        cdn.innerText = css;
    }
    document.head.appendChild(cdn);
};
window.BS.Helper.InjectScript = (link, code) => {
    let cdn = document.createElement('script');
    if(link) cdn.src = link;
    else if(code) cdn.innerText = code;
    document.body.appendChild(cdn);
};
window.BS.Helper.RemoveDuplicates = (array) => {
    let contains = (array, obj) => {
        for (var i = 0; i < array.length; i++) {
            if (isEqual(array[i], obj)) return true;
        }
        return false;
    };
    let isEqual = (obj1, obj2) => {
        if (obj1 == obj2) return true;
        return false;
    };
    let arr = [];
    return array.filter(function(x) {
        return !contains(arr, x) && arr.push(x);
    });
};

// BS -> PN
window.BS.PN.Send = (opt) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://bs.to/messages/new', true);
    xhr.send();
    xhr.onload = () => {
        if(xhr.status === 200) {
            const div = document.createElement('div');
            div.innerHTML = xhr.responseText;
            let token = div.querySelector('input[name="security_token"]').value;
            let params = `newmsg%5Bto%5D=${opt.to}&newmsg%5Bsubject%5D=${opt.subject}&newmsg%5Btext%5D=${opt.text}&security_token=${token}`;
            const http = new XMLHttpRequest();
            http.open('POST', 'https://bs.to/messages', true);
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            http.send(params);
        }
    };
};
window.BS.PN.NotifyIfNew = () => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://bs.to/messages', true);
    xhr.onload = () => {
        if(xhr.status === 200) {
            let div = document.createElement('div');
            div.innerHTML = xhr.responseText;
            let unread = div.querySelectorAll('tr.unread');
            let messages = (window.localStorage.messages) ? JSON.parse(window.localStorage.messages) : [];
            if(unread.length > 0) {
                for(let i = 0; i < unread.length; i++) {
                    let msg = {
                        id: unread[i].children[0].children[0].getAttribute('href').split('/')[unread[i].children[0].children[0].getAttribute('href').split('/').length-1].split(':')[1],
                        subject: unread[i].children[0].children[0].innerText,
                        from: unread[i].children[1].children[0].innerText,
                        to: unread[i].children[2].children[0].innerText,
                        timestamp: unread[i].querySelector('time').innerText,
                        title: `${unread[i].children[1].children[0].innerText}`,
                        notify: () => {
                            let options = {
                                body: msg.subject,
                                icon: window.BS.Image.PN
                            };
                            new Notification(`PN von ${msg.from}`, options);
                        }
                    };
                    if (!(messages.some(e => e.id === msg.id))) {
                        if(!(msg.from === "Dir")) {
                            msg.notify();
                            messages.push(msg);
                        }
                    }
                }
                window.localStorage.messages = JSON.stringify(messages);
            }
        }
    };
    xhr.send();
};

// BS -> Favorites
window.BS.Favorites.Get = (callback) => {
    var http = new XMLHttpRequest();
	http.open("GET", "https://bs.to/settings/series", true);
	http.setRequestHeader("Content-type", "text/html; charset=utf-8");
    http.onload = () => {
        if(http.status == 200) {
            var list =http.responseText.split('<ul class="col" id="series-menu">')[1].split('</ul>')[0].split("\n");
			var AList=new Array(0);
			for(var i=1;i<list.length-1;i++){
				try{
					AList.push(JSON.parse(list[i].split('data-id="')[1].split('">')[0]));
				}catch(e){
					AList.push(list[i].split('data-id="')[1].split('">')[0]);
				}
			}
            if(callback) callback(AList);
        }
    };
	http.send();
};
window.BS.Favorites.Save = (favs, reload) => {
    let params = `token=${window.BS.Global.SecurityToken()}`;
    let id = window.BS.Series.ID();
    for(let i = 0; i < favs.length; i++) {
        params += `&series%5B%5D=${favs[i]}`;
    }
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://bs.to/ajax/edit-seriesnav.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(params);
    if(reload) {
        setTimeout(() => {
            window.BS.Module.Update('#other-series-nav');
        }, 2000);
    }
};