// ==UserScript==
// @name                WME Copy Venue Attributes
// @namespace           none
// @description         Select a model, copy, select a poi, paste
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/editor*
// @include             https://beta.waze.com/*/editor*
// @exclude             https://www.waze.com/*user/editor/*
// @version             0.2
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/379376/WME%20Copy%20Venue%20Attributes.user.js
// @updateURL https://update.greasyfork.org/scripts/379376/WME%20Copy%20Venue%20Attributes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var PoiAttr={};
    function init(){
        console.log("Copy Venue Attributes: INIT");
        var editpanel = $('#edit-panel');
        if (editpanel.length==0) { window.setTimeout(init, 1000); return; }

        $('#edit-panel').bind('DOMSubtreeModified',function(e){
            var editLM = $('.geometry-button-region');
            if (editLM.length==1) {
                var copyattribDiv = $('#wme-copyattrib-fr');
                if (copyattribDiv.length==0) {
                    copyattribDiv=document.createElement('div');
                    copyattribDiv.id='wme-copyattrib-fr';
                    $(copyattribDiv).css({'float':'right','padding':'2px','border-radius':'5px','background-color':'#fff','box-shadow':'rgba(0, 0, 0, 0.1) 0px 1px 6px 0px'});
                    editLM[0].parentNode.insertBefore(copyattribDiv, editLM[0].nextSibling);

                    var copyBtn=document.createElement('span');
                    copyBtn.innerHTML='<i class="fa fa-copy" data-original-title="" title="Copy attributes"></i>';
                    copyBtn.style.margin='0 3px';
                    copyBtn.onclick=CopyAttrib;
                    copyattribDiv.appendChild(copyBtn);

                    var pasteBtn=document.createElement('span');
                    pasteBtn.innerHTML='<i class="fa fa-paste" data-original-title="" title="Paste attributes"></i>';
                    pasteBtn.style.margin='0 3px';
                    pasteBtn.onclick=PasteAttrib;
                    copyattribDiv.appendChild(pasteBtn);
                }
            }

        })
    }
    function CopyAttrib(){
        $('#wme-copyattrib-fr')[0].style.backgroundColor='#26bae8';
        var venue=W.selectionManager.getSelectedFeatures()[0].model.attributes;
        PoiAttr.aliases=venue.aliases;
        PoiAttr.brand=venue.brand;
        PoiAttr.categories=venue.categories;
        PoiAttr.categoryAttributes=venue.categoryAttributes;
        PoiAttr.description=venue.description;
        PoiAttr.name=venue.name;
        PoiAttr.openingHours=venue.openingHours;
        PoiAttr.phone=venue.phone;
        PoiAttr.services=venue.services;
        PoiAttr.url=venue.url
    }
    function PasteAttrib(){
        if (Object.keys(PoiAttr).length !=0) {
            $('#wme-copyattrib-fr')[0].style.backgroundColor='#00aa00';
            try {
                var venue=W.selectionManager.getSelectedFeatures()[0].model;
                W.model.actionManager.add(new (require("Waze/Action/UpdateObject"))(venue, PoiAttr));
                setTimeout(function () { $('#wme-copyattrib-fr')[0].style.backgroundColor='#26bae8'; }, 1000);
            }
            catch (err) {
                console.log("Copy Venue Attributes : Problem", err);
            }
        }
    }
    setTimeout(init, 200);
})();