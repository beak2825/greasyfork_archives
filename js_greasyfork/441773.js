// ==UserScript==
// @name        Twitterの[保存した検索]をドラッグ&ドロップで並び替え
// @namespace   http://kood.info/
// @version         0.1.1
// @description    Twitterの[保存した検索]をドラッグ&ドロップで並び替えられるようにするスクリプト
// @author          kood
// @match          https://twitter.com/*
// @match          https://x.com/*
// @require         https://code.jquery.com/jquery-3.7.1.min.js
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/441773/Twitter%E3%81%AE%5B%E4%BF%9D%E5%AD%98%E3%81%97%E3%81%9F%E6%A4%9C%E7%B4%A2%5D%E3%82%92%E3%83%89%E3%83%A9%E3%83%83%E3%82%B0%E3%83%89%E3%83%AD%E3%83%83%E3%83%97%E3%81%A7%E4%B8%A6%E3%81%B3%E6%9B%BF%E3%81%88.user.js
// @updateURL https://update.greasyfork.org/scripts/441773/Twitter%E3%81%AE%5B%E4%BF%9D%E5%AD%98%E3%81%97%E3%81%9F%E6%A4%9C%E7%B4%A2%5D%E3%82%92%E3%83%89%E3%83%A9%E3%83%83%E3%82%B0%E3%83%89%E3%83%AD%E3%83%83%E3%83%97%E3%81%A7%E4%B8%A6%E3%81%B3%E6%9B%BF%E3%81%88.meta.js
// ==/UserScript==

(function() {
    waitForKeyElements("[data-testid='typeaheadSavedSearchesContainer']", allowSortingOfSearchWords);
    function allowSortingOfSearchWords(jNode){
        // ドラッグを可能にする
        const items = $(jNode[0]).find("[data-testid='typeaheadSavedSearchesItem']");
        $(items).attr("draggable", "true");

        // CSSを適用
        const dragCss = [
            "#tempElem={display:none;}",
            "#reverseArrow{color:#ddd;text-align:right;}"
        ].join("");
        GM_addStyle(dragCss);

        // IDを付与
        $.each(items, function(i, item){
            const sId = "savedSearchWord"+String(i);
            $(item).attr("id", sId);
        });

        // ローカルストレージを参照して検索ワードの順番を入れ替え
        let wordsJson = localStorage.getItem("savedSearchWordOrder");
        if(wordsJson != null){
            let words = JSON.parse(wordsJson);
            sortItems(words, items, $(jNode[0]));
        }

        // ドラッグ&ドロップで並び替えられるようにする
        $.each(items, function(i, item){
            item.ondragstart = function(){
                // ドラッグ開始時にIDを保存
                event.dataTransfer.setData("text/plain", event.target.id);
            };
            item.ondragover = function(){
                // 要素に重なった時にその要素の前後に青線を表示
                event.preventDefault();
                let rect = this.getBoundingClientRect();
                if ((event.clientY - rect.top) < (this.clientHeight/2)) {
                    //マウスカーソルの位置が要素の半分より上の場合、上に青線表示
                    this.style.borderTop = "2px solid blue";
                    this.style.borderBottom = "";
                } else {
                    //マウスカーソルの位置が要素の半分より下の場合、下に青線表示
                    this.style.borderTop = "";
                    this.style.borderBottom = "2px solid blue";
                }
            }
            item.ondragleave = function () {
                // 要素から離れた時にその要素の青線を消す
                this.style.borderTop = "";
                this.style.borderBottom = "";
            };
            item.ondrop = function () {
                // ドロップ時に要素を移動し、検索ワードをlocalStorageに保存
                event.preventDefault();
                let dragId = event.dataTransfer.getData("text/plain");
                let dragElem = $("#"+dragId);
                let rect = this.getBoundingClientRect();
                if ((event.clientY - rect.top) < (this.clientHeight/2)) {
                    //マウスカーソルの位置が要素の半分より上の場合に、要素の前に移動
                    $(dragElem).insertBefore(this);
                    saveTheOrderOfSearchWords();
                } else {
                    //マウスカーソルの位置が要素の半分より下の場合に、要素の下に移動
                    $(dragElem).insertAfter(this);
                    saveTheOrderOfSearchWords();
                }
                this.style.borderTop = '';
                this.style.borderBottom = '';
            };
        });

        // 検索ワードを逆順にするボタンの追加
        let html = "<a href='' id='reverseArrow'>⇅</a>"
        const header = $("[data-testid='typeaheadSavedSearchesHeader']")[0];
        $(header).append(html);
        $(document).on("click", "#reverseArrow", function(){
            reverseItems($(jNode[0]));
            return false;
        })
    }

    // 検索ワードを並び替え
    function sortItems(words, items, dest){
        console.log("この順番で並び替えます。", words);
        $(dest).append("<div id='tempElem'></div>");
        // 順番にtempに移し、最後に戻す事で並び替え
        $.each(words, function(i, word){
            $.each(items, function(i, item){
                if(word == $(item).text()){
                    $(item).appendTo("#tempElem");
                }
            });
        });
        $("#tempElem [data-testid='typeaheadSavedSearchesItem']").appendTo(dest);
        $("#tempElem").remove();
    }

    // 現在の順番で検索ワードを取得
    function getTheOrderOfSearchWords(items){
        let words = [];
        $.each(items, function(i, item){
            words.push($(item).text());
        })
        return words;
    }

    // 逆順で並び替え
    function reverseItems(dest){
        const items = $("[data-testid='typeaheadSavedSearchesItem']");
        let words = getTheOrderOfSearchWords(items);
        words.reverse();
        sortItems(words, items, dest);
        saveTheOrderOfSearchWords(words);
    }

    // 検索ワードをlocalStorageに保存
    function saveTheOrderOfSearchWords(words){
        let sWords;
        if(words == undefined){
            const items = $("[data-testid='typeaheadSavedSearchesItem']");
            sWords = getTheOrderOfSearchWords(items);
        }else{
            sWords = words;
        }
        localStorage.setItem("savedSearchWordOrder", JSON.stringify(sWords));
    }

    /*
    Greasy Forkで外部スクリプトの読み込みが制限されているため、以下のスクリプトをコピペ
    https://gist.github.com/BrockA/2625891
    */
    /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
    */
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
        delete controlObj [controlKey]
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