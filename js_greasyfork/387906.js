// ==UserScript==
// @name         TorrentGalaxy: Default values for uploads (indexer)
// @namespace    NotNeo
// @version      0.2
// @description  Lets you set up defaults for the upload page on TGx
// @author       NotNeo
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @match        https://torrentgalaxy.to/torrents-upload.php?index
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/387906/TorrentGalaxy%3A%20Default%20values%20for%20uploads%20%28indexer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/387906/TorrentGalaxy%3A%20Default%20values%20for%20uploads%20%28indexer%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var icons = {
        save: `<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="save" class="svg-inline--fa fa-save fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM272 80v80H144V80h128zm122 352H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h42v104c0 13.255 10.745 24 24 24h176c13.255 0 24-10.745 24-24V83.882l78.243 78.243a6 6 0 0 1 1.757 4.243V426a6 6 0 0 1-6 6zM224 232c-48.523 0-88 39.477-88 88s39.477 88 88 88 88-39.477 88-88-39.477-88-88-88zm0 128c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40-17.944 40-40 40z"></path></svg>`,
        saveAlt: `<svg style="color: green;" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="save" class="svg-inline--fa fa-save fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"></path></svg>`
    }

    var catElm = $("form[name='upload'] td select[name='type']");

    var torNameDefault = GM_getValue("torNameDefault", "");
    var torIMDBDefault = GM_getValue("torIMDBDefault", "");
    var torTypeDefault = GM_getValue("torTypeDefault", "0");
    var torLangDefault = GM_getValue("torLangDefault", "1");
    var torDescDefault = GM_getValue("torDescDefault", "");

    var catDefaultsString = GM_getValue("catDefaultsString", "");
    var catDefaults;
    if(catDefaultsString == "")
        catDefaults = {};
    else
        catDefaults = JSON.parse(catDefaultsString);


    //insert styles
    {
        $("head").append(`<style>
.DVfU_saveButtonContainer {
display: inline-block;
vertical-align: top;
position: relative;
margin: 0 0 0 5px;
}
.DVfU_button > svg {
height: 15px;
}
.DVfU_button {
position: absolute;
top: 17px;
}
.DVfU_button:first-of-type {
top: 1px;
}
.DVfU_button:hover,
.DVfU_button:active {
cursor: pointer;
}


form[name='upload'] td input:first-child:nth-last-child(2),
form[name='upload'] td select:first-child:nth-last-child(2),
form[name='upload'] td textarea:first-child:nth-last-child(2){
width: calc(100% - 20px);
display: inline-block;
}

.DVfU_msg {
display: none;
position: fixed;
bottom: 20px;
right: 20px;
background-color: #555;
color: white;
border-radius: 10px;
font-size: 20px;
padding: 15px 20px;
}
</style>`);
    }

    //insert buttons, initialize listeners and load global defaults
    {
        //name
        $("form[name='upload'] td input[name='name']").val(torNameDefault).after(CreateSaveButtons("Name"));
        $("#DVfU_saveNameButton").click(function(){
            torNameDefault = $(this).parent().prev().val();
            GM_setValue("torNameDefault", torNameDefault);
            ShowMessage();
        });
        $("#DVfU_saveNameCatButton").click(function(){
            if(catDefaults["d"+catElm.val()] === undefined)
                catDefaults["d"+catElm.val()] = {};

            catDefaults["d"+catElm.val()]["name"] = $(this).parent().prev().val();
            catDefaultsString = JSON.stringify(catDefaults);
            GM_setValue("catDefaultsString", catDefaultsString);
            ShowMessage();
        });

        //imdb
        $("form[name='upload'] td input[name='imdb']").val(torIMDBDefault).after(CreateSaveButtons("IMDB"));
        $("#DVfU_saveIMDBButton").click(function(){
            torIMDBDefault = $(this).parent().prev().val();
            GM_setValue("torIMDBDefault", torIMDBDefault);
            ShowMessage();
        });
        $("#DVfU_saveIMDBCatButton").click(function(){
            if(catDefaults["d"+catElm.val()] === undefined)
                catDefaults["d"+catElm.val()] = {};

            catDefaults["d"+catElm.val()]["imdb"] = $(this).parent().prev().val();
            catDefaultsString = JSON.stringify(catDefaults);
            GM_setValue("catDefaultsString", catDefaultsString);
            ShowMessage();
        });

        //type/category
        catElm.val(torTypeDefault).after(CreateSaveButtons("Type", true));
        $("#DVfU_saveTypeButton").click(function(){
            torTypeDefault = $(this).parent().prev().val();
            GM_setValue("torTypeDefault", torTypeDefault);
            ShowMessage();
        });

        //language
        $("form[name='upload'] td select[name='lang']").val(torLangDefault).after(CreateSaveButtons("Lang"));
        $("#DVfU_saveLangButton").click(function(){
            torLangDefault = $(this).parent().prev().val();
            GM_setValue("torLangDefault", torLangDefault);
            ShowMessage();
        });
        $("#DVfU_saveLangCatButton").click(function(){
            if(catDefaults["d"+catElm.val()] === undefined)
                catDefaults["d"+catElm.val()] = {};

            catDefaults["d"+catElm.val()]["lang"] = $(this).parent().prev().val();
            catDefaultsString = JSON.stringify(catDefaults);
            GM_setValue("catDefaultsString", catDefaultsString);
            ShowMessage();
        });

        //description
        $("form[name='upload'] td textarea[name='descr']").val(torDescDefault).after(CreateSaveButtons("Desc"));
        $("#DVfU_saveDescButton").click(function(){
            torDescDefault = $(this).parent().prev().val();
            GM_setValue("torDescDefault", torDescDefault);
            ShowMessage();
        });
        $("#DVfU_saveDescCatButton").click(function(){
            if(catDefaults["d"+catElm.val()] === undefined)
                catDefaults["d"+catElm.val()] = {};

            catDefaults["d"+catElm.val()]["desc"] = $(this).parent().prev().val();
            catDefaultsString = JSON.stringify(catDefaults);
            GM_setValue("catDefaultsString", catDefaultsString);
            ShowMessage();
        });

        LoadCategoryDefaults();
        catElm.change(LoadCategoryDefaults);
    }




    function CreateSaveButtons(id, noCatButton = false) {
        return `<div class="DVfU_saveButtonContainer"><a id="` + `DVfU_save` + id + `Button" class="DVfU_button" title="Save as the global default value">` + icons["save"] + `</a>` + `<a id="` + `DVfU_save` + id + (noCatButton ? `` : `CatButton" class="DVfU_button" title="Save as the default value for the current category">` + icons["saveAlt"] + `</a>`) + `</div>`;
    }

    function LoadCategoryDefaults() {
        let catVal = catElm.val();
        if(catDefaults["d"+catVal] !== undefined) {
            if(catDefaults["d"+catVal]["name"] !== undefined && catDefaults["d"+catVal]["name"] !== "")
                $("form[name='upload'] td input[name='name']").val(catDefaults["d"+catVal]["name"]);
            if(catDefaults["d"+catVal]["imdb"] !== undefined && catDefaults["d"+catVal]["imdb"] !== "")
                $("form[name='upload'] td input[name='imdb']").val(catDefaults["d"+catVal]["imdb"]);
            if(catDefaults["d"+catVal]["lang"] !== undefined && catDefaults["d"+catVal]["lang"] !== "")
                $("form[name='upload'] td input[name='lang']").val(catDefaults["d"+catVal]["lang"]);
            if(catDefaults["d"+catVal]["desc"] !== undefined && catDefaults["d"+catVal]["desc"] !== "")
                $("form[name='upload'] td textarea[name='descr']").val(catDefaults["d"+catVal]["desc"]);
        }
    }

    function ShowMessage(text = "Saved!") {
        let uniqueId = "DVfU_msg_"+new Date().getTime();
        $("body").after('<span id="'+uniqueId+'" class="DVfU_msg">'+text+'</span>');
        let msg = $("#"+uniqueId);
        msg.fadeIn(200, function(){
            setTimeout(function(){
                msg.fadeOut(200, function(){
                    msg.remove();
                });
            }, 1500);
        });
    }

})();