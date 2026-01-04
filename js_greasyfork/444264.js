// ==UserScript==
// @name         AniList - Activity Assistant
// @namespace    https://www.youtube.com/c/NurarihyonMaou/
// @version      1.3.6
// @description  Script that speeds up Activity Making
// @author       NurarihyonMaou
// @match        https://anilist.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anilist.co
// @require      https://code.jquery.com/jquery-3.6.0.js
// @require      https://code.jquery.com/ui/1.13.1/jquery-ui.js
// @resource     IMPORTED_CSS https://code.jquery.com/ui/1.13.1/themes/base/jquery-ui.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/444264/AniList%20-%20Activity%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/444264/AniList%20-%20Activity%20Assistant.meta.js
// ==/UserScript==

const $ = window.jQuery;
const x_csrf_token = $("head script:contains('window.al_token')").text().split(/[“"”]+/g)[1];

const imported_CSS = GM_getResourceText("IMPORTED_CSS");
const list_Style = 'ul.ui-autocomplete { background-color: rgb(21, 31, 46); color: RGB(159,173,189); }';
const category_Style = '.ui-autocomplete-category { font-weight: bold; padding: .2em .4em; margin: .8em 0 .2em;line-height: 1.5;}';

GM_addStyle(list_Style);
GM_addStyle(imported_CSS);
GM_addStyle(category_Style);

let autoComplete = [];
let textArea, prefix, wordsConnector, caretPos, CaretPos;
let allWords, currentWord, lastSearched, words;

(function init() {

    textArea = document.getElementsByClassName("el-textarea__inner");

    if (textArea.length > 0) {

        if (GM_getValue("wordsConnector") == undefined || GM_getValue("prefix") == undefined) {
            prefix = prompt("Type a Character that You want to use as a Prefix for using the AutoComplete. You can change it later by Typing - 'changePrefix'", ".");
            wordsConnector = prompt("Type a Character that You want to use as a Connector for Multiple-Word-Search. You can change it later by Typing - 'wordsConnector'", "_");
            GM_setValue("prefix", prefix);
            GM_setValue("wordsConnector", wordsConnector);
        } else { wordsConnector = GM_getValue("wordsConnector"); prefix = GM_getValue("prefix"); }

        $(textArea).after('<input type="hidden" id="testArea">');

        function searchQuery(word) {
            var query = `
            query($search:String,$isAdult:Boolean){anime:Page(perPage:8){pageInfo{total}results:media(type:ANIME,isAdult:$isAdult,search:$search){id title{romaji, english, native}coverImage{medium}type format bannerImage isLicensed startDate{year}}}manga:Page(perPage:8){pageInfo{total}results:media(type:MANGA,isAdult:$isAdult,search:$search){id title{romaji, english, native}coverImage{medium}type format bannerImage isLicensed startDate{year}}}characters:Page(perPage:8){pageInfo{total}results:characters(search:$search){id name{full, native, alternative}image{medium}}}staff:Page(perPage:8){pageInfo{total}results:staff(search:$search){id primaryOccupations name{full, native, alternative}image{medium}}}studios:Page(perPage:13){pageInfo{total}results:studios(search:$search){id name}}users:Page(perPage:8){results:users(search:$search){id name avatar{medium}}}}
            `;

            var variables = {
                search: word
            };

            var url = 'https://anilist.co/graphql',
                options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        "x-csrf-token": x_csrf_token
                    },
                    body: JSON.stringify({
                        query: query,
                        variables: variables
                    })
                };

            fetch(url, options).then(handleResponse)
                .then(handleData)
                .catch(handleError);

            function handleResponse(response) {
                return response.json().then(function (json) {
                    return response.ok ? json : Promise.reject(json);
                });
            }

            function handleData(data) {

                autoComplete = [];

                $.each(data.data.anime.results, function (index, element) {
                    autoComplete.push({ 'value': 'https://anilist.co/anime/' + element.id, 'label': [element.title.romaji, element.title.english, element.title.native], 'category': 'Anime' });
                });

                $.each(data.data.manga.results, function (index, element) {
                    autoComplete.push({ 'value': 'https://anilist.co/manga/' + element.id, 'label': [element.title.romaji, element.title.english, element.title.native], 'category': 'Manga' });
                });

                $.each(data.data.characters.results, function (index, element) {
                    autoComplete.push({ 'value': '[' + element.name.full + '](https://anilist.co/character/' + element.id + ")", 'label': [element.name.full, element.name.native, element.name.alternative], 'category': 'Characters' });
                });

                $.each(data.data.staff.results, function (index, element) {
                    autoComplete.push({ 'value': '[' + element.name.full + '](https://anilist.co/staff/' + element.id + ")", 'label': [element.name.full, element.name.native, element.name.alternative], 'category': 'Staff' });
                });

                $.each(data.data.users.results, function (index, element) {
                    autoComplete.push({ 'value': '@' + element.name, 'label': element.name, 'category': 'Users' });
                });

                $.each(data.data.studios.results, function (index, element) {
                    autoComplete.push({ 'value': '[' + element.name + '](https://anilist.co/studio/' + element.id + ")", 'label': element.name, 'category': 'Studios' });
                });

            }

            function handleError(error) {
                alert('Error, check console');
                console.error(error);
            }
        }

        $.widget("custom.catcomplete", $.ui.autocomplete, {
            _create: function () {
                this._super();
                this.widget().menu("option", "items", "> :not(.ui-autocomplete-category)");
            },
            _renderMenu: function (ul, items) {
                var that = this,
                    currentCategory = "";
                $.each(items, function (index, item) {
                    var li;
                    if (item.category != currentCategory) {
                        ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                        currentCategory = item.category;
                    }
                    li = that._renderItemData(ul, item);
                    let useThisLabel = Array.isArray(item.label) ? item.label[0] : item.label;
                    if (item.category) {
                        li.attr("aria-label", item.category + " : " + useThisLabel);
                    }
                    li.children().text(useThisLabel);
                });
            }
        });

        function ReturnWord(text, caretPos) {
            let preText = text.substring(0, caretPos);
            allWords = preText.split(/\s+/);
            return allWords[allWords.length - 1];
        }

        function GetCaretPosition(ctrl) {
            if (document.selection) {
                ctrl.focus();
                let Sel = document.selection.createRange();
                Sel.moveStart('character', -ctrl.value.length);
                CaretPos = Sel.text.length;
            }
            else if (ctrl.selectionStart || ctrl.selectionStart == '0')
                CaretPos = ctrl.selectionStart;
            return (CaretPos);
        }

        function setCaretPosition(caretPos) {
            if (textArea[0] != null) {
                if (textArea[0].createTextRange) {
                    var range = textArea[0].createTextRange();
                    range.move('character', caretPos);
                    range.select();
                }
                else {
                    if (textArea[0].selectionStart) {
                        textArea[0].focus();
                        textArea[0].setSelectionRange(caretPos, caretPos);
                    }
                    else
                        textArea[0].focus();
                }
            }
        }

        $(textArea).on('input', function () {
            caretPos = GetCaretPosition(textArea[0])
            currentWord = ReturnWord($(textArea).val(), caretPos).replaceAll(wordsConnector, " ");

            if (currentWord == "wordsConnector") {
                $(textArea).val($(textArea).val().replace("wordsConnector", ""));
                wordsConnector = prompt("Type a Character that You want to use as a Connector for Multiple-Word-Search.", wordsConnector);
                GM_setValue("wordsConnector", wordsConnector);
            }
            else if (currentWord == "changePrefix") {
                $(textArea).val($(textArea).val().replace("changePrefix", ""));
                prefix = prompt("Type a Character that You want to use as a Prefix for using the AutoComplete.", prefix);
                GM_setValue("changePrefix", prefix);
            }
            else if (currentWord.length > 2 && lastSearched != currentWord && currentWord[0] == prefix) {
                currentWord = currentWord.substring(1);
                searchQuery(currentWord);
                lastSearched = currentWord;
            }
        });

        $(textArea).catcomplete({
            delay: 500,
            minLength: 3,
            source: function (request, response) {
                response($.ui.autocomplete.filter(
                    autoComplete, currentWord));
            },
            focus: function () {
                return false;
            },
            select: function (event, ui) {
                let insertAutoComplete = $(textArea).val().substring(0, caretPos - currentWord.length - 1) + ui.item.value + $(textArea).val().substr(caretPos);
                $(textArea).val(insertAutoComplete);
                setCaretPosition(caretPos + ((ui.item.value).length - currentWord.length));
                autoComplete = [];
                currentWord = "";
                return false;
            }
        });

    } else {
        setTimeout(init, 0);
    }
})();

