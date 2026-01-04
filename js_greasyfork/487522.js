// ==UserScript==
// @name         VoiceMap Tour Editor Additions
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  avoid leaving page without saving changes, enable preview button, and scroll current location (in both map and script view) into view to avoid excessive scrolling and searching. Also adds a setting "Publishing Mode", which, when disabled, prevents you from accidentally publishing a script instead of saving it. Load at least 100 locations in bulk editing mode, add a button to generate computer voice for all locations
// @author       Kiki
// @license      MIT
// @match        https://voicemap.me/mapmaker/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=voicemap.me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487522/VoiceMap%20Tour%20Editor%20Additions.user.js
// @updateURL https://update.greasyfork.org/scripts/487522/VoiceMap%20Tour%20Editor%20Additions.meta.js
// ==/UserScript==

/* globals jQuery, $ */

(function() {
    'use strict';
    //window.onload = doItAll;
    window.setTimeout(doItAll, 2000);
})();

function doItAll()
{
    if (window.location.href.indexOf("/scripts") > -1)
    {
        enablePreview();
        showHidePublishButton();
        createPublishingModeSetting();
        highlightCurrentScript();
    }

    if (window.location.href.indexOf("/map-locations") > -1)
    {
        watchForNewSelection();
    }

    if(window.location.href.indexOf("overview") > -1)
    {
        if(applyBulkEditingLimit())
        {
            addBulkGenerateVoiceButton();
        }
    }
}

function enablePreview()
{
    var x = document.querySelector('span.isDisabled.text-gray-600:has(> a g[id="preview-icon"])');
    if(x != null)
    {
        x.classList.remove("isDisabled");
        x.classList.remove("text-gray-600");
    }
}

function protectMyChanges()
{
    $('textarea.sound_bite_text').bind('input propertychange', function()
    {
        $(window).on("beforeunload", function() { return true; });
    });
    $('input.btn.btn-save-location').on("click", function()
    {
        $(window).off("beforeunload");
    });
    $('input.btn.btn-danger.save_submit').on("click", function()
    {
        $(window).off("beforeunload");
    });
}

function highlightCurrentScript()
{
    // show the list
    console.log('show sidebar');
    $('#map-location').find('.sidebar').toggleClass("collapsed");
    $('#map-location').find('.form-sound-bite').toggleClass("extend");
    console.log('show sidebar - done');

    //move to the current one
    var card = $('#map-location .card-location.active .mask');
    if(card != null && card instanceof jQuery && card.length > 0)
    {
        card[0].scrollIntoView({ behavior: "instant", block: "nearest", inline: "nearest" });
    }
    else
    {
        console.log("no highlight");
    }
}

function watchForNewSelection()
{
    var observer = new MutationObserver(function(mutations)
        {
            for (let mutation of mutations)
            {
                var elem = $(mutation.target);
                if (elem.hasClass('active'))
                {
                    elem[0].scrollIntoView({ behavior: "instant", block: "nearest", inline: "nearest" });
                    break;
                }
            }
        });
    observer.observe($('#map-location')[0], { subtree: true, attributes: true, attributeFilter: ['class'] });
    console.log("observing");
}

//////////////////////////////
// Publishing Mode

function createPublishingModeSetting()
{
  const newDiv = document.createElement("div");
  // use predefined class for better layout
  newDiv.classList.add("btn");
  newDiv.innerHTML = `
    <div style="display:inline-block;">Publishing Mode:&nbsp;</div>
    <div style="display:inline-block;">
      <label class="switch">
        <input id="cbPublishingMode" type="checkbox" ${ (getCookie('PublishingMode') === 'true') ? 'checked' : '' } >
        <span class="slider round"></span>
      </label>
    </div>
  `;
  const parent = document.querySelector('div.btn-group');
  parent.appendChild(newDiv);
  // add handler
  const cb = document.querySelector('input#cbPublishingMode');
  cb.addEventListener("change", publishingModeChanged);
}

function publishingModeChanged(event)
{
  setCookie('PublishingMode', event.currentTarget.checked);
  showHidePublishButton();
}

function showHidePublishButton()
{
  const btn = document.querySelector('.btn-danger.save_submit');
  if(btn != null)
  {
    if(getCookie('PublishingMode') === "true")
    {
      btn.classList.remove('d-none');
    }
    else
    {
      btn.classList.add('d-none');
    }
  }
}

function setCookie(name, value, expireInDays = 30)
{
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + expireInDays);
  document.cookie = `${name}=${value}; expires=${expiry.toUTCString()}; path=/`;
}

function deleteCookie(name)
{
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function getCookie(name)
{
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
  {
    return parts.pop().split(';').shift();
  }
}

/////////////////////////////////////////
// bulk editing page
function applyBulkEditingLimit()
{
    if(document.querySelector("a#dropdown-limit-locations span").innerText < 100)
    {
        document.location.href = document.location.href.split('?')[0] + "?limit=100";
        return false;
    }

    return true;
}

function addBulkGenerateVoiceButton()
{
    if(document.querySelector("button#btnVoice") == null)
    {
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `
            <button id="btnVoice" class="btn" type="button" style="margin-left: 10px;">Generate ALL Speech</button>
          `;
        const parent = document.querySelector('div.card div.d-flex');
        parent.appendChild(newDiv);
        // add handler
        const btn = document.querySelector('button#btnVoice');
        btn.addEventListener("click", generateVoice);
    }
}

function generateVoice()
{
    if(!confirm('Do you really want to create speech for ALL locations?\nThis will take a while.'))
    {
       return;
    }

    var soundBiteInputs = document.querySelectorAll("input.checkbox-select-sound-bite");
    var soundBites = [];
    soundBiteInputs.forEach((a) => { soundBites.push(a.value);});

    var authenticity_token = document.querySelector('input[name="authenticity_token"]').value;

    var data =
        {
            "utf8": "✓",
            "authenticity_token": authenticity_token,
            "action_type": "text_to_speech",
            "sound_bite_ids": soundBites.join(',')
        };

    $.post(document.location.href, data, (data, status) => { console.log("generateVoice status: " + status); });

    alert('Speech is being generated, please be patient.');
}
