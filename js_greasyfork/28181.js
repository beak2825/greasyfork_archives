// ==UserScript==
// @name         GetJobber
// @namespace    zo1984
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      http*://*getjobber.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28181/GetJobber.user.js
// @updateURL https://update.greasyfork.org/scripts/28181/GetJobber.meta.js
// ==/UserScript==


window.zo1984 = {}; 
window.zo1984.elements = []; 

document.body.style.fontFamily = "Arial !important"; 

(function() 
{
    var origOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function() 
    {
        this.addEventListener('load', function() 
        {
            // console.log("Response loaded"); 

            object = []; 
            try { object = Array.from(JSON.parse(this.responseText)); } catch(e){ object = []; }

            if (object.length > 1)
            {
                console.clear();
                console.log("Length: ", object.length); 

                object = object.filter(function(elem, index)
                {
                    // console.log("index:", index); 

                    if (elem.client && elem.client.name)
                    {
                        time = 0; 

                        if (elem.end_at_epoch) end = elem.end_at_epoch; 
                        if (elem.start_at_epoch) start = elem.start_at_epoch; 

                        if (end && start){ elem.time = (end - start) / 60; }
                        if (elem.assigned_to[0]) elem.team = elem.assigned_to[0].name; 
                        else { console.log(elem.client.name + ' not assigned'); return false; }

                        return true; 
                    }

                    else { console.log(elem); return false; }
                });
                
                object.sort(function(a, b)
                {
                    if (a.start_at_epoch < b.start_at_epoch) return 1; else return -1; 
                });  

                object.sort(function(a, b)
                {
                    if (a.team > b.team) return 1; 
                    
                    else if (a.team < b.team) return -1; 
                    
                    else 
                    {
                        if (a.start_at_epoch > b.start_at_epoch) return 1; else return -1;                                
                    }
                });

                window.zo1984.elements = object;

                prev_team = ""; 

                object.forEach(function(elem)
                {
                    try 
                    {
                        elem.prop = ""; 

                        if (property = elem.property.combined.replace('/', ",").split(','))
                        {
                            property.forEach(function(e, i)
                            {
                                if (i != 1) elem.prop += e.trim().replace(/\s+/g, "+"); 
                                else elem.prop += "+" + e.trim().replace(/\s+/g, "+"); ; 
                                if (i < (property.length - 1)) elem.prop += ","; 
                            }); 

                            elem.prop += "/";
                        }

                        if (elem.team == prev_team || (prev_team == "")){ console.log(elem.client.name, ", ", (elem.end_at_epoch - elem.start_at_epoch) / 60, ",", elem.prop, elem.team); }
                        else if(prev_team !== "")
                        { 
                            console.log('----------------------------'); 
                            console.log(elem.client.name, ", ", (elem.end_at_epoch - elem.start_at_epoch) / 60, ",", elem.prop, elem.team); 
                        }
                        else console.log("---------------------------------------- --------------------------------------"); 

                        prev_team = elem.team; 
                    } 

                    catch(e){ console.log("Error", elem); }
                }); 
            }
        });

        origOpen.apply(this, arguments);
    };
})();

window.zo1984.show_with_properties = function (a, b)
{
    window.zo1984.elements.forEach(function(elem)
    {
        console.log(elem.client.name, elem[a], elem[b]); 
    }); 
};