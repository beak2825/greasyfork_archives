// ==UserScript==
// @name         Google Calendar Modifcations
// @namespace    https://github.com/ThomasTerp
// @version      0.1
// @description  Various modifications for Google Calendar.
// @author       Thomas Terp
// @match        https://calendar.google.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393484/Google%20Calendar%20Modifcations.user.js
// @updateURL https://update.greasyfork.org/scripts/393484/Google%20Calendar%20Modifcations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastSelectedCalendar;

    function getSelectedCalendarName()
    {
        return $("div.MocG8c.LMgvRb.KKjvXb > span > div > div.Z7IIl.jT5e9").html();
    }

    function getTitle()
    {
        return $("div.ZX9XLb > div.mvRfff > div > div.aCsJod.oJeWuf > div > div.Xb9hP > input").val();
    }

    function setTitle(title)
    {
        $("div.ZX9XLb > div.mvRfff > div > div.aCsJod.oJeWuf > div > div.Xb9hP > input").val(title).focus();
        $("div.mvRfff > div > div.aCsJod.oJeWuf > div > div.Xb9hP > div")[title === "" ? "show" : "hide"]();
    }

    function hideExtraVaribles()
    {
        $("div.mrslJ.ZjAUM.YzQjIf").hide();
        $("#tabEvent > div > div.AHjck.dBA1M.sUvU0d").hide();
        $("#tabEvent > div > div.AZLU4c.BVTBSc.sUvU0d").hide();
        $("#tabEvent > div > div:nth-child(4)").hide();
    }

    function showExtraVaribles()
    {
        $("div.mrslJ.ZjAUM.YzQjIf").show();
        $("#tabEvent > div > div.AHjck.dBA1M.sUvU0d").show();
        $("#tabEvent > div > div.AZLU4c.BVTBSc.sUvU0d").show();
        $("#tabEvent > div > div:nth-child(4)").show();
    }

    function onSelectedCalendarNameChanged(calendarName)
    {
        if(calendarName === "Varme")
        {
            setTitle("Varme");
            hideExtraVaribles();
        }
        else
        {
            if(getTitle() == "Varme")
            {
                setTitle("")
            }

            showExtraVaribles()
        }
    }

    $(document).on("click", () =>
    {
        setTimeout(() =>
        {
            const selectedCalendarName = getSelectedCalendarName();

            if(getSelectedCalendarName() !== lastSelectedCalendar)
            {
                onSelectedCalendarNameChanged(selectedCalendarName);

                lastSelectedCalendar = selectedCalendarName;
            }
        }, 200);

        setTimeout(() =>
        {
            if(typeof getSelectedCalendarName() === "undefined")
            {
                lastSelectedCalendar = undefined;
            }
        }, 1000);
    });
})();
