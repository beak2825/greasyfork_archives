// ==UserScript==
// @name         TheWest - Tamagotchi PG
// @namespace    https://greasyfork.org/scripts/35553-thewest-tamagotchi-pg
// @version      0.53
// @description  Power up your character with the Tamagothi menu
// @author       Adriano
// @license      LGPLv3
// @include      http*://*.the-west.*/game.php
// @include      http*://*.the-west.*.*/game.php*
// @include      http*://*.tw.innogames.*/game.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35553/TheWest%20-%20Tamagotchi%20PG.user.js
// @updateURL https://update.greasyfork.org/scripts/35553/TheWest%20-%20Tamagotchi%20PG.meta.js
// ==/UserScript==

function appendScript(fn) {
	var newScript = document.createElement('script');
	newScript.setAttribute("type", "application/javascript");
	newScript.textContent = '(' + fn + ')();';
	document.body.appendChild(newScript);
	document.body.removeChild(newScript);
}
appendScript(function() {
    //'use strict';
    var VERSION = 0.53;
	var URL_INSTALL = "https://greasyfork.org/scripts/35553-thewest-tamagotchi-pg";
	var URL_CODE = "https://greasyfork.org/scripts/35553-thewest-tamagotchi-pg/code/TheWest%20-%20Tamagotchi%20PG.user.js";
    var SCRIPT1 = "https://greasyfork.org/scripts/35553-thewest-tamagotchi-pg";
    var SCRIPT2 = "https://greasyfork.org/en/scripts/35587-thewest-no-edge-blink";
	var scriptAuthor = "Adriano";
	var scriptCredits = '<span style="display: inline-block; vertical-align: middle;">TW Friends for the base script, Adriano (Tiger54) for this script<br />Wojcieszyᴾᴸ, Adrianoᴵᵀ`ᴰᴱ`ᴱᴺ, Pepe100ᴱˢ </span>';
    var scriptList = '<p style="margin: 8pt;"><b>Adriano\'s Scripts</b>: <span style="display: inline-block; vertical-align: middle;"><a href="' + SCRIPT1 + '">Tamagotchi PG</a><br><a href="' + SCRIPT2 + '">No Edge Blink</a></span></p>';
	var scriptName = "Tamagotchi PG";
	var scriptObject = "TamagotchiPG";
    var ITEMSGROUPS = 7;
	this[scriptObject] = {
        options: {
            hide0Items : false,
            init: function()
            {
                var decodedCookie = decodeURIComponent(document.cookie);
                var ca = decodedCookie.split(';');
                for(var i = 0; i <ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf("hideitems=") == 0) {
                        this.hide0Items = (c.substring("hideitems=".length, c.length) != 'false');
                    }
                }
                var desc = TamagotchiPG.localeManager.getMsg('description');
                desc = desc.replace("[OPTIONS]", "<input type='checkbox' " + (this.hide0Items?"checked":"") + " onclick='TamagotchiPG.options.hide0Items=this.checked;TamagotchiPG.options.save();'> &nbsp; " + TamagotchiPG.localeManager.getMsg('opt_hide0elements') + "<br>");
                TamagotchiPG.script.api.setGui(desc);
            },
            save: function()
            {
                var d = new Date();
                var exdays = 365;
                d.setTime(d.getTime() + (exdays*24*60*60*1000));
                var expires = "expires="+ d.toUTCString();
                document.cookie = "hideitems=" + this.hide0Items.toString() + ";" + expires + ";path=/";
                this.init();
            },
        },
        toolbar: {
            div1: null,
            menuicons : [],
            menutitles : [],
            lastPGClick : 0,
            init : function()
            {
                this.menutitles.push(TamagotchiPG.localeManager.getMsg("menu_energy"));  this.menuicons.push("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGASURBVDhPY2QgADTnX+gDKkqBclHAfwaGOQQN0Jh3/tPmWAPer0DVyIAbqNN38YXPBA1QnXeuD2gXiguSAw14566/8JmBgXEOVIg4oDz39Kf57//8B9HKc04BDWZgYALLEAEUZh3v+/v3LwPXv38MIPpuilkRSJxoA/7+/5+yMMyIt2TNmc9AI+BOJ8oAqRmH+/79/8Pw7NsfBhD9KM0abDsIEAxEyRkH+hiAti8LseCNWnMCGHBIgJFxDiOueAbF8fVEgyKxaXs/rQiy5D37/icDLwsTgxovKwMvKxOYbbf08GdGjXnngPFsiBLPkDg+//lGkhGf8LQ9fYxAF0ClUMB/kAuU55zpA3oEriAlwIB3zgZgHP9nmHM3xQTuV7wAFEXys058mvvq538QDeJDpQgCRplZh4GBxJCyMcKc13/FSUQgMTLMeZJmS9gFEtP3f9r/6vv/npsf/s+8++k/iH3j06//IHGoEryAURQYSOhpHQIY57zOciEuDMgHDAwASoGne8UPddgAAAAASUVORK5CYII=");
                this.menutitles.push(TamagotchiPG.localeManager.getMsg("menu_live"));    this.menuicons.push("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAK9SURBVDhPZVFNSFRRFD73vvv+dP5/TA2LyFoMhkGZNtgiWtYiWkm1CwkXQYuWRT/Qpto2tYySWmUQCNFCcBU5i5FwkaILLTAzdd78vnnvvnc7943NWH2Xj3ff5ZzvnO8cArtYvnLsnNnbc72jtyejGIbl1WszvFx5n777Lr8bAmvXRhJqLBy1Q876ofuztnwLBBYvHXmgxaJ34kMnoKO/H5RwCITngbO+7tqrq1Pb8wsv3XL5fOr0qQuqoad4ubrIS9aT7kcfX5OvF/uvcrv+KjGQgejgAGipFFBNA6JqIIQPvlWEytIKcMeFSOYoUHzjpTLUf/yE2s72mDLeTZ8zXe/Tk3FgGgNh18ErWcCLRfCsHfy3gZkGClIQDQeEg+QciBDg1+z9pJCNrKnhcF+orwfMrnQzmFI01xpPcBe+hxRAFSV48hwOjaL1ncyPxgqEKceNeAz0eBSYgQIKCjTHA+ij+UUIvAfiIFDABduqLJDCaOIxTuwWM/SguqKqWGWPwB4IPASP7ISjFe7wpySfjRxWQMwRQhIEKFDaTvxfQoo0BXzfq1FBR4KY/HBoglGS87kHvoNEv7L1fwVabhSGJLeHC/bDVkz+ZGeOMjLhVnH/VRc9opDMaI8gANUo6Kb6ttHVGDs7C1yaDWDWqjeZC5NmJ6rrKthcgUqNQKkCYCFLVaxFVEgY+ozHGuMyWeY1d4LIbYK3L+5Md/sslQypQ9gAVGwfbBfARzPJCIMVpkxPNezLN5ZhZzetLSAxuwn+iw33A25KOZNWszhYygWBdFSFGR/e3PvWmPhcgiKGtoz9EZCzMJFp5ME5y1tZqotitosNxjsV7dmWO5nbcHPYjLQs6SCxx/am5GMYGUMmkXGkecCgmRgD/UvF/4T/v5BbSNlBDfmXgITsRkXiFIO7FJVBWDiAHJrknr0A/AaAiiZKS6khhwAAAABJRU5ErkJggg==");
                this.menutitles.push(TamagotchiPG.localeManager.getMsg("menu_work"));    this.menuicons.push("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIvSURBVDhPY6AUMEJpOFi1ahUbLy+v47+/DP4MDP89GRj/Sf37/4+F8d+/M39+M/QHBAesgCoFAwwD1q5d+wFIff/D8O8X03+Gr4z/GVVMzUxY+XgFGG7fucVw9879/cwsjB5hYWG/IDoIgNmzl4nPnDHj56f3H////PHr/+kzp//PnTv3CFSagQlK4wTffnzar6GjzfbpyyeGt2/fM6goqzIwMTFaz5kzhxckzwxWhQNcWp0Weu8tRxIHlwALHz8fw6NHDxjWrV//RUdbj+3Bg/v5jo6OTBhhAANnlyV08QgIl0qrOzJMXX6UgV9MmeHFsyfPGBkZwxgYGddYWVlIHNh/+ANWLxxbENXOxiVYqqBtx/Dn8QEGR/nHDLramgz///+Xra+vP/rv71/VA/v3//z583skVAsC7Jsa1n56ec7/b7fX/H+6Mfn//ulh/w9MD3SFSsNBcXGxPIhG8cLWPr8OHiHJchNrJ4Zn5zYz3H7+lYHh3293r6Itu6BKMADcC2tbPNvZuYTKDUwcGR4cXcNw5f5bhm9fvnng0wwCYBcsrXHs5BeWKrOy82a4f3IFw62XX4AW//OIbjuwE6wKD2CcXWjTLSQhWeLo5Mdw49AShpsvvjP8/f/HPaXnGF6bYYCJX0iyxNYpgOHK3oUM5x98Yvj68bsnsZpBgOnr188MF3bOYTh//yPDz6/f3HNmnd4BlSMKML16+8r44oPP237/+GFSNO8i0TZDAAMDAHNc5AhTlzLSAAAAAElFTkSuQmCC");
                this.menutitles.push(TamagotchiPG.localeManager.getMsg("menu_duel"));    this.menuicons.push("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJ6SURBVDhPpVNNTxNRFD1Dv2jD8B1SQsGkWIKxiomwAKKIDU1cuIF/oCu6Mu7csdcYY8KCRffsTHFBAonYYMJKK0HTEEhBFJFKIKUdZjrTmee9j9LIxo03OZ07555z3rzpPPxvKdVrrQ6ADgeYgKLcEkAncyQ6gBCf64BlIvJSWK1LAd+Be+6mpseB8fEb/oGBHldjo8q8fXpa1NfX985WVjYqhUKyG3gvDX8Xmw+DwZQ5M3Mi5ueFyOWEMIxzcE8cz1jD2qoNLv7Zpsf2qOqztkQi7o3FmjE4CGd5GWJhAWJ1FaJQgDIxAZeq1nuam4NnmUxDwjQ/vAY02pbcR9w/OnrT3d/fhL4+2LOzEDs7UKJRCe6Z4xlrWMse9soAU1Fu+yORbmdoCFYqBce2gelp2L29EtwzJ2ekYS17agFlIKT4fGq5vR3O1hZsWsnc3YWdTErInjiesUZqyVMLMOhdOOUyyoYBp1JBxbJg0j33DO6Z415q6J49tQBK+6UfHZUqtJLZ1QVlYwN6aytKU1MS3DPHM9awlj21gKIQH39ms4dueuOnY2OwaaXA3ByUzU0J7pnjGWtYyx72ysd4QGknx8d3gz5fp6ejw6vFYqjL5+GhPbvoaoVCKE5Owkth5aUlLbO2tq7Z9os3QEkGcBO37cKP/f1oqFhsCViWxxgZgUb/vT48DKelBf50Gsbiop5Op7Oarj9/BHxi76VP+QnwMOr1Pg2Hw1ev9PS0qg0N9cwXSyXj297ecS6X2/5imi9fAW+lgeoiwE1oI7RfA4L3gTsR4LqnepgsOkxbwNd3wGr2/DD9JhwRKhcB/DIDVXDYv4q+MmiEMwDOHylfR/XT5NhwAAAAAElFTkSuQmCC");
                this.menutitles.push(TamagotchiPG.localeManager.getMsg("menu_speed"));   this.menuicons.push("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJbSURBVDhP1ZFfSJNhFMZ/3/fNf21maqUu0DaxUjNLKkskEwwCuzESoW606KKIIvAiNLGLgggjqgsvyiC6tosyoi6KNA2demNmTbZkGlua23Slc7l9vd+3VUJ01VXPy3n/cZ5znnMO/wopdv6B0xWYImHuqip1wnTIEkFJoa29m5boz18CCPLB8DJPd+zZS0lpOQS9JBjT8Hjc9L7owu32e+70kaX5KjpjBfTMy4xWVR/CsmENjjcPcNsHcY70sSoxSGllDVOucVN+elAZcvFSvtl2Qr11/WRMJKgR7hUWF7A2GcZ6HzL8IcTrMRh0wONndnqe3GdfRbkmXS9DPtfYsfMXW0DUXVtQuBWnrQu7G6wllZxtaub8xWaq647y1hEgLrKIEtMuCxviZ5cERKMIzX1EEqdsMlO8NZeBR1cZ6LxCfNhHlmULPvd74gxRf+nGtQadLskGp7+/N9/rebe0vyybuWkXn5Td5EgD+BYTGRoLYrbksDHDQPyCA5sT2l8JmtFkpHB7EbmbrNb0igPjC0HweVy6gpB/gslpyMsvovFSK9VVu0gQZLcfFpd4rikwBOYDonERDELT5oK87In1yXzxB8hIg1RpmlERgH4bn+02zZ9JL0zNoHYOc0Z7y5JItfD1m2i/Sji0RNmxU6xOgrBQkhIPRZngn4eeEegW9t1oZtuRevVya4PQIUq/0FjTkZmRetySZyUhSTBlBUkRTFkWoxJLlKKbcFbF0saEUOydmcU7O1Ov/Ztbmmpvp6UYD0e7qcfVtt9Y+YwNLBpYSxFFtrB10ev/BfgBAJbZLBlRl5gAAAAASUVORK5CYII=");
                this.menutitles.push(TamagotchiPG.localeManager.getMsg("menu_luck"));    this.menuicons.push("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHXSURBVDhPzVK/SxxREJ55b9c9A0Gw0EaxSWWT1iAhamMhxhCxs9ErhUAQ8kOLNIk/CiHWCgeCRWyMpLUR70yKIGIhaVLYWYlR8C7u7ozf29t78f6C+G3xhplvZr6ZWfrv4Pz1WPnS1x5HdpWEhZLCq7cTu5fLO/0fRelxYHjuzVj5OKdmCPLX4yYKi0w6SYZIW6qHi9+eHBjiOYNWqaIM0WidWYdX0OisxE/h7HE+sD8YpYoy7WYk0j8oUb6rBH3qcJ1Rb9IlG7ZkTECs1CGkncSGAtsCFrcZ5hEo+VTPulMA5OM0dU2JRFMKkWBsMMPGbka2lVKJM54Dk/mZm81LXNjpe8Riu4g5QOdSZAtdqoqCMSrLuAqdI+Xq3YvyIWNRLscr2NqasCzhAMwBxAZNwu0GYQaTMRKuMtSIff76rC1LAvwVfodnU8y65kS5Lyo8oGqtemWC+CIKH3ZjgBmRJOPWJOnFM+3sfzuA0NzMut6k19iBrGKBxb/xNQ7gw03wBapHlRKeacy6JxjWzY4vZfdDAW6xKHEKc5aT1tfO59C0RIel7f4iJKw7W5WnxCY/KLYn1uJQoqX3LyuZ9Aa8gga8EiTXjvY35p9//2UDHYavqfN9AdEtwWC1pb0pEz8AAAAASUVORK5CYII=");
                this.menutitles.push(TamagotchiPG.localeManager.getMsg("menu_special")); this.menuicons.push("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHZSURBVDhPY2TAAXh5ec9KSkoKA5ksr1+//vX+/XsliAwqYILSKICLi8uIiYlJWFlZWR4IpJmZmfkkJCRModIoAKsBQNtTli1bJqumpsagpaXFMHnyJGEpKalqqDRRQMTKyurwgwcP/l+7evW/v7//a5AYRAoVYHUBELxhYWH5CWUzsLKy/gFSbyA8VIDLAKIBLgPEgDHAD2IAA5BBUECAFyQG4hMFREREuk6dOvULFAb379//v3PH9v+6uroLodIEAa+7u/txkOYLFy78j4tIuO1o4PlIjFf6FUgOogQBMBISGxNHpaqceqIgh+ivH6/+MVtw+qrwMAuw3P557f/hd8t6X/1+WgpVCgboBrApsGvvjZYps/kPCnck8OnfJ4Zd7xY/v/X1lAKQ+wsiihaIrEysCfZCQVoMbJgpnJuRm0Gdy0yCl0kkCyoEBsgGMIqyyEZIC6gJ/f/2HyqEAMyMzAzS7CqMouzSeUAu3AZkA6QVOLREGP9jaoYDoDZRNjlxIEsKIoBqwJMrX49duPXu/DMoHw5+AwPk/d/3DPe+X/734Pulw0ChpxAZzEBkZGJijZRglYvmYRZUZGFk5QTawfaP4e+/738/PX/96/G0b/8+g9ID1JkMDAC5gYpHMXGa0wAAAABJRU5ErkJggg==");
                this.menutitles.push(TamagotchiPG.localeManager.getMsg("menu_premium")); this.menuicons.push("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKNSURBVDhPfVJfSFNRHP7uvdtkttDZg8XMCSULpf9RkFDhU6JEQhghCBEVFD1E9CwNhJ586U2CoigMWUJNgiQTAgkSIrMsWyKrzdS2Nefcds7dOf3u3W15e+jjHM7hnO/7fr/z+x0F66BfuSx5fQNYOAwpJSAEpDFpb6wVHR3Ay1fwjD0v61RrNSF1vUyWxSLpLQPam5PuBOMWuwS7AddLUS2BGsjCeSr218C4+68BXUrGoDY2mgJHSxrqIS+wKUNmASCfN+/Xw2YgGAsqsTi0hgZo+/xQtmah1rRCbVHg8PshZr5AFnjQopuwGbgHB3tlfCGI+Si0/TmovtNQqw9D+uOQn2YhZ+eC3pm3vRbdhFlNMVHn5kILKFJqnJ4oQr6LOJY47zx4nUK4wKKDYKGpp7JVuwGrBIxnln1dqahpUBiv/S4rm3xG50pdkFC9R4BKPxU2RTMNnphCcW0JkmIKisIy82DJnz2mQTaEE4LhgdZ8yePwnaFC/aB6pIiYBKmM/lKuDhobIXSO9ORDJN5MP1Gr0F3+EL/uYbsoIuza0RnQ6k6SySLpspTNGnUkRwYa9GQcC8+GijyD3t230GfoykWs7kGEb8CB3NzwsFj5aLyFRoEMCkZ/KXENi2NDST2Ptj9iA7Yu1HZhVXV7Rnk6AmnkJgUJaSNLn4jYq7v6MVpil2AzMCAVV7vTuwcKvdn42ozSVpw11IwquGo3178LYqdFNWEziD6qc1OgVq26CZn3IXy73x9ZGBm6m3g9jEIyhootzeBZtFt0EzaDCqwcVTzb3Mvha1ganxgQq9jbfBNnU58jbV8f346xHEP+HwMbYgM4F+nD3PRVHLeOypi8gKoX3bgz0okP1hEB+A31vFltpk0v4AAAAABJRU5ErkJggg==");
            },
            closeDefault : function()
            {
                if(typeof CharacterWindow.window != 'undefined' && CharacterWindow.window !== null) CharacterWindow.window.destroy();
                return true;
            },
            centerPGOnMap : function(withToolbar)
            {
                var task1 = TaskQueue.getByQueuePos(0);
                var t = new ServerDate().getTime();
                if(t - this.lastPGClick < 3000)
                {
                    Map.center(Character.position.x, Character.position.y - (withToolbar?120:0));
                    this.lastPGClick = 0;
                    //console.log("center Map double click");
                }
                else if(typeof task1 !== 'undefined' && task1 !== null && typeof task1.centerable != undefined && task1.centerable)
                {
                    var isWalking = Walker.current == 'walk' || Walker.current == 'ride';
                    var tw1 = task1.getWayStartDate();
                    var tw2 = task1.getWayEndDate();
                    var wayTime = tw2-tw1;
                    if(tw1 < t && tw2 > t)
                    {
                        var c1 = Character.position.x + (task1.data.x - Character.position.x) * (wayTime - (task1.data.date_start - t)) / wayTime;
                        var c2 = Character.position.y + (task1.data.y - Character.position.y) * (wayTime - (task1.data.date_start - t)) / wayTime - (withToolbar?120:0);
                        Map.center(
                            parseInt(c1),
                            parseInt(c2)
                        );
                        //console.log("New position: " + c1 + ", " + c2);
                        //console.log("center PG");
                        this.lastPGClick = t;
                    }
                    else
                    {
                        Map.center(Character.position.x, Character.position.y - (withToolbar?120:0));
                        this.lastPGClick = 0;
                        //console.log("center Map no moving");
                    }

                    //console.log("PG position: " + Character.position.x + ", " + Character.position.y);
                    //console.log("Next work: " + task1.data.x + ", " + task1.data.y);
                    //console.log("starting in " + ((task1.data.date_start - t) / 1000) + "seconds");
                    //console.log("wayTime " + (wayTime/1000) + "seconds");

                }
                else
                {
                    Map.center(Character.position.x, Character.position.y - (withToolbar?120:0));
                    this.lastPGClick = 0;
                    //console.log("center Map no task");
                }
            },
        },
        powerItems: {
            subdivs : [],
            riposo : [],
            vita : [],
            lavoro : [],
            duello : [],
            velocita : [],
            fortuna : [],
            speciale : [],
            premium : [],
            createFunc : function (msg) {return function(){$.globalEval(msg);};},
            createFunc2 : function (index, div) {
                return function() {
                    TamagotchiPG.powerItems.showItems(index, ([
                        TamagotchiPG.powerItems.riposo,
                        TamagotchiPG.powerItems.vita,
                        TamagotchiPG.powerItems.lavoro,
                        TamagotchiPG.powerItems.duello,
                        TamagotchiPG.powerItems.velocita,
                        TamagotchiPG.powerItems.fortuna,
                        TamagotchiPG.powerItems.speciale,
                        TamagotchiPG.powerItems.premium,
                    ])[index], div);
                };
            },
            move : function(qty, div) {
                var currLeft = parseInt(div.style.left) / 61;
                if(currLeft - qty > 0) qty = currLeft;
                if(div.childNodes.length <= -(currLeft - qty)) qty = 0;
                if(qty !== 0)
                {
                    var single = qty / Math.abs(qty);
                    div.style.left = ((currLeft - single) * 61) + "px";
                    if(single != qty) setTimeout(function(){TamagotchiPG.powerItems.move(qty - single, div);}, 40);
                }
            },
            showItems : function(el, arr, div) {
                for(var j=0;j<this.subdivs.length;j++)
                {
                    this.subdivs[j].style.opacity = "0.6";
                    this.subdivs[j].childNodes[0].style.borderColor = "#000000";
                    //this.subdivs[el].childNodes[0].style.borderWidth = "1px";
                }
                this.subdivs[el].style.opacity = "1.0";
                this.subdivs[el].childNodes[0].style.borderColor = "#ffff00";
                //this.subdivs[el].childNodes[0].style.borderWidth = "2px";
                while(div.childNodes.length > 0) div.removeChild(div.childNodes[0]);
                div.style.left = "0px";
                var t = new ServerDate().getTime()/1000;
                var hideItems = TamagotchiPG.options.hide0Items;
                for(j in arr)
                {
                    if(!(!isNaN(parseFloat(arr[j])) && isFinite(arr[j]))) continue;
                    var it = ItemManager.get(arr[j]);
                    if(it === null || typeof it == 'undefined' || it.name === null || it.name =='undefined')
                    {
                        console.error("TW-Tamagotchi Script: Item " + arr[j] + " not found");
                        continue;
                    }
                    var bagItem = Bag.getItemByItemId(arr[j]);
                    var itemCounts = (bagItem !== null && typeof bagItem !=='undefined' && bagItem.count != 'undefined') ? bagItem.count : 0;
                    var divi = document.createElement("div");
                    divi.className = "item item_inventory not_upgradeable hasMousePopup";
                    var img = document.createElement("img");
                    img.className = "tw_item item_inventory_img dnd_draggable";
                    img.setAttribute("src", "https://westit.innogamescdn.com/" + it.image );
                    var cooldownvar = false;
                    var span = null;
                    if(itemCounts > 0)
                    {
                        var itemCooldown=Bag.itemCooldown[arr[j]],globalCooldown=bagItem.obj.has_cooldown?Character.cooldown:0,cooldown=Math.max(itemCooldown||0,globalCooldown||0);
                        img.addEventListener("click", this.createFunc(it.action));

                        if(parseInt(bagItem.cooldown) > 0 || parseInt(cooldown) > 0)
                        {
                            cooldownvar = (parseInt(bagItem.cooldown) > 0)?bagItem.cooldown:cooldown;
                            if(t < cooldownvar)
                            {
                                span = document.createElement("span");
                                span.className = "cooldown";
                                span.setAttribute("style", "display:block;");
                                span.appendChild(document.createTextNode((cooldownvar - t).getTime2EndShort()));
                            }
                        }
                    }
                    else if(hideItems) continue;
                    var tt = new ItemPopup(it,{show_buffs:false,show_compare:false,show_alreadyown:false,traderCharge:false,show_setboni:true,character:itemCounts>0?bagItem.character:null,show_sell_price:true,show_lifetime:false,show_cooldown:cooldownvar});
                    tt.bindTo(img);
                    divi.appendChild(img);
                    var spa = document.createElement("span");
                    spa.className = "count";
                    spa.setAttribute("style", "display:block;");
                    spa.appendChild(document.createTextNode(itemCounts));
                    divi.appendChild(spa);
                    if(span !== null) divi.appendChild(span);
                    div.appendChild(divi);
                }
            },
            init : function() {
                this.riposo.push(1971000);     // calumet 100%R
                this.riposo.push(1997000);     // arrosto 100%R 100%L
                this.riposo.push(2130000);     // tè maté 100%R 20%L 20%D
                this.riposo.push(17028000);    // barattolo spinaci 100%R 100%V 100%L 100%D
                this.riposo.push(50113000);    // zuppa fagioli 100%R 20%V 20%L 20%D
                this.riposo.push(2129000);     // guaranà 50%R 10%L 10%D
                this.riposo.push(16100000);    // borsa medico 40%R 25%V
                this.riposo.push(2128000);     // caffé 25%R 5%L 5%D
                this.riposo.push(1890000);     // tè 20%R
                this.riposo.push(1969000);     // whiskey invecchiato 20%R
                this.riposo.push(1970000);     // torta di ciliegie 20%R
                this.riposo.push(2356000);     // birra 15%R
                this.riposo.push(13704000);    // liquore qualità 15%R
                this.riposo.push(2294000);     // colore blu 15%R
                this.riposo.push(2670000);     // tamales 15%R
                this.riposo.push(12704000);    // pan pepato 15%R
                this.riposo.push(2525000);     // inchiostro 15%R 15%V
                this.riposo.push(1928000);     // sacco a pelo 15%R 15%L
                this.riposo.push(1898000);     // acqua di rosa 15%R 25%V
                this.riposo.push(1943000);     // fagioli cotti 10%R
                this.riposo.push(2358000);     // salsiccia 10%R 10%V
                this.riposo.push(13706000);    // arancia 10%R 10%V
                this.riposo.push(12706000);    // marzapane 10%R 10%V
                this.riposo.push(2672000);     // bambola 10%R 10%V
                this.riposo.push(2296000);     // fuoco artificio 10%V 10%R
                this.riposo.push(185205000);   // uovo pasqua 10%R 10%V
                this.riposo.push(255000);      // insalata pomodori 10%R 10%L
                this.riposo.push(1892000);     // liquore fruttato 10%R 15%V
                this.riposo.push(1985000);     // liquore squisito 10%R 15%D
                this.riposo.push(1937000);     // zaino 10%S 5%R
                this.vita.push(17028000);      // barattolo spinaci 100%R 100%V 100%L 100%D
                this.vita.push(2117000);       // liquido 75%V
                this.vita.push(1974000);       // elisir 50%V
                this.vita.push(2116000);       // linfa 25%V
                this.vita.push(16100000);      // borsa medico 40%R 25%V
                this.vita.push(1898000);       // acqua di rosa 15%R 25%V
                this.vita.push(2295000);       // colore bianco 20%V
                this.vita.push(2357000);       // crauti 20%V
                this.vita.push(2671000);       // pan muertos 20%V
                this.vita.push(12705000);      // tortino 20%V
                this.vita.push(13705000);      // fagioli e pancetta 20%V
                this.vita.push(185204000);     // uovo pasqua 20%V
                this.vita.push(2734000);       // lanterna 300%S 20%V 20%D
                this.vita.push(50113000);      // zuppa fagioli 100%R 20%V 20%L 20%D
                this.vita.push(1892000);       // liquore fruttato 10%R 15%V
                this.vita.push(2525000);       // inchiostro 15%R 15%V
                this.vita.push(2358000);       // salsiccia 10%R 10%V
                this.vita.push(12706000);      // marzapane 10%R 10%V
                this.vita.push(2296000);       // fuoco artificio 10%V 10%R
                this.vita.push(13706000);      // arancia 10%R 10%V
                this.vita.push(2672000);       // bambola 10%R 10%V
                this.vita.push(185205000);     // uovo pasqua 10%R 10%V
                this.vita.push(1883000);       // medicina stomaco 10%V
                this.lavoro.push(1997000);     // arrosto 100%R 100%L
                this.lavoro.push(2391000);     // zucca 100%L 100%D
                this.lavoro.push(17028000);    // barattolo spinaci 100%R 100%V 100%L 100%D
                this.lavoro.push(1934000);     // pomello da sella 100%S 30%L 30%D
                this.lavoro.push(1984000);     // lozione capelli 20%L
                this.lavoro.push(185200000);   // uovo pasqua 15%L
                this.lavoro.push(1891000);     // tabacco 25%L
                this.lavoro.push(2268000);     // acqua saponata 25%L 25%D
                this.lavoro.push(2130000);     // tè maté 100%R 20%L 20%D
                this.lavoro.push(50113000);    // zuppa fagioli 100%R 20%V 20%L 20%D
                this.lavoro.push(2353000);     // pretzel 15%L
                this.lavoro.push(2667000);     // mezcal 15%L
                this.lavoro.push(13701000);    // pomodoro 15%L
                this.lavoro.push(12701000);    // liquirizia 15%L
                this.lavoro.push(2291000);     // fuoco artificio 15%L
                this.lavoro.push(1928000);     // sacco a pelo 15%R 15%L
                this.lavoro.push(2516000);     // hushpuppy 15%L 15%D
                this.lavoro.push(2706000);     // coniglio 10%L
                this.lavoro.push(2707000);     // coniglio 10%L
                this.lavoro.push(2129000);     // guaranà 50%R 10%L 10%D
                this.lavoro.push(255000);      // insalata pomodori 10%R 10%L
                this.lavoro.push(1939000);     // sigarette con filtro 7%L 7%D
                this.lavoro.push(2128000);     // caffé 25%R 5%L 5%D
                this.duello.push(2391000);     // zucca 100%L 100%D
                this.duello.push(17028000);    // barattolo spinaci 100%R 100%V 100%L 100%D
                this.duello.push(50135000);    // pigmenti 30%D
                this.duello.push(1934000);     // pomello da sella 100%S 30%L 30%D
                this.duello.push(50136000);    // testamento 25%D
                this.duello.push(2268000);     // acqua saponata 25%L 25%D
                this.duello.push(2734000);     // lanterna 300%S 20%V 20%D
                this.duello.push(2130000);     // tè maté 100%R 20%L 20%D
                this.duello.push(50113000);    // zuppa fagioli 100%R 20%V 20%L 20%D
                this.duello.push(2355000);     // pan zenzero 15%D
                this.duello.push(185202000);   // uovo pasqua 15%D
                this.duello.push(2294000);     // colore rosso 15%D
                this.duello.push(2669000);     // calavera 15%D
                this.duello.push(13703000);    // sigarette 15%D
                this.duello.push(12703000);    // petardo 15%D
                this.duello.push(1985000);     // liquore squisito 10%R 15%D
                this.duello.push(2516000);     // hushpuppy 15%L 15%D
                this.duello.push(1882000);     // spazzola tubolare 10%D
                this.duello.push(1952000);     // sacco del cibo 15%S 10%D
                this.duello.push(1988000);     // fondina 10%D
                this.duello.push(2129000);     // guaranà 50%R 10%L 10%D
                this.duello.push(1939000);     // sigarette con filtro 7%L 7%D
                this.duello.push(2128000);     // caffé 25%R 5%L 5%D
                this.velocita.push(2229000);   // bevanda galattica 60000%S
                this.velocita.push(2734000);   // lanterna 300%S 20%V 20%D
                this.velocita.push(2284000);   // ferri 200%S
                this.velocita.push(2519000);   // vettura corsa 200%S
                this.velocita.push(1987000);   // redini 125%S
                this.velocita.push(1934000);   // pomello da sella 100%S 30%L 30%D
                this.velocita.push(1927000);   // briglie 50%S
                this.velocita.push(1968000);   // tonificante 50%S
                this.velocita.push(13702000);  // ferro cavallo 50%S
                this.velocita.push(185201000); // uovo pasqua 25%S
                this.velocita.push(1919000);   // integratore 25%S
                this.velocita.push(2292000);   // fuochi 25%S
                this.velocita.push(2354000);   // stinco 25%S
                this.velocita.push(2668000);   // candele 25%S
                this.velocita.push(12702000);  // avena 25%S
                this.velocita.push(1926000);   // sperone 20%S
                this.velocita.push(1918000);   // zoccolo 15%S
                this.velocita.push(1952000);   // sacco del cibo 15%S 10%D
                this.velocita.push(1937000);   // zaino 10%S 5%R
                this.fortuna.push(2696000);    // coperta 15%F
                this.fortuna.push(50107000);   // carte 7%F
                this.fortuna.push(2290000);    // fermaglio 50%F 150PL
                this.fortuna.push(2465000);    // potenziamento 25%F
                this.fortuna.push(2251000);    // quadrifoglio 25%F
                this.fortuna.push(2738000);    // vino di miele 20%F
                this.fortuna.push(2250000);    // quadrifoglio 10%F
                this.fortuna.push(2249000);    // quadrifoglio 5%F
                this.fortuna.push(2248000);    // quadrifoglio 2%F
                this.fortuna.push(2247000);    // quadrifoglio 1%F
                this.fortuna.push(2326000);    // riconoscimento salario 1a
                this.fortuna.push(2322000);    // riconoscimento salario 3m
                this.fortuna.push(2318000);    // riconoscimento salario 14g
                this.fortuna.push(2314000);    // riconoscimento salario 3g
                this.fortuna.push(21343000);   // riconoscimento salario 1g
                /* Not available:
                this.fortuna.push(2947000);    // VIP 1a
                this.fortuna.push(2945000);    // VIP 3m
                this.fortuna.push(2943000);    // VIP 14g
                this.fortuna.push(2941000);    // VIP 3g
                */
                this.fortuna.push(2105000);    // istruzioni lavoro 250PL
                this.fortuna.push(2104000);    // istruzioni lavoro 250PL
                this.fortuna.push(2103000);    // istruzioni lavoro 150PL
                this.fortuna.push(2102000);    // istruzioni lavoro 150PL
                this.fortuna.push(2732000);    // musica spettrale 100PL
                this.fortuna.push(2101000);    // istruzioni lavoro 75PL
                this.fortuna.push(2100000);    // istruzioni lavoro 75PL
                this.fortuna.push(2118000);    // istruzioni lavoro 50PL
                this.fortuna.push(2126000);    // istruzioni lavoro 50PL
                this.fortuna.push(1879000);    // cena gentiluomo 50PL
                this.fortuna.push(1998000);    // torta natalizia 50PL
                this.speciale.push(2482000);   // sacco pepite
                this.speciale.push(2485000);   // sacco riposo 10%R
                this.speciale.push(2484000);   // sacco motivazione 10%L 10%D
                this.speciale.push(21340000);  // riconoscimento pg 1 giorno
                this.speciale.push(21341000);  // riposo 1 giorno
                this.speciale.push(21343000);  // salario 1 giorno
                this.speciale.push(21342000);  // automatizzazione 1 giorno
                this.speciale.push(21345000);  // fanta-riposo 1 giorno + 100%

            },
        },
        localeManager: {
			localeDefault: 'en_US',
			localeScript: 'en_US',
			getMsg: function(msg) {
				if(undefined !== this.languages[this.localeScript][msg]) return this.languages[this.localeScript][msg];
				if(undefined !== this.languages[this.localeDefault][msg]) return this.languages[this.localeDefault][msg];
				return '';
			},
            checkLanguages: function() {
				var langs = Object.keys(this.languages), messages = Object.keys(this.languages[this.localeDefault]), that = this;
				$.each(messages, function(i, msg) {
					$.each(langs, function(j, lang) {
						if(!that.languages[lang].hasOwnProperty(msg)) console.log('Missing '+lang+'.'+msg);
						else if(typeof that.languages[that.localeDefault][msg] == "object") {
							$.each(Object.keys(that.languages[that.localeDefault][msg]), function(k, msg2) {
								if(!that.languages[lang][msg].hasOwnProperty(msg2)) console.log('Missing '+lang+'.'+msg+'.'+msg2);
							});
						}
					});
				});
				$.each(langs, function(i, lang) {
					$.each(Object.keys(that.languages[lang]), function(j, msg) {
						if(!messages.includes(msg)) console.log('Obsolete message '+lang+'.'+msg);
						else if(typeof that.languages[lang][msg] == "object") {
							$.each(Object.keys(that.languages[lang][msg]), function(j, msg2) {
								if(!that.languages[that.localeDefault][msg].hasOwnProperty(msg2)) console.log('Obsolete message '+lang+'.'+msg+'.'+msg2);
							});
						}
					});
				});
			},
			setLocale: function(localeSelected) {
				this.localeScript = (undefined !== this.languages[localeSelected]) ? localeSelected : this.localeDefault;
			},
            languages: {
				en_US: {
					description: '<h1>The West - Tamagotchi PG</h1><p style="margin: 8pt;">Add a Tamagothi Toolbar over your PG</p><p style="margin: 8pt;">You will be able to use consumables ordered by type:</p><p style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;">Energy, Live, Working points, Duels points, Speed, Luck, Special items</p><br><b>Click on the character to open this toolbar!</b><br>This script will replace also the "center character" button, so it will center your character even if it is walking on the map - double click to center to the old position (standard function in the west).</p><p style="margin: 8pt;"><b>Credits</b>: '+scriptCredits+'</p><p style="margin: 8pt;"><b>Options</b>: <span style="display: inline-block; vertical-align: middle;">[OPTIONS]</span></p>' + scriptList,
					version: 'version',
					version_checkFailed: 'Unable to check for updates',
					version_checkManual: 'Check manually',
					version_ok: 'You already have the latest version',
					version_upgrade: 'A new version is available. Do you want to upgrade now?',
					refresh: 'Refresh',
                    opt_hide0elements: 'Hide elements that are not in inventory',
                    menu_live : 'Live points',
                    menu_energy : 'Energy points',
                    menu_work : 'Work motivation',
                    menu_duel: 'Duel motivation',
                    menu_speed: 'Speed',
                    menu_luck: 'Luck',
                    menu_special: 'Special items',
                    menu_premium: 'Premium',
				},
                de_DE: {
					description: '<h1>The West - Tamagotchi PG</h1><p style="margin: 8pt;">Füge ein Tamagotchi-Menu zum PG hinzu</p><p style="margin: 8pt;">Somit kannst du einfach einsetzbare Elemente auswählen:</p><p style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;">Erholung, Leben, Arbeitsmotivation, Duellmotivation, Geschwindigkeit, Glück, Spezielle Elemente</p><br><b>Klicke auf dein Charakter um das Toolbar zu öffnen!</b><br>Dieser script ersetzt auch die Funktion "Charakter zentrieren", so wird er auch zentriert wenn er am laufen ist - mit doppel klick wird die vorherige Position zentriert (so wie es im Spiel üblich ist).</p><p style="margin: 8pt;"><b>Credits</b>: '+scriptCredits+'</p><p style="margin: 8pt;"><b>Opzioni</b>: <span style="display: inline-block; vertical-align: middle;">[OPTIONS]</span></p>' + scriptList,
					version: 'Version',
					version_checkFailed: 'kann keine Updates suchen',
					version_checkManual: 'Manuell suchen',
					version_ok: 'Du hast bereits die aktuelle Version',
					version_upgrade: 'Neue Version verfügbar, jetzt aktualisieren?',
					refresh: 'Aktualisieren',
                    opt_hide0elements: 'Verstecke die Einsetzbare elemente die nicht im Inventar sind',
                    menu_live : 'Lebenspunkte',
                    menu_energy : 'Erholungspunkte',
                    menu_work : 'Arbeitsmotivation',
                    menu_duel: 'Duellmotivation',
                    menu_speed: 'Geschwindigkeit',
                    menu_luck: 'Glück',
                    menu_special: 'Spezielle Elemente',
                    menu_premium: 'Premium',
				},
                es_ES: {
					description: '<h1>The West - Tamagotchi PJ</h1><p style="margin: 8pt;">Agrega una Barra de herramientas Tamagotchi sobre tu PJ</p><p style="margin: 8pt;">Podrá usar consumibles ordenados por tipo:</p><p style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;">Energía, Vida, Puntos Trabajo, Puntos Duelo, Velocidad, Suerte, Artículos Especiales</p><br><b>¡Haga clic en el personaje para abrir esta barra de herramientas!</b><br>Este script también reemplazará el botón "centrar personaje", incluso si está caminando sobre el mapa - haz doble clic sobre el para centrarlo en la posición anterior (función estándar en the west).</p><p style="margin: 8pt;"><b>Créditos</b>: '+scriptCredits+'</p><p style="margin: 8pt;"><b>Opciones</b>: <span style="display: inline-block; vertical-align: middle;">[OPCIONES]</span></p>' + scriptList,
					version: 'versión',
					version_checkFailed: 'No se pueden verificar las actualizaciones',
					version_checkManual: 'Comprobar manualmente',
					version_ok: 'Ya tienes la última versión',
					version_upgrade: 'Una nueva versión está disponible. ¿Deseas actualizar ahora?',
					refresh: 'Actualizar',
                    opt_hide0elements: 'Ocultar elementos que no están en el inventario',
                    menu_live : 'Puntos Vida',
                    menu_energy : 'Puntos Energía',
                    menu_work : 'Motivación Trabajo',
                    menu_duel: 'Motivación Duelo',
                    menu_speed: 'Velocidad',
                    menu_luck: 'Suerte',
                    menu_special: 'Artículos Especiales',
                    menu_premium: 'Premium',
				},
                it_IT: {
					description: '<h1>The West - Tamagotchi PG</h1><p style="margin: 8pt;">Aggiungi un menu in stile Tamagotchi al tuo PG</p><p style="margin: 8pt;">Potrai usare in modo semplice i consumabili ordinati per:</p><p style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;">Riposo, Vita, Motivazione lavoro, Motivazione duello, Velocità, Fortuna, Consumabili speciali</p><br><b>Clicca sul tuo personaggio per aprire la toolbar!</b><br>Questo script inoltre rimpiazza la funzione "centra personaggio", in questo modo verrà centrato anche quando sta camminando - con un doppio click verrà centrata la posizione precedente (predefinito nel gioco).</p><p style="margin: 8pt;"><b>Credits</b>: '+scriptCredits+'</p><p style="margin: 8pt;"><b>Opzioni</b>: <span style="display: inline-block; vertical-align: middle;">[OPTIONS]</span></p>' + scriptList,
					version: 'versione',
					version_checkFailed: 'impossibile cercare aggiornamenti',
					version_checkManual: 'Cerca manualmente',
					version_ok: 'Possiedi la versione più recente',
					version_upgrade: 'E\' disponibile una nuova versione, aggiornare ora?',
					refresh: 'Aggiorna',
                    opt_hide0elements: 'Nascondi gli elementi non presenti in inventario',
                    menu_live : 'Punti vita',
                    menu_energy : 'Punti riposo',
                    menu_work : 'Motivazione lavoro',
                    menu_duel: 'Motivazione duello',
                    menu_speed: 'Velocità',
                    menu_luck: 'Fortuna',
                    menu_special: 'Oggetti speciali',
                    menu_premium: 'Premium',
				},
                pl_PL: {
                    description: '<h1>The West - Tamagotchi PG</h1><p style="margin: 8pt;">Dodaje pasek Tomagotchi nad twoją postacią.</p><p style="margin: 8pt;">Będziesz miał szybszy dostęp do wzmocnień typu:</p><p style="list-style: disc outside; margin-left: 16pt; padding-left: 16pt;">Energia, Życie, Motywacja do prac, Motywacja do pojedynków, Prędkość, Szczęście, Specjalne przedmioty</p><br><b>Kliknij na swoją postać na mapie by otworzyć toolbar!</b><br>Ten skrypt zmienia działanie ,,pokaż postać na mapie", jeśli chcesz zobaczyć pozycje swojej postaci (nawet gdy jest w podróży), kliknij raz na "pokaż postać na mapie", podwójne kliknięcie spowoduje zadziałanie standardowej opcji.</p><p style="margin: 8pt;"><b>Podziękowania</b>: '+scriptCredits+'</p><p style="margin: 8pt;"><b>Opcje</b>: <span style="display: inline-block; vertical-align: middle;">[OPTIONS]</span></p>' + scriptList,
                    version: 'Wersja',
                    version_checkFailed: 'Sprawdzenie aktualizacji nie powiodło się.',
                    version_checkManual: 'Sprawdź ręcznie.',
                    version_ok: 'Masz najnowszą wersję skryptu.',
                    version_upgrade: 'Nowa wersja jest gotowa. Chcesz zaktualizować skrypt teraZ?',
                    refresh: 'Odśwież',
                    opt_hide0elements: 'Ukryj elementy, których nie posiadasz w ekwipunku.',
                    menu_live : 'Punkty życia',
                    menu_energy : 'Punkty energii',
                    menu_work : 'Motywacja do pracy',
                    menu_duel: 'Motywacja do pojedynków',
                    menu_speed: 'Prędkość',
                    menu_luck: 'Szczęście',
                    menu_special: 'Przedmioty specjalne',
                    menu_premium: 'Premium',
                },
            },
        },
        script: {
			api: null,
			listeningSignal: 'game_config_loaded',
			loaded: false,
			init: function() {
				var that = this;
				if(this.loaded) return false;
				EventHandler.listen(this.listeningSignal, function() {
					that.init();
					return EventHandler.ONE_TIME_EVENT;
				});
                $(".menulink.lcharacter").off('click').on('click', function (){
                    // replacing: "Map.center(Character.position);" with:
                    TamagotchiPG.toolbar.centerPGOnMap(false);
                    EventHandler.signal('button-clicked',['lcharacter']);
                });
				if(!!(Game && Game.loaded)) {
					this.loaded = true;
					TamagotchiPG.localeManager.setLocale(Game.locale);
					this.api = TheWestApi.register(scriptObject, scriptName, VERSION.toString(), Game.version.toString(), scriptAuthor, URL_INSTALL);
                    TamagotchiPG.options.init();
                    TamagotchiPG.powerItems.init();
                    TamagotchiPG.toolbar.init();
                    var j;
                    AnimatedCharacter.getElement()[0].addEventListener("click", function(e) {
                        e.preventDefault();
                        if(TamagotchiPG.toolbar.div1 !== null)
                        {
                            for(var h1 in TamagotchiPG.toolbar.div1.childNodes)
                            {
                                if(e.target == TamagotchiPG.toolbar.div1.childNodes[h1]) return TamagotchiPG.toolbar.closeDefault();
                                for(var h2 in TamagotchiPG.toolbar.div1.childNodes[h1].childNodes)
                                {
                                    if(e.target == TamagotchiPG.toolbar.div1.childNodes[h1].childNodes[h2]) return TamagotchiPG.toolbar.closeDefault();
                                    for(var h3 in TamagotchiPG.toolbar.div1.childNodes[h1].childNodes[h2].childNodes)
                                    {
                                        if(e.target == TamagotchiPG.toolbar.div1.childNodes[h1].childNodes[h2].childNodes[h3]) return TamagotchiPG.toolbar.closeDefault();
                                    }
                                }
                            }
                            try
                            {
                                AnimatedCharacter.getElement()[0].removeChild(TamagotchiPG.toolbar.div1);
                                TamagotchiPG.toolbar.div1 = null;
                                return TamagotchiPG.toolbar.closeDefault();
                            }
                            catch(err){}
                        }
                        var div3 = document.createElement("div");
                        div3.setAttribute("style", "width:305px;height:60px;display:block;margin-left:5px;overflow:hidden;");
                        var div2 = document.createElement("div");
                        div2.setAttribute("style", "width:3000px;max-height:60px;padding-left:0px;left:0px;position:relative;");
                        div3.appendChild(div2);
                        TamagotchiPG.toolbar.div1 = document.createElement("div");
                        TamagotchiPG.toolbar.div1.setAttribute("style", "width:330px;height:90px;border-radius:8px;border-style:ridge;border-width:2px;border-color:#a8a888;overflow:hidden;display:block;left:" + AnimatedCharacter.getElement()[0].style.left + ";top:" + AnimatedCharacter.getElement()[0].style.top + ";transform:translate(-140px,-174px);box-shadow:4px 4px 5px rgba(0,0,0,0.5);");
                        TamagotchiPG.toolbar.div1.className = "work hasMousePopup";
                        var divbg = document.createElement("div");
                        divbg.setAttribute("style", "opacity:0.8;width:330px;height:90px;position:absolute;left:0px;top:0px;border-radius:8px;background:linear-gradient(0deg, rgba(0,0,0,0.6), rgba(96,64,16,0.7)), url('https://westit.innogamescdn.com/images/tw2gui/groupframe/groupframe_bg.jpg');background-color:#4B2503;background-repeat:no-repeat;background-size:330px 90px;");
                        TamagotchiPG.toolbar.div1.appendChild(divbg);

                        var table = document.createElement("div");
                        table.setAttribute("style","cursor:pointer;display:table;margin:0 auto;text-align:center;");
                        if(TamagotchiPG.powerItems.subdivs.length > 0) TamagotchiPG.powerItems.subdivs =[];
                        for(var k=0;k<ITEMSGROUPS;k++)
                        {
                            var td = document.createElement("div");
                            var imgi = document.createElement("img");
                            td.setAttribute("style","width:24px;height:24px;opacity:0.6;margin:2px;display:inline-block;background-size:cover;");
                            td.addEventListener("click", TamagotchiPG.powerItems.createFunc2(k, div2));
                            imgi.setAttribute("src", TamagotchiPG.toolbar.menuicons[k]);
                            imgi.setAttribute("style", "width:16px;height:16px;margin:0px;padding:2px;padding-top:2px;border-radius:2px;border-style:outset;border-width:1px;");
                            imgi.className = "tw_item item_inventory_img dnd_draggable";
                            imgi.setAttribute("title", TamagotchiPG.toolbar.menutitles[k]);
                            td.appendChild(imgi);
                            td.className = "item item_inventory title hasMousePopup";
                            TamagotchiPG.powerItems.subdivs.push(td);
                            table.appendChild(td);
                        }
                        TamagotchiPG.toolbar.div1.appendChild(table);
                        /* Center Character */
                        TamagotchiPG.toolbar.centerPGOnMap(true);

                        table = document.createElement("div");
                        table.setAttribute("style","cursor:pointer;font-size:18px;position:absolute;display:block;margin-left:310px;width:16px;");
                        for(k=0;k<2;k++)
                        {
                            var tx = document.createElement("div");
                            if(k==0)
                            {
                                tx.className = "bag_next bag_control";
                                tx.setAttribute("style","width:15px;height:24px;background-image:url('https://westit.innogamescdn.com/images/window/trader/arrows.png');background-position:top right;color:white;padding:0px;margin-top:4px;padding-top:3px;padding-right:2px;display:block;background-size:cover;text-align:center;");
                                tx.addEventListener("click", function(){TamagotchiPG.powerItems.move(+5,div2);});
                            }
                            else
                            {
                                //tx.className = "item item_inventory title hasMousePopup";
                                tx.className = "bag_previous bag_control";
                                tx.setAttribute("style","width:15px;height:24px;background-image:url('https://westit.innogamescdn.com/images/window/trader/arrows.png');background-position:top left;color:white;padding:0px;margin-bottom:4px;padding-top:3px;padding-left:2px;display:block;background-size:cover;text-align:center;");
                                tx.addEventListener("click", function(){TamagotchiPG.powerItems.move(-5,div2);});
                            }
                            table.appendChild(tx);
                        }
                        TamagotchiPG.toolbar.div1.appendChild(table);

                        TamagotchiPG.powerItems.showItems(6, TamagotchiPG.powerItems.speciale, div2);
                        TamagotchiPG.toolbar.div1.appendChild(div3);

                        AnimatedCharacter.getElement()[0].appendChild(TamagotchiPG.toolbar.div1);
                        return TamagotchiPG.toolbar.closeDefault();
                    });
				}
			},
		},
    };
    $(function() { try { TamagotchiPG.script.init(); } catch(x) { console.trace(x); } });
});
