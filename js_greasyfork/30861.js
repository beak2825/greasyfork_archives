// ==UserScript==
// @name        WME Telephone fix FR
// @namespace   wmetelephonefix
// @description Corrige le numéro de téléphone dans les POIs
// @include     https://www.waze.com/editor/*
// @include     https://www.waze.com/*/editor/*
// @include     https://beta.waze.com/*
// @exclude     https://www.waze.com/user/*
// @exclude     https://www.waze.com/*/user/*
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30861/WME%20Telephone%20fix%20FR.user.js
// @updateURL https://update.greasyfork.org/scripts/30861/WME%20Telephone%20fix%20FR.meta.js
// ==/UserScript==



function runPhoneFix()
{
    function boostrap() {
        var editpanel = $('#edit-panel');
        if (editpanel.length==0)
        {
            window.setTimeout(boostrap, 1000);
            return;
        }
        
        $('#edit-panel').bind('DOMSubtreeModified',function(e){
            var editLM = $('#landmark-edit-more-info');
            //console.debug("PHONE: editLM" , editLM);
            if (editLM.length==1)
            {

                var fixPhoneBtn = $('#wme-telephonefix-fr');
                //console.debug("PHONE: fixPhoneBtn" , fixPhoneBtn);
                if (fixPhoneBtn.length==0)
                {
                    fixPhoneBtn=document.createElement('button');
                    fixPhoneBtn.innerHTML='fix';
                    fixPhoneBtn.id='wme-telephonefix-fr';
                    $(fixPhoneBtn).css({'float': 'right',
                                        'position': 'absolute',
                                        'right': '0px',
                                        'bottom': '0px'});
                    $('[name=phone]').parent().append(fixPhoneBtn);
                    
                    try {
                        var venue=Waze.selectionManager.selectedItems[0].model;
                        var phone=venue.attributes.phone;
                        var newPhone='';
                        var phoneTo='';
                        phoneTo = venue.attributes.phone.replace(/^0([0-9])[.| |-]?([0-9][0-9])[.| |-]?([0-9][0-9])[.| |-]?([0-9][0-9])[.| |-]?([0-9][0-9])$/g, "+33 $1 $2 $3 $4 $5");
                        if (phoneTo!=venue.attributes.phone && phoneTo.startsWith('+33 8')==false)
                            newPhone=phoneTo;
                        phoneTo = venue.attributes.phone.replace(/^\+33[ ]*(?:\(?0\)?)?([0-9])[.| |-]?([0-9][0-9])[.| |-]?([0-9][0-9])[.| |-]?([0-9][0-9])[.| |-]?([0-9][0-9])$/g, "+33 $1 $2 $3 $4 $5");
                        if (phoneTo!=venue.attributes.phone && phoneTo.startsWith('+33 8')==false)
                            newPhone=phoneTo;
                        phoneTo = venue.attributes.phone.replace(/^0[.| |-]?8[.| |-]?([0-9])([0-9])[.| |-]?([0-9])([0-9])[.| |-]?([0-9])([0-9])[.| |-]?([0-9])([0-9])$/g, "0 8$1$2 $3$4$5 $6$7$8");
                        if (phoneTo!=venue.attributes.phone)
                            newPhone=phoneTo;
                        phoneTo = venue.attributes.phone.replace(/^\+33[ ]*(?:\(?0\)?)?8[.| |-]?([0-9])([0-9])[.| |-]?([0-9])([0-9])[.| |-]?([0-9])([0-9])[.| |-]?([0-9])([0-9])$/g, "0 8$1$2 $3$4$5 $6$7$8");
                        if (phoneTo!=venue.attributes.phone)
                            newPhone=phoneTo;

                        if (newPhone!='')
                        {
                            fixPhoneBtn.addEventListener("click", function (v, p) {
                                return function () {
                                    var newAtts = { phone: p, id: v.attributes.id };
                                    Waze.model.actionManager.add(new (require("Waze/Action/UpdateObject"))(v, newAtts));
                                    $(fixPhoneBtn).css({'display': 'none'});
                                }
                            }(venue, newPhone), false);
                        }
                        else
                            $(fixPhoneBtn).css({'display': 'none'});
                    }
                    catch (err)
                    {
                        $(fixPhoneBtn).css({'display': 'none'});
                    }
                    //.debug("PHONE: append fixPhoneBtn" , fixPhoneBtn);
                }
            }

        })
    }
    boostrap();
  
};

var WMEPFScript = document.createElement("script");
WMEPFScript.textContent = '' + runPhoneFix.toString() + ' \n' + 'runPhoneFix();';
WMEPFScript.setAttribute("type", "application/javascript");
document.body.appendChild(WMEPFScript);