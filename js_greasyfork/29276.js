// ==UserScript==
// @name         GTB4WE
// @name:es      Herramientas pa Gaia
// @version      0.2.2
// @description  Gaia ToolBox for Waze Editors. Some funcionalities to make waze map editing a little bit easier.
// @description:es Gaia ToolBox for Waze Editors. Algunas funcionalidades pa hacer la edición del mapa mas sencilla.
// @author       abdielisai
// @include      http://gaia.inegi.org.mx/mdm6/*
// @grant        none
// @license      GPLv3
// @namespace https://greasyfork.org/users/118132
// @downloadURL https://update.greasyfork.org/scripts/29276/GTB4WE.user.js
// @updateURL https://update.greasyfork.org/scripts/29276/GTB4WE.meta.js
// ==/UserScript==

(function () {

    var _debugLevel = 0;

    function log(message, level) {
        if (message && level <= _debugLevel) {
            console.log('GTB4WE: ' + message);
        }
    }

    //> Executes a callback if is valid, if not, it tries again after a time
    function bootstrap(valid, callback, tries) {
        tries = tries || 1;
        log("bootstrap " + tries, 3);
        if (valid()) {
            callback();
        } else if (tries < 250) {
            setTimeout(function () { bootstrap(valid, callback, tries + 1); }, 200);
        }
    }

    function init() {
        log("init", 1);
        $.fn.exists = function () {
            return this.length !== 0;
        };

        bootstrap(
            function () { return $("#mdm6DinamicPanel").exists(); },
            initStreetNameObserver
        );
        bootstrap(
            function () { return $("#mdmToolBar").exists() && $("#mdmToolBar")[0].childNodes.length > 0; },
            function () {
                createLink();
                //createHideButton();
            }
        );
        console.log("Gaia ToolBox for Waze Editors (GTB4WE) " + GM_info.script.version + " is running.");

    }

    function initStreetNameObserver() {
        log("initStreetNameObserver", 1);
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if ($(mutation.target).hasClass("dinamicPanel-detail")) {
                    selectStreetName();
                }
            });
        });
        observer.observe($("#mdm6DinamicPanel")[0], {
            childList: true,
            subtree: true
        });
    }

    function selectStreetName() {
        var elements = $(".dinamicPanel-detailMainLabel");
        if (elements.length === 0 || elements[0].childNodes.length === 0) return;
        var sel = window.getSelection();
        if (!sel.isCollapsed) return;
        log("selecting street.", 3);
        var range = document.createRange();
        elements[0].childNodes.forEach(function (child) {
            if (child.nodeName == "#text") {
                range.selectNodeContents(child);
                return;
            } else if (child.nodeName == "TABLE") {
                range.selectNodeContents(child.childNodes[0].childNodes[0].childNodes[1]);
                return;
            }
        });
        sel.removeAllRanges();
        sel.addRange(range);
    }

    //> Creates a button to go to WME
    function createLink() {
        log("createLink", 1);
        var $link = $("<div id='toWaze' class='custom-toolBar-btn' title='Ir a WME'><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAS0SURBVEhL7VV/TJR1GL/EVYq1pSnEbhLIcQh3eN7FAcd7eyE85oJBupGbbdofUtp01mqDtDJXiUsyY/5uWI3shzkrB4UGTqctC+QMxeMOOLg77gfH/fB+HyB9et6Xtz8amrVaf/XZnn2/+/74PM/zeb7P+4r+x7+Ne5OSknJSFi0qpfHx5OTkpbQ2e3rrHyAzMzMrIyOjMT8/3/zkqlWoqXkWG2pqUFVVBZVKZaK9PVKp9FHh+N+DVCrZXlBQENvT8C46u/Vwe/2IxMcRjU/A4/Oj80o3dtXXo7CwMEBONgrX/hqysjKPrVu/HvprvZgEEJ+8hXA0xls0Fkd8fAJTtM7hp64rWL16NaQSyU7h+p+DZKlbt/4ZWJ1uhOOTGPPdRCAcQZCMcxARnHDmD4b4AIyDQ6isrATdfUqguT1IU7FarY5f7tLjZnQcdrcHvmCYdxKOxhEMRRCKREmmcfgDIQQjMV66OKXT1t4BuVzuyM3NTRToZmJJWtpLta9sgzcUg9Xlhj8cRfv5C2AYBh83f4KJqV/JpnDo8BEUs8W43NmFQCQOp8cHbzCC5zZtQlpq6lqBbiaypNIvPmw+jrFgFMOOUXIURUvbWYpMhoNEGpuYIrsFrvAKhQLnL/5AQcRgc43xGR/+oAkSiaRJoJsJSvHcyW9a4PAFMDjixJDdBQ9FNkRzu9sLx5gXzjEfHCSd1TkKP0lkoZELxh0I48uvTkMuk50R6GZCpVJebTnbAcuoFyarHXbvTezbfxBft35HEU7AQkScBaj4rWe+x37KyuUL8sE4/SEcP3ES2dnZLQLdDMzTarWBi516mGxOGIZs5CCAhvfeR0lJCXqMA/CG4/CQ/WIwobi4GA37Gnlio2WEsg5id8NeSNLT9wp809DpdInUUBvTFi9u27z1RdywONAzMIxrZDfIyYB9FC/X1hFhCbZsfQHPb94ClmVRu207zPSU+4ZH0Gex09kRVK9Zg/T09FKBehpKpXIt1/oHjjbh514j9KYhXDEMQG8046rJjF6zDYOOMZxqbcPOt+vx5u53cPpMO8wuDx8AF4zVE0DjoaOQL13auUO0Y5ZAPQ0qrJja3Xzk2Eew0UGjzYWr/cMwWF18Nt19g7wzg9WJAaeHiL2w0DmT3Y3rnPNRH5pPnALXPzKZLFeg/SNycnKWKORyPSfBuUuXoTf0o6n5U3xGr6J3mNK3OHGdJODlG7TwhMeOf45L3T1oaDyAvLy8EBV3pUB3e1Ad5tA3aEdRUZGtoqICy+mdK5Ytwxtv7ULHpR/x7bkLaCfnda++jlzqC5VSCZ2uDCqFooO6VybQ3B1qtbJcoylEeXk5Vuh0oBpR+nkGCuAGRdr/mEpFxDo8QfsajQa0Lheu3hX3cKZmmGx6rigrK+ON6tNF6wkisXiOKCkpkUhNv+/RJ2QiP5/l/gdcYbn7d0ZGxsr7UkpLFyzQrEhZzjD1RQzTrykq6pZpi5+ez7JiMctmcKNcq91AMvYUarVGhVb72sNa7SPJDLNQTBILVHfELM5JUq4uUVRdnTBfrX5QxM1VFXPp8vzFDPNQSl7eAmr3uSKWnSfSaB6gcfZCmqey7P0iUXWCwPNfQCT6DZcqHQbWTyaWAAAAAElFTkSuQmCC' width='24px' height='24px'></div>");
        $("#mdmToolBar").append($link);
        $link[0].onclick = go2WME;
    }

    //> Extracts coords for current position and opens a new waze map editor window
    function go2WME() {
        var params = atob(window.location.href.slice(window.location.href.indexOf('=') + 1)).split(',');
        params.forEach(function (value, i, array) {
            if (value.includes("lat") || value.includes("lon")) {
                array[i] = value.replace(":", "=");
            } else if (value.includes("z")) {
                //> mdm zoom minus 8 units corresponding to wme zoom
                var z = parseInt(value.slice(value.indexOf(":") + 1)) - 8;
                if (z < 0) z = 0;
                if (z > 10) z = 10;
                array[i] = "zoom=" + z;
            } else {
                array.splice(i, 1);
            }
        });
        log("params " + params, 3);
        window.open("https://www.waze.com/editor/?" + params.join("&"));
    }

    //> Creates a button to hide header info
    function createHideButton() {
        log("createHideButton", 1);
        var $link = $("<div id='hideTop' class='custom-toolBar-btn' title='Ocultar encabezado'><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwABD+QAAQ/kAdSgKfcAAAF4SURBVEhL7ZO9SgNBFIVn7liIYGEQCzvfIlgpWlpYKOJv/AWxsRBBGwsLKx9BBAVFiXY2MWChnSgIgm/gC1gKomd2zpDZNbvZqI2QDy4z59w75y6BqBb/iqJW+gB1bU+lzBD9v0CWtJLPZMHf4sBvqIXjvo0vH8S5E3ibHPwJslgLMuM0icwGS9ZpNkNWuCe2ZI1mHmShcbgntmSZZhYynz/cE1tSolkPKTUf7oktmaIZInM5wnvxHzjE2e1kknCJGaNpkckc4T3oP3PuEbrg7CSxJSPW6YN4R33kDH/l+QC/0ZI3KzasUErvuuY3gnB9DF3AWWZA6hLM7Ee5uOxFF2VG2QsJw0/oWQT60vlpS2Ta5eJ34uAdRFvUc6SFe5JLupwd0Q7v3vasMBisMKgKXYQ1DP1Cr164J1zyBD2A6sf9lm+voinQCXHDwaD0EftZaMyd13lbQa/DjTgMPmgVjQvUKe4T9HMiM3h3hirjvgJDO79FJkp9Af1BdpDV9usUAAAAAElFTkSuQmCC' width='24px' height='24px'></div>");
        $("#mdmToolBar").append($link);
        $link[0].onclick = function () {
            log(" hiding headers.", 3);
            $("#Encabezado").hide();
            $("#main").css("top", "0px");
        };
    }

    bootstrap(
        function () { return $; },
        init
    );

})();