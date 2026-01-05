// ==UserScript==
// @name         WME RH to POI
// @description  Convert residential to POI
// @version      0.0.5
// @author       Vinkoy
// @include      https://www.waze.com/editor/*
// @include      https://www.waze.com/*/editor/*
// @include      https://editor-beta.waze.com/editor/*
// @include      https://editor-beta.waze.com/*/editor/*
// @namespace    https://greasyfork.org/en/scripts/24468-wme-rh-to-poi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24468/WME%20RH%20to%20POI.user.js
// @updateURL https://update.greasyfork.org/scripts/24468/WME%20RH%20to%20POI.meta.js
// ==/UserScript==


function RHtoPOI_bootstrap()
{
    W.selectionManager.events.register("selectionchanged", null, addBtn);
}

function addBtn()
{
    datePattern = /[a-zA-Z]+ ([a-zA-Z]{3}) (\d{2}) (\d{4}) (\d{2}:\d{2}:\d{2}) .+?\)/g;
    if ( W.selectionManager.getSelectedFeatures().length > 0
        && W.selectionManager.getSelectedFeatures()[0].model.type == "venue"
        && W.selectionManager.getSelectedFeatures()[0].model.isResidential() )
    {
        var landmarkEditArea = document.getElementById('landmark-edit-general');

        var btnSection = document.createElement('div');
        btnSection.innerHTML = '<button class="btn-link toggle-residential" type="button" onclick="">Вернуть обратно публичный POI</button>';

        landmarkEditArea.insertBefore(btnSection, landmarkEditArea.firstChild);


        var RHattr=document.getElementsByClassName('additional-attributes list-unstyled side-panel-section');
        if (RHattr)
        {
            if (W.selectionManager.getSelectedFeatures()[0].model.attributes.updatedOn > 0)
            {
                var liUpdated=document.createElement("LI");
                var updated = new Date(W.selectionManager.getSelectedFeatures()[0].model.attributes.updatedOn);
                liUpdated.innerHTML="Обновлено: " + updated.toString().replace( datePattern, "$2 $1 $3, $4" );
                RHattr[0].appendChild(liUpdated);
            }
            if (W.selectionManager.getSelectedFeatures()[0].model.attributes.createdOn > 0)
            {
                var liCreated=document.createElement("LI");
                var created = new Date(W.selectionManager.getSelectedFeatures()[0].model.attributes.createdOn);
                liCreated.innerHTML="Создано: "   + created.toString().replace( datePattern, "$2 $1 $3, $4" );
                RHattr[0].appendChild(liCreated);
            }
        }
    }
    if ( W.selectionManager.getSelectedFeatures().length > 0 )
    {
        var poiDT = document.getElementsByClassName('additional-attributes list-unstyled side-panel-section');
        if (poiDT)
        {
            poiDT[0].innerHTML = poiDT[0].innerHTML.replace( datePattern, "$2 $1 $3, $4" );
        }
    }
}

function getElementsByClassName(classname, node) {
    if(!node)
        node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for (var i=0,j=els.length; i<j; i++)
        if (re.test(els[i].className)) a.push(els[i]);
    return a;
}

RHtoPOI_bootstrap();
