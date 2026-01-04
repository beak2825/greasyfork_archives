// ==UserScript==
// @name		Take my Plus
// @author		Frubi
// @description:de	Gibt ausgewählen Nutzern automatisch Plus
// @include		*://pr0gramm.com/*
// @grant       none
// @version		1.0.1
// @namespace https://greasyfork.org/users/158955
// @description Gibt ausgewählen Nutzern automatisch Plus
// @downloadURL https://update.greasyfork.org/scripts/35375/Take%20my%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/35375/Take%20my%20Plus.meta.js
// ==/UserScript==

let settings =
{
    isActive: false,
    users: [],
    rateComments: true,
    rateUpload: true
};


let checkPageReady;
let checkURL = function()
{
    clearInterval(checkPageReady);
    if(url.length > 24)
    {
        checkPageReady = setInterval(function()
        {
            if($('.comments').length != 0)
            {
                clearInterval(checkPageReady);
                if(settings.isActive)
                    executeModules();
            }
            else if($('.tab-bar').length != 0 && $('.takeMyPlus').length == 0 && url.includes('settings'))
            {
                clearInterval(checkPageReady);
                addSettingsTab();
            }
        },10);
    }
}

let readSettings = function()
{
    let temp = JSON.parse(localStorage.getItem("TakeMyPlus_Settings"));
    if(temp != null)
    {
        settings = temp;
    }
}

let addSettingsTab = function()
{
    let tmp = $('.takeMyPlus');
    if(tmp.length != 0)
    {
        return;
    }
    let button = document.createElement('a');
    button.innerText = 'TakeMyPlus';
    button.className = "takeMyPlus";
    button.href = '/settings/takeMyPlus';
    $(button).click(function(e)
    {
        e.preventDefault();
        window.history.replaceState({},"Selfmade M0d Settings","/settings/takeMyPlus");
        createSettings();
    });
    $('.tab-bar')[0].appendChild(button); 
}

let createSettings = function()
{
    $('.pane.form-page').empty();
    
    $('.active').toggleClass('active');
    $('.takeMyPlus').addClass('active');
    
    let settingsPageContent = `
    <div class='form-section'>
        <div class='takeMyPlus' id='tmp'>
            <input type="checkbox" class="box-from-label" name="active" >
                <label for="active"> Aktiv </label>
            Nutzerliste:<br>
            <div style='margin-top:5px'></div>
            <input placeholder='nutzer1,nutzer2,nutzer3,...' title='Nutzer mit Komma trennen!'></input>
            <input type="checkbox" class="box-from-label" name="rateComments" >
                <label for="rateComments"> Kommentare bewerten </label>
            <input type="checkbox" class="box-from-label" name="ratePost" >
                <label for="ratePost"> Bild bewerten </label>
        </div>
        <br>
        <div class="takeMyPlus" id='save'>
            <input type="submit" value="Speichern" class="confirm settings-save"></input>
        </div>
        <br>
        <div class='takeMyPlus' id='reset'>
            <a class='action clear-settings-button'>Einstellungen zurücksetzen</a>
        </div>
    </div>       
    `

    $('.pane.form-page').append(settingsPageContent);

    $("#tmp input")[0].checked = settings.isActive;
    settings.users.forEach(function(e)
    {
        createNameTag($('#tmp input')[1], e);
    });

    $('#tmp input:eq(1)').keyup(function(e){
        if(e.key == ',')
        {
            let text = this.value.slice(0,this.value.length-1);
            if(text.length <3) 
            {
                this.value = text;
                return;
            }
            createNameTag(this, text);
        }
    });

    $("#tmp input")[2].checked = settings.rateComments;
    $("#tmp input")[3].checked = settings.rateUpload;

    $('#save input').click(function(){ saveSettings()});
    $('#reset a').click(function()
    {
        localStorage.removeItem('TakeMyPlus_Settings');
        location.href = "http://pr0gramm.com/new";
    });

    $('.box-from-label').next().each(function()
    {
        $(this).click(function()
        {
            $(this).prev()[0].checked = !$(this).prev()[0].checked;
        });
    });
}

let createNameTag = function(element, data)
{
    let wrapper = document.createElement('span');
    $(wrapper).addClass('tag');
    
    $(wrapper).text(data);

    let x = document.createElement('a');

    $(x).href='#';
    $(x).html("&nbsp;&nbsp;x");
    $(x).css("color","red");

    $(x).click(function(e)
    {
        e.preventDefault();
        $(this).parent().remove();
    });

    wrapper.append(x);

    element.value = "";

    $(element).prev().append(wrapper);
}

let saveSettings = function()
{
    settings.isActive = $('#tmp input')[0].checked;

    settings.users = [];
    $('#tmp input:eq(1)').prev().find('span').each(function()
    {
        let text = this.innerText.slice(0,this.innerText.length-3);
        settings.users.push(text.toLowerCase().trim());
    });

    settings.rateComments = $('#tmp input')[2].checked;
    settings.rateUpload = $('#tmp input')[3].checked;

    quickSave();
}

let quickSave = function()
{
    localStorage.setItem("TakeMyPlus_Settings", JSON.stringify(settings));
}

let executeModules = function()
{
    if(settings.rateComments)
        rateComments();
    if(settings.rateUpload)
        rateUpload()
}

let rateUpload = function()
{
    if(settings.users.includes(getUser()))
    {
        if(!$('.item-vote:has(.pict)')[0].className.includes("voted-up"))
        {
            $('.item-vote:has(.pict) .vote-up').click();
            console.log("Upload wurde bewertet");
        }     
    }
}

let rateComments = function()
{
    $('.comment:not(.voted-up):not(textarea').each(function()
    {
        if(settings.users.includes($(this).find('.user')[0].innerText))
        {
            $(this).find('.pict.vote-up').click()
            console.log("Kommentar wurde bewertet");
        }
    });
}

let getUser = function()
{
    return $('.item-details .user')[0].innerText.toLowerCase();
}

let url = "https://pr0gramm.com"
$(document).ready(function()
{
    readSettings();

    window.addEventListener("resize", function(){checkURL()});

    setInterval(function()
    {
        if(url != window.location.href)
        {
            url = window.location.href;
            checkURL();
        }
    },100);
});