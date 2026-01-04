// ==UserScript==
// @name         [DP] PlanetDP Listeler
// @description  Planetdp portalında kendinize özel listeler oluşturmasına olanak sağlar.
// @version      1.2
// @author       nht.ctn
// @namespace    https://github.com/nhtctn
// @icon         data:image/png;base64,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
// @run-at       document-end

// @include      *://*planetdp.org*
// @include      *://*forum.planetdp.org*

// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_xmlhttpRequest

/* global $ */
// @downloadURL https://update.greasyfork.org/scripts/410020/%5BDP%5D%20PlanetDP%20Listeler.user.js
// @updateURL https://update.greasyfork.org/scripts/410020/%5BDP%5D%20PlanetDP%20Listeler.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';

    var defaultQueueForm = {name: "", description: "", counter: 1, delay: 0, note: 1, sortBy: "created", color: "olive"};
    var version = 1.1;
//    var defaultContentForm = {};
//    var oldContentDeleteTime = millisecondConverter(2, "year", "ms"); // 2 Year
    var checkWaitingTime = millisecondConverter(10, "minute", "ms"); // 10 minutes

    var pageUrl = window.location.href;
    var x;
    var enter = `
`;
if (pageUrl.search(/forum\.planetdp\.org\/.+/) > 0) {
    waitForKeyElements('.cke_toolbar.cke_toolbar_last > .cke_toolbar_end', function() {addForumExport();}, false);
}
else {
    if (pageUrl.search( /planetdp\.org\/title\// ) >= 0) {
        var babaMain = document.querySelector('div.baba_main');
        var cardId = pageUrl.replace(/.+planetdp\.org\/title\/.+-dp(\d+)(.+)?/,"$1");
        var cardInfos = getCardInfos(babaMain, cardId);
    }

    if (document.querySelector( '[href="/logout"]' ) != null)
    {
        // Üye menüsüne Kuyruk ikonu ve içine kuyruk oluştur seçeneğini yerleştir.
        var queueHtmlZero = `
<li class="dropdown">
<a data-toggle="dropdown" data-placement="bottom" class="lists-menu648" title="Listeler" class="dropdown-toggle" data-secondary-toggle="tooltip">
<span class="badge"></span>
<i class="fa fa-tasks"></i>
</a>
<ul class="dropdown-menu user-dropdown"><li id="queue648"><a href="#">Liste Oluştur</a></li></ul>
</li>
`;
        $('.user-buttons > .seperator:first').after(queueHtmlZero);
        document.getElementById("queue648").onclick = function() {insertQueueForm("new");};

        // Varsa mevcut kuyrukları da ekle.
        isertQueues();

        // Kuyruklar güncellendiğinde eski seçenek ve butonları temizle, baştan oluşturan fonksiyonu çlıştır.
        GM_addValueChangeListener("queueArray", function(name, old_value, new_value, remote) {
            var oldOptions = document.querySelectorAll('[id^="queue648_"]');
            for (x = 0; x < oldOptions.length; x++) {
                oldOptions[x].remove();
            }
            isertQueues();
        });
    }

    // CSS eklemeleri (Her sayfada gerekli css'ler yok.)
    GM_addStyle(`
.window-header {
    padding-bottom: 15px;
    border-bottom: 1px solid #000;
    display: contents;
}
.mfp-close-btn-in .mfp-close {
    color: #333;
}
button.mfp-close, button.mfp-arrow {
    overflow: visible;
    cursor: pointer;
    background: transparent;
    border: 0;
    -webkit-appearance: none;
    display: block;
    outline: none;
    padding: 0;
    z-index: 1046;
    -webkit-box-shadow: none;
    box-shadow: none;
}
.mfp-close {
    width: 44px;
    height: 44px;
    line-height: 44px;
    position: absolute;
    right: 0;
    top: 0;
    text-decoration: none;
    text-align: center;
    opacity: .65;
    filter: alpha(opacity=65);
    padding: 0 0 18px 10px;
    color: #fff;
    font-style: normal;
    font-size: 28px;
    font-family: Arial,Baskerville,monospace;
}
.mfp-close, .mfp-arrow, .mfp-preloader, .mfp-counter {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}
.mfp-bg {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1042;
    overflow: hidden;
    position: fixed;
    background: #0b0b0b;
    opacity: .8;
    filter: alpha(opacity=80);
}
.mfp-wrap {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1043;
    position: fixed;
    outline: none!important;
    -webkit-backface-visibility: hidden;
}
.mfp-container {
    text-align: center;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    padding: 0 8px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
.mfp-container:before {
    content: '';
    display: inline-block;
    height: 100%;
    vertical-align: middle;
}
.mfp-auto-cursor .mfp-content {
    cursor: auto;
}
.mfp-inline-holder .mfp-content, .mfp-ajax-holder .mfp-content {
    width: 100%;
    cursor: auto;
}
.mfp-content {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin: 0 auto;
    text-align: left;
    z-index: 1045;
}
.window-content .btn {
    margin-right: 15px;
}
.btn {
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 4px;
}
.btn-default {
    color: #333;
    background-color: #fff;
    border-color: #ccc;
}` +
    // Ekstra CSS'ler
`

ul[id^="queueWindow_list"] {
    height: 450px;
    overflow-y: auto;
}
ul[id^="queueWindow_list"] > li {
    padding: 7px 5px;
    border-bottom: 1px dotted #000;
    list-style: none;
    display: flex;
}
.div-left {
    display: inline-block;
    width: 70%;
    padding-right: 15px;
}
.div-right {
    display: inline-block;
    width: 30%;
}
.div-left > *, .div-right > * {
    display: block;
    width: 100%;
    word-break: break-word;
}
.queue_list_hide {
    display: none;
}
.queButtons {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
}
.waitingButtons {
    flex: 1;
}
.editButtons > i {
    font-size: 15px;
    border-radius: 15px;
    margin-left: 10px;
    user-select: none;
}
#deleteQueue:hover, #editQueue:hover, #exportQueue:hover {
    color: #f00;
}
.badge.no-counter {
    opacity: 0.6;
}

/* MOBİL GÖRÜNÜM */
@media only screen and (max-width: 767px) and (min-width: 320px){
    #queueWindow-form {margin: 0;}
    .queButtons { flex-direction: column; }
    .queButtons > * { width: 100%; text-align: left; }
    .editButtons > i  { margin: 0 15px 0 0; }
    .waitingButtons { margin-top: 10px; }
    ul[id^="queueWindow_list"] > li { flex-direction: column; }
    .div-right, .div-left { width: 100%; }
}
`);

    $('#dpDarkCss').after('<style id="queueCss_dark">queueWindow-form li, [id*="-form"] .window-header { border-color: #4c4c4c!important; }</style>');
    darkToggle();
    $('#darkSwitchButton').on("click", function() {darkToggle();} );
}

    function darkToggle() {
        if ($('#dpDarkCss').attr("disabled")) { $('#queueCss_dark').prop("disabled", "disabled"); }
        else { $('#queueCss_dark').prop("disabled", ""); }
    }

    function getCardInfos(page, c_ID) {
        var cardTitle = page.querySelector( 'h1[itemprop="name"]' ).textContent.trim();
        var year = page.querySelector('span[itemprop="copyrightYear"]');
        year = (year) ? year.textContent.trim().replace(/\n/gi,"").replace(/(\d{4})\s?-?\s?(\d{4})?/,"$1") : "?";
        var dpRaiting = page.querySelector('span[itemprop="ratingValue"]');
        dpRaiting = (dpRaiting) ? dpRaiting.textContent.trim() : "-";
        var imdbBoxLink = page.querySelector('ul.pd [href*="imdb.com/title/tt"]');
        var imdbID = (imdbBoxLink) ? imdbBoxLink.href.replace(/.+imdb\.com\/title\/tt(\d+)/,"$1") : "-";
        var imdbRating = (imdbBoxLink) ? imdbBoxLink.closest("ul").querySelector('li.active').textContent.trim().replace(/\/10/,"") : "-";
        imdbRating = (imdbRating == "") ? "-" : imdbRating;
        return {cardId: c_ID, cardTitle: cardTitle, year: year, dpRaiting: dpRaiting, imdbID: imdbID, imdbRating: imdbRating};
    }

    function activateElements() {
        var db = GM_getValue("queueArray");
        var lastActivate = GM_getValue("lastActivateTime");
        var currentTime = new Date().getTime();
        if (currentTime - lastActivate >= checkWaitingTime || lastActivate == null) {
            for (let y = 0; y < db.length; y++) {
                var activeWitingArray = db[y][1];
                for (let z = 0; z < activeWitingArray.length; z++) {
                    var w = activeWitingArray[z];
                    if (w != null) {
                        if (w.active == 0) {
                            if (currentTime >= w.activateTime) {
                                w.active = 1;
                            }
                        }
                    }
                }
            }
            GM_setValue("queueArray", db);
            GM_setValue("lastActivateTime", currentTime);
        }
    }

    function downloadQueue(no) {
        var queue = GM_getValue("queueArray")[no];
        var infos = queue[0];
        var s = `	`;
        var d = new Date();
        var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        var filename = infos.name + "_" + date;
        var array = [];
        arrayFilter(queue[1], array);
        arraySorter(array, "object", infos.sortBy);

        var data = `Yapım Adı` + s + `Yıl` + s + `IMDb ID` + s + `DP ID` + s + `Aktif mi?` + s + `Not` + s + `Gecikme` + s + `Oluşturma Zamanı` + s + `Aktifleşme Zamanı` + enter;
        for (let x = 0; x < array.length; x++) {
            var q = array[x];
            if (q != null) {
                data += q.cardTitle + s + q.year + s + q.imdbID + s + q.cardId + s + q.active + s + q.note + s + q.delay + s + q.created + s + q.activateTime + enter;
            }
        }

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    function isUpToDate(no) {
        var infos = GM_getValue("queueArray")[no][0];
        if (infos.version == version) {
            return true;
        }
        else {
            upDateQueue(no);
        }
    }

    function upDateQueue(no) {
        var queueArray = GM_getValue("queueArray");
        var infos = queueArray[no][0];
        var array = queueArray[no][1];
        var filtredArray = [];
        arrayFilter(queueArray[no][1], filtredArray);

        if(confirm("Bu listenin yeni versiyona göre güncellenmesi gerekmektedir." + enter +"Sürüm " + infos.version + " => Sürüm " + version + enter + enter + "Bu işlem birkaç dakika sürebilir. Lütfen sekmeyi kapatmayın.")) {
            try {
                // İlk verisonlu sürüme geçiş. ========
                if (infos.version == null) {
                    var change1 = (function(t) { // Version no ekle. Sıralama türü ekle[addedtime].
                        return function (e) {
                            var n_que = GM_getValue("queueArray");
                            infos.version = version;
                            infos.sortBy = "created";
                            n_que[no][0] = infos;
                            GM_setValue("queueArray", n_que);
                        };
                    })(no);

                    upDateQueueContent(no, filtredArray, 0, change1); // Öğe bilgilerini güncellemek için request at. [yıl,imdb ID,imdb puan,dp puan]
					alert("Güncelleme işlemi tamamlandı.");
                }
                // 1.1'e geçiş. ======================= (Henüz yayınlanmadı.)
                else if (infos.version == 1.0) {
                    for (let x = 0; x < filtredArray.length; x++) {
                        array[filtredArray[x].cardId].year = array[filtredArray[x].cardId].year.replace(/(\d{4})\s?-?\s?(\d{4})?/,"$1");
                    }
                    queueArray[no][0].version = version;
                    queueArray[no][1] = array;
                    GM_setValue("queueArray", queueArray);
                    alert("Güncelleme işlemi tamamlandı.");
                }
            }
            catch(err) {
                alert("Güncelleme işlemi sırasında bir sorun oluştu." + enter +"Sürüm " + infos.version + " => Sürüm " + version + enter + enter + "Lütfen aşağıdaki hata mesajı ile birlikte uygulama yazarına haber verin." + enter + enter + err.message);
            }
        }
    }

    function upDateQueueContent(no, array, index, myFunction) {
        if (index < array.length) {
            var ax = array[index];
            var id = ax.cardId;
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.planetdp.org/title/-" + id,
                onload: function(response) {
                    var json = response.responseText;
                    var htmlObj = $(json);
                    var page = htmlObj.find( 'div.baba_main' )[0];

                    var cardInfos2 = getCardInfos(page, id);
                    createContentLog(id, no, ax.delay, ax.note, cardInfos2, ax.created);

                    setTimeout(function() {upDateQueueContent(no, array, index+1, myFunction);}, 500);
                }
            });
        }
        else if (index == array.length) {
            myFunction();
        }
    }

    function createQueueWindow(queueNo) {
        if (isUpToDate(queueNo) == true) {

        var infos = GM_getValue("queueArray")[queueNo][0];
        insertWindow("queueWindow", "tasks", infos.name, false, infos.color);

        var buttons = `
<div class="queButtons">
    <div class="editButtons">
        <i id="exportQueue" class="fa fa-file-excel-o" aria-hidden="true" title="Bu Listenin Çıktısını Al"> Çıktı Al</i>
        <i id="editQueue" class="fa fa-pencil" aria-hidden="true" title="Bu Listeyi Düzenle"> Düzenle</i>
        <i id="deleteQueue" class="fa fa-trash" aria-hidden="true" title="Bu Listeyi Sil"> Sil</i>
    </div>
    <div class="waitingButtons">
        <a id="queueWindow_button_active" href="#" class="btn btn-info">Aktif</a>
        <a id="queueWindow_button_waiting" href="#" class="btn btn-default">Beklemede</a>
        <a id="queueWindow_button_done" href="#" class="btn btn-default" style="display: none;">Tamamlanmış</a>
    </div>
</div>
`;

        var listCovers = `
<fieldset class="window-content margintop10">
    <ul id="queueWindow_list_active" class="queue_list_show">
    </ul>
    <ul id="queueWindow_list_waiting" class="queue_list_hide">
    </ul>
    <ul id="queueWindow_list_done" class="queue_list_hide">
    </ul>
</fieldset>
`;
        var listFieldset = document.querySelector('#queueWindow-form > .window-content');
        listFieldset.insertAdjacentHTML("beforeend", buttons + listCovers);

        // Sil, düzenle, çıktı al butonlarına fonksiyonları bağla.
        document.querySelector('#queueWindow-form #exportQueue').onclick = function() {
            if (confirm("İnecek olan Txt dosyasının içindekileri kopyalayıp bir Excel dosyasına yapıştırabilirsiniz.")) {
                downloadQueue(queueNo);
            }
        };
        document.querySelector('#queueWindow-form #editQueue').onclick = function() {removeForm("queueWindow"); insertQueueForm("edit", queueNo);};
        document.querySelector('#queueWindow-form #deleteQueue').onclick = (function(t, inf) {
            return function (e) {
                if (confirm("Bu listeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
                    var library = GM_getValue("queueArray");
                    library.splice(t, 1);
                    GM_setValue("queueArray", library);
                    removeForm("queueWindow");
                    alert("\"" + infos.name + "\" adlı kuruk silindi.");
                }
            };
        })(queueNo, infos);

        // Listelerin içini doldur ve güncelle
        insertLists(queueNo);

        GM_addValueChangeListener("queueArray", function(name, old_value, new_value, remote) {
            var oldLists = document.querySelectorAll('[id^="queueWindow_list"]');
            for (x = 0; x < oldLists.length; x++) {
                oldLists[x].innerHTML = "";
            }
            insertLists(queueNo);
        });

        // Listelerin ve butonların toggle'larını ayarla
        var listButtons = listFieldset.querySelectorAll('[id^="queueWindow_button"]');
        for (let x = 0; x < listButtons.length; x++) {
            listButtons[x].onclick = (function(t) {
                return function (e) {
                    // Butonlar
                    var oldButton = listFieldset.querySelector('a.btn-info');
                    classToogle( oldButton, ["btn-info", "btn-default"] );
                    classToogle( listButtons[x], ["btn-info", "btn-default"] );

                    // Listeler
                    var oldListElement = listFieldset.querySelector( 'ul.queue_list_show' );
                    classToogle( oldListElement, ["queue_list_show", "queue_list_hide"] );
                    var listElement = listFieldset.querySelector( '#' + listButtons[x].id.replace('button','list') );
                    classToogle( listElement, ["queue_list_show", "queue_list_hide"] );
                };
            })(x);
        }

        }
    }

    function insertLists(queueNo) {
        var library = GM_getValue("queueArray");
        var sortBy = library[queueNo][0].sortBy;
        sortBy = sortBy ? sortBy : "cardTitle";

        // Aktif
        var activeArray = [];
        arrayFilter(library[queueNo][1], activeArray, "active");
        arraySorter(activeArray, "object", sortBy);
        var activeList = document.querySelector('#queueWindow_list_active');
        activeList.innerHTML = listHTML(activeArray);

        // Beklemede
        var waitingArray = [];
        arrayFilter(library[queueNo][1], waitingArray, "waiting");
        arraySorter(activeArray, "object", sortBy);
        var waitingList = document.querySelector('#queueWindow_list_waiting');
        waitingList.innerHTML = listHTML(waitingArray);

        // Tamamlanmış (Sonra)
    }

    function listHTML(array) {
        var result = '';
        for (let x = 0; x < array.length; x++) {
            var a = array[x];

            var d = new Date(a.created);
            var date = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();

            result += `
<li>
    <div class="div-left">
        <a href="/title/-` + a.cardId + `"><strong>` + a.cardTitle + ` (` + a.year + `)</strong></a>
        <span>` + (a.note == "" ? "" : "<strong>Not:</strong> " + a.note) + `</span>
    </div>
    <div class="div-right">
        <span><strong>Eklenme:</strong> ` + date + `</span>
        <span><strong>Gecikme:</strong> ` + (a.delay == 0 ? "Yok" : a.delay + " gün") + `</span>
    </div>
</li>
`;
        }
        result = (result == '') ? "Bu listede hiçbir öğe yok." : result;
        return result;
    }

    function isertQueues() {
        var queues = GM_getValue("queueArray");
        if (queues != null && Array.isArray(queues) && queues.length >= 1) {
            // Aktifleşecek varsa aktifleştir.
            activateElements();

            // Üst menüye eklemeleri yap.
            for (x = 0; x < queues.length; x++) {
                var infos = queues[x][0];
                var activeArray = [];
                arrayFilter(queues[x][1], activeArray, "active");
                var queueOption = '<li id="queue648_' + infos.id + '_menu"><a href="#">' + infos.name + (infos.counter == 0 ? ' <span class="badge">' + activeArray.length + '</span>' : ' <span class="badge no-counter">' + activeArray.length + '</span>') + '</a></li>';
                $('#queue648').parent().append(queueOption);

                // Aktif öğe penceresi için fonksiyonu bağla.
                document.querySelector('#queue648_' + infos.id + '_menu').onclick = (function(t) {
                    return function (e) {
                        createQueueWindow(t);
                    };
                })(x);
            }

            // Üst menü için tooltip ve bildirimi çalıştır.
       //     $('script[src^="/js/jquery.min.12.4.js"]').remove();
	        $('.lists-menu648').tooltip();
	        $('.user-buttons > li.dropdown').each(function() {
	        	var counter = countCalculator(this);
	        	$(this).find('a[data-toggle="dropdown"] > .badge').html( (counter > 0 ? counter : "") );
	        });

            // Yapım sayfasındaysa karta eklemeleri yap.
            if (pageUrl.search( /planetdp\.org\/title\// ) >= 0) {
                var readMore = document.querySelector('div[itemprop="description"] + a[data-readmore-moretext="Devamını gör"]');
                if (readMore) {
                    readMore.style.position = "relative";
                    readMore.style.marginRight = "15px";
                }
                for (x = 0; x < queues.length; x++) {
                    var queueNo = queues.length - (x + 1);
                    var infos2 = queues[queueNo][0];
                    var isInQueue = queues[queueNo][1][cardId] != null;
                    var buttonTitle = (isInQueue ? 'Listeden çıkar: ' : 'Listeye ekle: ') + infos2.name;
                    if (isInQueue) {
                        var q = queues[queueNo][1][cardId];
                        var currentTime = new Date().getTime();
                        buttonTitle += (q.active == 1 ? '' : enter + 'Aktifleşme: ' + millisecondConverter( (q.activateTime - currentTime) , "ms", "day") + ' gün sonra') + enter + (q.note == '' ? '' : 'Not: ' + q.note);
                    }
                    var queuButton = '<a href="#" id="queue648_' + infos2.id + '" title="' + buttonTitle + '" onclick="this.classList.toggle(`inQueue`)" class="' + (isInQueue ? 'inQueue': '') + '" style="margin-right: 10px; float: left;"><i class="fa fa-tasks" aria-hidden="true"></i></a>';
                    document.querySelector('div.baba_main_right > div.text-right.marginver10').insertAdjacentHTML('afterbegin', queuButton);
                    GM_addStyle('#queue648_' + infos2.id + ':hover, #queue648_' + infos2.id + '.inQueue {color: ' + infos2.color + '!important;}');

                    // Kuyruğa yapım ekleme/çıkarma fonksiyonunu bağla.
                    if (isInQueue) {
                        document.querySelector('div.baba_main_right #queue648_' + infos2.id).onclick = (function(t, id) {
                            return function (e) {
                                removeQueueContent(t, id);
                            };
                        })(x, cardId);
                    }
                    else {
                        document.querySelector('div.baba_main_right #queue648_' + infos2.id).onclick = (function(t) {
                            return function (e) {
                                createQueueContent(t);
                            };
                        })(x);
                    }
                }
            }
        }
    }

	function countCalculator(dropdownLi) {
		var number = 0;
		$(dropdownLi).find('a:not([data-toggle="dropdown"]) > .badge:not(.no-counter)').each(function() {
			number += parseInt( this.textContent.trim().replace( /(\d+) - \d+/, "$1" ) );
		});
		return number;
	}

    function createQueueContent(queueNo) {
        var queues = GM_getValue("queueArray");
        var r_queueNo = queues.length - (queueNo + 1);
        var infos = queues[r_queueNo][0];
        var c_delay = infos.delay;
        var c_note = infos.note;
        var note = '';
        var delay = c_delay;

        // Lazımsa notu ve/veya gecikme süresini al.
        if (c_note == 0 || c_delay == "?") {
            insertWindow("content", "tasks", "Listeye ekle: " + infos.name, true, infos.color);
            var formContent = [];
            if (c_note == 0) {formContent.push( {name: 'Açıklama', element: 'textarea', elementProperties: 'id="queue_content_note" placeholder="Yapılacak iş ile ilgili bir not bırakabilirsiniz. Bu alan zorunlu değildir." style="resize: vertical;"'} );}
            if (c_delay == "?") {formContent.push( {name: 'Öğe Aktifleşme Gecikmesi', element: 'select', elementProperties: 'id="queue_content_delay"', inside: function() {return optionsHTML(this.options);}, options: [
                {value: '0', text: 'Yok'},
                {value: '1', text: '1 gün sonra'},
                {value: '2', text: '2 gün sonra'},
                {value: '3', text: '3 gün sonra'},
                {value: '7', text: '7 gün sonra'},
                {value: '15', text: '15 gün sonra'},
                {value: '30', text: '30 gün sonra'},
                {value: '*', text: 'Gün sayısını elle gir'}] }
            );}
            document.querySelector('#content-form > .window-content').insertAdjacentHTML("afterbegin", createformHTML(formContent) );
            if (c_delay == "?") {askToPerson( document.querySelector('select#queue_content_delay'), 7 );} // Gün sayısını elle girme fonksiyonu
            document.querySelector('button#save_content').onclick = function() {
                note = (c_note == 0 ? document.querySelector("#queue_content_note").value : '');
                delay = (c_delay == "?" ? getSelected("queue_content_delay") : c_delay);

                // Öğeyi oluştur.
                createContentLog(cardId, r_queueNo, delay, note, cardInfos, new Date().getTime());
                removeForm("content");
            };
        }
        else {
            // Öğeyi oluştur.
            createContentLog(cardId, r_queueNo, delay, note, cardInfos, new Date().getTime());
        }
    }

    function createContentLog(c_id, c_no, delay, note, c_Infos, added) {
        let que = GM_getValue("queueArray");
        var created = added;
        var activateTime = created + (delay*86400000);
        var active = (delay == 0 ? 1 : 0);
        var contentInfos = {cardId: c_id, cardTitle: c_Infos.cardTitle, active: active, note: note, created: created, activateTime: activateTime, delay: delay, year: c_Infos.year, dpRaiting: c_Infos.dpRaiting, imdbID: c_Infos.imdbID, imdbRating: c_Infos.imdbRating};
        que[c_no][1][c_id] = contentInfos;
        console.log(contentInfos);
        GM_setValue("queueArray", que);
        activateElements(); // Bekleyenleri kontrol ederek kaydet.
    }

    function removeQueueContent(queueNo, c_cardId) {
        var validation = confirm("Bu yapımı listeden çıkarmak istediğinize emin misiniz?");
        if (validation) {
            var queues = GM_getValue("queueArray");
            var r_queueNo = queues.length - (queueNo + 1);
            queues[r_queueNo][1][c_cardId] = null;
            GM_setValue("queueArray",queues);
            console.log("removed");
        }
    }

    function insertQueueForm(newOrEdit, queueNo) {
        var windowTitle, queueColor, oldInfos;
        if (newOrEdit == "new") {
            windowTitle = "Liste Oluştur";
        }
        else if (newOrEdit == "edit") {
            var library = GM_getValue("queueArray");
            oldInfos = library[queueNo][0];
            queueColor = oldInfos.color;
            windowTitle = "Listeyi Düzenle";
        }

        insertWindow("queue", "tasks", windowTitle, true, queueColor);

        var formContent = [
            {
				name: 'Liste Adı',
				element: 'input',
				elementProperties: 'id ="queue_name" type="text"'
			},
            {
				name: 'Açıklama',
				element: 'textarea',
				elementProperties: 'id="queue_description" placeholder="Listenin amacı, kullanışı vs. Bu alan zorunlu değildir." style="resize: vertical;"'
			},
            {
				name: 'Bildirim Olarak Göster',
				element: 'select',
				elementProperties: 'id="queue_counter"',
				inside: function() {return optionsHTML(this.options);},
				options: [
					{value:'0', text:'Evet'},
					{value:'1', text:'Hayır'}
				]
			},
            {
				name: 'Öğe Notu',
				element: 'select',
				elementProperties: 'id="queue_note"',
				inside: function() {return optionsHTML(this.options);},
				options: [
					{value:'0', text:'Evet'},
					{value:'1', text:'Hayır'}] },
            {
				name: 'Öğe Aktifleşme Gecikmesi',
				element: 'select',
				elementProperties: 'id="queue_delay"',
				inside: function() {return optionsHTML(this.options);},
				options: [
                	{value: '?', text: 'Ekleyişte sor'},
                	{value: '0', text: 'Yok'},
                	{value: '1', text: '1 gün sonra'},
                	{value: '2', text: '2 gün sonra'},
                	{value: '3', text: '3 gün sonra'},
                	{value: '7', text: '7 gün sonra'},
                	{value: '15', text: '15 gün sonra'},
                    {value: '30', text: '30 gün sonra'},
                	{value: '*', text: 'Gün sayısını elle gir'},
            	]
			},
            {
				name: 'Sıralama',
				element: 'select',
				elementProperties: 'id="queue_sortBy"',
				inside: function() {return optionsHTML(this.options);},
				options: [
                	{value: 'created',       text: 'Ekleme Tarihine Göre'},
                	{value: 'activateTime',  text: 'Aktifleşme Tarihine Göre'},
                	{value: 'cardTitle',     text: 'Alfabetik'},
                	{value: 'year',          text: 'Yıla Göre'},
                	{value: 'imdbRating',    text: 'IMDb Puanına Göre'},
               		{value: 'dpRaiting',     text: 'PlanetDP Puanına Göre'},
				]
			},
            {
				name: 'Liste Rengi',
				element: 'select',
				elementProperties: 'id="queue_color" onchange="this.className = `form-control ` + this.options[this.selectedIndex].value"',
				inside: function() {return colorOptionsHTML();}
			}
        ];
        document.querySelector('#queue-form > .window-content').insertAdjacentHTML("afterbegin", createformHTML(formContent) );
        askToPerson( document.querySelector('select#queue_delay'), 8 ); // Gün sayısını elle girme fonksiyonu

        if (newOrEdit == "new") {
            document.querySelector('button#save_queue').onclick = function() { createEditQueue(); };
            fillNewEditQueueForm(defaultQueueForm);
        }
        else if (newOrEdit == "edit") {
            fillNewEditQueueForm(oldInfos);
            document.querySelector('button#save_queue').onclick = function() { createEditQueue(queueNo); createQueueWindow(queueNo); };
            document.querySelector('#queue-form button#close').onclick = function() { removeForm("queue"); createQueueWindow(queueNo); };
        }
    }

    function fillNewEditQueueForm(i_infos) {
        document.querySelector('input#queue_name').value = i_infos.name;
        document.querySelector('textarea#queue_description').value = i_infos.description;
        setSelected("queue_counter", i_infos.counter);
        setSelected("queue_note", i_infos.note);
        setSelected("queue_delay", i_infos.delay);
        setSelected("queue_sortBy", i_infos.sortBy);
        setSelected("queue_color", i_infos.color);
    }

    function setSelected(selectId, option) {
        $('select#' + selectId + ' option[value="' + option + '"]').prop('selected', true);
    }

    function askToPerson(delaySelection, askIndex) {
        delaySelection.onchange = function() {
            if(delaySelection.selectedIndex === askIndex) {
                var manualDelay;
                for (x = 0; !Number.isInteger( parseInt(manualDelay) ); x++) {
                    manualDelay = prompt("Listeye eklenen öğeler kaç gün sonra aktifleşsin?");
                    if (manualDelay == null) { break; }
                }
                if (manualDelay != null) {
                    delaySelection.insertAdjacentHTML("beforeend", '<option value="' + manualDelay + '">' + manualDelay + ' gün sonra</option>');
                    delaySelection.querySelector('option[value="' + manualDelay + '"]').selected = true;
                }
                else {
                    delaySelection.firstElementChild.selected = true;
                }
            }
        };
    }

    function createformHTML(object) {
        var formContentHTML = '';
        for (x = 0; x < object.length; x++) {
            var f = object[x];
            formContentHTML += `
            <div class="row margintop10">
                <div class="col-md-4">` + f.name + `</div>
                <div class="col-md-8">
                    <` + f.element + ` ` + f.elementProperties + ` class="form-control">` + (f.inside ? f.inside(): '') + `</` + f.element + `>
                </div>
            </div>`;
        }
        return formContentHTML;
    }

    function optionsHTML(object) {
        var html = '';
        for (var y = 0; y < object.length; y++ ) {
            html += '<option value="' + object[y].value + '">' + object[y].text + '</option>';
        }
        return html;
    }

    function colorOptionsHTML() {
        var queueColorsHTML = "";
        var queueColors = ["blueviolet", "brown", "cadetblue", "chocolate", "crimson", "darkgoldenrod", "dodgerblue", "forestgreen", "lightseagreen", "mediumvioletred", "olive", "orangered", "orchid", "palevioletred", "peru", "rebeccapurple", "royalblue", "teal", "tomato"];
        for (x = 0; x < queueColors.length; x++) {
            queueColorsHTML += '<option value="' + queueColors[x] + '" style="background-color: ' + queueColors[x] + '"' + (x==0 ? 'selected': '') + '>' + queueColors[x] + '</option>';
            GM_addStyle('.' + queueColors[x] + ' {background-color: ' + queueColors[x] + '}');
        }
        return queueColorsHTML;
    }

    function createEditQueue(c_queueNo) {
        var name = document.querySelector('input#queue_name').value;
        var description = document.querySelector('textarea#queue_description').value;
        var counter = getSelected("queue_counter");
        var note = getSelected("queue_note");
        var delay = getSelected("queue_delay");
        var sortBy = getSelected("queue_sortBy");
        var color = getSelected("queue_color");

        if (name == "") {
            alert("Bir liste adı girmeniz gerekiyor.");
        }
        else {
            var id = name.replace(/[\[\]\(\)\"\!\'\^\#\+\%\&\/\\\{\}\=\*\|\-\_\@\,\;\`\:\.<>\¨\~]/gi,"").replace(/\s+/g,"_").toLowerCase();
            var currentTime = new Date().getTime();

            var queueArray = GM_getValue("queueArray");
            if (queueArray == null) {
                queueArray = [];
            }

            if (c_queueNo == null) {
                var infos = {id: id, created: currentTime, name: name, description: description, counter: counter, note: note, delay: delay, sortBy: sortBy, color: color, version: version};
                var newQueue = [ infos, [], [] ]; // infos, active/waiting, completed
                queueArray.push(newQueue);
            }
            else {
                var oldInfos = queueArray[c_queueNo][0];
                var editedInfos = {id: id, created: oldInfos.created, name: name, description: description, counter: counter, note: note, delay: delay, sortBy: sortBy, color: color, version: version};
                queueArray[c_queueNo][0] = editedInfos;
            }

            // Kaydet ve pencereyi kapat.
            GM_setValue("queueArray", queueArray);
            removeForm("queue");
        }
    }

    function getSelected(selectId) {
        var selected = document.querySelector('select#' + selectId);
        if (selected != null) {
            selected = selected.options[selected.selectedIndex].value;
            return selected;
        }
        else {
            return null;
        }
    }

    function insertWindow(formName, faIcon, title, saveButton, iconColor) {
        // Formu ekle
        var formContainerHTML = `
<div class="mfp-bg mfp-ready"></div>
<div class="mfp-wrap mfp-close-btn-in mfp-auto-cursor mfp-ready" tabindex="-1" style="overflow: hidden auto;"><div class="mfp-container mfp-inline-holder"><div class="mfp-content">
<form id="` + formName + `-form" class="white-popup-block" style="padding-top: 30px">
<fieldset class="window-header">
<h1 style="font-size: 25px;">
<i class="fa fa-` + faIcon + `" aria-hidden="true" style="margin-right: 10px; color:` + (iconColor =! null ? iconColor : 'inherit') + `"></i>` + title + `
</h1>
</fieldset>
<fieldset class="window-content margintop10">` + (saveButton ? `<div class="row margintop10 text-center"><button id="save_` + formName + `" type="button" class="btn btn-info" style="margin-top: 10px;">KAYDET</button></div>` : '') + `
</fieldset>
<button id="close" title="Kapat (Esc)" type="button" class="mfp-close">×</button>
</form></div></div></div>
`;
        document.querySelector('body').insertAdjacentHTML("afterbegin", formContainerHTML);

        // Kapat tuşuyla formu kapat
        document.querySelector('#' + formName + '-form > button#close').onclick = function() { removeForm(formName); };

        // Esc ile formu kapat
        function doc_keyUp(e) {
            if (e.key === "Escape") {
                removeForm(formName);
            }
        }
        document.addEventListener('keyup', doc_keyUp, false);

/* Bu kod firefox'da her daim çalıştığı için sorun çıkardı.
        // Form dışı bir yere tıklama ile formu kapat
        window.onclick = function(event) {
            if (event.target.closest('#' + formName + '-form') == null) {
                removeForm(formName);
            }
        };
*/
    }

    function removeForm(formName) {
        if ( document.querySelector('#' + formName + '-form') ) {
            var formDiv = document.querySelector('#' + formName + '-form').parentElement.parentElement.parentElement;
            formDiv.previousElementSibling.remove();
            formDiv.remove();
        }
    }

    function classToogle(element, classes) {
        for (let x = 0; x < classes.length; x++) {
            element.classList.toggle( classes[x] );
        }
    }

    function arrayFilter(sourceArray, targetArray, type) {
        for (let x = 0; x < sourceArray.length; x++) {
            if (sourceArray[x] != null) {
                if (type == "active") {
                    if (sourceArray[x].active == 1) targetArray.push(sourceArray[x]);
                }
                else if (type == "waiting") {
                    if (sourceArray[x].active == 0) targetArray.push(sourceArray[x]);
                }
                else {
                    targetArray.push(sourceArray[x]);
                }
            }
        }
    }

    function arraySorter(array, objectOrNot, objectType) {
        if (objectOrNot == "object") {
            array.sort(function(a, b) {
              var x = ( isFinite(a[objectType]) ) ? Number(a[objectType]) : a[objectType].toString().toLowerCase();
              var y = ( isFinite(b[objectType]) ) ? Number(b[objectType]) : b[objectType].toString().toLowerCase();
              if (x < y) {return -1;}
              if (x > y) {return 1;}
              return 0;
            });
            if (objectType == "imdbRating" || objectType == "dpRaiting") array.reverse();
        }
        else if (objectOrNot == "nonObject") {
            array.sort();
        }
    }

    function millisecondConverter( unit, from, to ) {
        var result;
        switch (from) {
            case "ms" :
                switch (to) {
                    case "year":    result = Math.round(unit / 31556952000); break;
                    case "month" :  result = Math.round(unit / 2592000000); break;
                    case "week" :   result = Math.round(unit / 604800000); break;
                    case "day" :    result = Math.round(unit / 86400000); break;
                    case "hour" :   result = Math.round(unit / 3600000); break;
                    case "minute" : result = Math.round(unit / 60000); break;
                    case "second" : result = Math.round(unit / 1000); break;
                }
                break;
            case "year":
                switch (to) {case "ms": result = unit * 31556952000; break;} break;
            case "month":
                switch (to) {case "ms": result = unit * 2592000000; break;} break;
            case "week":
                switch (to) {case "ms": result = unit * 604800000; break;} break;
            case "day":
                switch (to) {case "ms": result = unit * 86400000; break;} break;
            case "hour":
                switch (to) {case "ms": result = unit * 3600000; break;} break;
            case "minute":
                switch (to) {case "ms": result = unit * 60000; break;} break;
            case "second":
                switch (to) {case "ms": result = unit * 1000; break;} break;
        }
        return result;
    }

    function addForumExport() {
        var appsArea = document.querySelector('.cke_toolbar.cke_toolbar_last > .cke_toolbar_end').previousElementSibling;
        var appButton = `
<a id="cke_queue" class="cke_button cke_button_off" href="javascript:void('Queue')" title="Liste Çıktısı Al" role="button">
    <span class="cke_button_icon" style="background-image: url('https://images2.imgbox.com/6a/18/KWBxXjc7_o.png'); background-position: 0 0px; background-size: 16px;"></span>
</a>
`;
        appsArea.insertAdjacentHTML("beforeend", appButton);
        appsArea.querySelector('#cke_queue').onclick = function() {
            var library = GM_getValue("queueArray");
            var promtText = 'Aşağıdaki listelerden çıktısını almak istediğinizin numarısını girin:' + enter;
            for (let x = 0; x < library.length; x++) {
                promtText += enter + x + " - " + library[x][0].name;
            }
            var queueNo = prompt(promtText);
            if (queueNo) {
                var infos = library[queueNo][0];
                var array = [];
                arrayFilter(library[queueNo][1], array);
                arraySorter(array, "object", infos.sortBy);
                var queueHTMLli = '';
                for (let x = 0; x < array.length; x++) {
                    var a =array[x];
                    queueHTMLli += `<li><strong><a href="https://www.planetdp.org/title/-dp` + a.cardId + `" rel="external nofollow">PlanetDP</a> | <a href="https://www.imdb.com/title/tt` + a.imdbID + `" rel="external nofollow">IMDb</a></strong> >> <strong>` + a.cardTitle + ` (` + a.year + `)</strong></li>`;
                }
                var queueHTML = '<p>Liste: <strong>' + infos.name + ' (' + array.length + ')</strong></p><ul>' + queueHTMLli + '</ul>';
                appsArea.closest('.cke_inner.cke_reset').querySelector('div.cke_enable_context_menu.cke_editable[role="textbox"]').insertAdjacentHTML("beforeend", queueHTML);
            }
        };
    }

        function waitForKeyElements (
        selectorTxt,    /* Required: The jQuery selector string that
                            specifies the desired element(s).
                        */
        actionFunction, /* Required: The code to run when elements are
                            found. It is passed a jNode to the matched
                            element.
                        */
        bWaitOnce,      /* Optional: If false, will continue to scan for
                            new elements even after the first match is
                            found.
                        */
        iframeSelector  /* Optional: If set, identifies the iframe to
                            search.
                        */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes     = $(selectorTxt);
        else
            targetNodes     = $(iframeSelector).contents ()
                                               .find (selectorTxt);

        if (targetNodes  &&  targetNodes.length > 0) {
            btargetsFound   = true;
            /*--- Found target node(s).  Go through each and act if they
                are new.
            */
            targetNodes.each ( function () {
                var jThis        = $(this);
                var alreadyFound = jThis.data ('alreadyFound')  ||  false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound     = actionFunction (jThis);
                    if (cancelFound)
                        btargetsFound   = false;
                    else
                        jThis.data ('alreadyFound', true);
                }
            } );
        }
        else {
            btargetsFound   = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj      = waitForKeyElements.controlObj  ||  {};
        var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl     = controlObj [controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval (timeControl);
            delete controlObj [controlKey];
        }
        else {
            //--- Set a timer, if needed.
            if ( ! timeControl) {
                timeControl = setInterval ( function () {
                        waitForKeyElements (    selectorTxt,
                                                actionFunction,
                                                bWaitOnce,
                                                iframeSelector
                                            );
                    },
                    300
                );
                controlObj [controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj   = controlObj;
    }

})();