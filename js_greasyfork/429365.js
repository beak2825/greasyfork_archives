// ==UserScript==
// @name         Biletix Bilet Satışta
// @version      1.0.4
// @description  Bir grubunun etkinliği için bilet satışta olunca, script bildirim gösterir ve o sekmeye odaklanır.
// @author       Criyessei, Ouzhan55
// @include      /^https:\/\/www\.biletix\.com\/etkinlik-grup\/\d{3,}\/[a-zA-Z]{3,}\/[a-zA-Z]{2,3}(\?.*)?$/
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_notification
// @grant        GM_info
// @run-at       document-end
// @noframes
// @namespace https://greasyfork.org/users/793449
// @downloadURL https://update.greasyfork.org/scripts/429365/Biletix%20Bilet%20Sat%C4%B1%C5%9Fta.user.js
// @updateURL https://update.greasyfork.org/scripts/429365/Biletix%20Bilet%20Sat%C4%B1%C5%9Fta.meta.js
// ==/UserScript==

/*globals $*/

//Inputs
const reloadPeriod = 10000; //format ms. 1000ms=1sn
const notificationSettings = {
    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAdhwAAHYcBj+XxZQAABGhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nPgo8cmRmOlJERiB4bWxuczpyZGY9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMnPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6QXR0cmliPSdodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvJz4KICA8QXR0cmliOkFkcz4KICAgPHJkZjpTZXE+CiAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9J1Jlc291cmNlJz4KICAgICA8QXR0cmliOkNyZWF0ZWQ+MjAyMS0wNy0xNDwvQXR0cmliOkNyZWF0ZWQ+CiAgICAgPEF0dHJpYjpFeHRJZD42MzUxNmI4MS00NWRjLTRmNjctYTlhNi0wNjkyYjRlNDgxNDg8L0F0dHJpYjpFeHRJZD4KICAgICA8QXR0cmliOkZiSWQ+NTI1MjY1OTE0MTc5NTgwPC9BdHRyaWI6RmJJZD4KICAgICA8QXR0cmliOlRvdWNoVHlwZT4yPC9BdHRyaWI6VG91Y2hUeXBlPgogICAgPC9yZGY6bGk+CiAgIDwvcmRmOlNlcT4KICA8L0F0dHJpYjpBZHM+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOmRjPSdodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyc+CiAgPGRjOnRpdGxlPgogICA8cmRmOkFsdD4KICAgIDxyZGY6bGkgeG1sOmxhbmc9J3gtZGVmYXVsdCc+dGlja2V0PC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlwdGlv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",
    sound: !0, //Notifikasyon olduğunda bildirim sesi olsun mu?
    showTab: !0, //Notifkasyon olduğunda tab açılsın mı
};


//Datas
const {/*groupId, city, */lang} = location.href.match(/\/etkinlik-grup\/(?<groupId>\d{3,})\/(?<city>[a-zA-Z]{3,})\/(?<lang>[a-zA-Z]{2,3})/).groups;
const localTexts = {
    "tr":{
        ticketStatuses: ["Satışta", "Tükendi"],
    },
    "en":{
        ticketStatuses: ["Onsale", "Sold out"],
    }
}[lang];

if(localTexts == undefined){
    alert(
        `Tr ve en dilindeki sayfalar için script(${GM_info.script.name}) çalışmaktadır.\n\n`+
        `The script(${GM_info.script.name}) works for pages in tr and en languages.`
    );
    return;
}
const start = Date.now();

(function() {
    'use strict';
    try{
        document.title = "Bilet kontrolü başladı";
        let events = $('#venuelists [id="tab1"]:first >[id="venueresultlists"]:first >div.listevent');
        if(!events.length){
            setTimeout(()=>{
                document.title = "Hiç etkinlik yok"
            }, Math.min(500, calculateRemaining()));
            return reload();
        }

        let foundedEvent = null;
        events.each(function(){
            let event = $(this);
            let ticketStatus = event.find('[itemprop="performer"]:first-child+span:first').text().trim();
            if(ticketStatus == localTexts.ticketStatuses[0]){
                foundedEvent = event;
                return false;
            }
        });

        if(foundedEvent == null){
            setTimeout(()=>{
                document.title = events.length==1?"Bilet tükenmiş":"Biletler tükenmiş";
            }, Math.min(500, calculateRemaining()));
            return reload();
        }

        let event = {
            groupName: foundedEvent.find('[itemprop="performer"]:first a:first').text().trim(),
            date: (foundedEvent.find('[itemprop="startDate"]:first').text()||"").trim(),
            day: (foundedEvent.find('.date> .day').text()||"").trim()
        };

        document.title = "Bilet bulundu!";
        console.log("Bileti satışta olan etkinlik bulundu!: %o", event);
        if(notificationSettings.showTab){
            if(document.hidden) window.focus();
            setTimeout(()=>{
                scrollToEvent(foundedEvent);
            }, 500);
        }
        GM_notification({
            title: `${event.groupName} Grubu için biletix'ten bilet bulundu!`,
            text: `${event.groupName} Grubunun ${event.date?`${event.date}${event.day?`(${event.day})`:""} günü için`:``} satışta bilet bulundu! Buraya tıklayarak sekmeyi açabilirsiniz.`,
            image: notificationSettings.image,
            highlight: notificationSettings.showTab,
            silent: !notificationSettings.sound,
            timeout: 10000,
            onclick: ()=>{
                window.focus();
                scrollToEvent(foundedEvent);
            },
        });
    }
    catch(err){
        document.title="Script hata ile karşılaştı!";
    }
})();

function reload(){
    let ms = calculateRemaining();
    let sec = parseInt(ms/1000);
    let interval = setInterval(()=>{
        if(--sec==0) clearInterval(interval);
        let title = document.title;
        let idx = title.indexOf(']');
        if(idx==-1) idx=0;
        else ++idx;
        document.title = ` [${sec}] ` + title.substring(idx);
    }, 1000);
    setTimeout(()=> {
        clearInterval(interval);
        document.title="Yenileniyor...";
        location.reload();
    }, ms);
}
function calculateRemaining(){
    return Math.max(0, Math.min(reloadPeriod, reloadPeriod-(Date.now()-start)));
}
function sleep(ms){return new Promise(res => setTimeout(res, ms))};
async function scrollToEvent(e){
    await waitFocusedTab();
    $('html').animate({ scrollTop: $(e).offset().top-500 }, 'fast');
    e.css('background-color', '#ffb7b7');
}
function waitFocusedTab(maxWait=5000){
    return new Promise(res=>{
        let interval;
        let timeout = setTimeout(()=>{
            clearInterval(interval);
            res(0);
        }, maxWait)
        interval = setInterval(()=>{
            if(document.hidden) return;
            clearTimeout(timeout);
            clearInterval(interval);
            res(1);
        }, 100);
    });
}