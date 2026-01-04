// ==UserScript==
// @name         test3
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  nadirkitap isbn13 search
// @author       aek
// @match        https://www.nadirkitap.com/*
// @noframes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nadirkitap.com
// @grant        GM.xmlHttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/441251/test3.user.js
// @updateURL https://update.greasyfork.org/scripts/441251/test3.meta.js
// ==/UserScript==

(function () {
    var sellerId = "25233";
    var description = `
`;
    var description2 = `Kapak ve sayfalar temiz, fotoğrafta görülen ürün gönderilecektir.`;
    var description3 = `Hafta içi 17:00, cumartesi 12:00' ye kadar olan siparişler aynı gün kargoya verilecektir.`;
    var description4 = `İlk sayfada isim yazıyor. Kapak ve sayfalar temiz, fotoğrafta görülen ürün gönderilecektir.`;
    var description5 = `Hafta içi 17:00, cumartesi 12:00' ye kadar olan siparişler aynı gün kargoya verilecektir. `;
    description = description2 + description + description3;

    
    //description = undefined;
    if (location.href.startsWith("https://www.nadirkitap.com/banaozel_kitapekle.php")) {
        var serializeForm = function () {
            return Array.from(new FormData(document.getElementsByName("ekle")[0]), function (field) {
                return field.map(encodeURIComponent).join('=');
            }).join('&');
        };
        var oldState;
        setTimeout(function() {
            oldState = serializeForm(document.getElementsByName("ekle")[0]);
        }, 1000);
        var oldState = serializeForm();
        console.log(oldState);
        window.addEventListener('beforeunload', function (e) {
            console.log(serializeForm(document.getElementsByName("ekle")[0]));
            if (oldState && oldState != serializeForm(document.getElementsByName("ekle")[0])) {
                e.returnValue = 'Emin misin?';
            }
        });
        var junks = document.querySelectorAll("p.a14");
        for (var index = 0; index < junks.length; index++) {
            var junk = junks[index];
            junk.parentElement.removeChild(junk);
        }
        junks = document.querySelectorAll("div[class='col-xs-12 col-md-6']");
        function removeJunk(junkPanel) {
            for (var i = 0; i < 6; i++) {
                junkPanel.children[3].parentNode.removeChild(junkPanel.children[3]);
            }
        }
        removeJunk(junks[0]);
        removeJunk(junks[1]);
        var list = document.querySelector(".member-list");
        list.innerHTML = "";
        var li = document.createElement("li");
        li.appendChild(document.getElementsByName("guzelciltli")[0].parentNode);
        list.appendChild(li);
        li = document.createElement("li");
        li.appendChild(document.getElementsByName("birincibaski")[0].parentNode);
        list.appendChild(li);
        li = document.createElement("li");
        li.appendChild(document.getElementsByName("imzali")[0].parentNode);
        list.appendChild(li);
        var junk = document.querySelector("span[style='font-size:10px;']");
        junk.parentElement.removeChild(junk);

        var nomargins = document.querySelectorAll("p.col-md-12.no-padding, .form-control.all-input");
        for (var index = 0; index < nomargins.length; index++) {
            nomargins[index].style.margin = 0;
            nomargins[index].style.padding = 0;
        }
        var q = document.querySelectorAll("div.margin-top10.col-md-12.col-xs-12.no-padding");
        q[2].parentNode.insertBefore(q[2], q[1]);
        //document.querySelector("div.padding15.col-sm-12.hidden-xs.mbl-display-n").scrollIntoView();
        if (description) {
            var input = document.getElementById("wmd-input");
            if (!input.value.endsWith(description))
                input.value += description;
        }
        document.getElementsByName("rafkodu")[0].scrollIntoView();
    }

    var pageState = restoreSavedObject("PageState", "pageState");
    var links = document.querySelectorAll("a.seller-link[href$='" + sellerId + ".html']");
    function findParent(el, tagName) {
        while ((el = el.parentElement) && el.tagName.toLowerCase() !== tagName);
        return el;
    }
    if (links.length == 1 && pageState.self) {
        var url = findParent(findParent(links[0], "div"), "div").querySelector("a").href;
        var id = url.substring(url.lastIndexOf("-kitap") + 6, url.length - 5);
        location.href = "https://www.nadirkitap.com/banaozel_kitapekle.php?islem=kitapekleme&kid=" + id;
        return;
    }
    for (var index = 0; index < links.length; index++) {
        var url = findParent(findParent(links[index], "div"), "div").querySelector("a").href;
        var id = url.substring(url.lastIndexOf("-kitap") + 6, url.length - 5);
        var li = findParent(findParent(links[index], "li"), "li");
        var parent = li.parentElement;
        parent.removeChild(li);
        parent.prepend(li);
        var div = document.createElement("div");
        div.className = "col-md-12 no-padding text-right";
        div.innerHTML = '<br><br><a href="https://www.nadirkitap.com/banaozel_kitapekle.php?islem=kitapekleme&kid=' + id + '" style="color:red;">Düzenle</a>';
        li.querySelector("div.col-md-4.col-xs-12.col-sm-12").appendChild(div);
    }

    var pendingRequestCount = 0;
    var successfulRequestCount = 0;
    window.addEventListener('beforeunload', function (e) {
        if (pendingRequestCount) {
            e.returnValue = 'Emin misin?';
        }
    });
    function restoreSavedObject(objectType, storageKey) {
        var obj = eval("new " + objectType + "();");
        var s = GM_getValue(storageKey);
        Object.assign(obj, s);
        return obj;
    }
    function IsbnInfo(isbnstr) {
        if (isbnstr && isbnstr.length == 13) {
            var t = 0, c;
            var digits = isbnstr.substr(3, 9);
            for (var i = 0; i < 9; i++) {
                t += (10 - i) * parseInt(digits[i]);
            }
            c = 11 - t % 11;
            this.isbn = digits + ((c = (11 - t % 11) % 11) == 10 ? 'X' : c);
            this.isbn13 = isbnstr;
        }
        else if (isbnstr && isbnstr.length == 10) {
            var sum = 38;
            for (var i = 0; i < 9; i++) {
                sum += parseInt(isbnstr[i]) * ((i % 2) ? 1 : 3);
            }
            var checkDigit = 10 - (sum % 10);
            if (checkDigit == 10) {
                checkDigit = 0;
            }
            this.isbn = isbnstr;
            this.isbn13 = "978" + isbnstr.substring(0, 9) + checkDigit;
        }
        else {
            this.isbn = this.isbn13 = this.title = "Unknown";
        }
    }
    IsbnInfo.prototype.save = function (title) {
        this.title = title;
        GM_setValue("isbnInfo", this);
    };
    var isbnInfo = restoreSavedObject("IsbnInfo", "isbnInfo");
    function AmazonBookInfo(/*isbn, title, author, publisher, pageSize, width, heigth*/) {
        // this.isbn = isbn;
        // this.title = title;
        // this.author = author;
        // this.publisher = publisher;
        // this.pageSize = pageSize;
        // this.width = width;
        // this.heigth = heigth;
    }
    AmazonBookInfo.prototype.save = function (storage) {
        GM_setValue(storage, this);
    };
    AmazonBookInfo.parseFromResponse = function (response, type) {
        var dom = new DOMParser().parseFromString(response.responseText, "text/html");
        var info = new AmazonBookInfo();
        info.title = dom.getElementById("productTitle").innerText.replace("(Turkish Edition)", "").trim();
        var q = dom.querySelector(".author.notFaded a.a-link-normal.contributorNameID")
            || dom.querySelector(".author.notFaded a.a-link-normal");
        info.author = q ? q.innerText.trim() : "";
        q = dom.getElementsByClassName("rpi-icon book_details-publisher");
        info.publisher = q.length ? q[0].parentNode.parentNode.lastElementChild.innerText.trim() : "";
        q = dom.getElementsByClassName("rpi-icon book_details-fiona_pages");
        info.pageCount = q.length ? q[0].parentNode.parentNode.lastElementChild.innerText.trim().split(" ")[0] : "";
        q = dom.getElementsByClassName("rpi-icon book_details-dimensions");
        if (q.length) {
            var dimensions = q[0].parentNode.parentNode.lastElementChild.innerText.trim().split(" x ");
            if (type == 1) {
                info.width = dimensions[0];
                info.heigth = dimensions[2];
            }
            else {
                info.width = (Math.floor((parseFloat(dimensions[0]) * 2.54) * 100) / 100).toString();
                info.heigth = (Math.floor((parseFloat(dimensions[2]) * 2.54) * 100) / 100).toString();
            }
        }
        else {
            info.width = "";
            info.heigth = "";
        }
        return info;
    };

    function PageState() {
    }
    PageState.prototype.save = function () {
        GM_setValue("pageState", this);
    };

    PageState.prototype.restore = function () {
        var _this = this;
        var inputs = document.querySelectorAll("input[data-stateful]");
        for (var index = 0; index < inputs.length; index++) {
            let input = inputs[index];
            let storage = input.getAttribute("data-stateful") || input.id.substring(3);
            input.addEventListener("change", function () {
                _this[storage] = this.type == "checkbox" ? this.checked : this.value;
                _this.save();
            });
            var value = this[storage];
            if (value) {
                if (typeof value == "boolean") {
                    input.checked = value;
                }
                else {
                    input.value = value;
                }
            }
        }
    };

    var div = document.createElement("div");
    div.innerHTML = `
  <div>
  <form action="kitapara.php" method="GET" name="searchbook" id="frmSearch" >
    <input type="hidden" name="ara" value="aramayap" />
    <input type="hidden" name="tip" value="kitap" />
    <input type="hidden" name="satici" value="` + sellerId + `" id="hdnSeller">
    <input type="hidden" name="siralama" value="fiyatartan" id="hdnSort">
    <span>
    <input  id="chktitleChecked" type="checkbox" data-stateful />
    <input style="min-width: 400px;" id="txttitle" name="kitap_Adi" type="text" data-stateful />
    <input type="button" onclick='document.getElementById("kelime").value = document.getElementById("txttitle").value;document.getElementById("search-form").submit(); event.preventDefault(); return false;' value="Search" />
    </span>
    <span>
    <input  id="chkauthorChecked" type="checkbox" data-stateful />
    <input id="txtauthor" name="yazar" type='text' data-stateful />
    </span>
    <span>
    <input  id="chkpublisherChecked" type="checkbox" data-stateful />
    <input  id="txtpublisher" name="yayin_Evi" type="text" data-stateful />
    </span>
    <span>
    <input  id="chkself" type="checkbox" data-stateful />
    <label for="chkself">Kendimde</label>
    <input type="submit" value="ARA" />
    </span>
    </div>
    <div>
    <a href="https://amazon.com/dp/` + isbnInfo.isbn + `" target="amazon">Amazon</a>
    <a href="https://amazon.com.tr/dp/` + isbnInfo.isbn + `" target="amazontr">.com.tr</a>
    <a href="https://www.google.com.tr/search?q=` + isbnInfo.isbn + `" target="google">` + isbnInfo.isbn + `</a>
    <a href="https://www.google.com.tr/search?q=` + isbnInfo.isbn13 + `" target="google13">` + isbnInfo.isbn13 + `</a>
    <a href="https://www.amazon.com/s?k=` + isbnInfo.isbn13 + `" target="amazon13">Amazon13</a>
    <a href="https://www.amazon.com.tr/s?k=` + isbnInfo.isbn13 + `" target="amazon13">.com.tr</a>
    <input type="button" value="` + isbnInfo.title + `"  onclick='window.open("https://www.google.com.tr/search?q=kitap+` + isbnInfo.title + `", "google");' />
    <input id="chkpreferComtr" type="checkbox" data-stateful />
    <label for="chkpreferComtr">Prefer Amazon.com.tr</label>
    <input id="chkpasteIsbn" type="checkbox" data-stateful />
    <label for="chkpasteIsbn">PasteIsbn</label>
    </form>
    </div>`;
    document.title = isbnInfo.title;
    document.body.firstElementChild.appendChild(div);

    var isbnInput = document.querySelector('.form-control.all-input[name="isbn"]');
    if (isbnInput && pageState.pasteIsbn) {
        isbnInput.value = isbnInfo.isbn13;
    }
    var rafKodu = document.getElementsByName("rafkodu");
    if (rafKodu.length) {
        rafKodu[0].setAttribute("data-stateful", "shelfCode");
    }

    pageState.restore();

    document.getElementById("chkpreferComtr").addEventListener("change", function () {
        fillSearchForm();
    });

    function submitForm() {
        document.getElementById("txttitle").disabled = !document.getElementById("chktitleChecked").checked;
        document.getElementById("txtauthor").disabled = !document.getElementById("chkauthorChecked").checked;
        document.getElementById("txtpublisher").disabled = !document.getElementById("chkpublisherChecked").checked;
        document.getElementById("hdnSeller").disabled = !document.getElementById("chkself").checked;
        document.getElementById("frmSearch").submit();
    }

    var regexIsbn = /\d{13}/;
    var regexIsbn10 = /\d{10}/;

    document.getElementById("frmSearch").onsubmit = function (e) {
        e.preventDefault();
        var inputs = this.querySelectorAll("input[type=text]");

        for (var index = 0; index < inputs.length; index++) {
            var input = inputs[index];
            var str = input.value;
            var match;
            if (str && (match = str.match(regexIsbn))) {
                input.value = input.value.replace(match[0], "");
                input.dispatchEvent(new Event("change"));
                searchIsbn(match[0]);
                return false;
            }
            else if (str && (match = str.match(regexIsbn10))) {
                input.value = input.value.replace(match[0], "");
                input.dispatchEvent(new Event("change"));
                searchIsbn(match[0]);
                return false;
            }
        }
        submitForm();
        return false;
    };

    function fillSearchForm() {
        var main, other;
        var info0 = restoreSavedObject("AmazonBookInfo", "amazonInfo0");
        var info1 = restoreSavedObject("AmazonBookInfo", "amazonInfo1");
        if (document.getElementById("chkpreferComtr").checked) {
            main = info1;
            other = info0;
        }
        else {
            main = info0;
            other = info1;
        }
        var input = document.getElementById("txttitle");
        pageState.title = input.value = main.title || other.title || "";
        input = document.getElementById("txtauthor");
        pageState.author = input.value = main.author || other.author || "";
        input = document.getElementById("txtpublisher");
        pageState.publisher = input.value = main.publisher || other.publisher || "";
        pageState.save();
    }

    function searchIsbn(isbnstr) {
        var lisbnInfo = new IsbnInfo(isbnstr);
        GM_setValue("amazonInfo0", undefined);
        GM_setValue("amazonInfo1", undefined);
        pendingRequestCount = 2;
        successfulRequestCount = 0;
        document.title = "Loading";
        var onProgress = function (state, type, result) {
            switch (state) {
                case "info":
                    document.title = result;
                    break;
                case "error":
                    alert("info: amazon" + (type == 0 ? ".com" : "com.tr") + " failed");
                    if (!--pendingRequestCount) {
                        if (!successfulRequestCount) {
                            alert("Search yielded no results!");
                            lisbnInfo.save();
                            location.reload();
                        }
                        else {
                            lisbnInfo.save(restoreSavedObject("AmazonBookInfo", "amazonInfo" + (type == 0 ? "1" : "0")).title || "No Title?");
                            fillSearchForm();
                            submitForm();
                        }
                        return;
                    }
                    break;
                case "complete":
                    successfulRequestCount++;
                    var info = AmazonBookInfo.parseFromResponse(result);
                    info.save("amazonInfo" + type);
                    if (!--pendingRequestCount) {
                        lisbnInfo.save(info.title || restoreSavedObject("AmazonBookInfo", "amazonInfo" + (type == 0 ? "1" : "0")).title || "No Title?");
                        fillSearchForm();
                        submitForm();
                        return;
                    }
                    break;
            }
        };
        fetchAmazon(lisbnInfo, 0, onProgress);
        fetchAmazon(lisbnInfo, 1, onProgress);
    }
    function fetchAmazon(isbInfo, type, onProgress) {
        var url;
        if (!type) {
            url = "https://amazon.com/dp/" + isbInfo.isbn;
        }
        else {
            url = "https://amazon.com.tr/dp/" + isbInfo.isbn;
        }
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                if (response.status !== 404) {
                    onProgress("complete", type, response);
                    return;
                } else {
                    onProgress("info", type, "Searching...");
                    if (type === 0) {
                        url = "https://amazon.com.tr/dp/" + isbInfo.isbn;
                        url = "https://amazon.com/s?k=" + isbInfo.isbn13;
                    }
                    else {
                        url = "https://amazon.com.tr/s?k=" + isbInfo.isbn13;
                    }
                    GM.xmlHttpRequest({
                        method: "GET",
                        url: url,
                        onload: function (response) {
                            if (response.status === 404) {
                                onProgress("error", type);
                                return;
                            }
                            var dom = new DOMParser().parseFromString(response.responseText, "text/html");
                            var q = dom.querySelectorAll("div.s-result-item a.a-link-normal");
                            if (q.length < 3) {
                                onProgress("error", type);
                                return;
                            }
                            onProgress("info", type, "Loading2..");
                            url = q[0].href;
                            if (!type) {
                                url = url.replace(location.origin, "https://www.amazon.com");
                            }
                            else {
                                url = url.replace(location.origin, "https://www.amazon.com.tr");
                            }
                            GM.xmlHttpRequest({
                                method: "GET",
                                url: url,
                                onload: function (response) {
                                    onProgress("complete", type, response);
                                    return;
                                }
                            });
                        }
                    });
                    return;
                }
            }
        });
    }

    var timerId;
    var input = "";
    function restartTimeout() {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(function () {
            input = "";
        }, 100);
    }
    document.addEventListener('keydown', function (e) {
        restartTimeout();
        if (e.key == "Enter" && input.length == 13) {
            searchIsbn(input);
            e.preventDefault();
            return false;
        }
        else if (e.key - '0' >= 0 && e.key - '0' <= 9) {
            input += e.key;
        }
        else {
            input = "";
        }
        return true;
    });

})();