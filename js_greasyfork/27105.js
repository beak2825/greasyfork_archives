// ==UserScript==
// @name         Zateczkuj to
// @namespace    noisy.cat
// @version      0.3
// @description  zateczkuj to guwno skcoorwysynie
// @author       noisycat
// @match        https://www.facebook.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://greasyfork.org/scripts/27103-arrive-js/code/arrive%20js.js?version=173517
// @require      https://greasyfork.org/scripts/27102-html2canvas/code/html2canvas.js?version=173516
// @require      https://greasyfork.org/scripts/27104-filesaver/code/FileSaver.js?version=173518
// @downloadURL https://update.greasyfork.org/scripts/27105/Zateczkuj%20to.user.js
// @updateURL https://update.greasyfork.org/scripts/27105/Zateczkuj%20to.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const userElementClass = "fbUserContent";
    const buttonBarClass = "_42nr";

    const linkClass = "_5yxe";
    const xlinkClass ="_xlink";
    const emClass = "_4qba";

    const iconUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTM0A1t6AAAAnElEQVQ4T2OgCPz//x+MQaBnwvT/2DBYEghg6sAAWRPMEHQM0wxiYwCQ5Pote59C8XMgBvHBGNlWFLBw6dr/xGCocggACSCbjg+jaIZphDoVhQ2ikcVJ0ohMY9UIU4DPAOrZuG7zHpwaYWyQGhSN8xev/rV20+5/MElcGKQGpBaqjYGhf9LM2UBT/8JMx4P/gtRCtSEAejLDDRgYAOO2kkazfLBuAAAAAElFTkSuQmCC";
    const logoUrl = "data:image/png;base64,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";

    const buttonHtml =
          '<span>' +
              '<a class="'+linkClass+' '+xlinkClass+'" style=""><em class="'+emClass+'">Teczkuj to</em></a>' +
          '</span>';

    const linkBeforeCss = 'background-image: url('+iconUrl+') !important; background-position: 0 0 !important;';

    function C(x) { return "." + x; }

    function addButton(element)
    {
        if (!!element.teczked)
            return;

        var hasParent = false;
        element.parents(C(userElementClass)).each(function() {
            hasParent = true;
        });

        if (hasParent)
            return;

        makeNewButton(element);

        element.teczked = true;
        element.find(C(userElementClass)).each(function() {
            $(this).teczked = true;
        });
    }

    function makeNewButton(element)
    {
        var buttonBar = element.find(C(buttonBarClass));
        $(buttonHtml).appendTo(buttonBar).click(function() {
            onTeczked(element, $(this));
        });
    }

    function onTeczked(element, button)
    {
        element.find("p").attr('style','display: inline-block; width:100%');
        var oldDisplay = button.css('display');
        button.css('display', 'none');

        var wm = $('<img src="'+ logoUrl +'" style="display: inline-block; float: right;"/>').insertAfter(button);
        html2canvas(element, {useCORS: true, allowTaint: false, background: "#fff"}).then(function(canvas) {
            //var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            canvas.toBlob(function(blob) {
                saveAs(blob, "pretty image.png");
            });
            button.css('display', oldDisplay);
        });
        wm.remove();
    }

    function downloadCanvas(link, canvasId, filename)
    {
        link.href = document.getElementById(canvasId).toDataURL();
        link.Download = filename;
    }

    $(document).ready(function() {
        //CSS Hack
        var sheet = document.styleSheets[0];
        sheet.insertRule(C(xlinkClass)+'::before {' + linkBeforeCss + '}', 0);

        $(C(userElementClass)).each(function() {
            addButton($(this));
        });
    });

    $(document).arrive(C(userElementClass), function() {
        addButton($(this));
    });
})();