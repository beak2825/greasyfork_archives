// ==UserScript==
// @name hololyzer Sort Tool
// @name:zh hololyzer 排序工具
// @name:zh-TW hololyzer 排序工具
// @name:zh-HK hololyzer 排序工具
// @name:zh-CN hololyzer 排序工具
// @name:zh-SG hololyzer 排序工具
// @name:en hololyzer Sort Tool
// @name:ja hololyzerのソートツール
// @name:ko hololyzer 정렬 도구
// @name:fr Outil de tri hololyzer
// @name:es Herramienta de ordenación hololyzer
// @name:ar أداة ترتيب هولوليزر
// @name:de hololyzer-Sortierwerkzeug
// @name:hi होलोलाइज़र सॉर्ट टूल
// @name:ru Инструмент сортировки hololyzer
// @name:pt Ferramenta de classificação hololyzer
// @name:sw Chombo cha utaratibu wa hololyzer
// @name:sr Alat za sortiranje hololajzera
// @name:hr Alat za sortiranje hololajzera
// @name:it Strumento di ordinamento hololyzer
// @name:ms Alat penyusunan hololyzer
// @name:id Alat pengurutan hololyzer
// @name:nl hololyzer sorteertool
// @name:fa ابزار مرتب سازی hololyzer
// @namespace          https://github.com/kevin823lin
// @version            0.3
// @description Add support for sorting hololyzer's super chat list by name.
// @description:zh 讓 hololyzer 的超級留言清單支援姓名排序功能
// @description:zh-TW 讓 hololyzer 的超級留言清單支援姓名排序功能
// @description:zh-HK 讓 hololyzer 的超級留言清單支援姓名排序功能
// @description:zh-CN 让 hololyzer 的超级留言清单支持姓名排序功能
// @description:zh-SG 让 hololyzer 的超级留言清单支持姓名排序功能
// @description:en Add support for sorting hololyzer's super chat list by name.
// @description:ja hololyzerのスーパーチャットリストを名前でソートする機能を追加する
// @description:ko hololyzer의 슈퍼 챗 목록을 이름별로 정렬하는 기능
// @description:fr Ajouter la prise en charge du tri de la liste de super chats hololyzer par nom.
// @description:es Agregar soporte para ordenar la lista de super chats de hololyzer por nombre.
// @description:ar إضافة دعم لترتيب قائمة الدردشة الخارقة لـ hololyzer حسب الاسم.
// @description:de Unterstützung zum Sortieren der Super-Chat-Liste von hololyzer nach Namen hinzufügen.
// @description:hi नाम द्वारा होलोलाइजर के सुपर चैट सूची को सॉर्ट करने के लिए समर्थन जोड़ें।
// @description:ru Добавить поддержку сортировки списка супер-чатов hololyzer по имени.
// @description:pt Adicionar suporte para classificar a lista de superchats do hololyzer por nome.
// @description:sw Ongeza msaada wa kupanga orodha ya gumzo kuu la hololyzer kwa jina.
// @description:sr Dodajte podršku za sortiranje super-čet liste hololyzer-a po imenu.
// @description:hr Dodajte podršku za sortiranje super chat liste hololyzer po imenu.
// @description:it Aggiungere il supporto per ordinare l'elenco dei super chat di hololyzer per nome.
// @description:ms Tambah sokongan untuk mengurutkan senarai sembang super hololyzer mengikut nama.
// @description:id Tambahkan dukungan untuk mengurutkan daftar super chat hololyzer berdasarkan nama.
// @description:nl Voeg ondersteuning toe voor het sorteren van de superchatlijst van hololyzer op naam.
// @description:fa پشتیبانی از مرتب سازی لیست چت های فوق العاده hololyzer بر اساس نام.
// @author             kevin823lin
// @match              https://www.hololyzer.net/*/superchat/*
// @icon               https://www.google.com/s2/favicons?domain=hololyzer.net
// @grant              none
// @date               2023-03-08
// @downloadURL https://update.greasyfork.org/scripts/436870/hololyzer%20Sort%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/436870/hololyzer%20Sort%20Tool.meta.js
// ==/UserScript==
/*Translate and optimize with ChatGPT*/

