// ==UserScript==
// @name         MunzeeMapFilterV3
// @namespace    CzPeet
// @include      https://www.munzee.com/map*
// @version      3.0
// @author       CzPeet
// @description  filter for munzee map
// @downloadURL https://update.greasyfork.org/scripts/373493/MunzeeMapFilterV3.user.js
// @updateURL https://update.greasyfork.org/scripts/373493/MunzeeMapFilterV3.meta.js
// ==/UserScript==
//basedon: original munzee specials filter
//basedon: https://greasyfork.org/en/scripts/11662-munzeemapv2

$("#footer").remove();
$('head').append($("<style> .ico_hide{opacity:0.4;} .filter_icon{padding: 0 1px 0 0;} .filter_icon > div{text-align: center;} .filter_icon > img{height:30px;cursor:pointer; border-radius: 5px} .filter_icon > img.img_hide{opacity:0.4;} #filterIcons{padding: 5px;background: white} #inputbar{background: white;top:30px;border-top: 1px solid #ffffff;} </style>"));
$(".panel.panel-default").css('margin-bottom', '0');
$('.row').css('margin', '0');
$('.panel-body').css('padding-left', '0').css('padding-right', '0');

var inputbar = $('#inputbar');
var filterIcons = $('<div id="filterIcons"></div>');
inputbar.append(filterIcons);

var iconCounter = {};
var disabledIcons = [];
var imgSRC = "";

function createfilter4Map()
{
    iconCounter = {};
    filterIcons.empty();

    //Collection
    for (var munzeeID in mapMarkers)
    {
        //img src
        imgSRC = mapMarkers[munzeeID]._element.style.backgroundImage.replace("url(\"","").replace("\")","");

        if (typeof iconCounter[imgSRC] == 'undefined')
        {
            iconCounter[imgSRC] = 1;
        }
        else
        {
            iconCounter[imgSRC]++;
        }
    }

    //Creation
    for (imgSRC in iconCounter)
    {
        //new element
        filterIcons.append
        (
            '<div class="pull-left filter_icon">' +
            '<div>' + iconCounter[imgSRC] + '</div>' +
            '<img class="haideris ' + (disabledIcons.indexOf(imgSRC) >= 0 ? 'ico_hide' : 'ico_show') + '" src=' + imgSRC + ' />' +
            '</div>'
        );
    }

    filterIcons.append('<div style="clear:both;height: 1px; overflow: hidden"></div>');

    updateMapIcons();
}

function updateMapIcons()
{
    for (var mID in mapMarkers)
    {
        var curr = mapMarkers[mID]._element.style.backgroundImage.replace("url(\"","").replace("\")","");
        if ($.inArray(curr, disabledIcons) == -1)
        {
            $( "[data-index='" + mID + "']" ).css('display', 'block');
        }
        else
        {
            $( "[data-index='" + mID + "']" ).css('display', 'none');
        }
    }
}

// hide
$(document).on('click', '.ico_show.haideris', function (e)
{
    var curr = $(this).attr('src');

    if (e.ctrlKey)
    {
        var icons = document.querySelectorAll(".haideris");
        disabledIcons = [];
        for (var ic in iconCounter)
        {
            if (ic != curr)
            {
                disabledIcons.push(ic);
            }
        }

        for (var i in icons)
        {
            if (icons[i].src != curr)
            {
                icons[i].className = "haideris ico_hide";
            }
            else
            {
                icons[i].className = "haideris ico_show";
            }
        }
    }
    else
    {
        $(this).removeClass('ico_show').addClass('ico_hide');
        if (disabledIcons.indexOf(curr) == -1)
        {
            disabledIcons.push(curr);
        }
    }
    updateMapIcons();
});

// show
$(document).on('click', '.ico_hide.haideris', function (e)
{
    var curr = $(this).attr('src');

    if (e.ctrlKey)
    {
        var icons = document.querySelectorAll(".haideris");
        disabledIcons = [];
        for (var ic in iconCounter)
        {
            if (ic == curr)
            {
                disabledIcons.push(ic);
            }
        }

        for (var i in icons)
        {
            if (icons[i].src == curr)
            {
                icons[i].className = "haideris ico_hide";
            }
            else
            {
                icons[i].className = "haideris ico_show";
            }
        }
    }
    else
    {
        $(this).removeClass('ico_hide').addClass('ico_show');
        var index = disabledIcons.indexOf(curr);
        if (index !== -1)
        {
            disabledIcons.splice(index, 1);
        }
    }
    updateMapIcons();
});

$(document).ajaxSuccess(createfilter4Map);