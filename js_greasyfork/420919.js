// ==UserScript==
// @name         Tagesschau.de Desktop Kompakt
// @namespace    http://tampermonkey.net/
// @version      0.1.20
// @description  Browser-Tool: Tagesschau.de im Kompaktmodus zur verkleinerten Darstellung der Seiteninhalte auf dem Desktop
// @author       FrohDigital
// @match        https://www.tagesschau.de/*
// @exclude      https://www.tagesschau.de/thema/*
// @exclude      https://www.tagesschau.de/allemeldungen/*
// @exclude      https://www.tagesschau.de/infoservices/podcast/*
// @exclude      https://www.tagesschau.de/search/*
// @grant        GM_addStyle
// @license      Freeware - GPL (General Public License)
// @downloadURL https://update.greasyfork.org/scripts/420919/Tagesschaude%20Desktop%20Kompakt.user.js
// @updateURL https://update.greasyfork.org/scripts/420919/Tagesschaude%20Desktop%20Kompakt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(".content-wrapper{background-color: rgba(138, 138, 138, .1);}")

    GM_addStyle(".textabsatz{ background-color: rgba(255, 255, 255, 0.0); }")
    GM_addStyle(".id-card{ background-color: rgba(255, 255, 255, 0.0);  }")
    GM_addStyle(".id-card__inner{ background-color: rgba(255, 255, 255, 0.0);  }")
    GM_addStyle(".socialbuttons{ background-color: rgba(255, 255, 255, 0.0); }")
    GM_addStyle(".trenner{ background-color: rgba(255, 255, 255, 0.0); }")
    GM_addStyle(".multimediahead{ background-color: rgba(255, 255, 255, 0.0); }")

    GM_addStyle(".teaser__teaserinfo{ margin:0px; padding:0px;}")
    GM_addStyle(".teaser__shorttext{ margin:0px; padding:0px;}")
    GM_addStyle(".teaser__link{ margin:0px; padding:0px;}")
    GM_addStyle(".teaser__headline-wrapper{ margin:0px; padding:0px;}")
    GM_addStyle(".teaser__topline{ margin:0px; padding:0px;}")
    GM_addStyle(".teaser__head{ margin:0px; padding:0px;}")
    GM_addStyle(".teaser__media{ margin:0px; padding:0px;  }")

    var bodyw = document.body.clientWidth;
    var mediaItm = "none";
    var pdleft = 5;
    var lmmxw = "206px";
    var mblw = 768;

    var cntnwrpr = "none";

    var els_ = document.getElementsByTagName("*");
    var a;
    for (a = 0; a < els_.length; a++)
    {
        if(els_[a].classList.length > 0)
        {
            if(els_[a].classList.contains("content-wrapper"))
            {
                cntnwrpr = els_[a];
                break;
            }
        }
    }

    if(cntnwrpr != "none")
    {
        var els = cntnwrpr.getElementsByTagName("*");
        var i;
        var elswclasses = [];
        for (i = 0; i < els.length; i++)
        {
            if(els[i].classList.length > 0)
            {
                elswclasses.push(els[i]);
            }
        }
    }
    else
    {
        return;
    }

    for(var n = 0; n < elswclasses.length; n++)
    {
        if(elswclasses[n].tagName != "iFrame")
        {
            elswclasses[n].style.fontSize = "1.6rem";
            elswclasses[n].style.lineHeight = "normal";
            if(elswclasses[n].classList.contains("footer"))
            {}
            else
            {
                elswclasses[n].style.paddingBottom = "0px";
            }
            if(elswclasses[n].classList.contains("teaser__shorttext"))
            {
                elswclasses[n].style.padding = "0px";
                elswclasses[n].style.margin = "0px";
                elswclasses[n].style.width = "99.8%";
            }
            if(elswclasses[n].classList.contains("teaser__headline"))
            {
                elswclasses[n].style.padding = "0px";
                elswclasses[n].style.margin = "0px";
                elswclasses[n].style.fontSize = "2.2rem";
            }
            if(elswclasses[n].classList.contains("teaser"))
            {
                elswclasses[n].style.padding = "0px";
                elswclasses[n].style.margin = "0px";
                elswclasses[n].style.marginBottom = "10px";

                if(elswclasses[n].classList.contains("color--tongue"))
                {
                    elswclasses[n].style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                }
                else
                {
                    elswclasses[n].style.backgroundColor = "rgba(0, 0, 0, 0.05)";
                }
            }
            if(elswclasses[n].classList.contains("columns") && elswclasses[n].classList.contains("twelve"))
            {
                var sub_els = elswclasses[n].getElementsByTagName("*");
                if(sub_els.length > 0)
                {
                    if(sub_els[0].classList.contains("teaser__media"))
                    {
                        elswclasses[n].style.maxWidth = lmmxw;
                        mediaItm = elswclasses[n];
                    }
                    else
                    {
                        if(sub_els[0].classList.contains("teaser__teaserinfo") || sub_els[0].classList.contains("teaser__link"))
                        {
                            sub_els[0].style.paddingTop = "2px";
                            sub_els[0].style.paddingLeft = (pdleft + 'px').toString();
                            if(elswclasses[n].classList.contains("m-six") || elswclasses[n].classList.contains("m-eight"))
                            {
                                elswclasses[n].style.paddingLeft = (pdleft + 'px').toString();
                                elswclasses[n].style.marginLeft = "0px";
                                if(typeof(bodyw) != 'undefined')
                                {
                                    if(bodyw > 505)
                                    {
                                        if(bodyw < mblw)
                                        {
                                            if(bodyw > 648)
                                            {
                                                elswclasses[n].style.maxWidth = "65%";
                                            }
                                            else
                                            {
                                                elswclasses[n].style.maxWidth = "55%";
                                            }
                                        }
                                        else
                                        {
                                            elswclasses[n].style.minWidth = "70%";
                                        }
                                    }
                                }
                                else
                                {
                                    elswclasses[n].style.minWidth = "70%";
                                }
                                mediaItm = "none";
                            }
                            else
                            {
                                elswclasses[n].style.marginRight = "0px";
                                elswclasses[n].style.marginLeft = "0px";
                                elswclasses[n].style.paddingLeft = "0px";
                                if(elswclasses[n].clientWidth < (568))
                                {
                                    elswclasses[n].style.maxWidth = "100%"
                                }
                                else
                                {
                                    var resW = (elswclasses[n].clientWidth - 275 - pdleft);
                                    var resWStr = (resW + 'px').toString();
                                    elswclasses[n].style.maxWidth = resWStr;
                                    elswclasses[n].style.paddingLeft = (pdleft + 'px').toString();
                                    elswclasses[n].style.paddingRight = "0px";
                                    elswclasses[n].style.marginLeft = "0px";
                                    elswclasses[n].style.marginRight = "0px";
                                }
                                if(mediaItm != "none")
                                {
                                    mediaItm.style.maxWidth = "275px";
                                }
                            }
                        }
                    }
                }
                if(sub_els.length > 1)
                {
                    if(sub_els[1].classList.contains("teaser__media"))
                    {
                        elswclasses[n].style.maxWidth = "275px";
                        elswclasses[n].style.marginLeft = "0px";
                        elswclasses[n].style.marginRight = "0px";
                        elswclasses[n].style.paddingLeft = "0px";
                        elswclasses[n].style.paddingRight = "0px";
                    }
                    if(sub_els[1].classList.contains("teaser__teaserinfo") || sub_els[1].classList.contains("teaser__link"))
                    {
                        sub_els[1].style.paddingTop = "2px";
                        sub_els[1].style.paddingLeft = "0px";
                    }
                }
            }
            if(elswclasses[n].classList.contains("trenner__text__topline"))
            {
                elswclasses[n].style.fontSize = "1.8rem";
            }
            if(elswclasses[n].classList.contains("trenner__text__headline"))
            {
                elswclasses[n].style.fontSize = "2.6rem";
            }
            if(elswclasses[n].classList.contains("trenner__link"))
            {
                elswclasses[n].style.fontSize = "1.8rem";
            }
            if(elswclasses[n].classList.contains("id-card__img"))
            {
                elswclasses[n].style.maxWidth = "80px";
            }
            if(elswclasses[n].classList.contains("list"))
            {
                elswclasses[n].style.paddingBottom = "10px";
            }
            if(elswclasses[n].classList.contains("list-element"))
            {
                elswclasses[n].style.marginBottom = "10px";
                if(elswclasses[n].classList.contains("columns"))
                {
                    elswclasses[n].style.borderRightStyle = "solid";
                    elswclasses[n].style.borderRightWidth = "5px";
                    elswclasses[n].style.borderRightColor = "rgba(0, 0, 0, 0.05)";

                    elswclasses[n].style.borderLeftStyle = "solid";
                    elswclasses[n].style.borderLeftWidth = "5px";
                    elswclasses[n].style.borderLeftColor = "rgba(0, 0, 0, 0.05)";

                    elswclasses[n].style.paddingRight = "0px";
                    elswclasses[n].style.paddingLeft = "0px";

                    elswclasses[n].style.marginTop = "5px";
                    elswclasses[n].style.marginBottom = "5px";
                }
            }
            if(elswclasses[n].classList.contains("list-element__media"))
            {
                if(elswclasses[n].classList.contains("four") && elswclasses[n].classList.contains("m-six"))
                {
                    elswclasses[n].style.maxWidth = lmmxw;
                }
                if(elswclasses[n].classList.contains("four") && elswclasses[n].classList.contains("columns"))
                {
                    elswclasses[n].style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    elswclasses[n].style.width = "23%";
                    var maxW = lmmxw;
                    var imchldrn = elswclasses[n].getElementsByClassName("list-element__image")
                    if(imchldrn.length != 0)
                    {
                        if(elswclasses[n].classList.contains("m-three"))
                        {
                            maxW = "80px";
                        }
                        else
                        {
                            elswclasses[n].style.height = "100%";
                        }
                    }
                    if(typeof(bodyw) != 'undefined')
                    {
                        if(bodyw < mblw)
                        {
                            elswclasses[n].style.maxWidth = "106px";
                        }
                        else
                        {
                            elswclasses[n].style.maxWidth = maxW;
                        }
                    }
                    else
                    {
                        elswclasses[n].style.maxWidth = maxW;
                    }
                }
            }
            if(elswclasses[n].classList.contains("list-element__teaserinfo"))
            {
                elswclasses[n].style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                elswclasses[n].style.minWidth = "77%";
                if(elswclasses[n].classList.contains("m-nine"))
                {}
                else
                {
                    elswclasses[n].style.minHeight = "100%";
                }
            }
            if(elswclasses[n].classList.contains("list-element__shorttext"))
            {
                elswclasses[n].style.marginBottom = "2px";
            }
            if(elswclasses[n].classList.contains("list-element__link"))
            {
                elswclasses[n].style.backgroundColor = "rgba(255, 255, 255, 0.0)";
            }
            if(elswclasses[n].classList.contains("teaser__link"))
            {
                elswclasses[n].style.backgroundColor = "rgba(255, 255, 255, 0.0)";
            }
            if(elswclasses[n].classList.contains("teaser__teaserinfo"))
            {
                elswclasses[n].style.backgroundColor = "rgba(255, 255, 255, 0.0)";
            }
            if(elswclasses[n].classList.contains("mubu-container"))
            {
                elswclasses[n].style.backgroundColor = "rgba(0, 0, 0, 0.07)";
                elswclasses[n].style.marginTop = "0px";
                elswclasses[n].style.paddingBottom = "2px";
            }
        }
    }
})();