let oldURL;

(function () {
  let pushState = history.pushState;
  let replaceState = history.replaceState;

  history.pushState = function () {
    pushState.apply(history, arguments);
    window.dispatchEvent(new Event("pushstate"));
    window.dispatchEvent(new Event("locationchange"));
  };

  history.replaceState = function () {
    replaceState.apply(history, arguments);
    window.dispatchEvent(new Event("replacestate"));
    window.dispatchEvent(new Event("locationchange"));
  };

  window.addEventListener("popstate", function () {
    window.dispatchEvent(new Event("locationchange"));
  });
})();

$(window).on("load", function () {
  GM_setValue("oldURL", $(location).attr("pathname").split("/")[1]);
});

window.addEventListener("locationchange", function () {
  oldURL = GM_getValue("oldURL");

  if (
    (oldURL != $(location).attr("pathname").split("/")[1]) &&
    ($(location).attr("pathname").split("/")[1] == "user" || $(location).attr("pathname").split("/")[1] == "home" || $(location).attr("pathname").split("/")[1] == "forum" || $(location).attr("pathname").split("/")[1] == "activity")
  ) {
    GM_setValue("oldURL", $(location).attr("pathname").split("/")[1]);
    location.reload();
  } else GM_setValue("oldURL", $(location).attr("pathname").split("/")[1]);
});