(function () {
    'use strict';

    // Your code here...
    init();

    function i18n(name, param) {
        const lang = navigator.appName == "Netscape" ? navigator.language : navigator.userLanguage;
        let config = {};
        switch (lang) {
            case "zh":
            case "zh-TW":
            case "zh-HK":
                config = {
                    sortByTime: "時間排序",
                    sortByName: "姓名排序",
                    copyTable: "複製表格",
                    copyFailed: "複製失敗"
                };
                break;
            case "zh-CN":
            case "zh-SG":
                config = {
                    sortByTime: "时间排序",
                    sortByName: "姓名排序",
                    copyTable: "复制表格",
                    copyFailed: "复制失败"
                };
                break;
            case "en":
                config = {
                    sortByTime: "Sort by time",
                    sortByName: "Sort by name",
                    copyTable: "Copy table",
                    copyFailed: "Copy failed"
                };
                break;
            case "ja":
                config = {
                    sortByTime: "時間で並び替え",
                    sortByName: "名前で並び替え",
                    copyTable: "表をコピーする",
                    copyFailed: "コピーに失敗しました"
                };
                break;

            case "ko":
                config = {
                    sortByTime: "시간순 정렬",
                    sortByName: "이름순 정렬",
                    copyTable: "표 복사하기",
                    copyFailed: "복사 실패"
                };
                break;
            case "fr":
                config = {
                    sortByTime: "Trier par temps",
                    sortByName: "Trier par nom",
                    copyTable: "Copier le tableau",
                    copyFailed: "Copie échouée"
                };
                break;
            case "es":
                config = {
                    sortByTime: "Ordenar por tiempo",
                    sortByName: "Ordenar por nombre",
                    copyTable: "Copiar tabla",
                    copyFailed: "Error al copiar"
                };
                break;
            case "ar":
                config = {
                    sortByTime: "ترتيب حسب الوقت",
                    sortByName: "ترتيب حسب الاسم",
                    copyTable: "نسخ الجدول",
                    copyFailed: "فشل النسخ"
                };
                break;
            case "de":
                config = {
                    sortByTime: "Nach Zeit sortieren",
                    sortByName: "Nach Name sortieren",
                    copyTable: "Tabelle kopieren",
                    copyFailed: "Kopieren fehlgeschlagen"
                };
                break;
            case "hi":
                config = {
                    sortByTime: "समय के अनुसार क्रमबद्ध करें",
                    sortByName: "नाम के अनुसार क्रमबद्ध करें",
                    copyTable: "टेबल कॉपी करें",
                    copyFailed: "कॉपी असफल"
                };
                break;
            case "ru":
                config = {
                    sortByTime: "Сортировать по времени",
                    sortByName: "Сортировать по имени",
                    copyTable: "Копировать таблицу",
                    copyFailed: "Ошибка копирования"
                };
                break;
            case "pt":
                config = {
                    sortByTime: "Ordenar por hora",
                    sortByName: "Ordenar por nome",
                    copyTable: "Copiar tabela",
                    copyFailed: "Falha ao copiar"
                };
                break;
            case "sw":
                config = {
                    sortByTime: "Sort by Time",
                    sortByName: "Sort by Name",
                    copyTable: "Copy Table",
                    copyFailed: "Kushindwa nakala"
                };
                break;
            case "sr":
            case "hr":
            case "it":
                config = {
                    sortByTime: "Sortiraj po vremenu",
                    sortByName: "Sortiraj po imenu",
                    copyTable: "Kopiraj tabelu",
                    copyFailed: "Kopiranje nije uspelo"
                };
                break;
            case "ms":
            case "id":
                config = {
                    sortByTime: "Susun mengikut masa",
                    sortByName: "Susun mengikut nama",
                    copyTable: "Salin Jadual",
                    copyFailed: "Salinan gagal"
                };
                break;
            case "nl":
                config = {
                    sortByTime: "Sorteren op tijd",
                    sortByName: "Sorteren op naam",
                    copyTable: "Tabel kopiëren",
                    copyFailed: "Kopiëren mislukt"
                };
                break;
            case "fa":
                config = {
                    sortByTime: "مرتب سازی بر اساس زمان",
                    sortByName: "مرتب سازی بر اساس نام",
                    copyTable: "رونوشت جدول",
                    copyFailed: "کپی ناموفق"
                };
                break;
            default:
                config = {
                    sortByTime: "Sort by time",
                    sortByName: "Sort by name",
                    copyTable: "Copy table",
                    copyFailed: "Copy failed"
                };
                break;
        }
        return config[name] ? config[name].replace("#t#", param) : name;
    }

    async function init() {
        document.body.dataset.sortBy = "time";
        insertButton();
        await waitElementsLoaded('table[border]');
        const { tbody, newTbody } = getTbodyAndFakeTbody();
        insertNoByBame(newTbody);
        replaceTbody(tbody, newTbody);
    }

    function insertButton() {
        const sortByTimeBtn = document.createElement('button');
        const sortByNameBtn = document.createElement('button');
        const copyTableBtn = document.createElement('button');
        sortByTimeBtn.innerText = i18n('sortByTime');
        sortByNameBtn.innerText = i18n('sortByName');
        copyTableBtn.innerText = i18n('copyTable');
        sortByTimeBtn.addEventListener("click", function () {
            if (document.body.dataset.sortBy !== "time") {
                document.body.dataset.sortBy = "time";
                main("time");
            }
        });
        sortByNameBtn.addEventListener("click", async function () {
            if ((document.body.dataset.sortBy) !== "name") {
                document.body.dataset.sortBy = "name";
                main("name");
            }
        });
        copyTableBtn.addEventListener("click", function () {
            copyTable();
        });
        document.body.insertAdjacentElement('afterbegin', copyTableBtn);
        document.body.insertAdjacentElement('afterbegin', sortByNameBtn);
        document.body.insertAdjacentElement('afterbegin', sortByTimeBtn);
    }

    function insertNoByBame(tbody) {
        const ths = [...tbody.querySelectorAll("th")];
        const trs = [...tbody.querySelectorAll("tr:has(>td):nth-child(odd)")];

        const insertIndex = ((index) => index === -1 ? 0 : index)(ths.findIndex(th => /^(n|N)o$/.test(th.innerText)));
        const sortIndex = ((index) => index === -1 ? 6 : index)(ths.findIndex(th => /name|チャンネル名/.test(th.innerText)));

        const sortedTrs = sortTrs(trs, sortIndex);

        let count = 0;
        const countList = sortedTrs.map((tr, i) => {
            const preName = sortedTrs[i - 1]?.element.children[sortIndex]?.childNodes[0].textContent;
            const name = tr.element.children[sortIndex]?.childNodes[0].textContent;
            return preName !== name ? ++count : count;
        });

        sortedTrs.forEach((tr, i) => {
            const insertEle = tr.element.insertCell(insertIndex + 1);
            insertEle.innerText = countList[i];
            insertEle.setAttribute('rowspan', 2);
            insertEle.style.textAlign = "right";
        });

        const parentRow = tbody.querySelector("tr");
        const childrenEle = parentRow.children[insertIndex + 1];
        const insertEle = document.createElement("th");
        insertEle.innerText = "no by name";
        insertEle.setAttribute('rowspan', 2);
        parentRow.insertBefore(insertEle, childrenEle);
    }

    async function main(sortBy) {
        const { tbody, newTbody } = getTbodyAndFakeTbody();
        sort(newTbody, sortBy);
        replaceTbody(tbody, newTbody);
    }

    function sort(tbody, sortBy) {
        const trs = [...tbody.querySelectorAll("tr:has(>td):nth-child(odd)")];

        let sortIndex;

        switch (sortBy) {
            case "time":
                sortIndex = ((index) => index === -1 ? 0 : index)([...tbody.querySelectorAll('th')].findIndex(th => /^(n|N)o$/.test(th.innerText)));
                break;
            case "name":
                sortIndex = ((index) => index === -1 ? 1 : index)([...tbody.querySelectorAll('th')].findIndex(th => /no by name/.test(th.innerText)));
                break;
        }
        const sortedTrs = sortTrs(trs, sortIndex, true);

        sortedTrs.forEach(item => { tbody.appendChild(item.element); tbody.appendChild(item.nextElementSibling) });
    }

    function sortTrs(trs, sortIndex, num = false) {
        return trs.map(tr => ({
            element: tr,
            previousElementSibling: tr.previousElementSibling,
            nextElementSibling: tr.nextElementSibling,
            key: tr.children[sortIndex].innerText
        })).sort((a, b) => num ? (a.key - b.key) : a.key.localeCompare(b.key, 'ja'));
    }

    function getTbodyAndFakeTbody() {
        const tbody = document.querySelector('table[border] > tbody');

        const clonedTbody = tbody.cloneNode(true);
        const fragment = new DocumentFragment();
        fragment.append(clonedTbody);

        const newTbody = fragment.querySelector('tbody')

        return { tbody, newTbody };
    }

    function replaceTbody(tbody, newTbody) {
        tbody.replaceWith(newTbody);
    }

    function copyTable() {
        copyElement(document.querySelector('table[border] > tbody'));
    }

    function copyElement(ele) {
        if (document.createRange && window.getSelection) {
            const sel = window.getSelection();
            const oldRange = Array.from({ length: sel.rangeCount }, (_, i) => sel.getRangeAt(i));
            const copyRange = document.createRange();
            sel.removeAllRanges();
            try {
                copyRange.selectNode(ele);
                sel.addRange(copyRange);
            } catch (e) {
                copyRange.selectNodeContents(ele);
                sel.addRange(copyRange);
            }
            navigator.clipboard.writeText(sel.toString());
            sel.removeAllRanges();
            oldRange.forEach(range => { sel.addRange(range) });
        } else {
            alert(i18n('copyFailed'));
        }
    }

    function waitElementsLoaded(...eles) {
        return Promise.all(eles.map(ele => {
            return new Promise(async resolve => {
                while (!document.querySelector(ele)) {
                    await wait(100);
                }
                resolve();
            });
        }));
    }

    function wait(ms) {
        try {
            return new Promise(r => setTimeout(r, ms));
        } catch (e) {
            console.error(`wait: ${e}`);
        }
    }
})();