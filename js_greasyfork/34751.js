// ==UserScript==
// @name          Eternity Tower Mining Details
// @icon          https://www.eternitytower.net/favicon.png
// @namespace     http://mean.cloud/
// @version       1.04
// @description   Adds mining details to the UI for the Eternity Tower game
// @match         http*://*.eternitytower.net/*
// @copyright     2017, MeanCloud
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/34751/Eternity%20Tower%20Mining%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/34751/Eternity%20Tower%20Mining%20Details.meta.js
// ==/UserScript==

function addJQuery(callback)
{
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function()
                            {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

function main()
{
    jQ("head").append
    (
        "<style type=\"text/css\">\r\n" +
        ".ET_tooltip {\r\n" +
        "    position: relative;\r\n" +
        "    display: inline-block;\r\n" +
        "}\r\n" +
        "\r\n" +
        ".ET_tooltip .ET_tooltiptext {\r\n" +
        "    visibility: hidden;\r\n" +
        "    width: 120px;\r\n" +
        "    background-color: #555;\r\n" +
        "    color: #fff;\r\n" +
        "    text-align: center;\r\n" +
        "    border-radius: 6px;\r\n" +
        "    padding: 5px 0;\r\n" +
        "    position: absolute;\r\n" +
        "    z-index: 1;\r\n" +
        "    bottom: 125%;\r\n" +
        "    left: 50%;\r\n" +
        "    margin-left: -60px;\r\n" +
        "    opacity: 0;\r\n" +
        "    transition: opacity 1s;\r\n" +
        "}\r\n" +
        "\r\n" +
        ".ET_tooltip .ET_tooltiptext::after {\r\n" +
        "    content: \"\";\r\n" +
        "    position: absolute;\r\n" +
        "    top: 100%;\r\n" +
        "    left: 50%;\r\n" +
        "    margin-left: -5px;\r\n" +
        "    border-width: 5px;\r\n" +
        "    border-style: solid;\r\n" +
        "    border-color: #555 transparent transparent transparent;\r\n" +
        "}\r\n" +
        "\r\n" +
        ".ET_tooltip:hover .ET_tooltiptext {\r\n" +
        "    visibility: visible;\r\n" +
        "    opacity: 1;\r\n" +
        "</style>\r\n" +
        "}\r\n"
    );

    // Set background tasks
    setTimeout(document.ET_fnRender, 1000);
}

document.ET_fnRender = function()
{
    Meteor.connection._stream.on('message', function(sMeteorRawData)
    {
        try
        {
            var oMeteorData = JSON.parse(sMeteorRawData);
            //console.log('collcetions: ' + oMeteorData.collection);

            if (oMeteorData.collection == "mining")
            {
                //console.log(oMeteorData.collection);
                document.ET_Stat_UserMiningAttack = oMeteorData.fields.stats.attack;
            }

        }
        catch (err) { }
    });

    jQ(".ET_extradetails").remove();

    jQ("div.mine-space-container").css("backgroundColor", "");

    jQ("div.mine-space-container > img").each(function()
                                              {
        function trim(str, charlist)
        {
            charlist = !charlist ? " \s\r\n\t\xA0\x0B\0" :
            charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, "\$1");

            var re = new RegExp("^[" + charlist + "]+|[" + charlist + "]+$", "g");

            return str.replace(re, '');
        }
        var oParent = jQ(this).parent();
        var sHTML   = oParent.html();

        var iCurDmgMining = document.ET_Stat_UserMiningAttack;

        var sType = document.ChopperBlank(sHTML, "/icons/", ".");
        var sSpanVal = document.ChopperBlank(sHTML, '<span style="font-size: 12px; white-space: nowrap">', '</span>');
        var sHealth = trim(sSpanVal.split(' / ')[0]);
        sHealth = sHealth.indexOf('k')!=-1 ? parseInt(parseFloat(sHealth.substring(0, sHealth.length - 1))*1000) : parseInt(sHealth);
        var sMaxHealth = trim(sSpanVal.split(' / ')[1]);
        sMaxHealth = sMaxHealth.indexOf('k')!=-1 ? parseInt(parseFloat(sMaxHealth.substring(0, sMaxHealth.length - 1))*1000) : parseInt(sMaxHealth);
        //console.log(oDmgMining.html());

        if (sType.length > 0)
        {
            if (sType.indexOf("Cluster") !== -1)
                sType = document.ChopperBlank(sType, "", "Cluster");

            sType = sType.toLowerCase();

            if      (sType == "gem")      sType = "GEM";
            else if (sType == "stone")    sType = "STONE";
            else if (sType == "copper")   sType = "COPPER";
            else if (sType == "coal")     sType = "COAL";
            else if (sType == "tin")      sType = "TIN";
            else if (sType == "bronze")   sType = "BRONZE";
            else if (sType == "iron")     sType = "IRON";
            else if (sType == "silver")   sType = "SILVER";
            else if (sType == "gold")     sType = "GOLD";
            else if (sType == "carbon")   sType = "CARBON";
            else if (sType == "steel")    sType = "STEEL";
            else if (sType == "platinum") sType = "PLATINUM";
            else if (sType == "titanium") sType = "TITANIUM";
            else if (sType == "tungsten") sType = "TUNGSTEN";
            else if (sType == "obsidian") sType = "OBSIDIAN";
            else if (sType == "cobalt")   sType = "COBALT";

            else if (sType == "silveressence")   sType = "ESSENCE (silver)";
            else if (sType == "goldessence")     sType = "ESSENCE (gold)";
            else if (sType == "carbonessence")   sType = "ESSENCE (carbon)";
            else if (sType == "steelessence")    sType = "ESSENCE (steel)";
            else if (sType == "platinumessence") sType = "ESSENCE (platinum)";
            else if (sType == "titaniumessence") sType = "ESSENCE (titanium)";
            else if (sType == "tungstenessence") sType = "ESSENCE (tungsten)";
            else if (sType == "obsidianessence") sType = "ESSENCE (obsidian)";
            else if (sType == "cobaltessence")   sType = "ESSENCE (cobalt)";

            else if (sType == "jade")     sType = "GEM (jade)";
            else if (sType == "lapis")    sType = "GEM (lapis)";
            else if (sType == "sapphire") sType = "GEM (sapphire)";
            else if (sType == "ruby")     sType = "GEM (ruby)";
            else if (sType == "emerald")  sType = "GEM (emerald)";

            else sType = sType.toUpperCase();

            oParent.append("<div class=\"ET_extradetails\" style=\"font-size: 10px; margin-top: -14px; margin-bottom: 4px;\"><br />" + sType + "</div>");

            if      (sType == "GEM")                                                          oParent.css("backgroundColor", "#e7cff7");
            else if (sHealth < iCurDmgMining)                                                 oParent.css("backgroundColor", "#05a3a3");
            else if (sHealth < (iCurDmgMining*10))                                            oParent.css("backgroundColor", "RGB("+(125-(((sHealth/iCurDmgMining)/10)*125)+130)+", 0, 0)");
            //else if (sHealth < 30)                                                          oParent.css("backgroundColor", "#d3d1d6");
            //else if (sType == "STONE")                                                      oParent.css("backgroundColor", "#d3d1d6");
            //else if (sType == "COAL")                                                       oParent.css("backgroundColor", "#b9b4b2");
            else if (sType.indexOf("ESSENSE") !== -1)                                         oParent.css("backgroundColor", "#f9e9c7");
            else if (sType.indexOf("GEM (") !== -1)                                           oParent.css("backgroundColor", "#ccf9c7");
        }
    });

    setTimeout(document.ET_fnRender, 1000);
};

document.ChopperBlank = function (sText, sSearch, sEnd)
{
    var sIntermediate = "";

    if (sSearch === "")
        sIntermediate = sText.substring(0, sText.length);
    else
    {
        var iIndexStart = sText.indexOf(sSearch);
        if (iIndexStart === -1)
            return "";

        sIntermediate = sText.substring(iIndexStart + sSearch.length);
    }

    if (sEnd === "")
        return sIntermediate;

    var iIndexEnd = sIntermediate.indexOf(sEnd);

    return (iIndexEnd === -1) ? sIntermediate : sIntermediate.substring(0, iIndexEnd);
};

addJQuery(main);