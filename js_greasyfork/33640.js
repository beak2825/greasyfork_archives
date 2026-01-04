// ==UserScript==
// @name         Dashboard forum
// @version      2.4
// @description  Beautify that forum
// @author       A Meaty Alt
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=forum
// @grant        none

// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/33640/Dashboard%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/33640/Dashboard%20forum.meta.js
// ==/UserScript==

(function() {
    //////////////////////////////////////////
    //Workaround for credit shop ads
    //////////////////////////////////////////
    $("#fancybox-wrap").remove();
    $("#fancybox-overlay").remove();
    //////////////////////////////////////////
    //WRAPPER
    //////////////////////////////////////////
    function getItemsFromForum(){
        var rows = $(".row111").first().parent().parent()[0].children;
        var items = [];
        var categories = ["News", "Talk", "Trade and Services", "Off Topic", "Information", "In Character", "Other", "Gold Member Area"];
        var title;
        function isCategory(text){
            for(var j=0; j<categories.length; j++){
                if(text == categories[j]){
                    return true;
                }
            }
            return false;
        }
        for(var i=1; i<rows.length; i++){
            var text = rows[i].textContent.trim();
            if(isCategory(text)){
                title = document.createElement("div");
                title.classList.add("holder");
                title.style.height = "auto";
                var inner = document.createElement("div");
                inner.classList.add("title");
                inner.innerHTML = text;
                title.appendChild(inner);
                if(title){
                    items.push(title);
                }
            }
            else{
                var content = document.createElement("div");
                content.classList.add("content");
                
                var postA = rows[i].children[4].children[0].children[2];
                postA.innerHTML = postA.title;
                rows[i].children[4].children[0].children[2] = postA;
                content.innerHTML = rows[i].outerHTML;
                title.appendChild(content);
            }
        }
        return items;
    }
    var items = getItemsFromForum();
    var body = $("table")[16];
    body.innerHTML = "";
    var head = document.getElementsByTagName("head")[0];
    var wrapper = document.createElement("div");
    wrapper.classList.add("grid-stack");
    wrapper.classList.add("grid-stack-3");
    var loading = document.createElement("img");
    loading.id = "loading_gif";
    loading.src = "https://m.popkey.co/163fce/Llgbv_s-200x150.gif";
    body.appendChild(loading);
    body.appendChild(wrapper);
    //////////////////////////////////////////
    //STYLES
    //////////////////////////////////////////
    var st1 = document.createElement("link");
    st1.rel = "stylesheet";
    st1.href = "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css";
    var gridstackCss = document.createElement("link");
    gridstackCss.rel = "stylesheet";
    gridstackCss.href = "https://cdn.rawgit.com/gridstack/gridstack.js/74b1875a/dist/gridstack.css";
    var gridstackExtraCss = document.createElement("link");
    gridstackExtraCss.rel = "stylesheet";
    gridstackExtraCss.href = "https://cdn.rawgit.com/gridstack/gridstack.js/74b1875a/dist/gridstack-extra.css";
    var style = document.createElement("style");
    style.innerHTML =
        ".grid-stack-item{height: auto; position: relative; text-align: center; overflow: hidden; background-color: #303030; border-style: outset; border-color: #701724;}";
    style.innerHTML +=
        ".title{border-bottom-style: outset; border-color: #701724; font-size: large; color: #AF9B6D;}";
    style.innerHTML +=
        ".ui-draggable-handle{height: 20px; cursor: all-scroll}";
    style.innerHTML +=
        "body{background: black !important;}";
    style.innerHTML +=
        "#loading_gif {display: block; margin: auto;}";
    head.appendChild(style);
    head.appendChild(st1);
    head.appendChild(gridstackCss);
    head.appendChild(gridstackExtraCss);
    //////////////////////////////////////////
    //SCRIPTS
    //////////////////////////////////////////
    var scriptURLs = ["https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js",
                      "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.0/jquery-ui.js",
                      "https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js",
                      "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.5.0/lodash.min.js",
                      "https://cdn.rawgit.com/gridstack/gridstack.js/74b1875a/dist/gridstack.js",
                      "https://cdn.rawgit.com/gridstack/gridstack.js/74b1875a/dist/gridstack.jQueryUI.js"];

    appendScript(0).then(dashboardState);
    function appendScript(i){
        return new Promise((resolve) => {
            if(i >= scriptURLs.length){
                initializeDashboard();
                resolve();
            }
            else{
                $.get(scriptURLs[i], (response) => {
                    var script = document.createElement('script');
                    script.text = response;
                    head.appendChild(script);
                    appendScript(i+1).then(() => {resolve();});
                });
            }
        });
    }
    function initializeDashboard() {
        $("#loading_gif").remove();
        var options = {
            width: 3,
        };
        $('.grid-stack').gridstack(options);

        var itemsSettings = loadDashboardState();

        function loadDashboardState(){
            var settings = [];
            var storage = JSON.parse(localStorage.getItem("dashboardState"));
            if(storage) return storage;
            return settings;
        }

        if(itemsSettings.length === 0) {
            var first = true;
            var height = 0;
            for (var i=0; i<items.length; i++){
                var settings = {};
                settings.x = first? 0:1;
                settings.y = height;
                settings.width = 1;
                settings.height = items[i].children.length+2;
                itemsSettings.push(settings);
                first = !first;
                height += settings.height;
            }
        }
        $('.grid-stack').each(function () {
            var grid = $(this).data('gridstack');

            _.each(itemsSettings, function (node, i) {
                grid.addWidget($('<div><div class="grid-stack-item-content" />'+items[i].outerHTML+'<div/>'),
                               node.x, node.y, node.width, node.height);
            }, this);
        });
    }
    //////////////////////////////////////////
    //Save dashboard state
    //////////////////////////////////////////
    function dashboardState(){
        var dst = $(".gensmall")[1];
        var save = document.createElement("input");
        save.type = "button";
        save.value = "Save changes";
        save.style.float = "right";
        var saveMsg = document.createElement("div");
        saveMsg.innerHTML = "Changes were saved!";
        saveMsg.id = "save_msg";
        saveMsg.style.display = "none";
        $(save).on("click", function(){
            var serializedData = _.map($('.grid-stack > .grid-stack-item:visible'), function (el) {
                el = $(el);
                var node = el.data('_gridstack_node');
                return {
                    x: node.x,
                    y: node.y,
                    width: node.width,
                    height: node.height
                };
            }, this);
            localStorage.setItem("dashboardState", JSON.stringify(serializedData));
            $("#save_msg").animate({opacity: 'toggle'}, 800);
            setTimeout(() => $("#save_msg").animate({opacity: 'toggle'}, 800), 1000);
        });
        dst.appendChild(save);
        dst.appendChild(saveMsg);
    }
})();