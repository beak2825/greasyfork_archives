// ==UserScript==
// @name         Google translate auto slide
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Google translate auto slide on mouseover
// @author       aseg
// @match        https://*
// @match        http://*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460614/Google%20translate%20auto%20slide.user.js
// @updateURL https://update.greasyfork.org/scripts/460614/Google%20translate%20auto%20slide.meta.js
// ==/UserScript==

(function()
{
    'use strict';

    let
        ftcolor = "#4175b4",
        stripX = 510,
        stripY = 40,
        zcont = null,
        lklang = null,
        glink,
        btn1,
        btn1a,
        btn2,
	    observer = new MutationObserver(mutations =>
        {
            for(let mutation of mutations)
            {
                // examine new nodes
                for(let node of mutation.addedNodes)
                {
                    if(!(node instanceof HTMLElement))
                    {
                        continue;
                    }
                    if(document.getElementById(":0.container"))
				    {
                        zcont = document.getElementById(":0.container");
                        glink = document.getElementById(":0.container").contentDocument.body.firstChild.firstChild.firstChild.firstChild.firstChild;
                        lklang = document.getElementById(":0.container").contentDocument.body.firstChild.firstChild.firstChild.children[3].firstChild.firstChild.children[2].firstChild.firstChild;
                        btn1 = document.getElementById(":0.container").contentDocument.body.firstChild.firstChild.firstChild.children[3].firstChild.firstChild.children[2].children[2].firstChild;
                        btn1a = document.getElementById(":0.container").contentDocument.body.firstChild.firstChild.firstChild.children[3].firstChild.firstChild.firstChild.children[2].firstChild;
                        btn2 = document.getElementById(":0.container").contentDocument.body.firstChild.firstChild.firstChild.children[5].firstChild;
                    }
                }
            }

            if(zcont)
            {
                zcont.contentDocument.body.style.backgroundImage = "none";
                zcont.contentDocument.body.style.backgroundColor = "#aaa";
                zcont.style.width = "36px";
                zcont.style.marginLeft = "-10px";
                zcont.style.borderRadius = "0px 8px 8px 0px";

                glink.style.width = "30px";
                glink.firstChild.style.position = "absolute";
                glink.firstChild.style.top = "8px";
                glink.firstChild.style.clip = "rect(0px,17px,20px,0px)";

                lklang.style.color = ftcolor;
                lklang.children[0].style.fontWeight = "bold";
                if(lklang.children[0].firstChild)
                {
                    lklang.children[0].firstChild.style.color = ftcolor;
                }

                if(btn1)
                {
                    btn1.style.border = "none";
                    btn1.firstChild.style.backgroundImage = "none";
                    btn1.firstChild.style.border = "none";
                    btn1.firstChild.firstChild.style.backgroundColor = "#ddd";
                    btn1.firstChild.firstChild.style.borderRadius = "4px";
                    btn1.firstChild.firstChild.style.color = ftcolor;
                }

                if(btn1a)
                {
                    btn1a.style.border = "none";
                    btn1a.firstChild.style.backgroundImage = "none";
                    btn1a.firstChild.style.border = "none";
                    btn1a.firstChild.firstChild.style.backgroundColor = "#ddd";
                    btn1a.firstChild.firstChild.style.borderRadius = "4px";
                    btn1a.firstChild.firstChild.style.color = ftcolor;
                }

                if(btn2)
                {
                    btn2.style.border = "none";
                    btn2.firstChild.style.background = "none";
                    btn2.firstChild.style.border = "none";
                    btn2.firstChild.firstChild.style.backgroundColor = "#ddd";
                    btn2.firstChild.firstChild.style.borderRadius = "4px";
                    btn2.firstChild.firstChild.style.color = ftcolor;
                }

                zcont.onmouseover = function()
                {
                    zcont.style.width = stripX + "px";
                    zcont.style.marginLeft = "0px";

                    glink.style.width = "auto";
                    glink.firstChild.style.position = "initial";

                    document.onmousemove = function(evt)
                    {
                        let evtDoc, doc, body, posX = 0, posY = 0;

                        evt = evt || window.evt;

                        if (evt.pageX == null && evt.clientX != null)
                        {
                            evtDoc = (evt.target && evt.target.ownerDocument) || document;
                            doc = evtDoc.documentElement;
                            body = evtDoc.body;

                            evt.pageX = evt.clientX +
                                    (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                                    (doc && doc.clientLeft || body && body.clientLeft || 0);

							evt.pageY = evt.clientY +
                                    (doc && doc.scrollTop || body && body.scrollTop || 0) -
                                    (doc && doc.clientTop || body && body.clientTop || 0 );

                            posX = evt.pageX;
							posY = evt.pageY;
                        }
                        else
                        {
                            posX = evt.pageX > evt.clientX ? evt.clientX : evt.pageX;
							posY = evt.pageY > evt.clientY ? evt.clientY : evt.pageY;
                        }

                        if((posX > (stripX + 25)) || (posY > (stripY + 25)))
                        {
                            zcont.style.width = "36px";
                            zcont.style.marginLeft = "-10px";

                            glink.style.width = "30px";
                            glink.firstChild.style.position = "absolute";

                            document.onmousemove = function(){};
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {childList: true});
})();