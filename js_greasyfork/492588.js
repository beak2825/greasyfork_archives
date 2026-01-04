// ==UserScript==
// @name         CK Dashboard
// @namespace    http://tampermonkey.net/
// @version      25
// @description  Custom Dashboard Panel for Teletype
// @author       vertopolkaLF
// @license MIT
// @match        http://*.teletype.app/*
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teletype.app
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492588/CK%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/492588/CK%20Dashboard.meta.js
// ==/UserScript==

(function() {
    'use strict';


    if (window.location.href.indexOf("teletype.app") > -1) {
        function wait(ms)
        {
            var d = new Date();
            var d2 = null;
            do { d2 = new Date(); }
            while(d2-d < ms);
        }

        var free = 0;
        let freeTimer;

        function setAlarm(hour = 12, min = 0, sec = 0){

            var now = new Date();
            var alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, min, sec, 0) - now;
            var preAlarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour-1, min+55, sec, 0) - now;
            if (alarmTime < 0) {
                alarmTime += 86400000; // it's after 10am, try 10am tomorrow.
            }
            setTimeout(function(){
                window.location.reload();
            }, alarmTime);

            setTimeout(function(){
                document.querySelector('span.alarm').classList.add('visible');
            }, preAlarmTime);

        }

        setAlarm(9);
        setAlarm(12);
        setAlarm(15);
        setAlarm(18, 5);





        function waitForElm(selector) {
            return new Promise(resolve => {
                if(typeof selector === 'string'){
                    if (document.querySelector(selector)) {
                        return resolve(document.querySelector(selector));
                    }

                    const observer = new MutationObserver(mutations => {
                        if (document.querySelector(selector)) {
                            resolve(document.querySelector(selector));
                            observer.disconnect();
                        }
                    });

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                } else {
                    if (selector) {
                        return resolve(selector);
                    }

                    const observer = new MutationObserver(mutations => {
                        if (selector) {
                            resolve(selector);
                            observer.disconnect();
                        }
                    });

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                }
            });
        }

        function waitMessenger() {
            console.log('wait set');
            waitForElm("div.messenger-label:not([marked])").then((elm) => {
                messengerClass();
                console.log('wait trigger');
            });
        }

        function messengerClass(){
            var msgrs = document.querySelectorAll(".messenger-label");
            msgrs.forEach((element) => {
                if (element.innerHTML == "WhatsApp"){
                    if (! element.classList.contains('wa')){
                        element.classList.add('wa');
                        element.classList.add('marked');
                    }
                } else if (element.innerHTML == "Telegram"){
                    if (! element.classList.contains('tg')){
                        element.classList.add('tg');
                        element.classList.add('marked');
                    }
                }
            });
            waitMessenger();
        }

        setInterval(messengerClass, 5000);



        function selectFirst(){
            if (document.querySelector("div.appeal-selectors-container app-appeal-item:first-child")){
                document.querySelector("div.appeal-selectors-container app-appeal-item:first-child").click();
            }
            waitNew();
            console.log('wait init');
            messengerClass();
        }

        function waitNew() {
            console.log('wait start');
            waitForElm("div.appeal-selectors-container app-appeal-item:first-child div.appeal-selector:not(.active)").then((elm) => {
                console.log('wait elm');
                if (free == 0){
                    selectFirst();
                } else {
                }
            });

        }


        // FreeView on chat change and scroll
        waitForElm("div.appeals-list").then((elm) => {
            document.querySelector('.appeals-list').addEventListener('mousedown', freeView);
            document.addEventListener("wheel", freeView);
        });

        const freeIndicator = '<div class="progress-bar" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>';

        function freeView() {
            if (free != 2) {
                free = 1;
                clearTimeout(freeTimer);
                console.log('free ', free);
                freeTimer = setTimeout(lockView, 30000);
                if ( document.querySelector('.progress-bar') ){
                    document.querySelector('.progress-bar').remove();
                }
                document.body.insertAdjacentHTML('beforeEnd', freeIndicator);
                document.querySelector("div.progress-bar").classList.add('timer');
            }
        }

        function permaFreeView() {
            clearTimeout(freeTimer);
            free = 2;
            console.log('free ', free);
            if ( document.querySelector('.progress-bar') ){
                document.querySelector('.progress-bar').remove();
            }
            document.body.insertAdjacentHTML('beforeEnd', freeIndicator);
        }

        function lockView(){
            free = 0;
            waitNew();
            console.log('free ', free);
            if ( document.querySelector('.progress-bar') ){
                document.querySelector('.progress-bar').remove();
            }
            messengerClass();
            document.querySelector('.search-cancel').click();
            searchState = 1;
            searchToggle();
            showPhone(1);
        }

        function bookmark(){
            document.querySelector("div.appeal-selectors-container app-appeal-item div.appeal-selector.active").classList.toggle("bookmark");
        }



        // Refresh on close
        function refreshClosed() {
            console.log('function start');
            waitForElm("app-message.message-container.last div.assign-type").then((elm) => {
                if (document.querySelector("app-message.message-container.last div.assign-type").textContent.includes('закрыт')){
                    if (free == 0){
                        console.log('reload');
                        window.open("https://centrclimat.teletype.app/conversations/all/all","_self");
                    }
                }
            });
        }



        function createElementFromHTML(htmlString) {
            var div = document.createElement('div');
            div.innerHTML = htmlString.trim();

            // Change this to div.childNodes to support multiple top-level nodes.
            return div.firstChild;
        }



        function amoLink(){
            amoLink = document.querySelector("div.column.user-summary accordion div.panel.card div.info-row a[target='_blank']");
            if( amoLink ){
                amoLink.click();
            } else {
                location.reload();
            }
        }


        function showPhone(force){
            var phone = document.querySelector("div.phone");
            if (force == 1){
                phone.classList.remove('hover');
            } else {
                phone.classList.toggle('hover');
                freeView();
            }
        }




        var searchState = 0, searchParam = 0, searchParams;



        function searchToggle(){
            searchParams = document.querySelectorAll('.radio-param');
            if (searchState == 0){
                document.querySelector('app-search').classList.add('show');
                document.querySelector('app-search input').dispatchEvent(new MouseEvent("focus",{bubbles: true, cancellable: true}));
                document.querySelector('app-search input').focus();
                searchParam = 0;
                searchState = 1;
                console.log('open search');
            } else {
                document.querySelector('app-search input').dispatchEvent(new MouseEvent("blur",{bubbles: true, cancellable: true}));
                document.querySelector('app-search input').blur();
                document.querySelector('.search-cancel').click();
                document.querySelector('app-search').classList.remove('show');
                searchState = 0;
                console.log('close search');
            }
        }

        function clearSearch(){
            searchState = 0;
            document.querySelector('app-search input').dispatchEvent(new MouseEvent("blur",{bubbles: true, cancellable: true}));
            document.querySelector('app-search input').blur();
            document.querySelector('app-search').classList.remove('show');
            console.log('close search');
        }




        document.onkeyup = function(e) {

            if (e.which == 45) { // INS
                amoLink();
            }
            if (searchState == 1) {

                if (e.which == 13){
                    clearSearch();
                }

                if (e.which == 9){
                    console.log('tab');
                    e.preventDefault();
                    if (searchParam < 3) {

                        searchParam ++;
                        console.log(searchParam);
                        console.log(searchParams);
                        console.log(searchParams[Number(searchParam)]);
                        searchParams[Number(searchParam)].click();
                        document.querySelector('app-search input').focus();
                    } else {
                        searchParam = 0;
                        searchParams[Number(searchParam)].click();
                        document.querySelector('app-search input').focus();
                    }
                }
            }
        }

        document.onkeydown = function(e) {
            if (e.which == 45) { // INS
                amoLink();
            } else if (e.which == 46) { // DEL
                lockView();
            } else if (e.which == 33 || e.which == 34 || e.which == 35 || e.which == 36){ // OTHER BLOCK BTNS
                freeView();
            } else if (e.which == 19) { // PAUSE BREAK
                permaFreeView();
            } else if (e.which == 106) { // NUM *
                bookmark();
            } else if (e.which == 111) { // NUM /
                e.preventDefault();
                searchToggle();
            } else if (e.which == 109) { // NUM -
                e.preventDefault();
                showPhone();
            }

            if (e.which == 38 || e.which == 40) {
                freeView();
            }

            // numpad dialog selector
            if (searchState == 0) {
                if (e.which == 96) {
                    document.querySelector("div.appeal-selectors-container app-appeal-item:nth-child(2)").click();
                    freeView();
                } else if (e.which == 97) {
                    document.querySelector("div.appeal-selectors-container app-appeal-item:nth-child(3)").click();
                    freeView();
                } else if (e.which == 98) {
                    document.querySelector("div.appeal-selectors-container app-appeal-item:nth-child(4)").click();
                    freeView();
                } else if (e.which == 99) {
                    document.querySelector("div.appeal-selectors-container app-appeal-item:nth-child(5)").click();
                    freeView();
                } else if (e.which == 100) {
                    document.querySelector("div.appeal-selectors-container app-appeal-item:nth-child(6)").click();
                    freeView();
                } else if (e.which == 101) {
                    document.querySelector("div.appeal-selectors-container app-appeal-item:nth-child(7)").click();
                    freeView();
                } else if (e.which == 102) {
                    document.querySelector("div.appeal-selectors-container app-appeal-item:nth-child(8)").click();
                    freeView();
                } else if (e.which == 103) {
                    document.querySelector("div.appeal-selectors-container app-appeal-item:nth-child(9)").click();
                    freeView();
                } else if (e.which == 104) {
                    document.querySelector("div.appeal-selectors-container app-appeal-item:nth-child(10)").click();
                    freeView();
                } else if (e.which == 105) {
                    document.querySelector("div.appeal-selectors-container app-appeal-item:nth-child(11)").click();
                    freeView();
                } else if (e.which == 107) {
                    document.querySelector("div.appeal-selectors-container app-appeal-item:nth-child(1)").click();
                    freeView();
                }
            }

        }


        // mouse buttons

        function toolbarInit() {
            console.log("toolbarInit");
            const toolbar = "<div class='toolbar'></div>";
            const toolbar_HTML = createElementFromHTML(toolbar);

            const text_alarm = `<span class="alarm">Teletype перезагрузится через 5 минут</span>`;
            const btn_phone = `<a id='phone'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.6381 17.216V20.216C22.6392 20.4945 22.5822 20.7702 22.4706 21.0253C22.3591 21.2805 22.1954 21.5096 21.9902 21.6979C21.785 21.8861 21.5427 22.0295 21.2789 22.1187C21.015 22.2079 20.7355 22.2411 20.4581 22.216C17.381 21.8816 14.4251 20.8301 11.8281 19.146C9.41194 17.6107 7.36345 15.5622 5.82812 13.146C4.13809 10.5372 3.08636 7.56699 2.75812 4.476C2.73313 4.19946 2.76599 3.92076 2.85462 3.65762C2.94324 3.39448 3.08569 3.15268 3.27288 2.94762C3.46008 2.74255 3.68792 2.5787 3.94191 2.46652C4.19589 2.35433 4.47046 2.29626 4.74812 2.296H7.74812C8.23342 2.29122 8.70391 2.46307 9.07188 2.77953C9.43985 3.09598 9.68019 3.53544 9.74812 4.016C9.87474 4.97606 10.1096 5.91872 10.4481 6.826C10.5827 7.18392 10.6118 7.57291 10.532 7.94688C10.4523 8.32084 10.267 8.66411 9.99812 8.936L8.72812 10.206C10.1517 12.7095 12.2246 14.7824 14.7281 16.206L15.9981 14.936C16.27 14.6671 16.6133 14.4818 16.9872 14.4021C17.3612 14.3223 17.7502 14.3515 18.1081 14.486C19.0154 14.8245 19.9581 15.0594 20.9181 15.186C21.4039 15.2545 21.8475 15.4992 22.1646 15.8735C22.4818 16.2478 22.6503 16.7256 22.6381 17.216Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="shrtct">NUM -</span></a>`;
            const btn_auto = `<a id='lock'><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 11V7C7 5.67392 7.52679 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5356 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="shrtct">DEL</span></a>`;
            const btn_amo = `<a id='amo'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.61593 14.4684C7.61593 16.0125 8.21298 16.7836 9.40551 16.7836C10.6818 16.764 11.7393 16.1122 12.5765 14.8297C12.8695 14.3893 13.1102 13.8482 13.2986 13.2059C13.2986 10.9619 13.5079 9.03858 13.9271 7.43437C12.2312 7.75551 10.7555 8.53707 9.4997 9.77906C8.24385 11.022 7.61593 12.5857 7.61593 14.4684ZM22.4349 12.6648C22.8116 12.6648 23 13.1268 23 14.0476C23 14.5486 22.7802 15.1553 22.3412 15.8667C21.9017 16.5782 21.3308 17.23 20.6296 17.8206C19.9279 18.4118 19.1488 18.8983 18.2906 19.2791C17.4324 19.6593 16.5952 19.8492 15.7789 19.8492C14.6691 19.8492 13.9271 18.9178 13.5498 17.0536C13.0051 17.9158 12.2934 18.6222 11.4149 19.1733C10.5358 19.7249 9.35841 20 7.8828 20C6.40666 20 5.21937 19.5596 4.31935 18.6769C3.41933 17.7956 2.97978 16.7229 3.00071 15.4604C3.00071 12.0546 4.18277 9.36924 6.54847 7.40431C7.55366 6.58317 8.48979 6.04208 9.35841 5.78156C10.227 5.52104 11.1428 5.39028 12.1056 5.39028C13.0684 5.39028 13.8533 5.5511 14.4603 5.87124C14.7533 5.29058 15.0882 5 15.4649 5C16.1975 5 16.8935 5.30511 17.5528 5.91683C18.2121 6.52856 18.5423 7.10371 18.5423 7.64479C18.2482 8.30661 17.8197 9.0982 17.2545 10.02C17.0871 10.9414 17.0028 12.2345 17.0028 13.8978C17.0028 15.5616 17.2231 16.3923 17.6627 16.3923C18.2069 16.3923 19.5255 15.3512 21.6186 13.267C21.9953 12.8657 22.2674 12.6648 22.4349 12.6648Z" fill="white"></path></svg><span class="shrtct">INS</span></a>`;
            const btn_pause = `<a id='pause'><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.70288 19.5V4.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.6172 19.5V4.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="shrtct">PAUSE</span></a>`;
            const btn_mark = `<a id='bookmark'><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.18054L15.09 8.4405L22 9.4505L17 14.3205L18.18 21.2004L12 17.9504L5.82 21.2004L7 14.3205L2 9.4505L8.91 8.4405L12 2.18054Z" stroke="white" stroke-width="1.58333" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="shrtct">NUM *</span></a>`;
            const btn_search = `<a id='search'><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.0664 18.9824C15.4847 18.9824 19.0664 15.4007 19.0664 10.9824C19.0664 6.56414 15.4847 2.98242 11.0664 2.98242C6.64813 2.98242 3.06641 6.56414 3.06641 10.9824C3.06641 15.4007 6.64813 18.9824 11.0664 18.9824Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.0668 20.9828L16.7168 16.6328" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="shrtct">NUM /</span></a>`;
            // const btn_full = `<a id='fullscreen'><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.88818 3.32812H5.88818C5.35775 3.32813 4.84904 3.53884 4.47397 3.91391C4.0989 4.28898 3.88818 4.79769 3.88818 5.32812V8.32812M21.8882 8.32812V5.32812C21.8882 4.79769 21.6775 4.28898 21.3024 3.91391C20.9273 3.53884 20.4186 3.32813 19.8882 3.32812H16.8882M16.8882 21.3281H19.8882C20.4186 21.3281 20.9273 21.1174 21.3024 20.7423C21.6775 20.3673 21.8882 19.8586 21.8882 19.3281V16.3281M3.88818 16.3281V19.3281C3.88818 19.8586 4.0989 20.3673 4.47397 20.7423C4.84904 21.1174 5.35775 21.3281 5.88818 21.3281H8.88818" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="shrtct">F11</span></a>`;
            toolbar_HTML.innerHTML = text_alarm + btn_phone + btn_search + btn_amo + btn_auto + btn_pause + btn_mark;
            console.log(toolbar_HTML);
            document.querySelector('body').appendChild(toolbar_HTML);

            document.querySelector(`a#phone`).addEventListener('click', showPhone);
            document.querySelector(`a#lock`).addEventListener('click', lockView);
            document.querySelector(`a#amo`).addEventListener('click', amoLink);
            document.querySelector(`a#pause`).addEventListener('click', permaFreeView);
            document.querySelector(`a#bookmark`).addEventListener('click', bookmark);
            document.querySelector(`a#search`).addEventListener('click', searchToggle);
            // document.querySelector(`a#fullscreen`).addEventListener('click', toggleFullscreen);
            console.log("toolbarInitialized");

        }
        document.addEventListener('contextmenu', function(ev) {
            ev.preventDefault();
            window.open("https://centrclimat.teletype.app/conversations/all/all","_self");
        }, false);
        // First initialization
        waitForElm("div.appeal-selectors-container app-appeal-item:first-child").then((elm) => {
            selectFirst();
            messengerClass();
            setTimeout(refreshClosed, 10000);
            toolbarInit();
        });
    } else {
        console.log('not teletype');
        document.addEventListener('contextmenu', function(ev) {
            ev.preventDefault();
            window.close();
        }, false);
    }





    // setInterval(selectFirst, 10000);
})();