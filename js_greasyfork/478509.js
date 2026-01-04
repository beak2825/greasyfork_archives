// ==UserScript==
// @name         Bangumi 译名次要化或删除
// @namespace    https://github.com/2Jelly2/Make-Translated-Names-Secondary-or-Removed-on-Bangumi
// @version      0.16
// @icon         https://bgm.tv/img/favicon.ico
// @description  Make Translated Names Secondary or Removed on Bangumi.
// @author       時計坂しぐれ
// @supportURL   https://github.com/2Jelly2/Make-Translated-Names-Secondary-or-Removed-on-Bangumi/issues

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand

// @match        https://chii.in/*
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*

// @downloadURL https://update.greasyfork.org/scripts/478509/Bangumi%20%E8%AF%91%E5%90%8D%E6%AC%A1%E8%A6%81%E5%8C%96%E6%88%96%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/478509/Bangumi%20%E8%AF%91%E5%90%8D%E6%AC%A1%E8%A6%81%E5%8C%96%E6%88%96%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==
(
    function()
    {
        'use strict';

        const url = location.href;
        const keys = GM_listValues();

        if (!keys.includes("extinctionMode"))
        {
            GM_setValue("extinctionMode", false);
        }

        // Exchange original title names and translated ones
        // - with *false* to enable Exchange Mode. (default)
        // Remove translated title names completely, instead of exchange them with original ones
        // - with *true* to enable Distinction Mode;
        const extinctionMode = GM_getValue("extinctionMode");

        GM_registerMenuCommand("Extinction Mode: " + (extinctionMode ? "🟢Enabled" : "⚪Disabled"), function(event) {
            GM_setValue("extinctionMode", !extinctionMode);
            location.reload();
        });

        if (url.match(/(chii.in|bgm.tv|bangumi.tv)*(\/|\/timeline)$/) != null)
        {
            modifyHomePage();
            monitorTo(modifyCards);
        }
        else if (url.match(/(chii.in|bgm.tv|bangumi.tv)\/subject\//) != null)
        {
            modifySubjectPage();
        }
        else if (url.match(/(chii.in|bgm.tv|bangumi.tv)\/mono$/) != null)
        {
            modifyMonoPage();
        }
        else if (url.match(/(chii.in|bgm.tv|bangumi.tv)\/(person|character)\/[0-9]+/) != null)
        {
            if (url.match(/(chii.in|bgm.tv|bangumi.tv)\/(person|character)\/[0-9]+\/works(\?.*)?$/) != null)
            {
                modifyItems();
                modifyPersonPage();
            }
            else
            {
                modifyPersonPage();
            }
        }
        else
        {
            modifyItems();
        }

        function monitorTo(func)
        {
            func();
            const observer = new MutationObserver(function (mutations){func();});
            observer.observe(document.body, { childList: true, subtree: true });
        }


        function modifyCards()
        {
            var cards = document.getElementsByClassName("card");

            for (var i = 0; i < cards.length; i++)
            {
                var card = cards[i];
                var info = card.parentElement.getElementsByTagName("a")[1];
                var subtitle = card.getElementsByClassName("subtitle")[0];

                if (card.getAttribute("ignore") == null)
                {
                    var title = card.getElementsByClassName("title")[0].getElementsByTagName("a")[0];

                    if (info.getAttribute("data-subject-name") != null)
                    {
                        title.innerText = info.getAttribute("data-subject-name");
                    }
                    else if(subtitle.innerText != "")
                    {
                        title.innerText = subtitle.innerText;
                    }
                    card.setAttribute("ignore", true);
                }
            }
        }

        function modifyItems()
        {
            var subjects = document.querySelectorAll("li.item");

            for (var i = 0; i < subjects.length; i++)
            {
                var subject = subjects[i].getElementsByTagName("h3")[0];

                var subtitle_element = subject.getElementsByTagName("small")[0];
                if (subtitle_element != null)
                {
                    var title_element = subject.getElementsByTagName("a")[0];
                    var translated_name = title_element.innerText;
                    title_element.innerText = subtitle_element.innerText;
                    if (!extinctionMode)
                    {
                        subtitle_element.innerText = translated_name;
                    }
                    else
                    {
                        subtitle_element.parentElement.removeChild(subtitle_element);
                    }
                }
            }
        }

        function modifyPersonPage()
        {
            if (extinctionMode)
            {
                removeTranslatedNameFromInfobox();
                removeSmallTaggedElement(document.querySelectorAll("h1.nameSingle")[0]);

                var subjects = document.querySelectorAll("li.item");
                for (var i = 0; i < subjects.length; i++)
                {
                    removeSmallTaggedElement(subjects[i].getElementsByClassName("inner")[0]);
                }
            }
        }

        function modifySubjectPage()
        {
            if (extinctionMode)
            {
                removeTranslatedNameFromInfobox();
                removeTranslatedNameFromEpisodePopup();

                var sections = document.getElementsByClassName("subject_section");
                for (let i = 0; i < sections.length; i++)
                {
                    removePopupAttributes(sections[i].getElementsByClassName("avatar"));
                }

                var character_boxes = document.getElementsByClassName("user");
                for (let i = 0; i < character_boxes.length; i++)
                {
                    var character = character_boxes[i].getElementsByClassName("tip_j")[0];
                    character.removeChild(character.getElementsByClassName("tip")[0]);
                    character.removeChild(character.getElementsByTagName("br")[0]);
                }
            }
        }

        function modifyHomePage()
        {
            if (extinctionMode)
            {
                removeTranslatedNameFromEpisodePopup();

                var cover_lists = document.getElementsByClassName("coverList");
                for (let i = 0; i < cover_lists.length; i++)
                {
                    var covers = cover_lists[i].getElementsByClassName("thumbTip");
                    for (let j = 0; j < covers.length; j++)
                    {
                        var text = covers[j].getAttribute("data-original-title").split("<br /><small>", 1)[0];
                        covers[j].setAttribute("data-original-title", text);
                    }
                }

                var watching_subject_titles = document.getElementsByClassName("headerInner");
                for (let i = 0; i < watching_subject_titles.length; i++)
                {
                    removePopupAttributes(watching_subject_titles[i].getElementsByClassName("textTip"));
                }

                removePopupAttributes(document.querySelectorAll("a.subjectItem.title.textTip"));
            }
        }

        function modifyMonoPage()
        {
            if (extinctionMode)
            {
                var cover_lists = document.getElementsByClassName("coversSmall");
                for (let i = 0; i < cover_lists.length; i++)
                {
                    var entities = cover_lists[i].getElementsByTagName("li");
                    for (let j = 0; j < entities.length; j++)
                    {
                        removeSmallTaggedElement(entities[j].getElementsByClassName("info")[0]);
                    }
                }
            }
        }

        function removeTranslatedNameFromEpisodePopup()
        {
            var ep_popups = document.getElementsByClassName("prg_popup")
            for (let i = 0; i < ep_popups.length; i++)
            {
                var popup = ep_popups[i].getElementsByClassName("tip")[0];
                if (popup.innerText.startsWith("中文标题:"))
                {
                    var translated_text = popup.innerHTML.split("<br>", 1)[0];
                    popup.innerHTML = popup.innerHTML.replace(translated_text + "<br>", "");
                }
            }
        }

        function removeTranslatedNameFromInfobox()
        {
            var infobox_1st_map = document.getElementById("infobox").getElementsByTagName("li")[0];
            if (infobox_1st_map.getElementsByClassName("tip")[0].innerText.endsWith("中文名: "))
            {
                infobox_1st_map.parentElement.removeChild(infobox_1st_map);
            }
        }

        function removeSmallTaggedElement(outerElement)
        {
            var elementsTaggedWithSmall = outerElement.getElementsByTagName("small");
            if (elementsTaggedWithSmall.length > 0)
            {
                outerElement.removeChild(elementsTaggedWithSmall[0]);
            }
        }

        function removePopupAttributes(elementCollection)
        {
            for (var i = 0; i < elementCollection.length; i++)
            {
                elementCollection[i].removeAttribute("data-original-title");
            }
        }
    }
)();
