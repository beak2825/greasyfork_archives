// ==UserScript==
// @name                ManifestCSV
// @description         Convert Hermes manifest to CSV
// @include             https://courierportal.hermescloud.co.uk/*
// @grant               none
// @version             0.4
// @namespace https://greasyfork.org/users/2391
// @downloadURL https://update.greasyfork.org/scripts/407773/ManifestCSV.user.js
// @updateURL https://update.greasyfork.org/scripts/407773/ManifestCSV.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

const AddCSV =
{
    csvLines: [],
    scrollY: -1,
    scrollAttempts: 0,
    overlay: null,
    createOverlay: function()
    {
        AddCSV.overlay = document.createElement('div');
        AddCSV.overlay.id = 'AddCSV_Overlay';

        AddCSV.overlay.style.position = "fixed";
        AddCSV.overlay.style.display = "block";
        AddCSV.overlay.style.width = "100%";
        AddCSV.overlay.style.height = "100%";
        AddCSV.overlay.style.top = 0;
        AddCSV.overlay.style.left = 0;
        AddCSV.overlay.style.right = 0;
        AddCSV.overlay.style.bottom = 0;
        AddCSV.overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
        AddCSV.overlay.style.zIndex = 2;
        AddCSV.overlay.innerHTML = '<p style="color: yellow; font-size: 64px">Loading manifest, please wait...</p>';
        document.body.appendChild(AddCSV.overlay);
    },
    init: function()
    {
        if
        (
            (document.getElementById('manifest-summary-button') != null) && 
            (document.getElementsByName('round-id').length != 0) && 
            (document.getElementsByName('manifest').length != 0)
        )
        {
            var tBtn = document.createElement('i');
            tBtn.className = "btn btn-primary";
            tBtn.id = "saveAsCSV";
            tBtn.innerText = "Save as CSV";
            document.getElementsByClassName('card__body')[0].append(tBtn);
            tBtn.addEventListener("click", AddCSV.loadManifest);
        }
        else
        {
            window.setTimeout(AddCSV.init, 500);
        }
    },
    loadManifest: function()
    {
        AddCSV.createOverlay();
        AddCSV.scrollY = -1;
        AddCSV.scrollAttempts = 0;
        AddCSV.scrollToEnd();
        return false;
    },
    scrollToEnd: function()
    {
        // Reset the scroll attempts counter if we were able to scroll further down the page last time around,
        // OR if we're at the end but the "loading more data" wibbly dots are being displayed...
        if((window.scrollY != AddCSV.scrollY) || (document.getElementsByClassName('loading-dots').length != 0))
        {
            AddCSV.scrollY = window.scrollY;
            AddCSV.scrollAttempts = 0;
        }
        if(++AddCSV.scrollAttempts < 3)
        {
            window.scrollBy(0, 1000);
            window.setTimeout(AddCSV.scrollToEnd, 100);
            return;
        }
        window.scrollTo(0,0);
        AddCSV.process();
    },
    getFormattedType: function(rawType)
    {
        var retval = '';
        if(rawType == 'CL')
        {
            retval += 'COL, Collection';
        }
        else
        {
            retval += 'DEL, ';
            if(rawType == '01') retval += 'Packet/C2C Small';
            else if(rawType == '02') retval += 'Standard';
            else if(rawType == '03') retval += 'Heavy/Large';
            else if(rawType == '04') retval += 'Heavy';
            else if(rawType == '05') retval += 'Hanging';
            else if(rawType == '06') retval += 'Small';
            else if(rawType == '07') retval += 'Medium';
            else if(rawType == '08') retval += 'Postable';
            else retval += 'Unknown';
        }
        retval += ' ('+rawType+')';
        return retval;
    },
    saveToFile: function()
    {
        const a = document.createElement('a');
        var outData = '';

        var currentRoundIdx = document.getElementsByName('round-id')[0].selectedIndex;
        var currentManifestIdx = document.getElementsByName('manifest')[0].selectedIndex;

        var filename = 'manifest ';
        filename += document.getElementsByName('round-id')[0].options[currentRoundIdx].innerText.trim();
        filename += ' ';
        filename += document.getElementsByName('manifest')[0].options[currentManifestIdx].innerText.trim();
        filename += '.csv';

        for(var i =0; i < AddCSV.csvLines.length; ++i)
        {
            outData += AddCSV.csvLines[i] + '\r\n';
        }
        const file = new Blob([outData], {type: 'text/plain'});
        a.href= URL.createObjectURL(file);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    },
    process: function()
    {
        AddCSV.overlay.style.display = "none";
        var entries = document.getElementsByClassName('data-row').length;
        if(entries > 0)
        {
            AddCSV.csvLines = [];
            var tLine = '';
            for(var i = 0; i < entries; ++i)
            {
                var tRowObj = document.getElementsByClassName('data-row')[i];
               var tRowBits = tRowObj.getElementsByTagName('li');

                tLine = '\t';

                // fix for the new "remanifested" barcode entries
                var tBarcode = tRowBits[0].innerText;
                tBarcode = tBarcode.split('\n');
                tLine += tBarcode[1];
                if(tBarcode[0].indexOf('Remanifested') != -1)
                {
                   tLine += ' (R)';
                }
                tLine += ',';

                tLine += tRowBits[1].getElementsByClassName('data-row-item__value')[0].innerText + ',';
                tLine += tRowBits[2].getElementsByClassName('data-row-item__value')[0].innerText + ',';
                var tService = tRowBits[3].getElementsByClassName('data-row-item__value')[0].innerText;
                tService = tService.replace(',','/');
                tLine += tService + ',';
                var tType = tRowBits[4].getElementsByClassName('data-row-item__value')[0].innerText;
                tLine += tType; //AddCSV.getFormattedType(tType);
                AddCSV.csvLines.push(tLine);
            }

            AddCSV.saveToFile();
        }
    }
};

AddCSV.init();